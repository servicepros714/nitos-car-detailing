import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useBooking } from '../lib/BookingContext.jsx';
import { SERVICE_PAGES } from '../lib/pages.js';
import './Services.css';

// Home packages section. Landing pages reuse it with their own title (and without
// the service-page links, since they have a "More services" row).
export default function Services({ title = 'Built around your vehicle, not a conveyor belt', links = true }) {
  const { SERVICES } = useBooking();

  return (
    <section className="services section" id="services">
      <div className="container">
        <p className="eyebrow">Packages</p>
        <h2 className="services__title">{title}</h2>
        <p className="services__note">Pick an interior detail, then add the Exterior Wash if you want. Same price for every vehicle size.</p>
        <div className="services__grid">
          {SERVICES.map((s) => (
            <article className={`spec-plate ${s.featured ? 'spec-plate--featured' : ''}`} key={s.id}>
              {s.featured && <span className="spec-plate__tag">Most Complete</span>}
              <h3 className="spec-plate__name">{s.name}</h3>
              <p className="spec-plate__blurb">{s.blurb}</p>
              <div className="spec-plate__price">
                <span>{s.addOn ? '+' : ''}${s.price}</span>
                {s.addOn && <span className="spec-plate__addon">add-on</span>}
              </div>
              <ul className="spec-plate__list">
                {s.items.map((item) => (
                  <li key={item}><Check size={15} /> {item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="services__cta">
          <Link to="/book" className="btn btn-primary">
            Book Now <ArrowRight size={16} />
          </Link>
        </div>
        {links && (
          <nav className="seo-links" aria-label="Detailing services">
            <span>Learn more:</span>
            {SERVICE_PAGES.map((p) => <Link key={p.path} to={p.path}>{p.nav}</Link>)}
          </nav>
        )}
      </div>
    </section>
  );
}
