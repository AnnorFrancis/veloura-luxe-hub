import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import PageHero from '../components/PageHero';
import { CATEGORIES } from '../data/products';
import { useShopProducts } from '../store/useShop';
import { cartApi } from '../hooks/useCart';
import { useReveal } from '../hooks/useMotionKit';
import styles from './Collections.module.css';

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'low', label: 'Price ↑' },
  { id: 'high', label: 'Price ↓' },
  { id: 'az', label: 'A to Z' },
];

const PAGE = 24;

export default function Collections() {
  const [params, setParams] = useSearchParams();
  const cat = params.get('cat') || 'all';
  const [sort, setSort] = useState('featured');
  const [shown, setShown] = useState(PAGE);
  const ref = useReveal();
  const products = useShopProducts();

  // Reset paging when the filter changes, adjusted during render rather
  // than in an effect, so the grid never paints a stale page first.
  const viewKey = `${cat}|${sort}`;
  const [prevViewKey, setPrevViewKey] = useState(viewKey);
  if (viewKey !== prevViewKey) {
    setPrevViewKey(viewKey);
    setShown(PAGE);
  }

  const active = CATEGORIES.find((c) => c.id === cat);

  const list = useMemo(() => {
    const base = cat === 'all' ? [...products] : products.filter((x) => x.category === cat);
    if (sort === 'low') base.sort((a, b) => a.price - b.price);
    if (sort === 'high') base.sort((a, b) => b.price - a.price);
    if (sort === 'az') base.sort((a, b) => a.name.localeCompare(b.name));
    return base;
  }, [cat, sort, products]);

  const setCat = (id) => {
    if (id === 'all') setParams({});
    else setParams({ cat: id });
  };

  return (
    <div className={styles.page} data-tone={active?.tone || 'rose'}>
      <PageHero
        eyebrow={active ? active.label : 'The full floor'}
        title={active ? active.label : 'Every'}
        accent={active ? 'edit' : 'piece.'}
        lede={active ? active.blurb : 'Nine departments, one rail. Filter down to exactly what you came for.'}
        tone={active?.tone === 'sea' || active?.tone === 'sky' ? 'sea' : active?.tone === 'mint' ? 'mint' : active?.tone === 'sun' || active?.tone === 'gold' ? 'sun' : 'rose'}
        media={active ? active.id : 'shop'}
        crumbs={[{ label: 'Shop', to: '/shop' }, ...(active ? [{ label: active.label }] : [])]}
      />

      {/* ── Filter bar ────────────────────────────── */}
      <div className={styles.bar}>
        <div className={`container ${styles.barInner}`}>
          <div className={styles.chips}>
            <button
              className={`${styles.chip} ${cat === 'all' ? styles.chipOn : ''}`}
              onClick={() => setCat('all')}
            >
              All <i>{products.length}</i>
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                data-tone={c.tone}
                className={`${styles.chip} ${cat === c.id ? styles.chipOn : ''}`}
                onClick={() => setCat(c.id)}
              >
                {c.short} <i>{products.filter((x) => x.category === c.id).length}</i>
              </button>
            ))}
          </div>

          <div className={styles.sort}>
            <div className={styles.sortBtns} role="group" aria-label="Sort products">
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  className={`${styles.sortBtn} ${sort === s.id ? styles.sortOn : ''}`}
                  onClick={() => setSort(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid ──────────────────────────────────── */}
      <section className={styles.body} ref={ref}>
        <div className="container">
          <p className={styles.count}>
            Showing <b>{Math.min(shown, list.length)}</b> of <b>{list.length}</b> pieces
          </p>

          <div className={styles.grid} key={`${cat}-${sort}`}>
            {list.slice(0, shown).map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                onAdd={(x, o) => cartApi.add(x, o)}
              />
            ))}
          </div>

          {shown < list.length && (
            <div className={styles.more}>
              <button className="btn btn-ghost" onClick={() => setShown((s) => s + PAGE)}>
                Load {Math.min(PAGE, list.length - shown)} more
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
