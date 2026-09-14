import { ShieldCheck, MapPin, Sparkles, Clock } from 'lucide-react';
import './TrustStrip.css';

const ITEMS = [
  { icon: MapPin, label: 'We come to you in Rossmoor & nearby' },
  { icon: ShieldCheck, label: 'Insured & background-checked techs' },
  { icon: Sparkles, label: 'Hand-finished, no automated tunnels' },
  { icon: Clock, label: 'Most details done in 90–120 minutes' }
];

export default function TrustStrip() {
  return (
    <div className="trust">
      <div className="container trust__grid">
        {ITEMS.map(({ icon: Icon, label }) => (
          <div className="trust__item" key={label}>
            <Icon size={20} strokeWidth={2} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
