import { Routes, Route, useLocation } from 'react-router-dom';
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

export default function App() {
  const location = useLocation();
  const hideActionBar = ['/book', '/checkout', '/confirmation'].some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <BookingProvider>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<BookingLayout />}>
            <Route index element={<ServiceStep />} />
            <Route path="addon" element={<ExteriorWashStep />} />
            <Route path="date" element={<DateStep />} />
            <Route path="time" element={<TimeStep />} />
            <Route path="info" element={<InfoStep />} />
          </Route>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </main>
      <Footer />
      {!hideActionBar && <MobileActionBar />}
      {!hideActionBar && <div className="mobile-bar-spacer" />}
    </BookingProvider>
  );
}
