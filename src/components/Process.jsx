import './Process.css';

const STEPS = [
  { n: '01', title: 'Book your slot', desc: 'Pick a package, date and time online — 30-minute slots, 8 AM to 4:30 PM.' },
  { n: '02', title: 'We come to you', desc: 'Our detailer arrives at your home or office with everything needed on-site.' },
  { n: '03', title: 'Drive away clean', desc: 'Pay by card or Pay Later — your confirmation and receipt land in your inbox.' }
];

export default function Process() {
  return (
    <section className="process section" id="process">
      <div className="container">
        <p className="eyebrow">How It Works</p>
        <h2 className="process__title">From booking to a spotless finish</h2>
        <ol className="process__list">
          {STEPS.map((s) => (
            <li className="process__step" key={s.n}>
              <span className="process__num">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
