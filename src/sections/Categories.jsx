import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EDITORIAL } from '../data/products';
import styles from './Categories.module.css';

const CATS = [
  { id: 'shirts',    title: 'Shirts & Polos', count: '6 pieces',  image: EDITORIAL.stripe },
  { id: 'shoes',     title: 'Shoes & Sandals', count: '5 pieces', image: '/products/collection-grid.jpg' },
  { id: 'trousers',  title: 'Trousers',        count: '3 pieces', image: EDITORIAL.wave },
  { id: 'fragrance', title: 'Fragrance',       count: '4 formulas', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1000&q=85&auto=format&fit=crop' },
];

export default function Categories() {
  return (
    <section className={`section-padding ${styles.section}`}>
      <div className="container">
        <div className={styles.head}>
          <div>
            <span className="eyebrow">Shop by department</span>
            <h2 className={styles.title}>The four things a man wears.</h2>
          </div>
          <Link to="/collections" className={styles.all}>View everything →</Link>
        </div>

        <div className={styles.grid}>
          {CATS.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={styles.card}
            >
              <Link to={`/collections?cat=${c.id}`} className={styles.link}>
                <div className={styles.media}>
                  <img src={c.image} alt={c.title} loading="lazy" />
                </div>
                <div className={styles.info}>
                  <h3>{c.title}</h3>
                  <span>{c.count}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
