import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import './Hero.css';

// Confirmed facts only (no made-up counts or ratings).
const STATS = [
  { value: '$150', label: 'Interior Details From' },
  { value: '7 Days', label: '7 AM – 7 PM' },
  { value: 'Mobile', label: 'We Come To You' }
];

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="hero">
      <div className={`hero__content ${loaded ? 'hero__content--in' : ''}`}>
        <h1 className="eyebrow hero__kicker">Mobile car detailing in Rossmoor, CA</h1>
        <p className="hero__title">
          Showroom finish,<br />brought to your driveway.
        </p>
        <p className="hero__sub">
          Nitos Car Detailing Rossmoor delivers hand-finished interior detailing, plus
          an optional hand wash, at your home or office — booked online.
        </p>
        <div className="hero__actions">
          <Link to="/book" className="btn btn-primary">Book Your Detail</Link>
          <a href="tel:+15625392226" className="btn btn-outline-light">(562) 539-2226</a>
        </div>
        <div className="hero__stats">
          {STATS.map((s) => (
            <div className="hero__stat" key={s.label}>
              <span className="hero__stat-value">{s.value}</span>
              <span className="hero__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`hero__media ${loaded ? 'hero__media--in' : ''}`}>
        <img
          src="/images/hero-tacoma-foam.jpg"
          alt="Truck covered in foam pre-soak during a Nitos detailing appointment"
          className="hero__img"
        />
        <div className="hero__media-overlay" />
      </div>
    </section>
  );
}
