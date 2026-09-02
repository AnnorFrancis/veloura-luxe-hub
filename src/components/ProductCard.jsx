import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTilt } from '../hooks/useMotionKit';
import { useWishlist } from '../hooks/useWishlist';
import styles from './ProductCard.module.css';

const TONE = {
  panties: 'rose', underwear: 'sky', bikinis: 'sea', shapers: 'peach',
  nightwear: 'lilac', socks: 'mint', napkins: 'blush', towels: 'gold', raincoat: 'sun',
};

export default function ProductCard({ product, onAdd, index = 0, compact = false }) {
  const tilt = useTilt({ max: 7, scale: 1.02 });
  const wishlist = useWishlist();
  const [added, setAdded] = useState(false);
  const saved = wishlist.has(product.id);

  const add = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAdd?.(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1300);
  };

  const save = (e) => {
    e.preventDefault();
    e.stopPropagation();
    wishlist.toggle(product.id);
  };

  return (
    <article
      className={`${styles.card} ${compact ? styles.compact : ''}`}
      data-tone={TONE[product.category] || 'rose'}
      style={{ animationDelay: `${(index % 4) * 60}ms` }}
    >
      <Link to={`/product/${product.id}`} className={styles.media} {...tilt}>
        <span className={styles.frame}>
          <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
          <span className={styles.glare} aria-hidden="true" />
          <span className={styles.veil} aria-hidden="true" />
        </span>

        {product.badge && <span className={styles.badge}>{product.badge}</span>}

        <button
          className={`${styles.heart} ${saved ? styles.heartOn : ''}`}
          onClick={save}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
          aria-pressed={saved}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
            <path d="M12 20.5 4.6 13a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8A4.7 4.7 0 0 1 19.4 13z" strokeLinejoin="round" />
          </svg>
        </button>

        {onAdd && (
          <span className={styles.tools}>
            <button className={`${styles.add} ${added ? styles.addOn : ''}`} onClick={add}>
              {added ? 'Added' : 'Add to cart'}
            </button>
          </span>
        )}
      </Link>

      <div className={styles.info}>
        <h3 className={styles.name}>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className={styles.line}>
          <span className={styles.tagline}>{product.tagline}</span>
          <span className={styles.price}>
            {product.currency} {product.price.toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  );
}
