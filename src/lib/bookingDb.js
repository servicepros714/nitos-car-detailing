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

export function generateTimeSlots() {
  const slots = [];
  let hour = 8;
  let minute = 0;
  while (hour < 18) {
    if (hour === 17 && minute > 30) break;
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    slots.push(`${h12}:${minute === 0 ? '00' : minute} ${ampm}`);
    minute += 30;
    if (minute === 60) { minute = 0; hour += 1; }
  }
  return slots;
}

// Pacific-time "today" as YYYY-MM-DD, used for availability logic.
export function pacificToday() {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
  return fmt.format(new Date());
}
