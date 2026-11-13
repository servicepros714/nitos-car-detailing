// Worker API calls — production pattern (Montek/Fox/Luna/Sonrisa/Nitos).
const API_URL = import.meta.env.VITE_API_URL;

async function readError(res, fallback) {
  const data = await res.json().catch(() => ({}));
  return new Error(data.error || fallback);
}

export async function fetchBookedSlots(date) {
  const res = await fetch(`${API_URL}/api/slots?date=${date}`);
  if (!res.ok) throw new Error('Could not load availability');
  const data = await res.json();
  return data.booked || [];
}

export async function createBooking(payload) {
  const res = await fetch(`${API_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await readError(res, 'Could not save booking');
  return res.json();
}

// The Worker computes the price from package + add-on + coupon.
export async function createPaymentIntent({ pkg, exterior, coupon, name, email, phone }) {
  const res = await fetch(`${API_URL}/api/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ package: pkg, exterior, coupon, name, email, phone })
  });
  if (!res.ok) throw await readError(res, 'Could not start payment');
  return res.json();
}

// Every 30 minutes, 7:00 AM – 7:00 PM. Keep in sync with VALID_TIMES in worker/worker.js
export function generateTimeSlots() {
  const slots = [];
  let hour = 7;
  let minute = 0;
  while (hour < 20) {
    if (hour === 19 && minute > 0) break;
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    slots.push(`${h12}:${minute === 0 ? '00' : minute} ${ampm}`);
    minute += 30;
    if (minute === 60) { minute = 0; hour += 1; }
  }
  return slots;
}

// Same-day bookings need 4 hours' notice (California time). The worker enforces it too.
export const MIN_LEAD_MINUTES = 240;
const LAST_SLOT_MINUTES = 19 * 60;

function pacificMinutesNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date());
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  return get('hour') * 60 + get('minute');
}

function slotMinutes(label) {
  const [t, period] = label.split(' ');
  const [h, m] = t.split(':').map(Number);
  return ((h % 12) + (period === 'PM' ? 12 : 0)) * 60 + m;
}

// The slots a customer can pick for `date` (today's slots inside the notice window are left out).
export function availableSlots(date) {
  const slots = generateTimeSlots();
  if (date !== pacificToday()) return slots;
  const earliest = pacificMinutesNow() + MIN_LEAD_MINUTES;
  return slots.filter((s) => slotMinutes(s) >= earliest);
}

// True once no slot is left today (after 3 PM with a 7 PM last slot).
export function noSlotsLeftToday() {
  return pacificMinutesNow() + MIN_LEAD_MINUTES > LAST_SLOT_MINUTES;
}

// Pacific-time "today" as YYYY-MM-DD, used for availability logic.
export function pacificToday() {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
  return fmt.format(new Date());
}
