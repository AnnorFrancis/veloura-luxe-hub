import { motion } from 'framer-motion';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, onQuickView, onAdd, index = 0 }) {
  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.media} onClick={() => onQuickView?.(product)}>
        {product.badge && <span className={styles.badge}>{product.badge}</span>}
        <img src={product.image} alt={product.name} loading="lazy" />
        <button
          className={styles.quickAdd}
          onClick={(e) => { e.stopPropagation(); onAdd?.(product); }}
        >
          Add to bag
        </button>
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.line}>
          <span className={styles.tagline}>{product.tagline}</span>
          <span className={styles.price}>{product.currency} {product.price.toLocaleString()}</span>
        </div>
      </div>
    </motion.article>
  );
}
