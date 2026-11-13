import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import MobileActionBar from './components/MobileActionBar.jsx';
import Home from './pages/Home.jsx';
import BookingLayout from './pages/Book/BookingLayout.jsx';
import ServiceStep from './pages/Book/ServiceStep.jsx';
import ExteriorWashStep from './pages/Book/ExteriorWashStep.jsx';
import DateStep from './pages/Book/DateStep.jsx';
import TimeStep from './pages/Book/TimeStep.jsx';
import InfoStep from './pages/Book/InfoStep.jsx';
import Checkout from './pages/Checkout.jsx';
import Confirmation from './pages/Confirmation.jsx';
import { BookingProvider } from './lib/BookingContext.jsx';
import Landing from './pages/Landing.jsx';
import NotFound from './pages/NotFound.jsx';
import Seo from './components/Seo.jsx';
import { LANDING_PAGES } from './lib/pages.js';

// New page = start at the top (links like /#area keep their own scroll target).
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const location = useLocation();
  const hideActionBar = ['/book', '/checkout', '/confirmation'].some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <BookingProvider>
      <Seo />
      <ScrollToTop />
      <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {LANDING_PAGES.map((p) => (
            <Route key={p.path} path={p.path} element={<Landing key={p.path} page={p} />} />
          ))}
          <Route path="/book" element={<BookingLayout />}>
            <Route index element={<ServiceStep />} />
            <Route path="addon" element={<ExteriorWashStep />} />
            <Route path="date" element={<DateStep />} />
            <Route path="time" element={<TimeStep />} />
            <Route path="info" element={<InfoStep />} />
          </Route>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {!hideActionBar && <MobileActionBar />}
      {!hideActionBar && <div className="mobile-bar-spacer" />}
    </BookingProvider>
  );
}
