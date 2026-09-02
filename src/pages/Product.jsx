import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { cartApi } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useReveal, useTilt } from '../hooks/useMotionKit';
import ProductCard from '../components/ProductCard';
import { Star } from '../components/Logo';
import styles from './Product.module.css';

const TONE = {
  panties: 'rose', underwear: 'sky', bikinis: 'sea', shapers: 'peach',
  nightwear: 'lilac', socks: 'mint', napkins: 'blush', towels: 'gold', raincoat: 'sun',
};

const TABS = [
  { id: 'detail', label: 'Details' },
  { id: 'care', label: 'Care' },
  { id: 'delivery', label: 'Delivery' },
];

const CARE_BY_CAT = {
  panties: 'Hand wash cool with a mild soap. Dry flat in the shade. No bleach, no fabric softener.',
  underwear: 'Machine wash at 30 degrees in a mesh bag. Line dry. Tumble drying shortens the life of the waistband.',
  bikinis: 'Rinse in fresh water straight after swimming. Dry flat in the shade, never on a hot surface.',
  shapers: 'Hand wash after every second wear. Do not iron, as heat damages the bonded seams. Store flat.',
  nightwear: 'Machine wash cool on a gentle cycle. Cool iron on the reverse if needed. Satin should be line dried in shade.',
  socks: 'Machine wash at 40 degrees with like colours. Line dry to keep the cuff firm.',
  napkins: 'Machine wash at 40 degrees with like colours. Iron while slightly damp for a crisp fold. Cotton and linen soften with every wash.',
  towels: 'Wash once before first use. Machine wash at 40 degrees without softener, which stops towels absorbing.',
  raincoat: 'Sponge clean with cool water. Do not machine wash, iron or dry clean, as it damages the seam tape.',
};

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const wishlist = useWishlist();
  const ref = useReveal();
  const tilt = useTilt({ max: 6, scale: 1.015 });

  const product = PRODUCTS.find((p) => p.id === id);
  const [size, setSize] = useState(product?.sizes?.[0] ?? null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('detail');
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className={styles.missing}>
        <div className="container">
          <h1 className="display-lg">We cannot find that piece.</h1>
          <p className="lede">It may have sold out and come off the rail.</p>
          <Link to="/shop" className="btn btn-primary">Back to the shop</Link>
        </div>
      </div>
    );
  }

  const cat = CATEGORIES.find((c) => c.id === product.category);
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const saved = wishlist.has(product.id);

  const add = () => {
    for (let n = 0; n < qty; n += 1) cartApi.add(product, { size });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const buyNow = () => {
    add();
    navigate('/cart');
  };

  return (
    <div className={styles.page} data-tone={TONE[product.category]} ref={ref} key={product.id}>
      <div className="container">
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <i aria-hidden="true">/</i>
          <Link to="/shop">Shop</Link>
          <i aria-hidden="true">/</i>
          <Link to={`/shop?cat=${product.category}`}>{cat?.label}</Link>
          <i aria-hidden="true">/</i>
          <b>{product.name}</b>
        </nav>

        <div className={styles.grid}>
          {/* ── Gallery ─────────────────────────────── */}
          <div className={styles.gallery}>
            <figure className={styles.frame} {...tilt}>
              <img src={product.image} alt={product.name} fetchPriority="high" />
              <span className={styles.glare} aria-hidden="true" />
              {product.badge && <span className={styles.badge}>{product.badge}</span>}
            </figure>
          </div>

          {/* ── Buy panel ───────────────────────────── */}
          <div className={styles.panel}>
            <Link to={`/shop?cat=${product.category}`} className="eyebrow">{cat?.label}</Link>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.tagline}>{product.tagline}</p>

            <div className={styles.priceRow}>
              <span className={styles.price}>{product.currency} {product.price.toLocaleString()}</span>
              <span className={styles.stock}><i /> In stock</span>
            </div>

            {product.sizes && (
              <div className={styles.block}>
                <div className={styles.blockHead}>
                  <span className={styles.label}>Size</span>
                  <Link to="/size-guide" className={styles.sizeLink}>Size guide</Link>
                </div>
                <div className={styles.sizes}>
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`${styles.size} ${size === s ? styles.sizeOn : ''}`}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.buyRow}>
              <div className={styles.qty}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">&minus;</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity">+</button>
              </div>
              <button className={`btn btn-primary ${styles.addBtn}`} onClick={add}>
                {added ? 'Added to cart' : 'Add to cart'}
              </button>
            </div>

            <div className={styles.buyRow}>
              <button className={`btn btn-ghost ${styles.buyNow}`} onClick={buyNow}>Buy it now</button>
              <button
                className={`${styles.saveBtn} ${saved ? styles.savedOn : ''}`}
                onClick={() => wishlist.toggle(product.id)}
                aria-pressed={saved}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7">
                  <path d="M12 20.5 4.6 13a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8A4.7 4.7 0 0 1 19.4 13z" strokeLinejoin="round" />
                </svg>
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>

            <ul className={styles.perks}>
              <li><Star /> Free Accra delivery over GH₵ 300</li>
              <li><Star /> Discreet, unbranded packaging</li>
              <li><Star /> Seven day exchange on unused pieces</li>
            </ul>

            {/* tabs */}
            <div className={styles.tabs}>
              <div className={styles.tabBar} role="tablist">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    className={`${styles.tab} ${tab === t.id ? styles.tabOn : ''}`}
                    onClick={() => setTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className={styles.tabBody}>
                {tab === 'detail' && <p>{product.story}</p>}
                {tab === 'care' && <p>{CARE_BY_CAT[product.category]}</p>}
                {tab === 'delivery' && (
                  <p>
                    Same day within Greater Accra on orders placed before 2pm, and free over GH₵ 300.
                    One to two working days for Kumasi, Takoradi and Cape Coast.{' '}
                    <Link to="/delivery" className={styles.inlineLink}>Full delivery details</Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Related ──────────────────────────────── */}
        {related.length > 0 && (
          <section className={styles.related}>
            <div className={styles.relatedHead}>
              <h2 className="display-md">More in {cat?.label.toLowerCase()}</h2>
              <Link to={`/shop?cat=${product.category}`} className="link-arrow">
                See all <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onAdd={(x, o) => cartApi.add(x, o)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
