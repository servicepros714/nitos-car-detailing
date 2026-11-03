# Nitos Car Detailing Rossmoor

Mobile auto-detailing booking site: Vite + React 18 with a Cloudflare Worker (D1 bookings) and Stripe PaymentIntents. Same deployment setup as `highend-car-detailing-v2`.

| Item | Value |
|---|---|
| Phone | (562) 539-2226 |
| Location | Rossmoor, CA |
| Source tag (D1) | `nitos-rossmoor` |
| Booking ID prefix | `NIT-` |
| Worker | `nitos-rossmoor-detailing-worker` → https://nitos-rossmoor-detailing-worker.detailingmarketers2.workers.dev |
| Cloudflare account | detailingmarketers2 (`5df257c170669d41c20367d89e7963d1`) |
| D1 database | `detailing-bookings-detailingmarketers2` (`4143248b-0d9b-4c96-b078-61772ba3597e`, shared, rows scoped by `source`) |
| Pages project | `nitos-car-detailing-v2` → https://nitos-car-detailing-v2.pages.dev |
| Domain | `nitoscardetailingrossmoor.site` is still attached to the older `nitos-car-detailing-rossmoor` Pages project (previous site). Not moved yet. |
| Slots | Every 30 min, 8:00 AM – 5:30 PM, Mon–Sun |
| Coupon | `PREPAY` = $15 off (online prepay only) |

**Design direction:** "pit-lane" — ink navy `#0B1F3A`, brushed chrome `#C9D0DA`/`#F4F6F9`, racing red `#D42630` accent, pulled from the badge logo. Oswald (display) + Public Sans (body) + Rajdhani (accent/stats). Centered badge nav, angled/diagonal split hero and section edges.

## Local development
```bash
npm install
npm run dev
```

## 1. Worker

`worker/wrangler.toml` already binds `DB` and sets `ALLOWED_ORIGIN` (comma-separated: live domain, www, pages.dev, localhost:5173). Make sure wrangler is logged in to the detailingmarketers2 account (`npx wrangler whoami`), then:

```
npx wrangler deploy --config worker/wrangler.toml
npx wrangler secret put STRIPE_SECRET_KEY --config worker/wrangler.toml   # sk_live_… / sk_test_…
npx wrangler secret put GHL_WEBHOOK_URL --config worker/wrangler.toml     # GoHighLevel inbound webhook
npx wrangler secret put STRIPE_WEBHOOK_SECRET --config worker/wrangler.toml   # whsec_… (see below)
```

Optional: `npx wrangler secret put ADMIN_TOKEN --config worker/wrangler.toml` to protect GET/PATCH `/api/bookings`. Without it those routes are open to anyone with the Worker URL. The site itself doesn't call them, but the admin dashboard does, so give the dashboard the token at the same time.

Prices and time slots are enforced by the Worker. If you change them in `src/lib/BookingContext.jsx` or `src/lib/bookingDb.js`, change `PACKAGES` / `EXTERIOR` / `VALID_TIMES` in `worker/worker.js` too.

### Stripe webhook (`whsec_`)

`POST /api/stripe-webhook` verifies the `Stripe-Signature` header (HMAC-SHA256, 5-minute replay window) and updates the matching booking's `payment_status` by `payment_intent_id`:

| Stripe event | `payment_status` set to |
|---|---|
| `payment_intent.succeeded` | `Paid` |
| `payment_intent.payment_failed` | `Incomplete` (never downgrades a booking already `Paid`) |
| `charge.refunded` | `Refunded`, or `Partially Refunded` for a partial refund |

PaymentIntents whose `metadata.source` is not `nitos-rossmoor` are ignored, so the Stripe account can be shared with other sites.

Setup (repeat separately for test mode and live mode, each has its own `whsec_`):

1. Stripe Dashboard → **Developers → Webhooks → Add destination** → **Your account** → events `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded` → **Webhook endpoint** → URL `https://nitos-rossmoor-detailing-worker.detailingmarketers2.workers.dev/api/stripe-webhook`.
2. Open the endpoint → reveal the **Signing secret** (`whsec_…`).
3. `npx wrangler secret put STRIPE_WEBHOOK_SECRET --config worker/wrangler.toml` and paste it. No redeploy needed.

### GoHighLevel email / SMS notifications

The Worker POSTs every new booking to a GHL **Inbound Webhook** when `GHL_WEBHOOK_URL` is set. The payload matches the other portfolio sites, so the same workflow works: `id`, `name`, `phone`, `email`, `service`, `date`, `time`, `source` (`nitos-rossmoor`), `source_label` (`Nitos Car Detailing`), `vehicle`, `address`, `notes`, `payment_status` (`Paid` / `Pay Later`), `total`, `event_type` (`booking_confirmed`), plus `first_name`, `last_name`, `booking_id`, `status`, `created_at`, `business_phone`.

The call is fire-and-forget: if GHL is down the booking still saves and the customer still gets their confirmation page.

### Database schema

`worker/schema.sql` is the live schema of the shared `bookings` table. It uses `IF NOT EXISTS` only and needs no action for this site.

## 2. Frontend env

`.env.local` (committed per convention, holds no secrets):

```
VITE_API_URL=https://nitos-rossmoor-detailing-worker.detailingmarketers2.workers.dev
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

The publishable key must match the secret key's Stripe account and mode. While it's still a placeholder, checkout says online payment isn't connected and offers Pay Later only.

## 3. Deploy to Cloudflare Pages

```
npm run build
npx wrangler pages deploy dist --project-name=nitos-car-detailing-v2 --branch=main
```

`.github/workflows/deploy.yml` does the same on every push to `main` once the repo has the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` Actions secrets. `public/_redirects` handles SPA routes (`/book`, `/checkout`, `/confirmation`).

## Booking flow

Service → Exterior Wash add-on → Date → Time → Your info → Checkout (order summary, coupon, Stripe, Pay Later) → Confirmation.

The booking is saved when the customer pays or picks Pay Later, not before, so abandoned checkouts don't hold a slot and GoHighLevel gets the real payment status. Price, coupon and Stripe ID are written to `notes`, and the PaymentIntent ID to `payment_intent_id`.

The Worker only saves a booking as `Paid` after confirming with Stripe that the PaymentIntent went through, belongs to this site and matches the booked service. Anything else is saved as `Pay Later`. If Stripe can't be reached, the PaymentIntent stays linked so the webhook can still mark it `Paid`.

The total in `notes` and in the GoHighLevel payload is set by the Worker, never the browser: what Stripe charged for a `Paid` booking, otherwise the list price. Services it doesn't recognize are rejected.

## Checkout payment methods

- PaymentIntents are created with `payment_method_types` = `card` + `link` only, so Cash App, Klarna and Affirm never appear. Apple Pay runs on `card`.
- Express Checkout shows Apple Pay and Link. Google Pay, PayPal, Amazon Pay and Klarna are switched off in `src/pages/Checkout.jsx`.
- Apple Pay and Link buttons need the live domain and `www` registered in Stripe (live mode): **Settings → Payment methods → Payment method domains**.

## Images
Real photos from the client are in `public/images/` (logo, before/after transformations, fleet shots), resized and compressed for the web.

## Structure
```
src/
  components/       Nav, MobileActionBar, Hero, TrustStrip, Services, Gallery, Process, CtaBanner, Footer
  lib/              BookingContext (shared state + service catalog), bookingDb.js (Worker calls), finalize.js (saves the booking), stripe.js
  pages/
    Home.jsx
    Book/           ServiceStep, ExteriorWashStep, DateStep, TimeStep, InfoStep, BookingLayout (sticky Continue/Back bar)
    Checkout.jsx    Stripe Elements, ExpressCheckoutElement, PREPAY coupon, Pay Later
    Confirmation.jsx
worker/
  worker.js         Cloudflare Worker API
  wrangler.toml     Worker config (D1 binding, allowed origins)
  schema.sql        D1 schema
```

## Notes for future edits
Per your working style, request changes as find-and-replace blocks against the files above rather than full rewrites.
