// ---------------------------------------------------------------------------
// SEO landing pages (service + city). One template renders all of them
// (src/pages/Landing.jsx); head tags and schema come from src/lib/seo.js.
//
// Only confirmed facts: prices and package contents (BookingContext.jsx SERVICES),
// open 7 days 7 AM–7 PM, own water and power, same price for every vehicle size,
// prepay online (PREPAY = $15 off) or pay later, same-day bookings need 4 hours'
// notice. Never state: job durations, years in business, vehicles detailed,
// ratings, insurance, guarantees. The Exterior Wash is an add-on: never bookable alone.
// Keep the wording distinct from the owner's other detailing sites.
// ---------------------------------------------------------------------------

const BRANDS = ['Nitos Car Detailing', 'Nitos Detailing', 'Nitos'];

// Longest title that fits in 60 chars (counting '&' as the escaped '&amp;').
// For each brand (longest first) try "…, CA", then without ", CA".
export function fitTitle(keyword, city) {
  const options = BRANDS.flatMap((b) => [`${keyword} ${city}, CA | ${b}`, `${keyword} ${city} | ${b}`]);
  const len = (t) => t.replace(/&/g, '&amp;').length;
  return options.find((t) => len(t) <= 60) || options[options.length - 1];
}

export const HOME_CITY = 'Rossmoor';

const FAQ_WATER = { q: 'Do I need to provide water or power?', a: 'No. We bring our own water, power and equipment. We just need room to work around the car.' };
const FAQ_PAY = { q: 'When do I pay?', a: 'Pay online when you book and take $15 off with code PREPAY, or choose Pay Later and pay after the detail.' };
const FAQ_WASH = { q: 'Can I book just the Exterior Wash?', a: 'No. The Exterior Wash is a $50 add-on to the Basic or Premium Interior Detail. Add it on the screen after you pick your detail.' };
const FAQ_SIZE = { q: 'Do SUVs and trucks cost more?', a: 'No. Sedans, SUVs, trucks and vans all pay the same: $150 for the Basic Interior Detail, $200 for the Premium Interior Detail and $50 to add the Exterior Wash.' };
const FAQ_SOON = { q: 'How soon can I book?', a: 'Appointments start every 30 minutes from 7 AM to 7 PM, seven days a week. Same-day bookings need at least 4 hours’ notice.' };
const FAQ_PACKAGES = {
  q: 'What do the packages include?',
  a: 'The Basic Interior Detail ($150) is triple-stage vacuuming, a complete interior surface wipe-down and floor mat cleaning. The Premium Interior Detail ($200) adds cabin application, dust elimination, interior windows, deep carpet cleaning, cloth and carpet extraction, full interior shampooing and a UV-protectant coating. The Exterior Wash is a $50 add-on to either one.',
};

// Schema offers: only things a customer can actually book. The wash never appears alone.
const DETAIL_OFFERS = [
  ['Basic Interior Detail', 150], ['Premium Interior Detail', 200],
  ['Basic Interior Detail + Exterior Wash', 200], ['Premium Interior Detail + Exterior Wash', 250],
];

const PHOTO = {
  interior: { src: '/images/interior-before-after.jpg', alt: 'Cluttered SUV interior before and after an interior detail', portrait: true },
  camry: { src: '/images/camry-before-after.jpg', alt: 'Camry covered in pre-wash foam, then finished to a deep black shine', portrait: true },
  camaro: { src: '/images/camaro-before-after.jpg', alt: 'Black Camaro exterior before and after a hand wash', portrait: true },
  tacoma: { src: '/images/hero-tacoma-foam.jpg', alt: 'Truck covered in foam pre-soak during a mobile detail' },
  truck: { src: '/images/truck-detail.jpg', alt: 'GMC truck finished with a mobile detail on location' },
  van: { src: '/images/sprinter-van.jpg', alt: 'Sprinter cargo van after an exterior wash' },
};

export const SERVICE_PAGES = [
  {
    path: '/interior-car-detailing-rossmoor',
    kind: 'service',
    nav: 'Interior detailing',
    city: HOME_CITY,
    title: fitTitle('Interior Car Detailing', HOME_CITY),
    description: 'Mobile interior car detailing in Rossmoor, CA. Basic Interior Detail $150, Premium with shampoo and extraction $200, done at your home. Book online.',
    eyebrow: 'Interior detailing · Rossmoor, CA',
    h1: ['Interior car detailing', 'in Rossmoor.'],
    lede: 'Crumbs, dust, pet hair and coffee rings, cleaned out where your car is parked. Basic resets the cabin; Premium shampoos and extracts it.',
    facts: ['From $150', 'Same price, any size', 'Open 7 days, 7 AM–7 PM'],
    card: 'premium',
    photo: PHOTO.interior,
    intro: {
      h2: 'Two levels of interior clean.',
      paras: [
        'Commutes on the 405, school runs and weekend errands all leave something behind in the cabin. A quick vacuum only lifts what sits on top.',
        'The Basic Interior Detail is triple-stage vacuuming for deep debris removal, a complete interior surface wipe-down, and floor mat cleaning and restoration.',
        'The Premium Interior Detail goes further: cabin application, dust elimination, interior window cleaning, deep carpet cleaning, cloth and carpet extraction, full interior shampooing and a UV-protectant coating.',
      ],
    },
    points: [
      { title: 'No drop-off', text: 'We detail the car in your driveway or at work, with our own water and power.' },
      { title: 'Pick your level', text: 'Basic for regular upkeep, Premium when seats and carpet need shampoo and extraction.' },
      { title: 'Flat pricing', text: '$150 or $200, the same for every vehicle size.' },
    ],
    faqs: [
      { q: 'Basic or Premium: which one do I need?', a: 'Basic is for a car that gets regular care and needs a deep vacuum, a wipe-down and clean floor mats. Premium is for stained seats or carpet, or a car that hasn’t been detailed in a while.' },
      { q: 'Can you clean the outside too?', a: 'Yes. Add the Exterior Wash for $50: a hand-washed exterior, detailed rim cleaning, tire scrub and degrease, door jamb and panel wipe-down, tire shine and a spot-free hand dry.' },
      FAQ_SIZE,
      FAQ_WATER,
      FAQ_PAY,
    ],
    service: { type: 'Interior car detailing', offers: [['Basic Interior Detail', 150], ['Premium Interior Detail', 200]] },
  },
  {
    path: '/car-seat-carpet-shampoo-rossmoor',
    kind: 'service',
    nav: 'Seat & carpet shampoo',
    city: HOME_CITY,
    title: fitTitle('Car Seat and Carpet Shampoo', HOME_CITY),
    description: 'Car seat and carpet shampoo in Rossmoor, CA. The $200 Premium Interior Detail includes deep carpet cleaning, extraction and full shampooing at your home.',
    eyebrow: 'Seat & carpet shampoo · Rossmoor, CA',
    h1: ['Car seat & carpet shampoo', 'in Rossmoor.'],
    lede: 'Juice-box spills, muddy cleats, a dog’s favorite seat. The Premium Interior Detail shampoos and extracts it in your driveway.',
    facts: ['$200 Premium Detail', 'Same price, any size', 'Open 7 days, 7 AM–7 PM'],
    card: 'premium',
    photo: PHOTO.interior,
    intro: {
      h2: 'Shampoo that reaches the fibers.',
      paras: [
        'Vacuuming picks up what’s loose. Spills, ground-in dirt and stale smells sit down in the fabric where a vacuum can’t reach.',
        'In the Premium Interior Detail we shampoo cloth seats and carpets, then extract the dirty water and loosened grime back out. Deep carpet cleaning, dust elimination, interior windows and a UV-protectant coating come with it.',
        'Most everyday stains come out or fade a lot. Old, set-in stains, ink and dye transfer may not lift completely.',
      ],
    },
    points: [
      { title: 'Shampoo + extraction', text: 'The grime comes out with the water instead of drying back into the seat.' },
      { title: 'UV protection', text: 'Every Premium Interior Detail ends with a UV-protectant coating.' },
      { title: 'At your address', text: 'Own water and power, so nothing is needed from you.' },
    ],
    faqs: [
      { q: 'Does the Basic Interior Detail include shampoo?', a: 'No. Basic is triple-stage vacuuming, a complete interior surface wipe-down and floor mat cleaning. Shampoo, extraction and deep carpet cleaning come with the Premium Interior Detail ($200).' },
      { q: 'Will every stain come out?', a: 'Most everyday stains come out or fade noticeably. Old, set-in stains, ink and dye transfer may not lift completely.' },
      { q: 'How long do the seats take to dry?', a: 'It depends on the fabric, the weather and how much cleaning a spot needed. Parking in the sun, or in a garage with the windows cracked, helps them dry faster.' },
      FAQ_WATER,
      FAQ_PAY,
    ],
    service: { type: 'Car upholstery and carpet shampoo', offers: [['Premium Interior Detail', 200]] },
  },
  {
    path: '/full-car-detailing-rossmoor',
    kind: 'service',
    nav: 'Full detail, inside & out',
    city: HOME_CITY,
    title: fitTitle('Full Car Detailing', HOME_CITY),
    description: 'Full car detailing in Rossmoor, CA, inside and out. Basic Interior Detail plus hand wash $200, or Premium plus hand wash $250, done at your home.',
    eyebrow: 'Full detail · Rossmoor, CA',
    h1: ['Full car detailing', 'in Rossmoor, inside and out.'],
    lede: 'An interior detail plus the Exterior Wash in one visit at your address. Basic plus the wash is $200; Premium plus the wash is $250.',
    facts: ['From $200', 'Inside + out', 'Open 7 days, 7 AM–7 PM'],
    card: 'combo',
    photo: PHOTO.camry,
    intro: {
      h2: 'Cabin and paint in one visit.',
      paras: [
        'A full detail is the Basic or Premium Interior Detail with the Exterior Wash added. Inside and out are done in the same appointment, wherever the car is parked.',
        'Inside, choose Basic ($150) for a deep vacuum, wipe-down and clean floor mats, or Premium ($200) for shampoo, extraction and a UV-protectant coating.',
        'Outside, the Exterior Wash adds $50: a hand-washed exterior, detailed rim cleaning, tire scrub and degrease, door jamb and panel wipe-down, premium tire shine and a spot-free hand dry.',
      ],
    },
    points: [
      { title: 'Two flat prices', text: 'Basic plus the wash for $200, or Premium plus the wash for $250, any vehicle size.' },
      { title: 'Washed by hand', text: 'Rims, tires and door jambs included, finished with a spot-free hand dry.' },
      { title: 'Own water and power', text: 'Nothing needed from you but room around the car.' },
    ],
    faqs: [
      { q: 'What does a full detail cost?', a: '$200 for the Basic Interior Detail with the Exterior Wash, or $250 for the Premium Interior Detail with the Exterior Wash. Same price for every vehicle size.' },
      FAQ_WASH,
      { q: 'What does the Exterior Wash include?', a: 'A hand-washed exterior, detailed rim cleaning, tire scrub and degrease, door jamb and panel wipe-down, premium tire shine application and a spot-free hand dry.' },
      FAQ_WATER,
      FAQ_PAY,
    ],
    service: { type: 'Full car detailing', offers: [['Basic Interior Detail + Exterior Wash', 200], ['Premium Interior Detail + Exterior Wash', 250]] },
  },
  {
    path: '/suv-truck-detailing-rossmoor',
    kind: 'service',
    nav: 'SUV & truck detailing',
    city: HOME_CITY,
    title: fitTitle('SUV & Truck Detailing', HOME_CITY),
    description: 'Mobile SUV, truck and van detailing in Rossmoor, CA at the same price as a sedan. Interior from $150, add a hand wash for $50. Book online.',
    eyebrow: 'SUV, truck & van · Rossmoor, CA',
    h1: ['SUV & truck detailing', 'in Rossmoor, same price.'],
    lede: 'Three-row SUVs, pickups and work vans pay the same package price as a sedan.',
    facts: ['From $150', 'All sizes, same price', 'Open 7 days, 7 AM–7 PM'],
    card: 'premium',
    photo: PHOTO.truck,
    intro: {
      h2: 'Bigger vehicle, same price.',
      paras: [
        'The Basic Interior Detail is $150, the Premium Interior Detail is $200 and adding the Exterior Wash is $50, whether it’s a compact, a three-row SUV, a pickup or a van.',
        'Third rows, truck-cab floors and cargo areas collect the most dirt. Triple-stage vacuuming pulls debris out of carpets, seats and crevices.',
        'Add the Exterior Wash to have the body hand-washed, the rims cleaned and the tires scrubbed and shined in the same visit.',
      ],
    },
    points: [
      { title: 'One price, any size', text: 'Sedans, SUVs, trucks and vans all pay the same.' },
      { title: 'Every row', text: 'The whole interior is detailed, third row included.' },
      { title: 'Open 7 days', text: 'Book any open time from 7 AM to 7 PM.' },
    ],
    faqs: [
      FAQ_SIZE,
      { q: 'Do you clean the third row?', a: 'Yes. The whole interior is detailed, every row included. The Premium Interior Detail adds deep carpet cleaning, cloth and carpet extraction and full interior shampooing.' },
      { q: 'Can you hand wash a truck or van?', a: 'Yes. Add the Exterior Wash to either detail for $50: a hand wash, detailed rim cleaning, tire scrub and degrease, door jamb and panel wipe-down, tire shine and a spot-free hand dry.' },
      FAQ_WATER,
      FAQ_SOON,
    ],
    service: { type: 'SUV and truck detailing', offers: DETAIL_OFFERS },
  },
];

function cityPage({ slug, city, description, lede, intro, photo, localH2, localText, spots, spotsLabel = 'Neighborhoods we cover', faqs }) {
  return {
    path: `/mobile-car-detailing-${slug}`,
    kind: 'city',
    nav: city,
    city,
    title: fitTitle('Mobile Car Detailing', city),
    description,
    eyebrow: `Mobile detailing · ${city}, CA`,
    h1: ['Mobile car detailing', `in ${city}.`],
    lede,
    facts: ['Interior from $150', 'Hand wash add-on, +$50', 'Open 7 days, 7 AM–7 PM'],
    card: 'premium',
    photo,
    intro,
    points: [
      { title: `We come to you in ${city}`, text: 'Home or office, with our own water and power.' },
      { title: 'Same price, any size', text: 'Sedans, SUVs, trucks and vans all pay the same.' },
      { title: 'Pay your way', text: 'Prepay online with code PREPAY and save $15, or pay later.' },
    ],
    local: { h2: localH2, text: localText, spots, spotsLabel, map: `${city}, CA` },
    faqs: [...faqs, FAQ_PACKAGES, FAQ_WATER, FAQ_SOON],
    service: { type: 'Mobile car detailing', offers: DETAIL_OFFERS },
  };
}

export const CITY_PAGES = [
  cityPage({
    slug: 'los-alamitos',
    city: 'Los Alamitos',
    description: 'Mobile car detailing in Los Alamitos, CA. Interior details from $150, shampoo and extraction for $200, plus a $50 hand wash add-on. Book online.',
    lede: 'Interior detailing at your Los Alamitos home or office, with an optional hand wash. Open 7 days, 7 AM to 7 PM.',
    photo: PHOTO.interior,
    intro: {
      h2: 'Right across Katella from Rossmoor.',
      paras: [
        'Los Alamitos shares a border with Rossmoor, so it’s one of the shortest drives we make. We detail the car in your driveway or at your workplace.',
        'Choose the Basic Interior Detail for triple-stage vacuuming, a complete interior surface wipe-down and floor mat cleaning, or the Premium for shampoo, extraction and a UV-protectant coating.',
        'Add the Exterior Wash for $50 to have the outside hand-washed in the same visit.',
      ],
    },
    localH2: 'All around Los Alamitos.',
    localText: 'We come to homes, apartments and offices across Los Alamitos, on both sides of Katella Avenue.',
    spots: ['Along Katella Avenue', 'Near Laurel Park', 'Near Los Alamitos High School', 'Along Los Alamitos Boulevard'],
    spotsLabel: 'Areas we cover',
    faqs: [
      { q: 'Can you detail my car at work in Los Alamitos?', a: 'Yes, if we can park next to your car and the property allows it. We bring our own water and power. If your building has rules about service vehicles, call us before the appointment.' },
    ],
  }),
  cityPage({
    slug: 'seal-beach',
    city: 'Seal Beach',
    description: 'Mobile car detailing in Seal Beach, CA. Interior details from $150 and a $50 hand wash add-on, done at your home. Book online, open 7 days.',
    lede: 'Interior detailing at your Seal Beach home, with an optional hand wash. No drop-off, no waiting room.',
    photo: PHOTO.camaro,
    intro: {
      h2: 'Beach town, clean cabin.',
      paras: [
        'Seal Beach sits just south of Rossmoor. Sand from the pier, salty air and beach gear all end up in the car, and we clean it out at your home.',
        'Triple-stage vacuuming pulls loose sand from carpets and crevices on both details. The Premium Interior Detail adds deep carpet cleaning, extraction, full shampooing and a UV-protectant coating.',
        'Add the Exterior Wash for $50 to hand wash the salt film off the body and shine the tires in the same visit.',
      ],
    },
    localH2: 'Old Town to College Park.',
    localText: 'We detail cars at homes across Seal Beach, from Old Town and Main Street to College Park East and West and Leisure World.',
    spots: ['Old Town & Main Street', 'College Park East', 'College Park West', 'Leisure World', 'Bridgeport'],
    faqs: [
      { q: 'Can you get beach sand out of the carpet?', a: 'Triple-stage vacuuming pulls out loose sand on both details. For sand worked deep into the carpet, choose the Premium Interior Detail with deep carpet cleaning and extraction.' },
    ],
  }),
  cityPage({
    slug: 'cypress',
    city: 'Cypress',
    description: 'Mobile car detailing in Cypress, CA. Interior details from $150, shampoo and extraction for $200, plus a $50 hand wash add-on. Book online.',
    lede: 'Interior detailing in your Cypress driveway or office lot, with an optional hand wash. Open 7 days, 7 AM to 7 PM.',
    photo: PHOTO.tacoma,
    intro: {
      h2: 'A short drive up Valley View.',
      paras: [
        'Cypress is just northeast of Rossmoor. We work in your driveway or at your office with our own water and power.',
        'The Basic Interior Detail is triple-stage vacuuming, a complete interior surface wipe-down and floor mat cleaning. The Premium adds dust elimination, interior windows, deep carpet cleaning, extraction, full shampooing and a UV-protectant coating.',
        'Add the Exterior Wash to either detail for $50: a hand wash, clean rims, tire shine and a spot-free hand dry.',
      ],
    },
    localH2: 'Homes and offices in Cypress.',
    localText: 'We come to homes and workplaces across Cypress, from the neighborhoods off Valley View to the business parks along Katella.',
    spots: ['Near Cypress College', 'Along Valley View Street', 'Along Lincoln Avenue', 'Katella Avenue business parks'],
    spotsLabel: 'Areas we cover',
    faqs: [
      { q: 'Can you detail my car at an office in Cypress?', a: 'Yes, as long as there is room to work around the car and the property allows it. We bring our own water and power.' },
    ],
  }),
  cityPage({
    slug: 'long-beach',
    city: 'Long Beach',
    description: 'Mobile car detailing in east Long Beach, CA. Interior details from $150 and a $50 hand wash add-on, at your home. Book online, open 7 days.',
    lede: 'Interior detailing at your east Long Beach home, with an optional hand wash. Open 7 days, 7 AM to 7 PM.',
    photo: PHOTO.camry,
    intro: {
      h2: 'East Long Beach, next door.',
      paras: [
        'Rossmoor borders east Long Beach, so neighborhoods like Los Altos and Park Estates are only minutes away. We detail the car right where it’s parked.',
        'Pick the Basic Interior Detail for triple-stage vacuuming, a complete interior surface wipe-down and floor mat cleaning, or the Premium for shampoo, extraction and a UV-protectant coating.',
        'The Exterior Wash adds a hand wash, detailed rims and tire shine for $50, in the same visit.',
      ],
    },
    localH2: 'Los Altos to Belmont Shore.',
    localText: 'We come to homes across east Long Beach, from Los Altos and El Dorado Park to Park Estates, Belmont Shore and Naples.',
    spots: ['Los Altos', 'El Dorado Park', 'Park Estates', 'Belmont Shore', 'Naples'],
    faqs: [
      { q: 'Which parts of Long Beach do you cover?', a: 'East Long Beach, closest to Rossmoor: Los Altos, El Dorado Park, Park Estates, Belmont Shore and Naples. For other parts of Long Beach, call us before booking.' },
    ],
  }),
  cityPage({
    slug: 'westminster',
    city: 'Westminster',
    description: 'Mobile car detailing in Westminster, CA. Interior details from $150, shampoo and extraction for $200, plus a $50 hand wash add-on. Book online.',
    lede: 'Interior detailing at your Westminster home or business, with an optional hand wash. No shop, no waiting room.',
    photo: PHOTO.van,
    intro: {
      h2: 'Family cars and work vans.',
      paras: [
        'Westminster is a short drive southeast of Rossmoor along the 405. Family SUVs and work vans pay the same price as a sedan.',
        'The Basic Interior Detail is triple-stage vacuuming, a complete interior surface wipe-down and floor mat cleaning. The Premium adds deep carpet cleaning, extraction, full shampooing and a UV-protectant coating.',
        'Add the Exterior Wash for $50 to have the outside hand-washed and the tires shined in the same visit.',
      ],
    },
    localH2: 'Across Westminster.',
    localText: 'We detail cars at homes and businesses across Westminster, from Little Saigon to the neighborhoods off Goldenwest Street.',
    spots: ['Little Saigon', 'Near Westminster Mall', 'Along Beach Boulevard', 'Along Goldenwest Street', 'Midway City'],
    spotsLabel: 'Areas we cover',
    faqs: [
      { q: 'Can you detail a work van at my business?', a: 'Yes. Vans pay the same price as any other vehicle. We need room to work around the van and permission to park next to it.' },
    ],
  }),
];

export const LANDING_PAGES = [...SERVICE_PAGES, ...CITY_PAGES];

export function findLanding(pathname) {
  return LANDING_PAGES.find((p) => p.path === pathname);
}
