import { Star } from 'lucide-react';
import { REVIEWS, GOOGLE_PROFILE_URL } from '../lib/site.js';

// Real Google reviews only (src/lib/site.js REVIEWS). Hidden while the list is empty.
export default function Reviews() {
  if (!REVIEWS.length) return null;
  return (
    <section className="reviews section" id="reviews">
      <div className="container">
        <p className="eyebrow">GOOGLE REVIEWS</p>
        <h2 className="reviews__title">What customers say</h2>
        <div className="reviews__grid">
          {REVIEWS.map((r) => (
            <figure className="review-card" key={r.name}>
              <blockquote>&ldquo;{r.text}&rdquo;</blockquote>
              <figcaption>
                <strong>{r.name}</strong>
                <span>Google review</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="reviews__more">
          <a className="btn btn-outline" href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer">
            <Star size={16} /> Read all our reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}
