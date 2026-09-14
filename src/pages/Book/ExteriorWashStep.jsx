import { Check } from 'lucide-react';
import { useBooking } from '../../lib/BookingContext.jsx';
import './ExteriorWashStep.css';

export default function ExteriorWashStep() {
  const { booking, update, SERVICES, selectedServices } = useBooking();
  const addOn = SERVICES.find((s) => s.addOn);
  const selected = booking.serviceIds.includes(addOn.id);
  const packageName = selectedServices.find((s) => !s.addOn)?.name || 'your detail';

  const toggle = () => {
    const next = selected
      ? booking.serviceIds.filter((id) => id !== addOn.id)
      : [...booking.serviceIds, addOn.id];
    update({ serviceIds: next });
  };

  return (
    <div>
      <p className="eyebrow">Step 1 of 4</p>
      <h1 className="addon-step__title">Add an Exterior Wash?</h1>
      <p className="addon-step__subtitle">
        Optional — add a full hand wash &amp; shine to your {packageName}. Leave it off to continue with interior only.
      </p>

      <button
        type="button"
        onClick={toggle}
        className={`addon-card ${selected ? 'addon-card--selected' : ''}`}
      >
        <span className="addon-card__box">
          {selected && <Check size={16} color="#fff" />}
        </span>
        <span className="addon-card__body">
          <span className="addon-card__name">Add Exterior Wash</span>
          <span className="addon-card__desc">
            Hand wash, rims, tire shine, door jambs &amp; spot-free dry.
          </span>
        </span>
        <span className="addon-card__price">+${addOn.price}</span>
      </button>
    </div>
  );
}
