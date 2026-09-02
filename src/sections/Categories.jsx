import { Link } from 'react-router-dom';
import { CATEGORIES, countOf } from '../data/products';
import { useTilt, useReveal } from '../hooks/useMotionKit';
import { Sprig } from '../components/Logo';
import styles from './Categories.module.css';

function Card({ cat, index }) {
  const tilt = useTilt({ max: 8, scale: 1.015 });
  return (
    <article
      className={`${styles.card} reveal`}
      data-tone={cat.tone}
      style={{ transitionDelay: `${(index % 5) * 70}ms` }}
    >
      <Link
        to={`/shop?cat=${cat.id}`}
        className={styles.inner}
        {...tilt}
      >
        <span className={styles.media}>
          <img src={cat.cover} alt={cat.label} loading="lazy" />
          <span className={styles.wash} aria-hidden="true" />
          <span className={styles.glare} aria-hidden="true" />
        </span>

        <span className={styles.count}>{countOf(cat.id)}</span>

        <span className={styles.body}>
          <span className={styles.head}>
            <h3>{cat.label}</h3>
            <span className={styles.go} aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h13M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
          <p>{cat.blurb}</p>
        </span>
      </Link>
    </article>
  );
}

export default function Categories() {
  const ref = useReveal();
  return (
    <section className={`section-padding ${styles.section}`} ref={ref} id="departments">
      <span className={`blob ${styles.blobA}`} aria-hidden="true" />
      <span className={`blob ${styles.blobB}`} aria-hidden="true" />

      <div className="container">
        <header className={styles.head}>
          <div className="reveal">
            <span className="eyebrow">Shop by department</span>
            <h2 className={`display-lg ${styles.title}`}>
              Nine things she<br />
              <em className="serif-italic tinted">actually</em> reaches for.
            </h2>
          </div>
          <div className={`${styles.headSide} reveal`}>
            <p className="lede">
              Every department is stocked with pieces we have felt, fitted and
              worn ourselves, from a Monday cotton brief to a Saturday satin set.
            </p>
            <Link to="/shop" className="link-arrow">
              View everything <span aria-hidden="true">→</span>
            </Link>
            <Sprig className={styles.sprig} flip />
          </div>
        </header>

        <div className={styles.grid}>
          {CATEGORIES.map((c, i) => (
            <Card key={c.id} cat={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
