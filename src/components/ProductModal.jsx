import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './ProductModal.module.css';

export default function ProductModal({ product, onClose, onAdd }) {
  const [size, setSize] = useState(null);

  useEffect(() => {
    if (product?.sizes?.length) setSize(product.sizes[0]);
    else setSize(null);
  }, [product]);

  useEffect(() => {
    document.body.style.overflow = product ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div className={styles.overlay}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div className={styles.modal}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className={styles.close} onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>

            <div className={styles.grid}>
              <div className={styles.media}>
                <img src={product.image} alt={product.name} />
              </div>

              <div className={styles.info}>
                <span className="eyebrow">{product.category}</span>
                <h2 className={styles.name}>{product.name}</h2>
                <div className={styles.price}>{product.currency} {product.price.toLocaleString()}</div>

                <p className={styles.story}>{product.story}</p>

                {product.sizes && (
                  <div className={styles.sizes}>
                    <span className={styles.label}>Size</span>
                    <div className={styles.sizeGrid}>
                      {product.sizes.map(s => (
                        <button
                          key={s}
                          className={`${styles.size} ${size === s ? styles.sizeActive : ''}`}
                          onClick={() => setSize(s)}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.actions}>
                  <button className={styles.add} onClick={() => { onAdd(product, { size }); onClose(); }}>
                    Add to bag — {product.currency} {product.price.toLocaleString()}
                  </button>
                </div>

                <div className={styles.notes}>
                  <div><span>Delivery</span><em>1–3 days · Free above GH₵ 500</em></div>
                  <div><span>Returns</span><em>7-day free exchange</em></div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
