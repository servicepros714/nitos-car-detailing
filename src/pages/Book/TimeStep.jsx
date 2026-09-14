import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useBooking } from '../../lib/BookingContext.jsx';
import { fetchBookedSlots, generateTimeSlots } from '../../lib/bookingDb.js';

export default function TimeStep() {
  const { booking, update } = useBooking();
  const [booked, setBooked] = useState([]);
  const [loading, setLoading] = useState(true);
  const allSlots = generateTimeSlots();

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
      {loading ? (
        <p>Checking availability…</p>
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
