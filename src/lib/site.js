// Business facts used across the site, the SEO head tags and the schema.
// Package prices and contents live in BookingContext.jsx (SERVICES).

export const BUSINESS = {
  name: 'Nitos Car Detailing Rossmoor',
  shortName: 'Nitos Car Detailing',
  phone: '(562) 539-2226',
  phoneHref: 'tel:+15625392226',
  city: 'Rossmoor',
};

export const HOURS = 'Open 7 days, 7 AM – 7 PM';

// Canonical site address (no www). Every canonical tag, sitemap URL and schema URL uses this.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://nitoscardetailingrossmoor.site').replace(/\/$/, '');

// Google Business Profile. GOOGLE_PROFILE_URL is the share link people click;
// GOOGLE_PROFILE_ID is the stable profile URL used in schema (sameAs).
export const GOOGLE_PROFILE_URL = 'https://share.google/2IxxZW6cwLGtHpQ94';
export const GOOGLE_PROFILE_ID = 'https://www.google.com/search?kgmid=/g/11yrk4_j94';

// Home page FAQ. Also used for the FAQPage schema on the home page, so only list
// questions that are shown on the page, and only confirmed facts.
export const FAQS = [
  { q: 'Do I need to provide water or power?', a: 'No. We bring our own water, power and equipment. We just need room to work around the car.' },
  { q: 'How much does a detail cost?', a: 'The Basic Interior Detail is $150 and the Premium Interior Detail is $200. Add the Exterior Wash to either one for $50.' },
  { q: 'Can I book just the Exterior Wash?', a: 'No. The Exterior Wash is an add-on. Choose the Basic or Premium Interior Detail first, then add the wash on the next screen.' },
  { q: 'Do SUVs, trucks and vans cost more?', a: 'No. Every vehicle size pays the same package price.' },
  { q: 'What are your hours?', a: 'We are open 7 days a week, 7 AM to 7 PM, with appointments every 30 minutes. Same-day bookings need at least 4 hours’ notice.' },
  { q: 'When do I pay?', a: 'Pay online when you book and take $15 off with code PREPAY, or choose Pay Later and pay after the detail.' },
  { q: 'Which areas do you serve?', a: 'Rossmoor and nearby cities, including Los Alamitos, Seal Beach, Cypress, Long Beach and Westminster. Enter your address when you book.' },
];

// Real customer reviews only, copied word for word from the Google Business Profile
// (newest first, first name + last initial). Nothing shows while this list is empty.
// To add one: { name: 'Maria G.', text: '...' }, then commit and push.
export const REVIEWS = [];
