import { SERVICES } from './BookingContext.jsx';
import { createBooking } from './bookingDb.js';

export const COUPONS = { PREPAY: 15 };

export const isBookingComplete = (b) =>
  !!(b.serviceIds.some((id) => id !== 'exterior') && b.date && b.time && b.name && b.phone && b.email && b.address);

// Saved only once the customer pays or picks Pay Later, so abandoned checkouts don't hold a slot
// and GoHighLevel gets the real payment status. Total goes first in notes: the Worker reads it from there.
export async function finalizeBooking(booking, { paid, coupon, paymentIntentId }) {
  const services = SERVICES.filter((s) => booking.serviceIds.includes(s.id));
  const base = services.reduce((sum, s) => sum + s.price, 0);
  const discount = paid && coupon ? COUPONS[coupon] || 0 : 0;
  const total = Math.max(0, base - discount);

  const noteParts = [`Total: $${total}`];
  if (discount) noteParts.push(`${coupon} -$${discount}`);
  if (paymentIntentId) noteParts.push(`Stripe ${paymentIntentId}`);
  if (booking.notes.trim()) noteParts.push(booking.notes.trim());

  const { id } = await createBooking({
    date: booking.date,
    time: booking.time,
    service: services.map((s) => s.name).join(' + '),
    name: booking.name.trim(),
    phone: booking.phone.trim(),
    email: booking.email.trim(),
    vehicle: booking.vehicle.trim(),
    address: booking.address.trim(),
    notes: noteParts.join(' · '),
    payment_status: paid ? 'Paid' : 'Pay Later',
    payment_intent_id: paymentIntentId || null // lets the Stripe webhook find this booking
  });

  return {
    id,
    name: booking.name,
    email: booking.email,
    date: booking.date,
    time: booking.time,
    address: booking.address,
    services,
    discount,
    coupon: discount ? coupon : null,
    total
  };
}
