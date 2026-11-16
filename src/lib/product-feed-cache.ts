type CachedValue<T> = { cachedAt: number; value: T };

type CacheBackend = {
  read: (key: string) => Promise<unknown | null>;
  write: (key: string, value: unknown, maxAgeSeconds: number) => Promise<void>;
};

type StaleCacheOptions<T> = {
  freshForMs: number;
  retainForMs: number;
  isValid: (value: unknown) => value is T;
  backend?: CacheBackend;
  now?: () => number;
};

export function createStaleCache<T>(options: StaleCacheOptions<T>) {
  const local = new Map<string, CachedValue<T>>();
  const pending = new Map<string, Promise<T | null>>();
  const now = options.now ?? Date.now;

  function remember(key: string, entry: CachedValue<T>) {
    local.delete(key);
    local.set(key, entry);
    if (local.size > 100) {
      const oldestKey = local.keys().next().value;
      if (oldestKey !== undefined) local.delete(oldestKey);
    }
  }

  function ageOf(entry: CachedValue<T>) {
    return Math.max(0, now() - entry.cachedAt);
  }

  async function readBackend(key: string): Promise<CachedValue<T> | null> {
    if (!options.backend) return null;
    try {
      const payload = await options.backend.read(key);
      if (
        typeof payload !== "object" ||
        payload === null ||
        !("cachedAt" in payload) ||
        typeof payload.cachedAt !== "number" ||
        !("value" in payload) ||
        !options.isValid(payload.value)
      ) {
        return null;
      }
      const entry = { cachedAt: payload.cachedAt, value: payload.value };
      return ageOf(entry) <= options.retainForMs ? entry : null;
    } catch {
      return null;
    }
  }

  async function getOrLoad(key: string, load: () => Promise<T | null>): Promise<T | null> {
    const localEntry = local.get(key);
    if (localEntry && ageOf(localEntry) <= options.freshForMs) return localEntry.value;

    const existingRequest = pending.get(key);
    if (existingRequest) return existingRequest;

    const request = (async () => {
      let stale = localEntry && ageOf(localEntry) <= options.retainForMs ? localEntry : null;
      const persisted = await readBackend(key);
      if (persisted && (!stale || persisted.cachedAt > stale.cachedAt)) stale = persisted;

      if (stale && ageOf(stale) <= options.freshForMs) {
        remember(key, stale);
        return stale.value;
      }

      let value: T | null = null;
      try {
        value = await load();
      } catch {
        value = null;
      }

      if (value !== null && options.isValid(value)) {
        const entry = { cachedAt: now(), value };
        remember(key, entry);
        try {
          await options.backend?.write(key, entry, Math.ceil(options.retainForMs / 1000));
        } catch {
          // The local copy remains available if the edge cache cannot be written.
        }
        return value;
      }

      return stale?.value ?? null;
    })();

    pending.set(key, request);
    try {
      return await request;
    } finally {
      pending.delete(key);
    }
  }

  return { getOrLoad };
}

type WorkerCache = {
  match: (request: Request) => Promise<Response | undefined>;
  put: (request: Request, response: Response) => Promise<void>;
};

const workerCacheBackend: CacheBackend = {
  async read(key) {
    const cache = (globalThis as typeof globalThis & { caches?: { default?: WorkerCache } }).caches?.default;
    if (!cache) return null;
    const response = await cache.match(new Request(`https://sita-feed-cache.invalid/${encodeURIComponent(key)}`));
    if (!response?.ok) return null;
    return response.json();
  },
  async write(key, value, maxAgeSeconds) {
    const cache = (globalThis as typeof globalThis & { caches?: { default?: WorkerCache } }).caches?.default;
    if (!cache) return;
    await cache.put(
      new Request(`https://sita-feed-cache.invalid/${encodeURIComponent(key)}`),
      new Response(JSON.stringify(value), {
        headers: {
          "content-type": "application/json",
          "cache-control": `public, max-age=${maxAgeSeconds}`,
        },
      }),
    );
  },
};

export const productFeedCache = createStaleCache<unknown[]>({
  freshForMs: 5 * 60 * 1000,
  retainForMs: 7 * 24 * 60 * 60 * 1000,
  isValid: (value): value is unknown[] => Array.isArray(value),
  backend: workerCacheBackend,
});