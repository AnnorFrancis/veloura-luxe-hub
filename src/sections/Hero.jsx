import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Aurora from '../components/Aurora';
import { Sprig, Star } from '../components/Logo';
import { useTilt } from '../hooks/useMotionKit';
import { HERO_SLIDES, CATEGORIES } from '../data/products';
import { useShopProducts } from '../store/useShop';
import styles from './Hero.module.css';

const B = import.meta.env.BASE_URL || '/';

const DURATION = 5200;

const HEADLINE = ['Softness', 'you can', 'feel.'];

export default function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const barRef = useRef(null);
  const shopProducts = useShopProducts();
  const tilt = useTilt({ max: 7, scale: 1.015 });
  const cardTilt = useTilt({ max: 13, scale: 1.04 });

  const go = useCallback((n) => setI((n + HERO_SLIDES.length) % HERO_SLIDES.length), []);

  // auto-advance + restart the progress bar animation each slide
  useEffect(() => {
    if (paused) return undefined;
    const bar = barRef.current;
    if (bar) {
      bar.style.animation = 'none';
      void bar.offsetWidth; // reflow so the animation restarts
      bar.style.animation = `${styles.sweep || 'sweep'} ${DURATION}ms linear forwards`;
    }
    const t = setTimeout(() => go(i + 1), DURATION);
    return () => clearTimeout(t);
  }, [i, paused, go]);

  const slide = HERO_SLIDES[i];
  const featured = shopProducts.find((p) => p.badge === 'Bestseller');

  return (
    <section className={styles.hero} data-tone="rose">
      {/* The photograph carries the section. Everything above it only softens
          the left half so the headline never has to fight the picture. */}
      <div
        className={styles.bg}
        style={{ backgroundImage: `url(${B}backdrop/home.webp)` }}
        aria-hidden="true"
      />
      <div className={styles.veil} aria-hidden="true" />
      <Aurora
        className={styles.aurora}
        palette={['#FFD9C6', '#CDEAF2', '#FBDDE4', '#FFFCFA']}
        intensity={0.42}
        webgl
      />
      <div className={styles.grain} aria-hidden="true" />

      <div className={`container ${styles.grid}`}>
        {/* ── Copy column ─────────────────────────────── */}
        <div className={styles.copy}>
          <h1 className={`display-xl ${styles.title}`}>
            {HEADLINE.map((line, n) => (
              <span key={line} className={styles.lineMask}>
                <span className={styles.lineInner} style={{ animationDelay: `${0.18 + n * 0.11}s` }}>
                  {n === 2 ? <em className="serif-italic">{line}</em> : line}
                </span>
              </span>
            ))}
          </h1>

          <p className={`lede ${styles.lede}`}>
            Intimates and everyday essentials, chosen by hand in Accra and
            delivered discreetly across Ghana.
          </p>

          {/* What she sells, framed so it reads at a glance and doubles as
              the shortest route into the shop. */}
          <nav className={styles.depts} aria-label="Departments">
            {CATEGORIES.map((c) => (
              <Link key={c.id} to={`/shop?cat=${c.id}`} className={styles.dept} data-tone={c.tone}>
                {c.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <Link to="/shop" className="btn btn-primary">
              Shop the collection
            </Link>
            <Link to="/contact" className="link-arrow">
              Find your size <span aria-hidden="true">→</span>
            </Link>
          </div>

          <Sprig className={styles.sprig} />
        </div>

        {/* ── Cinematic slideshow ─────────────────────── */}
        <div
          className={styles.stage}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className={styles.frame}
            {...tilt}
          >
            <div className={styles.frameInner}>
              {HERO_SLIDES.map((s, n) => {
                // Mount the current slide and its neighbours only. The rest
                // stay out of the DOM so the browser never fetches them.
                const total = HERO_SLIDES.length;
                const near = n === i || n === (i + 1) % total || n === (i - 1 + total) % total;
                if (!near) return null;
                return (
                  <figure
                    key={s.src}
                    className={`${styles.slide} ${n === i ? styles.active : ''}`}
                    aria-hidden={n !== i}
                  >
                    <img
                      src={s.src}
                      alt={s.label}
                      loading={n === 0 ? 'eager' : 'lazy'}
                      fetchPriority={n === 0 ? 'high' : 'auto'}
                      draggable="false"
                    />
                  </figure>
                );
              })}

              <span className={styles.scrim} aria-hidden="true" />
              <span className={styles.glare} aria-hidden="true" />

              {/* caption */}
              <div className={styles.caption} key={slide.label}>
                <span className={styles.capLabel}>
                  <Star /> {slide.label}
                </span>
                <p className={styles.capLine}>{slide.line}</p>
                <Link to={slide.to} className={styles.capLink}>
                  Explore <span aria-hidden="true">→</span>
                </Link>
              </div>

              {/* progress + counter */}
              <div className={styles.progress}>
                <span className={styles.counter}>
                  {String(i + 1).padStart(2, '0')}
                  <i>/</i>
                  {String(HERO_SLIDES.length).padStart(2, '0')}
                </span>
                <span className={styles.track}>
                  <span ref={barRef} className={styles.bar} />
                </span>
              </div>
            </div>
          </div>

          {/* floating product card, the depth layer */}
          {featured && (
            <Link
              to="/shop"
              className={styles.floatCard}
              {...cardTilt}
            >
              <span className={styles.floatShine} aria-hidden="true" />
              <img src={featured.image} alt={featured.name} loading="lazy" />
              <span className={styles.floatMeta}>
                <b>{featured.name}</b>
                <i>{featured.currency} {featured.price}</i>
              </span>
            </Link>
          )}

          {/* dots */}
          <div className={styles.dots} role="tablist" aria-label="Featured departments">
            {HERO_SLIDES.map((s, n) => (
              <button
                key={s.src}
                role="tab"
                aria-selected={n === i}
                aria-label={s.label}
                className={`${styles.dot} ${n === i ? styles.dotOn : ''}`}
                onClick={() => go(n)}
              />
            ))}
          </div>
        </div>
      </div>

      <span className={styles.scroll} aria-hidden="true">
        <i /> Scroll
      </span>
    </section>
  );
}
