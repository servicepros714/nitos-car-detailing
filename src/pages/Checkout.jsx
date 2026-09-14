import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  ExpressCheckoutElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { Tag, Loader2, Lock } from 'lucide-react';
import { useBooking } from '../lib/BookingContext.jsx';
import { getStripe } from '../lib/stripe.js';
import { createPaymentIntent, updatePaymentStatus } from '../lib/bookingDb.js';
import './Checkout.css';

const elementStyle = {
  style: {
    base: {
      fontSize: '15px',
      fontFamily: 'Public Sans, sans-serif',
      color: '#0B1F3A',
      '::placeholder': { color: '#8A93A3' }
    }
  }
};

function CheckoutForm({ clientSecret, total, onPaid }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const { booking } = useBooking();

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: { name: booking.name, email: booking.email, phone: booking.phone }
      }
    });
    setPaying(false);
    if (error) {
      toast.error(error.message || 'Payment failed. Please check your card details.');
      return;
    }
    if (paymentIntent?.status === 'succeeded') {
      onPaid();
    }
  };

  return (
    <form onSubmit={handlePay} className="checkout__form">
      <ExpressCheckoutElement
        onConfirm={async () => {
          if (!stripe) return;
          const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: { return_url: window.location.origin + '/confirmation' },
            redirect: 'if_required'
          });
          if (error) toast.error(error.message || 'Express checkout failed.');
          else if (paymentIntent?.status === 'succeeded') onPaid();
        }}
      />
      <div className="checkout__divider"><span>or pay with card</span></div>

      <label className="checkout__label">Card number</label>
      <div className="checkout__card-field"><CardNumberElement options={elementStyle} /></div>
      <div className="checkout__row">
        <div>
          <label className="checkout__label">Expiry</label>
          <div className="checkout__card-field"><CardExpiryElement options={elementStyle} /></div>
        </div>
        <div>
          <label className="checkout__label">CVC</label>
          <div className="checkout__card-field"><CardCvcElement options={elementStyle} /></div>
        </div>
      </div>

      <button className="btn btn-primary checkout__pay-btn" type="submit" disabled={!stripe || paying}>
        {paying ? <Loader2 size={16} className="spin" /> : <Lock size={15} />}
        {paying ? 'Processing…' : `Pay $${total}`}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { booking, total, selectedServices } = useBooking();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState(null);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const discount = couponApplied ? 15 : 0;
  const finalTotal = Math.max(0, total - discount);

  useEffect(() => {
    if (!booking.bookingId) {
      navigate('/book');
      return;
    }
    createPaymentIntent(finalTotal, booking.email)
      .then((data) => setClientSecret(data.clientSecret))
      .catch(() => toast.error('Could not initialize payment.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTotal]);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'PREPAY') {
      setCouponApplied(true);
      toast.success('$15 PREPAY discount applied');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handlePayLater = async () => {
    try {
      await updatePaymentStatus(booking.bookingId, 'Pay Later');
    } catch (err) {
      // booking is already saved; payment status can be fixed by the admin dashboard if this fails
    }
    navigate('/confirmation');
  };

  const handlePaid = async () => {
    try {
      await updatePaymentStatus(booking.bookingId, 'Paid');
    } catch (err) {
      // booking is already saved; payment status can be fixed by the admin dashboard if this fails
    }
    navigate('/confirmation');
  };

  return (
    <div className="checkout container">
      <p className="eyebrow">Almost done</p>
      <h1 style={{ fontSize: 30, margin: '10px 0 24px' }}>Review &amp; pay</h1>

      <div className="checkout__grid">
        <div className="checkout__summary">
          <h3>Order Summary</h3>
          {selectedServices.map((s) => (
            <div className="checkout__line" key={s.id}>
              <span>{s.name}</span>
              <span>${s.price}</span>
            </div>
          ))}
          {couponApplied && (
            <div className="checkout__line checkout__line--discount">
              <span>PREPAY coupon</span>
              <span>-$15</span>
            </div>
          )}
          <div className="checkout__coupon">
            <Tag size={16} />
            <input
              placeholder="Coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              disabled={couponApplied}
            />
            <button type="button" onClick={applyCoupon} disabled={couponApplied}>Apply</button>
          </div>
          <div className="checkout__total">
            <span>Total</span>
            <span>${finalTotal}</span>
          </div>
          <button className="btn btn-outline checkout__pay-later" onClick={handlePayLater} type="button">
            Pay Later — Confirm My Booking
          </button>
        </div>

        <div className="checkout__pay">
          {clientSecret ? (
            <Elements
              stripe={getStripe()}
              options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#D42630' } } }}
            >
              <CheckoutForm clientSecret={clientSecret} total={finalTotal} onPaid={handlePaid} />
            </Elements>
          ) : (
            <p>Loading secure payment form…</p>
          )}
        </div>
      </div>
    </div>
  );
}
