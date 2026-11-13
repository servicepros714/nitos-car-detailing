import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useBooking } from '../../lib/BookingContext.jsx';
import { fetchBookedSlots, availableSlots, pacificToday } from '../../lib/bookingDb.js';

export default function TimeStep() {
  const { booking, update } = useBooking();
  const [booked, setBooked] = useState([]);
  const [loading, setLoading] = useState(true);
  // Same-day bookings need 4 hours' notice: earlier slots today are not offered.
  const allSlots = availableSlots(booking.date);
  const isToday = booking.date === pacificToday();

  useEffect(() => {
    if (!booking.date) return;
    setLoading(true);
    fetchBookedSlots(booking.date)
      .then(setBooked)
      .catch(() => setBooked([]))
      .finally(() => setLoading(false));
  }, [booking.date]);

  return (
    <div>
      <p className="eyebrow">Step 3 of 4</p>
      <h1 style={{ fontSize: 30, margin: '10px 0 6px' }}>Pick a time</h1>
      {booking.date && (
        <p style={{ color: 'var(--steel-600)', marginBottom: 20 }}>
          {format(parseISO(booking.date), 'EEEE, MMMM d')} — Pacific Time
        </p>
      )}
      {isToday && (
        <p style={{ color: 'var(--steel-600)', marginBottom: 20 }}>Same-day bookings need at least 4 hours&rsquo; notice.</p>
      )}
      {loading ? (
        <p>Checking availability…</p>
      ) : allSlots.length === 0 ? (
        <p>No same-day times left. Bookings need at least 4 hours&rsquo; notice, so please pick another day.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
          {allSlots.map((slot) => {
            const isBooked = booked.includes(slot);
            const selected = booking.time === slot;
            return (
              <button
                type="button"
                key={slot}
                disabled={isBooked}
                onClick={() => update({ time: slot })}
                style={{
                  border: `2px solid ${selected ? 'var(--racing-red)' : 'var(--chrome-200)'}`,
                  background: isBooked ? 'var(--chrome-200)' : selected ? 'var(--racing-red)' : '#fff',
                  color: isBooked ? 'var(--steel-600)' : selected ? '#fff' : 'var(--ink-navy-deep)',
                  borderRadius: 4,
                  padding: '12px 8px',
                  fontFamily: 'var(--font-accent)',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: isBooked ? 'not-allowed' : 'pointer',
                  textDecoration: isBooked ? 'line-through' : 'none'
                }}
              >
                {slot}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
