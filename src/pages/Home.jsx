import { useEffect } from 'react';
import Hero from '../components/Hero.jsx';
import TrustStrip from '../components/TrustStrip.jsx';
import Services from '../components/Services.jsx';
import Gallery from '../components/Gallery.jsx';
import Process from '../components/Process.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import ServiceArea from '../components/ServiceArea.jsx';
import Faq from '../components/Faq.jsx';

export default function Home() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Hero />
      <TrustStrip />
      <div className="reveal"><Services /></div>
      <div className="reveal"><Gallery /></div>
      <div className="reveal"><Process /></div>
      <ServiceArea />
      <Faq title="Mobile detailing questions, answered" />
      <div className="reveal"><CtaBanner /></div>
    </>
  );
}
