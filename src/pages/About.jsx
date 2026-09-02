import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { Star, Monogram } from '../components/Logo';
import { EDITORIAL, PRODUCTS } from '../data/products';
import { STORE } from '../data/site';
import { useReveal, useCountUp, useScrollProgress } from '../hooks/useMotionKit';
import styles from './About.module.css';

const VALUES = [
  {
    h: 'Handled before it is sold',
    p: 'Every piece is checked for stitch, stretch and how it behaves in real heat. If it does not pass, it does not reach the rail.',
  },
  {
    h: 'Fitted, not guessed',
    p: 'Fittings are free and take fifteen minutes. Most women leave wearing a different size to the one they walked in with.',
  },
  {
    h: 'Discreet by default',
    p: 'Plain packaging, no branding, nothing on the label. You should be the only person who knows what arrived.',
  },
  {
    h: 'Sized XS to 3XL',
    p: 'A shop that only carries small sizes is not a shop for everyone. We stock the full range and reorder what sells.',
  },
];

const TIMELINE = [
  { y: '2021', h: 'One rail, one room', p: 'Veloura started as a single rail in a shared space off Oxford Street, stocked with what we could carry back ourselves.' },
  { y: '2022', h: 'The fitting room', p: 'We added a proper fitting room after realising most customers had never been measured. It became the reason people came back.' },
  { y: '2024', h: 'Nine departments', p: 'Nightwear, swim and shapers joined the intimates, then the everyday things customers kept asking for.' },
  { y: '2026', h: 'Delivering nationwide', p: 'Same day across Greater Accra, and two to four days everywhere else in Ghana.' },
];

function Stat({ to, suffix = '', label }) {
  const [ref, n] = useCountUp(to);
  return (
    <div className={styles.stat} ref={ref}>
      <strong>{n.toLocaleString()}{suffix}</strong>
      <span>{label}</span>
    </div>
  );
}

export default function About() {
  const ref = useReveal();
  const [pRef, p] = useScrollProgress();
  const a = (p - 0.5) * -50;
  const b = (p - 0.5) * 36;

  return (
    <div className={styles.page} ref={ref}>
      <PageHero
        eyebrow="Our story"
        title="Built for the woman who"
        accent="knows her size."
        lede="Veloura Luxe Hub began with one frustration: shopping for intimates in Accra usually meant guessing."
        tone="rose"
        media="about"
        crumbs={[{ label: 'About' }]}
      />

      {/* ── Story ─────────────────────────────────── */}
      <section className={styles.story}>
        <div className="container">
          <div className={styles.storyGrid} ref={pRef}>
            <div className={`${styles.media} reveal`}>
              <figure className={styles.imgMain} style={{ transform: `translate3d(0, ${a}px, 0)` }}>
                <img src={EDITORIAL.portrait} alt="Loungewear on the rail in store" loading="lazy" />
              </figure>
              <figure className={styles.imgSmall} style={{ transform: `translate3d(0, ${b}px, 0)` }}>
                <img src={EDITORIAL.folded} alt="Folded cotton essentials" loading="lazy" />
              </figure>
              <span className={styles.plaque}>
                <Star className={styles.plaqueStar} />
                <b>Fitted in store</b>
                <i>{STORE.area}</i>
              </span>
            </div>

            <div className={`${styles.copy} reveal`}>
              <p className="lede">
                Guessing the size, guessing the fabric, guessing whether it would survive a
                wash. We opened because that felt solvable.
              </p>
              <p className="lede">
                So we buy differently. Nothing goes on the rail until someone here has held it,
                stretched it and checked the seams. It is slower, and it is the whole point.
              </p>
              <p className="lede">
                Five years later the shop carries nine departments and delivers across Ghana,
                but the fitting room is still the busiest room in it.
              </p>

              <div className={styles.stats}>
                <Stat to={9} label="Departments" />
                <Stat to={2400} suffix="+" label="Women dressed" />
                <Stat to={PRODUCTS.length} label="Pieces in stock" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────── */}
      <section className={styles.values}>
        <div className="container">
          <div className={styles.valuesHead}>
            <span className="eyebrow">How we work</span>
            <h2 className="display-lg">Four things we will not<br />cut corners on.</h2>
          </div>
          <div className={styles.valueGrid}>
            {VALUES.map((v, i) => (
              <article className={`${styles.value} reveal`} key={v.h} style={{ transitionDelay: `${i * 70}ms` }}>
                <span className={styles.valueNum}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{v.h}</h3>
                <p>{v.p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────── */}
      <section className={styles.timeline}>
        <div className="container">
          <div className={styles.tlHead}>
            <span className="eyebrow">Since 2021</span>
            <h2 className="display-lg">How it grew.</h2>
          </div>
          <ol className={styles.tlList}>
            {TIMELINE.map((t, i) => (
              <li className={`${styles.tlItem} reveal`} key={t.y} style={{ transitionDelay: `${i * 80}ms` }}>
                <span className={styles.tlYear}>{t.y}</span>
                <div>
                  <h3>{t.h}</h3>
                  <p>{t.p}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Visit ─────────────────────────────────── */}
      <section className={styles.visit}>
        <div className="container">
          <div className={styles.visitCard}>
            <Monogram className={styles.visitMark} />
            <div className={styles.visitCopy}>
              <span className="eyebrow">Come in</span>
              <h2 className="display-md">The fitting room is free,<br />and it is worth the trip.</h2>
              <p>{STORE.street}, {STORE.area}</p>
              <div className={styles.visitActions}>
                <Link to="/contact" className="btn btn-primary">Book a fitting</Link>
                <Link to="/shop" className="link-arrow">Shop online <span aria-hidden="true">&rarr;</span></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
