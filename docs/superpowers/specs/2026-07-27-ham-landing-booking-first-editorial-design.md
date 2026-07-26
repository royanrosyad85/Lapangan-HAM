# HAM Landing Page: Booking-First Editorial Design

## Goal

Redesign only the public HAM Stadium landing page so a visitor can quickly understand the venue, compare two-hour pricing, inspect the next five days of availability, and start a booking.

The primary audience is Indonesian football players, team coordinators, and event organizers booking Stadion H. Abdul Malik in Depok. Indonesian remains the default copy. The existing English locale remains available with equally concise typography and natural wording.

## Design direction

The approved direction is booking-first editorial.

- `design.md` is the visual source of truth.
- Theme is light and neutral-first.
- DM Sans substitutes for Cosmica on the landing page only.
- Canvas uses Paper `#f4f4f5`; elevated surfaces use Snow `#ffffff`.
- Obsidian `#09090b` carries headings and primary actions.
- Ember `#ff5a00` appears only as small functional punctuation.
- Content cards use 36px radii, controls use 14px radii, and small status elements use 12px radii.
- Hairline Cloud `#ececee` borders provide structure. Cards do not use heavy drop shadows.
- The page stays within a 1200px content width and uses an 80px major-section rhythm.

The signature element is the combination of real stadium photography and a compact live booking schedule. It should feel like a venue service, not a generic feature-card landing page.

## Information architecture

Final order:

1. Sticky navigation
2. Split hero
3. Compact booking proof row
4. Lapangan visual
5. Harga
6. Jadwal five-day availability
7. Lokasi
8. FAQ accordion
9. Closing booking CTA
10. Footer

The VENUE feature grid and testimonials section are removed completely. There is no replacement feature grid, carousel, or testimonial strip.

## Content and conversion

The hero contains:

- A short international-standard pitch headline
- One concise line explaining slot selection, DP upload, and online status tracking
- One primary `Booking Sekarang` action to `/customer/booking/create`
- The stadium address
- One properly sized hero image

The compact proof row contains at most three facts:

- Slot 2 jam
- DP 30%, minimum Rp500.000
- Status booking online

The same booking intent uses the same label throughout the page. The closing CTA repeats `Booking Sekarang` after the informational sections, but adjacent sections do not add redundant booking links.

Indonesian and English copy uses plain active language, sentence case, balanced headings, pretty body wrapping, and no em dash or en dash characters. Times and numeric ranges use a normal hyphen.

## Section behavior

### Navigation

- Sticky Snow surface without a heavy divider
- Logo, `Lapangan`, `Harga`, `Jadwal`, `Lokasi`, and `FAQ` anchors
- Locale control, `Masuk`, and `Daftar`
- Desktop stays on one line within 80px height
- Mobile keeps the brand and account actions without adding a new menu system
- All controls have at least a 44px touch target and visible focus rings

### Hero and lapangan

- Asymmetric split on desktop and a single column below 768px
- Hero content and CTA remain visible in the initial desktop viewport
- The existing stadium images remain the real visual assets
- Hero image uses `next/image`, responsive `sizes`, a reserved aspect ratio, and `preload`
- Supporting image stays lazy-loaded
- Images use a subtle inset black outline and no overlays or decorative labels

### Harga

- Continue using `BOOKING_PRICE_SLOTS`
- Show two-hour prices for weekdays, Friday, and weekend or public holiday
- Use tabular numbers for every time and Rupiah value
- Keep horizontal scrolling on small screens because the comparison relationship is clearer as a table
- Keep the DP note adjacent to the table
- Remove the redundant three-card pricing-note block

### Jadwal

- Continue using the `get_booked_slots` Supabase RPC and `calculateBookingPrice`
- Preserve the five-day date range and existing booking deep-link query parameters
- Available cells are links with price and accessible labels
- Booked and closed cells are non-interactive with distinct text and surface treatments
- Loading uses schedule-shaped skeletons instead of a spinner
- RPC failure renders an explicit retry-oriented error message and never presents all slots as available
- Times and prices use tabular numbers

### Lokasi

- Keep the current MapLibre map and exact coordinates
- Add a short address and a visible Google Maps link
- Make the map marker link a 44px target and remove the emoji treatment

### FAQ

- Use native `details` and `summary` elements for keyboard-friendly disclosure
- Keep only the three current topics: DP, cancellation or rescheduling, and peak hours
- No bespoke accordion state or animation dependency

### Motion

Motion intensity is deliberately low.

- No autoplay, marquee, parallax, scroll hijack, or testimonial animation
- No page-load keyframe sequence
- Pressable controls use an interruptible 150ms transform transition and `scale(0.96)` feedback
- Fine-pointer hover uses a small transform or color response
- Only transform and opacity are animated
- `prefers-reduced-motion` removes transform feedback
- No `transition: all`, `ease-in`, or motion longer than 300ms

## Implementation scope

Landing-only files:

- `src/app/(public)/page.tsx`
- `src/lib/i18n/translations/id.ts`
- `src/lib/i18n/translations/en.ts`
- `src/components/HAMMapWrapper.tsx`

Delete these dead testimonial files after removing their only import:

- `src/components/TestimonialsSection.tsx`
- `src/components/ui/testimonials-columns-1.tsx`

No routes, booking actions, database schema, auth code, customer UI, or admin UI change. Existing unrelated edits in `src/app/layout.tsx` and `skills-lock.json` remain untouched.

The current single Client Component remains in place because locale context and live schedule state already require it. Splitting it into new wrapper layers would add files without changing the user-facing result.

## Accessibility and responsive checks

- AA contrast for all copy and controls
- Visible `focus-visible` rings
- 44px minimum touch targets
- No CTA wrapping on desktop
- Explicit single-column collapse below 768px
- Pricing and schedule retain usable horizontal scrolling where relationships require it
- Disabled schedule states include readable text, not color alone
- Images reserve layout space

## Verification

Run in repository order:

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm test`
4. `npm run build`

Browser smoke checks:

- Home renders at desktop and 390px mobile widths
- `Booking Sekarang` reaches `/customer/booking/create`
- Every nav anchor reaches an existing section
- One available schedule cell preserves `date`, `start`, and `end` query parameters
- Booked and closed cells cannot be activated
- Locale switching keeps natural Indonesian and English layouts
- FAQ works by keyboard
- Map link opens Google Maps
- Reduced-motion mode removes transform motion

## Definition of done

- `design.md` is visibly represented in typography, color, spacing, radii, borders, buttons, tables, navigation, and footer
- VENUE and testimonials are absent from the DOM and dead files are removed
- The page is shorter, with one obvious above-the-fold booking path
- Harga, Jadwal, Lokasi, and FAQ remain correct on mobile
- Schedule failure is not misrepresented as availability
- The final craft review reports every applied before-and-after polish change
