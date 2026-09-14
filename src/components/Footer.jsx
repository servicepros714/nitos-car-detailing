import { Phone, MapPin, Clock } from 'lucide-react';
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
          <h4>Contact</h4>
          <a href="tel:+15625392226"><Phone size={16} /> (562) 539-2226</a>
          <span className="footer__line"><MapPin size={16} /> Rossmoor, CA</span>
          <span className="footer__line"><Clock size={16} /> Mon–Sun: By Appointment</span>
        </div>

        <div className="footer__col">
          <h4>Site</h4>
          <a href="/#services">Services</a>
          <a href="/#gallery">Gallery</a>
          <a href="/#process">Process</a>
          <a href="/book">Book Online</a>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>&copy; {new Date().getFullYear()} Nitos Car Detailing Rossmoor. All rights reserved.</span>
      </div>
    </footer>
  );
}
