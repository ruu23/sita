# Apply the SITA responsive design brief

## Goal
Refresh the Splash, Sign Up, and Home pages to closely match the supplied fashion-editorial brief across mobile, tablet, and desktop, without removing or replacing SITA’s working features.

## Resolved requirements
- Treat the brief as a **visual update only**.
- Preserve live Egyptian-brand products, shopper accounts, search, wishlist, AI stylist, profiles, brand pages, and admin tools.
- Keep sign-up and sign-in to **working email and password only**; do not add inactive Apple, Google, or Facebook buttons.
- Adopt the brief’s typography: **Bodoni Moda** for the SITA wordmark, **Playfair Display** for headings and key actions, and **Poppins** for body and interface text.
- Use the brief’s palette: black `#000000`, white `#FFFFFF`, dark brown `#3B2A22`, and light gray `#F5F5F5`, represented through the app’s semantic color system.

## Changes

### 1. Shared visual system
- Update global font loading and semantic styling while keeping the existing high-end black, white, and brown direction.
- Give the SITA wordmark the requested Didone character and `0.05em` letter spacing.
- Use Playfair Display for editorial headings/buttons and Poppins for fields, navigation, prices, and supporting copy.
- Keep thin line icons, restrained transitions, sharp product imagery, generous spacing, and minimal shadows.
- Apply the refreshed shared styles consistently to existing navigation and product cards where they appear on the three target pages.

### 2. Splash page
- Keep only the centered white SITA wordmark on a full black screen.
- Retain the gentle fade-in.
- Adjust automatic forwarding to the sign-up page to approximately 2.5 seconds.
- Ensure the composition stays centered at phone, tablet, and desktop sizes.

### 3. Sign Up page
- Preserve the existing fashion photograph and real email/password account flow.
- Mobile: full-screen photograph, readable dark overlay, and form positioned toward the lower portion of the screen.
- Tablet/desktop: balanced split-photo presentation with the form centered in the right side, without placing it inside a heavy floating card.
- Use the exact uppercase headline and subheading from the brief.
- Restyle inputs as translucent, blurred, rounded fields and the primary action as a black pill button.
- Keep the existing sign-up/sign-in switch, validation, confirmation notice, signed-in state, sign-out action, and browse-without-account link.
- Omit the social sign-up divider and buttons because email-only authentication was selected.

### 4. Home page
- Refine the responsive white header: compact menu at the left, centered SITA wordmark, bag at the right on mobile; move discovery actions into the desktop header.
- Preserve the working three-image carousel, touch swipe, mouse/trackpad scrolling, keyboard navigation, desktop arrows, transparent indicator area, and full-outfit framing.
- Restyle “NEW IN” and its subtitle to the requested editorial hierarchy.
- Preserve live products, brand filtering, search, links, prices in EGP, wishlist hearts, and brand-page navigation.
- Keep the product grid at 2 columns on mobile, 3 on tablet, and 4 on desktop, with stable portrait imagery and restrained interactions.
- Keep the existing five-item mobile navigation because AI Stylist is a working SITA feature; continue moving the equivalent actions into the top navigation on larger screens.

## Verification
- Check the three target pages at representative mobile, tablet, and desktop widths.
- Confirm the splash timing and destination.
- Confirm sign-up/sign-in controls and all retained states remain usable.
- Confirm all three carousel slides display, dots and arrows navigate, touch swipe works on tablet, and horizontal mouse/trackpad navigation works on desktop.
- Confirm the live product grid uses the required responsive column counts and that search, brand links, external product links, and wishlist controls still work.
- Check for text overflow, overlaps, missing images, console errors, and build errors.

## Not changing
- No mock data replacement.
- No removal of existing pages or features.
- No decorative social-login buttons.
- No backend, account, catalog-feed, admin, or AI behavior changes.
