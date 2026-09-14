# Nitos Car Detailing Rossmoor

Mobile auto-detailing booking site. Built on the shared Service Pros stack (Vite + React 18, Stripe, Cloudflare Pages/Workers/D1).

## Identity assigned to this site
- **Source tag:** `nitos-rossmoor`
- **Booking prefix:** `NIT-`
- **Worker URL (once deployed):** `nitos-rossmoor-detailing-worker.austin80565.workers.dev`
- **Design direction:** "pit-lane" — ink navy `#0B1F3A`, brushed chrome `#C9D0DA`/`#F4F6F9`, racing red `#D42630` accent, pulled from the badge logo. Oswald (display) + Public Sans (body) + Rajdhani (accent/stats). Centered badge nav, angled/diagonal split hero and section edges — distinct from the other portfolio sites' nav and hero patterns.

## Local development
```bash
npm install
npm run dev
```

## Environment variables (`.env.local`, already committed per convention)
- `VITE_API_URL` — the Worker URL above
- `VITE_STRIPE_PUBLISHABLE_KEY` — replace the placeholder with the real publishable key (safe to commit)
- `VITE_CALENDLY_URL` — kept for reference only; not currently used anywhere in the site

## Booking link
All **Book Online** CTAs (nav, mobile action bar, hero, service cards, CTA banner, footer) go to the in-house `/book` flow — Service → Date → Time → Info → Stripe checkout. This is the full production pattern described below, not an external Calendly link.

## What you'll need to do on your end (infrastructure, per your usual workflow)
1. **GitHub repo:** create it and push this project.
2. **Cloudflare Pages:** connect the repo, build command `npm run build`, output directory `dist`. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub Secrets (deploy.yml already expects them), plus `VITE_STRIPE_PUBLISHABLE_KEY` if you want it injected at build time instead of via the committed `.env.local`.
3. **Worker:** in the Cloudflare dashboard, create a Worker named `nitos-rossmoor-detailing-worker`, paste in `worker/worker.js`, bind the existing shared `detailing-bookings` D1 database as `DB`, and set `STRIPE_SECRET_KEY` as a Worker secret.
4. **D1 schema:** `worker/schema.sql` uses `IF NOT EXISTS` only, so it's safe to run against the shared database — it won't affect other sites' data.
5. **DNS + Apple Pay domain verification:** as usual.
6. **Admin dashboard:** no changes needed — this Worker's `PATCH /api/bookings/:id` supports `reschedule_date`, `reschedule_time`, `original_date`, `original_time`, `notes2`, `status`, and `payment_status`, and `GET /api/bookings` returns only `source = 'nitos-rossmoor'` rows.

## Images
Real photos from the client are in `public/images/` (logo, before/after transformations, fleet shots), resized and compressed for the web. Swap in higher-resolution or additional shots the same way if you get more from the client.

## Structure
```
src/
  components/       Nav, MobileActionBar, Hero, TrustStrip, Services, Gallery, Process, CtaBanner, Footer
  lib/               BookingContext (shared state + service catalog), bookingDb.js (Worker calls), stripe.js
  pages/
    Home.jsx
    Book/            ServiceStep, DateStep, TimeStep, InfoStep, BookingLayout (sticky Continue/Back bar)
    Checkout.jsx     Stripe Elements, ExpressCheckoutElement, PREPAY coupon, Pay Later
    Confirmation.jsx
worker/
  worker.js          Cloudflare Worker API (paste into dashboard)
  schema.sql         D1 schema (IF NOT EXISTS, safe for shared DB)
```

## Notes for future edits
Per your working style, request changes as find-and-replace blocks against the files above rather than full rewrites.
