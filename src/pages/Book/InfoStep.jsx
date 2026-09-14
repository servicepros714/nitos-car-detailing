import { useBooking } from '../../lib/BookingContext.jsx';

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  const parts = [];
  if (digits.length > 0) parts.push('(' + digits.slice(0, 3));
  if (digits.length >= 4) parts.push(') ' + digits.slice(3, 6));
  if (digits.length >= 7) parts.push('-' + digits.slice(6, 10));
  return parts.join('');
}

const fieldStyle = {
  width: '100%',
  border: '2px solid var(--chrome-200)',
  borderRadius: 4,
  padding: '13px 14px',
  fontSize: 15,
  fontFamily: 'var(--font-body)',
  background: '#fff'
};
const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-accent)',
  fontWeight: 600,
  fontSize: 13,
  marginBottom: 6,
  color: 'var(--ink-navy-deep)'
};

export default function InfoStep() {
  const { booking, update } = useBooking();

  return (
    <div>
      <p className="eyebrow">Step 4 of 4</p>
      <h1 style={{ fontSize: 30, margin: '10px 0 24px' }}>Your info</h1>
      <div style={{ display: 'grid', gap: 18 }}>
        <div>
          <label style={labelStyle}>Full Name</label>
          <input
            style={fieldStyle}
            value={booking.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Jane Rivera"
          />
        </div>

        <div>
          <label style={labelStyle}>Phone</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '2px solid var(--chrome-200)', borderRadius: 4, padding: '0 14px' }}>
            <img src="https://flagcdn.com/w20/us.png" alt="US" width={20} height={14} />
            <span style={{ fontFamily: 'var(--font-body)', color: 'var(--steel-600)' }}>+1</span>
            <input
              style={{ ...fieldStyle, border: 'none', padding: '13px 0' }}
              value={booking.phone}
              onChange={(e) => update({ phone: formatPhone(e.target.value) })}
              placeholder="(562) 555-0148"
              inputMode="tel"
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Email</label>
          <input
            style={fieldStyle}
            type="email"
            value={booking.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="jane@email.com"
          />
        </div>

        <div>
          <label style={labelStyle}>Service Address</label>
          <input
            style={fieldStyle}
            value={booking.address}
            onChange={(e) => update({ address: e.target.value })}
            placeholder="123 Montecito Rd, Rossmoor, CA"
          />
        </div>

        <div>
          <label style={labelStyle}>Vehicle (Year / Make / Model)</label>
          <input
            style={fieldStyle}
            value={booking.vehicle}
            onChange={(e) => update({ vehicle: e.target.value })}
            placeholder="2022 Toyota Camry"
          />
        </div>

        <div>
          <label style={labelStyle}>Notes (optional)</label>
          <textarea
            style={{ ...fieldStyle, minHeight: 90, resize: 'vertical' }}
            value={booking.notes}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder="Gate code, parking instructions, areas of concern…"
          />
        </div>
      </div>
    </div>
  );
}
