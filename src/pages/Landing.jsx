import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock, MapPin, Phone } from 'lucide-react';
import { SERVICES } from '../lib/BookingContext.jsx';
import { BUSINESS, HOURS } from '../lib/site.js';
import { SERVICE_PAGES, CITY_PAGES, HOME_CITY } from '../lib/pages.js';
import Services from '../components/Services.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import Faq from '../components/Faq.jsx';
import '../components/Process.css';

// One template for every SEO landing page in src/lib/pages.js.

const [basic, premium, wash] = SERVICES;

// Hero price card: a detail, or 'combo' = Premium Interior Detail + Exterior Wash.
// The Exterior Wash is never shown as a product on its own.
function HeroCard({ page }) {
  const combo = page.card === 'combo';
  const pkg = combo ? premium : SERVICES.find((s) => s.id === page.card);
  const name = combo ? `${premium.name} + ${wash.name}` : pkg.name;
  const price = combo ? premium.price + wash.price : pkg.price;
  const items = combo
    ? ['Everything in the Premium Interior Detail', 'Full Interior Shampooing', 'UV-Protectant Coating', 'Hand-Washed Exterior', 'Rims, Tires & Tire Shine', 'Spot-Free Hand Drying']
    : pkg.items;
  return (
    <aside className="spec-plate spec-plate--featured lp-card" aria-label={name}>
      <span className="spec-plate__tag">{combo ? 'Inside + Out' : 'Most Complete'}</span>
      <h2 className="spec-plate__name">{name}</h2>
      <p className="spec-plate__blurb">{combo ? `$${premium.price} detail + $${wash.price} hand wash` : pkg.blurb}</p>
      <div className="spec-plate__price"><span>${price}</span></div>
      <ul className="spec-plate__list">
        {items.map((f) => <li key={f}><Check size={15} /> {f}</li>)}
      </ul>
      <Link to="/book" className="btn btn-primary lp-card__btn">
        {combo ? 'Book Premium + Wash' : `Book the ${pkg.name}`} <ArrowRight size={16} />
      </Link>
      <p className="lp-card__note">
        {combo
          ? `Or the Basic Interior Detail + wash for $${basic.price + wash.price}. Add the wash on the next screen.`
          : 'Prepay online with code PREPAY and save $15, or pay later.'}
      </p>
    </aside>
  );
}

function Related({ page }) {
  const services = SERVICE_PAGES.filter((p) => p.path !== page.path);
  const areas = CITY_PAGES.filter((p) => p.path !== page.path);
  return (
    <section className="section lp-related" aria-label={`More from ${BUSINESS.shortName}`}>
      <div className="container lp-related__grid">
        <div>
          <h2 className="lp-related__title">More services</h2>
          <ul className="lp-chips">
            {services.map((p) => <li key={p.path}><Link to={p.path}>{p.nav}</Link></li>)}
            <li><a href="/#services">All prices</a></li>
          </ul>
        </div>
        <div>
          <h2 className="lp-related__title">Areas we serve</h2>
          <ul className="lp-chips">
            <li><Link to="/">{HOME_CITY}</Link></li>
            {areas.map((p) => <li key={p.path}><Link to={p.path}>{p.city}</Link></li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Landing({ page }) {
  const { local, intro } = page;
  const isCity = page.kind === 'city';
  return (
    <>
      <section className="lp-hero">
        <div className="container lp-hero__grid">
          <div className="lp-hero__copy">
            <nav className="lp-crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{page.nav}</span>
            </nav>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1 className="lp-hero__title">
              {page.h1[0]} <span>{page.h1[1]}</span>
            </h1>
            <p className="hero__sub">{page.lede}</p>
            <div className="hero__actions">
              <Link to="/book" className="btn btn-primary">Book Your Detail</Link>
              <a href={BUSINESS.phoneHref} className="btn btn-outline-light"><Phone size={16} /> {BUSINESS.phone}</a>
            </div>
            <ul className="lp-facts">
              {page.facts.map((f) => <li key={f}><Check size={15} /> {f}</li>)}
            </ul>
          </div>
          <HeroCard page={page} />
        </div>
      </section>

      <section className="section lp-intro">
        <div className="container lp-intro__grid">
          <div>
            <p className="eyebrow">{isCity ? page.city.toUpperCase() : 'OVERVIEW'}</p>
            <h2 className="lp-h2">{intro.h2}</h2>
            <div className="lp-prose">
              {intro.paras.map((p) => <p key={p}>{p}</p>)}
            </div>
          </div>
          <figure className={`lp-photo ${page.photo.portrait ? 'lp-photo--portrait' : ''}`}>
            <img src={page.photo.src} alt={page.photo.alt} loading="lazy" />
          </figure>
        </div>
      </section>

      <Services title={isCity ? `Flat prices in ${page.city}` : 'Two interior details and a hand wash add-on'} links={false} />

      <section className="process section">
        <div className="container">
          <p className="eyebrow">WHY NITOS</p>
          <h2 className="process__title">{isCity ? `Why book Nitos in ${page.city}` : 'Why book Nitos'}</h2>
          <ul className="process__list">
            {page.points.map((pt, i) => (
              <li className="process__step" key={pt.title}>
                <span className="process__num">0{i + 1}</span>
                <h3>{pt.title}</h3>
                <p>{pt.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq faqs={page.faqs} title={`${page.nav} questions`} />

      {local && (
        <section className="section area">
          <div className="container area__grid">
            <div>
              <p className="eyebrow">SERVICE AREA</p>
              <h2 className="lp-h2">{local.h2}</h2>
              <p className="area__text">{local.text}</p>
              <p className="lp-spots-label"><MapPin size={14} /> {local.spotsLabel}</p>
              <ul className="lp-chips lp-chips--plain">
                {local.spots.map((s) => <li key={s}><span>{s}</span></li>)}
              </ul>
              <ul className="area__info">
                <li><Clock size={16} /> {HOURS}</li>
                <li><Phone size={16} /> <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a></li>
              </ul>
            </div>
            <div className="area__map">
              <iframe
                title={`Map of ${local.map}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(local.map)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}

      <Related page={page} />
      <CtaBanner />
    </>
  );
}
