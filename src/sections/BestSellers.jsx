import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getBestSellers } from '../data/products';
import styles from './BestSellers.module.css';

export default function BestSellers({ onQuickView, onAdd }) {
  const products = getBestSellers();
  return (
    <section className={`section-padding ${styles.section}`}>
      <div className="container">
        <div className={styles.head}>
          <div>
            <span className="eyebrow">Best sellers</span>
            <h2 className={styles.title}>What men keep buying.</h2>
          </div>
          <Link to="/collections" className={styles.all}>Shop all →</Link>
        </div>

        <div className={styles.grid}>
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onQuickView={onQuickView} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </section>
  );
}
