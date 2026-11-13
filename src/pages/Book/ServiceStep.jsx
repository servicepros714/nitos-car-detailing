import { Check } from 'lucide-react';
import { useBooking } from '../../lib/BookingContext.jsx';
import './ServiceStep.css';

export default function ServiceStep() {
  const { booking, update, SERVICES } = useBooking();
  const packages = SERVICES.filter((s) => !s.addOn);

  const select = (id) => {
    const hasAddon = booking.serviceIds.includes('exterior');
    update({ serviceIds: hasAddon ? [id, 'exterior'] : [id] });
  };

  return (
    <div>
      <p className="eyebrow service-step__eyebrow">Step 1 of 4</p>
      <h1 className="service-step__title">Choose your service</h1>
      <p className="service-step__subtitle">
        Pick your interior detail — you can add an exterior wash on the next screen.
      </p>
      <div className="service-step__grid">
        {packages.map((s) => {
          const selected = booking.serviceIds.includes(s.id);
          return (
            <button
              type="button"
              key={s.id}
              onClick={() => select(s.id)}
              className={`spec-plate service-step__card ${s.featured ? 'spec-plate--featured' : ''} ${selected ? 'service-step__card--selected' : ''}`}
            >
              {s.featured && <span className="spec-plate__tag">Most Complete</span>}
              <span className="service-step__check">
                <span className="service-step__check-inner">
                  {selected && <Check size={12} color="#fff" />}
                </span>
              </span>
              <h3 className="spec-plate__name">{s.name}</h3>
              <p className="spec-plate__blurb">{s.blurb}</p>
              <div className="spec-plate__price">
                <span>${s.price}</span>
              </div>
              <ul className="spec-plate__list">
                {s.items.map((item) => (
                  <li key={item}><Check size={15} /> {item}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}