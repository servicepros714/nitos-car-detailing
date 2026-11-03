import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useBooking } from '../../lib/BookingContext.jsx';
import './Booking.css';

// Actual navigation order (what Back/Continue step through).
const ROUTE_ORDER = ['/book', '/book/addon', '/book/date', '/book/time', '/book/info'];

// What the progress bar shows — the exterior-wash screen is a sub-step
// of "Service", so it doesn't get its own crumb.
const CRUMBS = [
  { paths: ['/book', '/book/addon'], label: 'Service' },
  { paths: ['/book/date'], label: 'Date' },
  { paths: ['/book/time'], label: 'Time' },
  { paths: ['/book/info'], label: 'Your Info' }
];

function isStepValid(pathname, booking) {
  if (pathname === '/book') return booking.serviceIds.some((id) => id !== 'exterior');
  if (pathname === '/book/addon') return true;
  if (pathname === '/book/date') return !!booking.date;
  if (pathname === '/book/time') return !!booking.time;
  if (pathname === '/book/info') {
    return booking.name && booking.phone && booking.email && booking.address;
  }
  return true;
}

export default function BookingLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = useBooking();

  const routeIndex = ROUTE_ORDER.indexOf(location.pathname);
  const crumbIndex = CRUMBS.findIndex((c) => c.paths.includes(location.pathname));
  const valid = isStepValid(location.pathname, booking);
  const isLast = routeIndex === ROUTE_ORDER.length - 1;

  const handleBack = () => {
    if (routeIndex <= 0) {
      navigate('/');
    } else {
      navigate(ROUTE_ORDER[routeIndex - 1]);
    }
  };

  const handleContinue = () => {
    if (!valid) return;
    navigate(isLast ? '/checkout' : ROUTE_ORDER[routeIndex + 1]);
  };

  return (
    <div className="booking">
      <div className="booking__progress container">
        {CRUMBS.map((c, i) => (
          <div key={c.label} className={`booking__crumb ${i <= crumbIndex ? 'booking__crumb--active' : ''}`}>
            <span className="booking__crumb-dot">{i + 1}</span>
            <span className="booking__crumb-label">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="booking__body container">
        <Outlet />
      </div>

      <div className="booking__actions">
        <div className="booking__actions-inner">
          <button className="btn btn-outline" onClick={handleBack} type="button">
            <ArrowLeft size={16} /> Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleContinue}
            disabled={!valid}
            type="button"
          >
            {isLast ? 'Continue to Payment' : 'Continue'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}