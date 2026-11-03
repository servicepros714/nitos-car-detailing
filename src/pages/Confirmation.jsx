import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { CheckCircle2, Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import { useBooking } from '../lib/BookingContext.jsx';
import { finalizeBooking, isBookingComplete } from '../lib/finalize.js';
import './Confirmation.css';

export default function Confirmation() {
  const { booking, finish } = useBooking();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const paymentIntentId = params.get('payment_intent');
  const returning = !!paymentIntentId && params.get('redirect_status') === 'succeeded' && isBookingComplete(booking);
  const [finishing, setFinishing] = useState(returning);
  const ran = useRef(false);

  useEffect(() => {
    if (!returning) {
      if (!booking.result) navigate('/');
      return;
    }
    // Back from a redirect-based payment method: save the booking the checkout page couldn't
    if (ran.current) return;
    ran.current = true;
    let coupon = null;
    try { coupon = sessionStorage.getItem('nitos_coupon') || null; } catch { /* ignore */ }
    finalizeBooking(booking, { paid: true, coupon, paymentIntentId })
      .then(finish)
      .catch((err) => {
        toast.error(`Payment received, but we couldn't save the booking — please call us. (${err.message})`);
      })
      .finally(() => {
        setFinishing(false);
        window.history.replaceState(null, '', '/confirmation');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (finishing) {
    return (
      <div className="confirmation container">
        <Loader2 size={40} className="spin" />
        <p>Finishing your booking…</p>
      </div>
    );
  }

  const result = booking.result;
  if (!result) return null;

  return (
    <div className="confirmation container">
      <CheckCircle2 size={56} className="confirmation__icon" />
      <p className="eyebrow">Booking Confirmed</p>
      <h1>You're all set, {result.name.split(' ')[0] || 'there'}.</h1>
      <p className="confirmation__ref">Confirmation #{result.id}</p>

      <div className="confirmation__card">
        <div className="confirmation__row">
          <Calendar size={18} />
          <span>{format(parseISO(result.date), 'EEEE, MMMM d, yyyy')}</span>
        </div>
        <div className="confirmation__row">
          <Clock size={18} />
          <span>{result.time}</span>
        </div>
        <div className="confirmation__row">
          <MapPin size={18} />
          <span>{result.address}</span>
        </div>
        <div className="confirmation__services">
          {result.services.map((s) => (
            <div key={s.id} className="confirmation__line">
              <span>{s.name}</span>
              <span>${s.price}</span>
            </div>
          ))}
          {result.discount > 0 && (
            <div className="confirmation__line">
              <span>{result.coupon} coupon</span>
              <span>-${result.discount}</span>
            </div>
          )}
          <div className="confirmation__line confirmation__line--total">
            <span>Total</span>
            <span>${result.total}</span>
          </div>
        </div>
      </div>

      <p className="confirmation__note">
        A confirmation with these details has been sent to {result.email}. Need to change anything?
        Call us at <a href="tel:+15625392226">(562) 539-2226</a>.
      </p>

      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}
