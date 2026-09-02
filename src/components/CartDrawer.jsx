import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { Star } from './Logo';
import styles from './CartDrawer.module.css';

const FREE_OVER = 300;
const SHIPPING = 30;

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, updateQty, remove, clear } = useCart();
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && (paying ? setPaying(false) : onClose?.());
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, paying]);

  // Drop back out of the pay panel whenever the drawer closes.
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) setPaying(false);
  }

  const currency = items[0]?.currency || 'GH₵';
  const ship = items.length && subtotal < FREE_OVER ? SHIPPING : 0;
  const total = subtotal + ship;
  const toFree = Math.max(0, FREE_OVER - subtotal);
  const pct = Math.min(100, (subtotal / FREE_OVER) * 100);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.aside
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            aria-label="Shopping cart"
          >
            <header className={styles.head}>
              <h3 className={styles.title}>
                Your cart <span>{items.length}</span>
              </h3>
              <button className={styles.close} onClick={onClose} aria-label="Close cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            {items.length > 0 && (
              <div className={styles.freeBar}>
                <p>
                  {toFree > 0 ? (
                    <>Add <b>{currency} {toFree.toLocaleString()}</b> for free Accra delivery</>
                  ) : (
                    <><Star /> Free Accra delivery unlocked</>
                  )}
                </p>
                <span className={styles.freeTrack}>
                  <span className={styles.freeFill} style={{ transform: `scaleX(${pct / 100})` }} />
                </span>
              </div>
            )}

            <div className={styles.items}>
              {items.length === 0 ? (
                <div className={styles.empty}>
                  <span className={styles.emptyIcon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                      <path d="M5 8h14l-1.2 12H6.2L5 8Z" strokeLinejoin="round" />
                      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p>Your cart is empty.</p>
                  <Link to="/shop" onClick={onClose} className="btn btn-primary">
                    Start shopping
                  </Link>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((it) => (
                    <motion.div
                      key={it.key}
                      className={styles.item}
                      layout
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <span className={styles.thumb}>
                        <img src={it.image} alt={it.name} />
                      </span>
                      <div className={styles.itemBody}>
                        <div className={styles.itemTop}>
                          <b>{it.name}</b>
                          <button onClick={() => remove(it.key)} aria-label={`Remove ${it.name}`}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                        {it.size && <span className={styles.size}>Size {it.size}</span>}
                        <div className={styles.itemFoot}>
                          <span className={styles.stepper}>
                            <button onClick={() => updateQty(it.key, it.qty - 1)} aria-label="Decrease">−</button>
                            <i>{it.qty}</i>
                            <button onClick={() => updateQty(it.key, it.qty + 1)} aria-label="Increase">+</button>
                          </span>
                          <b className={styles.itemPrice}>
                            {it.currency} {(it.price * it.qty).toLocaleString()}
                          </b>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {items.length > 0 && (
              <footer className={styles.foot}>
                <dl className={styles.totals}>
                  <div><dt>Subtotal</dt><dd>{currency} {subtotal.toLocaleString()}</dd></div>
                  <div>
                    <dt>Delivery</dt>
                    <dd>{ship === 0 ? <em>Free</em> : `${currency} ${ship}`}</dd>
                  </div>
                  <div className={styles.grand}>
                    <dt>Total</dt><dd>{currency} {total.toLocaleString()}</dd>
                  </div>
                </dl>

                <button className={`btn btn-primary ${styles.checkout}`} onClick={() => setPaying(true)}>
                  Checkout
                </button>
                <button className={styles.clear} onClick={clear}>Empty cart</button>
              </footer>
            )}

            {/* checkout confirmation, rendered in React, not injected HTML */}
            <AnimatePresence>
              {paying && (
                <motion.div
                  className={styles.pay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className={styles.payCard}
                    initial={{ y: 20, scale: 0.97 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: 14, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Star className={styles.payStar} />
                    <h4>Ready to pay</h4>
                    <p>
                      Checkout opens <b>Paystack</b> for MTN MoMo, Telecel Cash,
                      card or bank transfer.
                    </p>
                    <div className={styles.payTotal}>{currency} {total.toLocaleString()}</div>
                    <span className={styles.payNote}>Design sample. No payment is taken.</span>
                    <button className="btn btn-primary" onClick={() => setPaying(false)}>Close</button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
