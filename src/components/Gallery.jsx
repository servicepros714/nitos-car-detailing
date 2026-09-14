import './Gallery.css';

const TRANSFORMS = [
  { src: '/images/interior-before-after.jpg', alt: 'Cluttered SUV interior before, fully restored after' },
  { src: '/images/camaro-before-after.jpg', alt: 'Camaro paint before and after correction and coating' },
  { src: '/images/camry-before-after.jpg', alt: 'Camry covered in pre-wash foam, then finished to a deep black shine' }
];

const FLEET = [
  { src: '/images/truck-detail.jpg', alt: 'GMC truck finished with a mobile detail on location' },
  { src: '/images/sprinter-van.jpg', alt: 'Sprinter cargo van after an exterior detail' }
];

export default function Gallery() {
  return (
    <section className="gallery section" id="gallery">
      <div className="container">
        <p className="eyebrow">Recent Work</p>
        <h2 className="gallery__title">Real vehicles, real transformations</h2>

        <div className="gallery__transforms">
          {TRANSFORMS.map((t) => (
            <figure className="transform-card" key={t.src}>
              <div className="transform-card__tag">Before / After</div>
              <img src={t.src} alt={t.alt} loading="lazy" />
            </figure>
          ))}
        </div>

        <div className="gallery__fleet">
          {FLEET.map((f) => (
            <figure className="fleet-card" key={f.src}>
              <img src={f.src} alt={f.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
