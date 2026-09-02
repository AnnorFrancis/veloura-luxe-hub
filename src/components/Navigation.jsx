import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { CATEGORIES, countOf } from '../data/products';
import { PRIMARY_NAV } from '../data/site';
import Logo from './Logo';
import styles from './Navigation.module.css';

export default function Navigation({ onOpenCart }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const { count } = useCart();
  const wishlist = useWishlist();
  const location = useLocation();
  const closeTimer = useRef(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', h, { passive: true });
    h();
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close both menus on navigation, adjusted during render so the new page
  // never paints with the old menu still up.
  const here = location.pathname + location.search;
  const [lastPath, setLastPath] = useState(here);
  if (here !== lastPath) {
    setLastPath(here);
    setOpen(false);
    setMega(false);
  }

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); setMega(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const holdMega = (v) => {
    clearTimeout(closeTimer.current);
    if (v) setMega(true);
    else closeTimer.current = setTimeout(() => setMega(false), 160);
  };

  return (
    <>
      <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${mega ? styles.megaOpen : ''}`}>
        <div className={styles.inner}>
          <Link to="/" className={styles.brand} aria-label="Veloura Luxe Hub, home">
            <Logo variant="lockup" priority />
          </Link>

          <nav className={styles.links} aria-label="Primary">
            {PRIMARY_NAV.map((l) => (
              <div
                key={l.to}
                className={styles.linkWrap}
                onMouseEnter={() => l.mega && holdMega(true)}
                onMouseLeave={() => l.mega && holdMega(false)}
              >
                <NavLink
                  to={l.to}
                  className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                >
                  <span>{l.label}</span>
                </NavLink>
              </div>
            ))}
          </nav>

          <div className={styles.actions}>
            <Link to="/wishlist" className={styles.icon} aria-label={`Wishlist, ${wishlist.count} saved`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 20.5 4.6 13a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8A4.7 4.7 0 0 1 19.4 13z" strokeLinejoin="round" />
              </svg>
              {wishlist.count > 0 && <span className={styles.dot} />}
            </Link>

            <button className={styles.cart} onClick={onOpenCart} aria-label={`Cart, ${count} items`}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M2.5 3.5h2.4l2.2 10.6h9.7l1.9-7.3H6.1" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9.2" cy="18.6" r="1.5" />
                <circle cx="16.4" cy="18.6" r="1.5" />
              </svg>
              <span className={styles.cartLabel}>Cart</span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    className={styles.badge}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              className={styles.burger}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <span /><span />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mega && (
            <motion.div
              className={styles.mega}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => holdMega(true)}
              onMouseLeave={() => holdMega(false)}
            >
              <div className={styles.megaInner}>
                <div className={styles.megaGrid}>
                  {CATEGORIES.map((c, n) => (
                    <Link
                      key={c.id}
                      to={`/shop?cat=${c.id}`}
                      className={styles.megaCard}
                      data-tone={c.tone}
                      style={{ animationDelay: `${n * 30}ms` }}
                    >
                      <span className={styles.megaThumb}>
                        <img src={c.cover} alt="" loading="lazy" />
                      </span>
                      <span className={styles.megaText}>
                        <b>{c.label}</b>
                        <i>{countOf(c.id)}</i>
                      </span>
                    </Link>
                  ))}
                </div>
                <div className={styles.megaFoot}>
                  <Link to="/shop" className="link-arrow">All products <span aria-hidden="true">&rarr;</span></Link>
                  <Link to="/size-guide" className={styles.megaSide}>Size guide</Link>
                  <Link to="/delivery" className={styles.megaSide}>Delivery &amp; returns</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Mobile sheet ────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.sheet}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className={styles.sheetTop}>
              <Logo variant="lockup" />
              <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close menu">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className={styles.sheetBody}>
              <div className={styles.sheetLinks}>
                {PRIMARY_NAV.map((l, n) => (
                  <motion.div
                    key={l.to}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.14 + n * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <NavLink to={l.to} className={styles.sheetLink}>{l.label}</NavLink>
                  </motion.div>
                ))}
              </div>

              <div className={styles.sheetCats}>
                <div className={styles.sheetCatGrid}>
                  {CATEGORIES.map((c, n) => (
                    <motion.div
                      key={c.id}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.26 + n * 0.03 }}
                    >
                      <Link to={`/shop?cat=${c.id}`} className={styles.sheetCat}>
                        <img src={c.cover} alt="" loading="lazy" />
                        <b>{c.short}</b>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className={styles.sheetMore}>
                <Link to="/wishlist">Wishlist</Link>
                <Link to="/size-guide">Size guide</Link>
                <Link to="/delivery">Delivery</Link>
                <Link to="/faq">FAQ</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
