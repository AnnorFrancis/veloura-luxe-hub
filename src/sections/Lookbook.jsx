import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LOOKBOOK } from '../data/products';
import { useScrollProgress } from '../hooks/useMotionKit';
import { Star } from '../components/Logo';
import styles from './Lookbook.module.css';

export default function Lookbook() {
  const [sectionRef, p] = useScrollProgress();
  const trackRef = useRef(null);
  const [maxShift, setMaxShift] = useState(0);
  const [pinned, setPinned] = useState(false);

  // Only pin-and-pan on comfortable viewports; small screens swipe instead.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPinned(mq.matches && !rm.matches);
    update();
    mq.addEventListener?.('change', update);
    rm.addEventListener?.('change', update);
    return () => {
      mq.removeEventListener?.('change', update);
      rm.removeEventListener?.('change', update);
    };
  }, []);

  /* Measure how far the strip has to travel. This only changes when the
     layout does, so it is measured against the DOM rather than recomputed
     on every scroll frame. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const measure = () => {
      const max = pinned ? Math.max(0, track.scrollWidth - window.innerWidth + 80) : 0;
      setMaxShift((prev) => (prev === max ? prev : max));
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pinned]);

  // Ease into the pan so the first and last frame each get a beat to breathe.
  const eased = Math.min(1, Math.max(0, (p - 0.12) / 0.76));
  const shift = eased * maxShift;
  const pct = Math.round(eased * 100);

  return (
    <section
      className={`${styles.section} ${pinned ? styles.pinned : ''}`}
      ref={sectionRef}
      aria-label="Lookbook"
    >
      <div className={styles.sticky}>
        <div className={styles.headRow}>
          <div className="container">
            <span className={`eyebrow ${styles.eyebrow}`}>The lookbook</span>
            <h2 className={`display-lg ${styles.title}`}>
              Colour, worn <em className="serif-italic">every day.</em>
            </h2>
          </div>
        </div>

        <div
          className={styles.track}
          ref={trackRef}
          style={pinned ? { transform: `translate3d(${-shift}px,0,0)` } : undefined}
        >
          {LOOKBOOK.map((l, i) => (
            <figure
              key={l.src}
              className={styles.frame}
              data-tone={l.tone}
              style={{ '--i': i }}
            >
              <span className={styles.imgWrap}>
                <img src={l.src} alt={l.cap} loading="lazy" decoding="async" />
                <span className={styles.tint} aria-hidden="true" />
              </span>
              <figcaption>
                <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.cap}>{l.cap}</span>
              </figcaption>
            </figure>
          ))}

          <div className={styles.endCard}>
            <Star className={styles.endStar} />
            <p className="display-md">Every piece, in one place.</p>
            <Link to="/shop" className="btn btn-primary">Open the shop</Link>
          </div>
        </div>

        <div className={styles.footRow}>
          <div className="container">
            <div className={styles.progress}>
              <span className={styles.pLabel}>
                {pinned ? 'Scroll to pan' : 'Swipe to browse'}
              </span>
              <span className={styles.pTrack}>
                <span className={styles.pBar} style={{ transform: `scaleX(${pct / 100})` }} />
              </span>
              <span className={styles.pCount}>{String(pct).padStart(3, '0')}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
