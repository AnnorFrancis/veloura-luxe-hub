import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import styles from './CartDrawer.module.css';

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, updateQty, remove, clear } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const currency = items[0]?.currency || 'GH₵';
  const shipping = subtotal >= 500 ? 0 : 30;
  const total = subtotal + (items.length ? shipping : 0);

  const handleCheckout = () => {
    if (!items.length) return;
    const el = document.createElement('div');
    el.innerHTML = `<div style="position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(30,45,38,0.55);backdrop-filter:blur(6px);">
      <div style="max-width:420px;padding:40px 32px;background:#F7F3EA;text-align:center;color:#1E2D26;font-family:Manrope,sans-serif;border-radius:4px;">
        <div style="font-family:Fraunces,serif;font-size:1.6rem;color:#1E2D26;margin-bottom:12px;">Ready to pay</div>
        <p style="font-size:14px;line-height:1.6;color:#3F4E44;margin-bottom:24px;">Checkout will open <strong>Paystack</strong> for card, bank or mobile money.<br/>Total: <strong>${currency} ${total.toLocaleString()}</strong></p>
        <button onclick="this.closest('div').parentElement.remove()" style="padding:14px 28px;background:#1E2D26;color:#F7F3EA;border:0;font-size:12px;font-weight:600;letter-spacing:0.06em;cursor:pointer;border-radius:2px;">Close</button>
      </div>
    </div>`;
    document.body.appendChild(el);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.aside
            className={styles.drawer}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className={styles.head}>
              <h3 className={styles.title}>Your bag</h3>
              <button className={styles.close} onClick={onClose} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className={styles.items}>
              {items.length === 0 ? (
                <div className={styles.empty}>
                  <p>Your bag is empty.</p>
                  <button onClick={onClose} className={styles.emptyLink}>Continue shopping →</button>
                </div>
              ) : items.map(it => (
                <div key={it.key} className={styles.item}>
                  <div className={styles.thumb} style={{ backgroundImage: `url(${it.image})` }} />
                  <div className={styles.info}>
                    <div className={styles.name}>{it.name}</div>
                    {it.size && <div className={styles.meta}>Size {it.size}</div>}
                    <div className={styles.qtyRow}>
                      <div className={styles.qty}>
                        <button onClick={() => updateQty(it.key, it.qty - 1)}>−</button>
                        <span>{it.qty}</span>
                        <button onClick={() => updateQty(it.key, it.qty + 1)}>+</button>
                      </div>
                      <button className={styles.rmv} onClick={() => remove(it.key)}>Remove</button>
                    </div>
                  </div>
                  <div className={styles.price}>{it.currency} {(it.qty * it.price).toLocaleString()}</div>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className={styles.foot}>
                <div className={styles.rows}>
                  <div className={styles.row}><span>Subtotal</span><span>{currency} {subtotal.toLocaleString()}</span></div>
                  <div className={styles.row}><span>Delivery</span><span>{shipping === 0 ? 'Free' : `${currency} ${shipping.toLocaleString()}`}</span></div>
                  <div className={`${styles.row} ${styles.total}`}><span>Total</span><span>{currency} {total.toLocaleString()}</span></div>
                </div>
                <button className={styles.checkout} onClick={handleCheckout}>Checkout with Paystack →</button>
                <button className={styles.clearBtn} onClick={clear}>Clear bag</button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
