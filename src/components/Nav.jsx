import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import './Nav.css';

const LEFT_LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'Gallery', href: '/#gallery' }
];
const RIGHT_LINKS = [
  { label: 'Process', href: '/#process' },
  { label: 'Contact', href: '/#contact' }
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const isHome = location.pathname === '/';

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__bar container">
        <nav className="nav__side nav__side--left" aria-label="Primary">
          {isHome ? LEFT_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="nav__link">{l.label}</a>
          )) : <Link to="/" className="nav__link">Home</Link>}
        </nav>

        <Link to="/" className="nav__badge" aria-label="Nitos Car Detailing Rossmoor — home">
          <img src="/images/logo.png" alt="Nitos Car Detailing Rossmoor" className="nav__badge-img" />
        </Link>

        <nav className="nav__side nav__side--right" aria-label="Secondary">
          {isHome && RIGHT_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="nav__link">{l.label}</a>
          ))}
          <Link to="/book" className="btn btn-primary nav__cta">Book Online</Link>
        </nav>

        <button className="nav__hamburger" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={26} />
        </button>
      </div>

      <div className={`nav__mobile ${open ? 'nav__mobile--open' : ''}`}>
        <button className="nav__mobile-close" onClick={() => setOpen(false)} aria-label="Close menu">
          <X size={28} />
        </button>
        <div className="nav__mobile-links">
          {[...LEFT_LINKS, ...RIGHT_LINKS].map((l) => (
            <a key={l.label} href={l.href} className="nav__mobile-link">{l.label}</a>
          ))}
          <a href="tel:+15625392226" className="nav__mobile-link nav__mobile-link--phone">
            <Phone size={18} /> (562) 539-2226
          </a>
          <Link to="/book" className="btn btn-primary">Book Online</Link>
        </div>
      </div>
    </header>
  );
}
