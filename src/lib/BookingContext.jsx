import { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

const SERVICES = [
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

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState({
    serviceIds: [],
    date: null,
    time: null,
    name: '',
    phone: '',
    email: '',
    vehicle: '',
    address: '',
    notes: '',
    paymentStatus: 'Pay Later',
    bookingId: null
  });

  const update = (fields) => setBooking((prev) => ({ ...prev, ...fields }));

  const selectedServices = SERVICES.filter((s) => booking.serviceIds.includes(s.id));
  const total = selectedServices.reduce((sum, s) => sum + s.price, 0);

  return (
    <BookingContext.Provider value={{ booking, update, SERVICES, selectedServices, total }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
