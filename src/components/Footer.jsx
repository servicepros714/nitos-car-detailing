import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Star } from 'lucide-react';
import { BUSINESS, HOURS, GOOGLE_PROFILE_URL } from '../lib/site.js';
import { SERVICE_PAGES, CITY_PAGES, HOME_CITY } from '../lib/pages.js';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__diagonal" />
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src="/images/logo.png" alt="Nitos Car Detailing Rossmoor" className="footer__logo" />
          <p>Mobile auto detailing serving Rossmoor and the surrounding areas.</p>
        </div>

        <div className="footer__col">
          <h3>Services</h3>
          {SERVICE_PAGES.map((p) => <Link key={p.path} to={p.path}>{p.nav}</Link>)}
          <a href="/#services">All prices</a>
        </div>

        <div className="footer__col">
          <h3>Areas</h3>
          <Link to="/">{HOME_CITY}</Link>
          {CITY_PAGES.map((p) => <Link key={p.path} to={p.path}>{p.city}</Link>)}
        </div>

        <div className="footer__col">
          <h3>Contact</h3>
          <a href={BUSINESS.phoneHref}><Phone size={16} /> {BUSINESS.phone}</a>
          <span className="footer__line"><MapPin size={16} /> Rossmoor, CA</span>
          <span className="footer__line"><Clock size={16} /> {HOURS}</span>
          <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer"><Star size={16} /> Find us on Google</a>
          <Link to="/book">Book Online</Link>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>&copy; {new Date().getFullYear()} Nitos Car Detailing Rossmoor. All rights reserved.</span>
      </div>
    </footer>
  );
}
