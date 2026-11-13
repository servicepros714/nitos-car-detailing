import { Link } from 'react-router-dom';

// Rendered for unknown URLs. Prerendered to dist/404.html, which Cloudflare
// Pages serves with a 404 status.
export default function NotFound() {
  return (
    <section className="notfound section">
      <div className="container">
        <p className="eyebrow">ERROR 404</p>
        <h1>This page took a wrong turn</h1>
        <p>The page you were looking for does not exist. Head back home or book a detail.</p>
        <div className="notfound__actions">
          <Link to="/" className="btn btn-outline">Back home</Link>
          <Link to="/book" className="btn btn-primary">Book Your Detail</Link>
        </div>
      </div>
    </section>
  );
}
