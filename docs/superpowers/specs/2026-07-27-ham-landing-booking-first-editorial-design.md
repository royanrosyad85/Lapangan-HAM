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
3. Match Day Bundle promotion
4. Harga
5. Lapangan visual
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

### Match Day Bundle promotion

- Place one featured promotional module directly between the hero and Harga
- Present it as one 36px-radius Snow surface, not an ecommerce grid or checkout form
- Use an asymmetric desktop split: promotional copy and a licensed football image on the left, compact selection and pricing on the right
- Stack into one column below 768px, with the selected price and CTA immediately following the selector
- Eyebrow: `PAKET MATCH DAY`
- Headline: `Match Day Lebih Lengkap, Lebih Hemat`
- Supporting copy: `Gabungkan perlengkapan pertandingan dan dokumentasi dalam satu booking. Pilih paket yang sesuai dengan kebutuhan tim Anda.`
- Use `BUNDLES` and `ADD_ON_ITEMS` from `src/config/pricing.ts` as the only pricing source
- Render a compact semantic button group with `aria-pressed`; do not reproduce checkbox cards or three equal product cards
- Default to `Complete Match Day`, the only package marked `PALING HEMAT`
- Show only the selected package's three or four included items
- Derive original price, savings amount, and savings percentage from config values
- Keep the selected bundle price visually dominant; the original price is crossed out and secondary
- Use Ember only for the best-value badge and savings treatment
- Use tabular numbers for every price and percentage
- Primary CTA: `Pilih Paket & Booking`
- CTA format: `/customer/booking/create?bundle={bundle-id}`
- Omit the secondary `Lihat detail paket` link because the selected details are already visible and another action would compete with booking
- Use Omar Ramadan's locally stored [soccer game on a stadium](https://unsplash.com/photos/jvBRJWFGbtg) photograph, which is free under the Unsplash License
- Do not autoplay or rotate packages
- Selection changes are immediate. Only opacity and transform feedback may transition, for at most 200ms
- Each selector and CTA has a 44px target, visible focus ring, and `scale(0.96)` pointer-press feedback

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
- `public/assets/match-day-bundle.jpg`

Delete these dead testimonial files after removing their only import:

- `src/components/TestimonialsSection.tsx`
- `src/components/ui/testimonials-columns-1.tsx`

Minimal booking-flow support:

- `src/app/customer/booking/create/page.tsx`
- `src/app/customer/booking/create/BookingCreateForm.tsx`
- `src/app/customer/booking/create/BookingCreateForm.test.tsx`

The booking page validates `bundle` against the existing `BundleId` values, resolves its items from `BUNDLES`, and passes those items as the initial add-on selection. Invalid query values are ignored. Submission, pricing resolution, payment handling, and existing date or time query parameters remain unchanged.

No route slug, booking action, database schema, auth code, payment behavior, or admin UI changes. Existing unrelated edits in `src/app/layout.tsx` and `skills-lock.json` remain untouched.

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
- Changing the Match Day selector updates only the active package details
- `Pilih Paket & Booking` carries the selected `bundle` query value
- Valid bundle query values preselect the matching existing add-on bundle
- Invalid bundle query values leave add-ons unselected
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
- One Match Day promotion appears directly after the hero without duplicating checkout UI
- Complete Match Day is clearly and quietly marked as the best-value package
- The selected package reaches the booking form through a validated query parameter
- Harga, Jadwal, Lokasi, and FAQ remain correct on mobile
- Schedule failure is not misrepresented as availability
- The final craft review reports every applied before-and-after polish change
