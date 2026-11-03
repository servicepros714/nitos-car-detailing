import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
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
import { getStripe, stripeReady } from '../lib/stripe.js';
import { createPaymentIntent } from '../lib/bookingDb.js';
import { COUPONS, finalizeBooking, isBookingComplete } from '../lib/finalize.js';
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

function CheckoutForm({ clientSecret, total, coupon, onPaid }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [expressAvailable, setExpressAvailable] = useState(false);
  const { booking } = useBooking();

  // Shared by the card form and the express buttons. Returns true when paid.
  const settle = async ({ error, paymentIntent }, fallbackMessage) => {
    if (error) {
      toast.error(error.message || fallbackMessage);
      return false;
    }
    if (paymentIntent && ['succeeded', 'processing', 'requires_capture'].includes(paymentIntent.status)) {
      await onPaid(paymentIntent.id);
      return true;
    }
    toast.error('Payment was not completed.');
    return false;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    const outcome = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: { name: booking.name, email: booking.email, phone: booking.phone }
      }
    });
    await settle(outcome, 'Payment failed. Please check your card details.');
    setPaying(false);
  };

  return (
    <form onSubmit={handlePay} className="checkout__form">
      <ExpressCheckoutElement
        options={{
          paymentMethods: { applePay: 'auto', link: 'auto', googlePay: 'never', amazonPay: 'never', paypal: 'never', klarna: 'never' }
        }}
        onReady={({ availablePaymentMethods }) => setExpressAvailable(!!availablePaymentMethods)}
        onConfirm={async (event) => {
          if (!stripe || !elements) return;
          // Remember the coupon in case the payment method redirects away and back
          try { sessionStorage.setItem('nitos_coupon', coupon || ''); } catch { /* ignore */ }
          const outcome = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.origin + '/confirmation' },
            redirect: 'if_required'
          });
          const ok = await settle(outcome, 'Express checkout failed.');
          if (!ok) event.paymentFailed?.({ reason: 'fail' });
        }}
      />
      {expressAvailable && <div className="checkout__divider"><span>or pay with card</span></div>}

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
  const { booking, finish, total, selectedServices } = useBooking();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState(null);
  const [intentError, setIntentError] = useState(null);
  const [savingLater, setSavingLater] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const complete = isBookingComplete(booking);
  const couponCode = couponApplied ? coupon.trim().toUpperCase() : null;
  const discount = couponCode ? COUPONS[couponCode] : 0;
  const finalTotal = Math.max(0, total - discount);

  useEffect(() => {
    if (!complete || !stripeReady) return undefined;
    let live = true;
    setClientSecret(null);
    setIntentError(null);
    createPaymentIntent({
      pkg: booking.serviceIds.find((id) => id !== 'exterior'),
      exterior: booking.serviceIds.includes('exterior'),
      coupon: couponCode,
      name: booking.name,
      email: booking.email,
      phone: booking.phone
    })
      .then((data) => { if (live) setClientSecret(data.clientSecret); })
      .catch((err) => { if (live) setIntentError(err.message); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete, couponCode]);

  if (!complete) return <Navigate to={booking.result ? '/confirmation' : '/book'} replace />;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setCouponApplied(true);
      toast.success(`$${COUPONS[code]} ${code} discount applied`);
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handlePayLater = async () => {
    setSavingLater(true);
    try {
      finish(await finalizeBooking(booking, { paid: false }));
      navigate('/confirmation');
    } catch (err) {
      toast.error(err.message || 'Could not save your booking.');
      setSavingLater(false);
    }
  };

  const handlePaid = async (paymentIntentId) => {
    try {
      finish(await finalizeBooking(booking, { paid: true, coupon: couponCode, paymentIntentId }));
      navigate('/confirmation');
    } catch (err) {
      toast.error(`Payment received, but we couldn't save the booking — please call us. (${err.message})`);
    }
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
              <span>{couponCode} coupon</span>
              <span>-${discount}</span>
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
          <button className="btn btn-outline checkout__pay-later" onClick={handlePayLater} disabled={savingLater} type="button">
            {savingLater ? 'Saving your booking…' : 'Pay Later — Confirm My Booking'}
          </button>
        </div>

        <div className="checkout__pay">
          {!stripeReady ? (
            <p>Online payment isn't connected yet. You can still reserve your time and pay after the job.</p>
          ) : intentError ? (
            <p>We couldn't start online payment ({intentError}). You can still reserve and pay later.</p>
          ) : clientSecret ? (
            <Elements
              key={clientSecret}
              stripe={getStripe()}
              options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#D42630' } } }}
            >
              <CheckoutForm clientSecret={clientSecret} total={finalTotal} coupon={couponCode} onPaid={handlePaid} />
            </Elements>
          ) : (
            <p>Loading secure payment form…</p>
          )}
        </div>
      </div>
    </div>
  );
}
