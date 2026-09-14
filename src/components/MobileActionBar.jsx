import { Link } from 'react-router-dom';
import { Phone, CalendarCheck } from 'lucide-react';
import './MobileActionBar.css';

export default function MobileActionBar() {
  return (
    <div className="mobile-bar">
      <a href="tel:+15625392226" className="mobile-bar__btn mobile-bar__btn--call">
        <Phone size={18} /> Call Now
      </a>
      <Link to="/book" className="mobile-bar__btn mobile-bar__btn--book">
        <CalendarCheck size={18} /> Book Online
      </Link>
    </div>
  );
}
