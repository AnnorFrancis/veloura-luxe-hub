import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import styles from './Navigation.module.css';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/collections', label: 'Shop' },
  { to: '/contact', label: 'Contact' },
];

export default function Navigation({ onOpenCart }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const location = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    h();
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <Link to="/" className={styles.logo}>META MEN</Link>

        <div className={styles.links}>
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.cartBtn} onClick={onOpenCart} aria-label="Cart">
            <span>Bag</span>
            {count > 0 && <span className={styles.badge}>{count}</span>}
          </button>
          <button className={styles.burger} onClick={() => setOpen(true)} aria-label="Menu">
            <span></span><span></span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className={styles.mobileTop}>
              <span className={styles.logo}>META MEN</span>
              <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className={styles.mobileLinks}>
              {LINKS.map((l, i) => (
                <motion.div key={l.to}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.12 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavLink to={l.to} className={styles.mobileLink}>{l.label}</NavLink>
                </motion.div>
              ))}
            </div>
            <div className={styles.mobileFoot}>
              <a href="mailto:hello@metamen.co">hello@metamen.co</a>
              <a href="tel:+233559990102">+233 55 999 0102</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
