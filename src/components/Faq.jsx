import { Plus } from 'lucide-react';
import { BUSINESS, FAQS } from '../lib/site.js';

// FAQ list. The same questions feed the FAQPage schema in src/lib/seo.js,
// so everything listed here must stay visible on the page.
export default function Faq({ faqs = FAQS, title = 'Questions, answered' }) {
  return (
    <section className="faq section" id="faq">
      <div className="container faq__grid">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 className="faq__title">{title}</h2>
          <p className="faq__sub">
            Something else? Call or text <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>.
          </p>
        </div>
        <div className="faq__list">
          {faqs.map((f) => (
            <details className="faq__item" key={f.q}>
              <summary>
                <span>{f.q}</span>
                <Plus size={18} aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
