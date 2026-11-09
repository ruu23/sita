CREATE TABLE public.sita_brands (
  slug text PRIMARY KEY,
  name text,
  domain text,
  site text,
  tagline text,
  description text,
  logo text,
  story text[] NOT NULL DEFAULT '{}'::text[],
  collections jsonb NOT NULL DEFAULT '[]'::jsonb,
  socials jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sita_brands TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.sita_brands TO authenticated;
GRANT ALL ON public.sita_brands TO service_role;
ALTER TABLE public.sita_brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read SITA brand catalog" ON public.sita_brands FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can add SITA brands" ON public.sita_brands FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update SITA brands" ON public.sita_brands FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can remove SITA brands" ON public.sita_brands FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));