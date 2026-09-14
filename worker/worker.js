// Nitos Car Detailing Rossmoor — Worker API
// Deploy manually via the Cloudflare dashboard (account: austin80565).
// Bind D1 database "detailing-bookings" as env.DB.
// Set STRIPE_SECRET_KEY as a Worker secret via the dashboard.

const SOURCE = 'nitos-rossmoor';
const PREFIX = 'NIT-';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
  });
}

const PATCHABLE = new Set([
  'status',
  'reschedule_date',
  'reschedule_time',
  'original_date',
  'original_time',
  'notes2',
  'payment_status'
]);

function newBookingId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${PREFIX}${Date.now().toString().slice(-6)}${rand}`;
}

async function stripeRequest(env, path, body) {
  const form = new URLSearchParams();
  for (const [k, v] of Object.entries(body)) {
    if (v !== undefined && v !== null) form.append(k, v);
  }
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: form
  });
  return res.json();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    try {
      // GET /api/slots?date=YYYY-MM-DD  → booked times for that date (source-scoped)
      if (pathname === '/api/slots' && request.method === 'GET') {
        const date = url.searchParams.get('date');
        if (!date) return json({ error: 'date is required' }, 400);
        const { results } = await env.DB.prepare(
          `SELECT time FROM bookings WHERE source = ? AND date = ? AND status != 'Cancelled'`
        )
          .bind(SOURCE, date)
          .all();
        return json({ booked: results.map((r) => r.time) });
      }

      // POST /api/create-payment-intent  { amount, email }
      if (pathname === '/api/create-payment-intent' && request.method === 'POST') {
        const { amount, email } = await request.json();
        if (!amount) return json({ error: 'amount is required' }, 400);
        const intent = await stripeRequest(env, 'payment_intents', {
          amount: Math.round(amount * 100),
          currency: 'usd',
          receipt_email: email,
          'automatic_payment_methods[enabled]': 'true'
        });
        if (intent.error) return json({ error: intent.error.message }, 400);
        return json({ clientSecret: intent.client_secret });
      }

      // POST /api/bookings  → create a booking (source-scoped, prefixed id)
      if (pathname === '/api/bookings' && request.method === 'POST') {
        const b = await request.json();
        const id = newBookingId();
        const created_at = new Date().toISOString();
        await env.DB.prepare(
          `INSERT INTO bookings
            (id, date, time, service, name, phone, email, vehicle, address, notes, source, created_at, status, payment_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?)`
        )
          .bind(
            id,
            b.date,
            b.time,
            b.service,
            b.name,
            b.phone,
            b.email,
            b.vehicle || '',
            b.address,
            b.notes || '',
            SOURCE,
            created_at,
            b.payment_status || 'Pay Later'
          )
          .run();
        return json({ id, created_at });
      }

      // GET /api/bookings  → source-scoped list (used by shared admin dashboard)
      if (pathname === '/api/bookings' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          `SELECT * FROM bookings WHERE source = ? ORDER BY date DESC, time DESC`
        )
          .bind(SOURCE)
          .all();
        return json({ bookings: results });
      }

      // PATCH /api/bookings/:id → admin dashboard status/reschedule updates
      const patchMatch = pathname.match(/^\/api\/bookings\/([^/]+)$/);
      if (patchMatch && request.method === 'PATCH') {
        const id = patchMatch[1];
        const updates = await request.json();
        const fields = Object.keys(updates).filter((k) => PATCHABLE.has(k));
        if (!fields.length) return json({ error: 'no valid fields' }, 400);
        const setClause = fields.map((f) => `${f} = ?`).join(', ');
        const values = fields.map((f) => updates[f]);
        await env.DB.prepare(
          `UPDATE bookings SET ${setClause} WHERE id = ? AND source = ?`
        )
          .bind(...values, id, SOURCE)
          .run();
        return json({ ok: true });
      }

      return json({ error: 'not found' }, 404);
    } catch (err) {
      return json({ error: err.message }, 500);
    }
  }
};
