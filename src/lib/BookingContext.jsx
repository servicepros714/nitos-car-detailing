import { createContext, useContext, useEffect, useState } from 'react';

const BookingContext = createContext(null);

const STORE = 'nitos_booking';

// Prices are also enforced server-side: keep in sync with PACKAGES / EXTERIOR in worker/worker.js
export const SERVICES = [
  {
    id: 'basic',
    name: 'Basic Interior Detail',
    price: 150,
    blurb: 'Deep interior reset for daily drivers.',
    items: [
      'Triple-Stage Vacuuming for Deep Debris Removal',
      'Complete Interior Surface Wipe-Down',
      'Floor Mat Cleaning & Restoration'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Interior Detail',
    price: 200,
    blurb: 'Our most thorough interior treatment.',
    featured: true,
    items: [
      'Triple-Stage Vacuuming',
      'Cabin Application',
      'Dust Elimination',
      'Interior Window Cleaning',
      'Deep Carpet Cleaning',
      'Cloth & Carpet Extraction',
      'Full Interior Shampooing',
      'UV-Protectant Coating'
    ]
  },
  {
    id: 'exterior',
    name: 'Exterior Wash',
    price: 50,
    addOn: true,
    blurb: 'Add a hand wash to either detail package.',
    items: [
      'Hand-Washed Exterior',
      'Detailed Rim Cleaning',
      'Tire Scrub and Degrease',
      'Door Jamb & Panel Wipe-Down',
      'Premium Tire Shine Application',
      'Spot-Free Hand Drying'
    ]
  }
];

const EMPTY = {
  serviceIds: [],
  date: null,
  time: null,
  name: '',
  phone: '',
  email: '',
  vehicle: '',
  address: '',
  notes: '',
  result: null
};

// Kept in sessionStorage so the booking survives a redirect-based payment method
function loadBooking() {
  try {
    return { ...EMPTY, ...JSON.parse(sessionStorage.getItem(STORE) || 'null') };
  } catch {
    return EMPTY;
  }
}

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(loadBooking);

  useEffect(() => {
    try { sessionStorage.setItem(STORE, JSON.stringify(booking)); } catch { /* ignore */ }
  }, [booking]);

  const update = (fields) => setBooking((prev) => ({ ...prev, ...fields }));
  // Clears the draft and keeps what the confirmation page needs
  const finish = (result) => setBooking({ ...EMPTY, result });

  const selectedServices = SERVICES.filter((s) => booking.serviceIds.includes(s.id));
  const total = selectedServices.reduce((sum, s) => sum + s.price, 0);

  return (
    <BookingContext.Provider value={{ booking, update, finish, SERVICES, selectedServices, total }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
