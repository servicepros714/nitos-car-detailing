// Worker API calls — production pattern (Montek/Fox/Luna/Sonrisa/Nitos).
const API_URL = import.meta.env.VITE_API_URL;

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
  if (!res.ok) throw new Error('Could not save booking');
  return res.json();
}

export async function updatePaymentStatus(bookingId, payment_status) {
  const res = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_status })
  });
  if (!res.ok) throw new Error('Could not update payment status');
  return res.json();
}

export async function createPaymentIntent(amount, email) {
  const res = await fetch(`${API_URL}/api/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, email })
  });
  if (!res.ok) throw new Error('Could not start payment');
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
