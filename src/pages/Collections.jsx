import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { cartApi } from '../hooks/useCart';
import styles from './Collections.module.css';

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price · Low to High' },
  { id: 'price-desc', label: 'Price · High to Low' },
  { id: 'newest', label: 'Newest' },
];

export default function Collections() {
  const [params, setParams] = useSearchParams();
  const cat = params.get('cat') || 'all';
  const [sort, setSort] = useState('featured');
  const [quick, setQuick] = useState(null);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const filtered = useMemo(() => {
    let list = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'newest': list = [...list].filter(p => p.badge === 'New').concat(list.filter(p => p.badge !== 'New')); break;
      default: break;
    }
    return list;
  }, [cat, sort]);

  const setCat = (id) => {
    if (id === 'all') setParams({}, { replace: true });
    else setParams({ cat: id }, { replace: true });
  };

  return (
    <div className="page">
      <section className={styles.hero}>
        <div className="container">
          <span className="eyebrow">Shop</span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={styles.title}
          >
            {CATEGORIES.find(c => c.id === cat)?.label || 'All'}
            <small>{filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}</small>
          </motion.h1>
          <p className={styles.lede}>
            Free delivery in Accra above GH₵ 500. 7-day free exchange on all shirts,
            trousers and shoes. Real customer support on WhatsApp.
          </p>
        </div>
      </section>

      <section className={styles.controls}>
        <div className="container">
          <div className={styles.bar}>
            <div className={styles.cats}>
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`${styles.chip} ${cat === c.id ? styles.chipActive : ''}`}
                >{c.label}</button>
              ))}
            </div>
            <div className={styles.sort}>
              <span className={styles.sortLabel}>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={styles.select}>
                {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className="container">
          <AnimatePresence mode="popLayout">
            <motion.div key={`${cat}-${sort}`} className={styles.grid}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  onQuickView={setQuick}
                  onAdd={(prod, opts) => cartApi.add(prod, opts)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className={styles.empty}>
              <p>Nothing in this category yet — check back soon.</p>
            </div>
          )}
        </div>
      </section>

      <ProductModal product={quick} onClose={() => setQuick(null)} onAdd={(p, o) => cartApi.add(p, o)} />
    </div>
  );
}
