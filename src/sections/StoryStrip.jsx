import { Link } from 'react-router-dom';
import { EDITORIAL } from '../data/products';
import { useReveal, useScrollProgress, useCountUp } from '../hooks/useMotionKit';
import { Star } from '../components/Logo';
import styles from './StoryStrip.module.css';

function Stat({ to, suffix = '', label }) {
  const [ref, n] = useCountUp(to);
  return (
    <div className={styles.stat} ref={ref}>
      <strong>{n.toLocaleString()}{suffix}</strong>
      <span>{label}</span>
    </div>
  );
}

/** A short teaser for the story. The full version lives on /about. */
export default function StoryStrip() {
  const ref = useReveal();
  const [pRef, p] = useScrollProgress();
  const shift = (p - 0.5) * -44;

  return (
    <section className={`section-padding ${styles.section}`} ref={ref}>
      <span className={`blob ${styles.blob}`} aria-hidden="true" />
      <div className="container">
        <div className={styles.grid} ref={pRef}>
          <div className={`${styles.media} reveal`}>
            <figure style={{ transform: `translate3d(0, ${shift}px, 0)` }}>
              <img src={EDITORIAL.portrait} alt="Loungewear on the rail in store" loading="lazy" />
            </figure>
            <span className={styles.plaque}>
              <Star className={styles.plaqueStar} />
              <b>Fitted in store</b>
              <i>Osu, Accra</i>
            </span>
          </div>

          <div className={`${styles.copy} reveal`}>
            <span className="eyebrow">Our story</span>
            <h2 className="display-lg">
              Built for the woman who<br />
              <em className="serif-italic tinted">knows her size.</em>
            </h2>
            <p className="lede">
              Nothing goes on the rail until someone here has held it, stretched it
              and checked the seams. It is slower, and it is the whole point.
            </p>

            <div className={styles.stats}>
              <Stat to={9} label="Departments" />
              <Stat to={2400} suffix="+" label="Women dressed" />
              <Stat to={5} label="Years in Osu" />
            </div>

            <Link to="/about" className="btn btn-ghost">Read our story</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
