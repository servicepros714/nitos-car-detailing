import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { CheckCircle2, Calendar, Clock, MapPin } from 'lucide-react';
import { useBooking } from '../lib/BookingContext.jsx';
import './Confirmation.css';

export default function Confirmation() {
  const { booking, selectedServices, total } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    if (!booking.bookingId) navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!booking.bookingId) return null;

  return (
    <div className="confirmation container">
      <CheckCircle2 size={56} className="confirmation__icon" />
      <p className="eyebrow">Booking Confirmed</p>
      <h1>You're all set, {booking.name.split(' ')[0] || 'there'}.</h1>
      <p className="confirmation__ref">Confirmation #{booking.bookingId}</p>

      <div className="confirmation__card">
        <div className="confirmation__row">
          <Calendar size={18} />
          <span>{booking.date ? format(parseISO(booking.date), 'EEEE, MMMM d, yyyy') : ''}</span>
        </div>
        <div className="confirmation__row">
          <Clock size={18} />
          <span>{booking.time}</span>
        </div>
        <div className="confirmation__row">
          <MapPin size={18} />
          <span>{booking.address}</span>
        </div>
        <div className="confirmation__services">
          {selectedServices.map((s) => (
            <div key={s.id} className="confirmation__line">
              <span>{s.name}</span>
              <span>${s.price}</span>
            </div>
          ))}
          <div className="confirmation__line confirmation__line--total">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      </div>

      <p className="confirmation__note">
        A confirmation with these details has been sent to {booking.email}. Need to change anything?
        Call us at <a href="tel:+15625392226">(562) 539-2226</a>.
      </p>

      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}
