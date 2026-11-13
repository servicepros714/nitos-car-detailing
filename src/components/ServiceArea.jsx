import { Link } from 'react-router-dom';
import { Clock, MapPin, Phone } from 'lucide-react';
import { BUSINESS, HOURS } from '../lib/site.js';
import { CITY_PAGES, HOME_CITY } from '../lib/pages.js';

// Home: where we work, with links to every city page.
export default function ServiceArea() {
  return (
    <section className="section area" id="area">
      <div className="container area__grid">
        <div>
          <p className="eyebrow">SERVICE AREA</p>
          <h2 className="lp-h2">Based in Rossmoor. We come to you.</h2>
          <p className="area__text">
            We detail cars at homes and offices in Rossmoor and the nearby cities below,
            with our own water and power. Don&rsquo;t see your city? Call and ask.
          </p>
          <ul className="lp-chips">
            <li><span>{HOME_CITY}</span></li>
            {CITY_PAGES.map((c) => <li key={c.path}><Link to={c.path}>{c.city}</Link></li>)}
          </ul>
          <ul className="area__info">
            <li><MapPin size={16} /> Rossmoor, CA</li>
            <li><Clock size={16} /> {HOURS}</li>
            <li><Phone size={16} /> <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a></li>
          </ul>
        </div>
        <div className="area__map">
          <iframe
            title="Map of Rossmoor, CA"
            src="https://www.google.com/maps?q=Rossmoor%2C%20CA&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
