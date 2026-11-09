# Admin access and brand management

## What will change
- Add a dedicated admin sign-in page, separate from the shopper sign-in screen, using the existing secure account system and checking admin access on the server.
- Add persistent brand management to `/admin`, including adding and removing brands.
- Keep the four existing brands and their stories, products, and pages intact; make brand changes persistent and visible consistently throughout SITA.

## Technical approach
- Add a publicly readable brand catalog table with explicit Data API grants and row-level security. Only verified admins may change records. Removing a built-in brand creates a persistent hidden override instead of deleting its original definition.
- Merge the built-in catalog with saved additions and removals in a server-side catalog function, and use the effective list for search, brand pages, product feeds, stylist recommendations, and admin status.
- Add server functions for protected brand changes, verifying the admin role on every write. The dedicated admin sign-in screen uses existing accounts, routes admins to `/admin`, and refuses access to non-admin accounts.
- Verify sign-in access, role enforcement, persistent add/remove behavior, and existing brand catalog flows.