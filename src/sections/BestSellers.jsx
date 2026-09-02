import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getBestSellers, getNewIn } from '../data/products';
import { useReveal } from '../hooks/useMotionKit';
import styles from './BestSellers.module.css';

const TABS = [
  { id: 'best', label: 'Best sellers', get: getBestSellers },
  { id: 'new', label: 'New in', get: getNewIn },
];

export default function BestSellers({ onAdd }) {
  const [tab, setTab] = useState('best');
  const railRef = useRef(null);
  const ref = useReveal();

  const products = TABS.find((t) => t.id === tab).get();

  const nudge = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector('article');
    const step = card ? card.offsetWidth + 20 : 320;
    rail.scrollBy({ left: dir * step * 2, behavior: 'smooth' });
  };

  return (
    <section className={`section-padding ${styles.section}`} ref={ref}>
      <div className="container">
        <header className={styles.head}>
          <div className="reveal">
            <span className="eyebrow">The floor favourites</span>
            <h2 className={`display-lg ${styles.title}`}>
              What keeps<br />
              <em className="serif-italic tinted">selling out.</em>
            </h2>
          </div>

          <div className={`${styles.controls} reveal`}>
            <div className={styles.tabs} role="tablist">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  className={`${styles.tab} ${tab === t.id ? styles.tabOn : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className={styles.arrows}>
              <button onClick={() => nudge(-1)} aria-label="Scroll left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H6M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={() => nudge(1)} aria-label="Scroll right">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h13M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </header>
      </div>

      <div className={styles.railWrap}>
        <div className={styles.rail} ref={railRef} key={tab}>
          <span className={styles.pad} aria-hidden="true" />
          {products.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              onAdd={onAdd}
            />
          ))}
          <Link to="/shop" className={styles.moreCard}>
            <span className={styles.moreInner}>
              <span className={styles.moreArrow} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 12h13M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <b>Shop the full floor</b>
              <i>All nine departments</i>
            </span>
          </Link>
          <span className={styles.pad} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
