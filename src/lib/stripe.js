import { loadStripe } from '@stripe/stripe-js';

const PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
export const stripeReady = PK.startsWith('pk_') && !PK.toLowerCase().includes('replace');

let stripePromise;
export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(PK);
  }
  return stripePromise;
}
