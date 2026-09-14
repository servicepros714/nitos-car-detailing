import { Link } from 'react-router-dom';
import './CtaBanner.css';

export default function CtaBanner() {
  return (
    <section className="cta-banner">
      <div className="container cta-banner__inner">
        <div>
          <h2>Ready for a clean that actually lasts?</h2>
          <p>Slots fill fast on weekends — reserve yours in under two minutes.</p>
        </div>
        <Link to="/book" className="btn btn-primary">Book Your Detail</Link>
      </div>
    </section>
  );
}
