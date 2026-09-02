import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import ProductCard from '../components/ProductCard';
import { useCart, cartApi } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { PRODUCTS, getBestSellers } from '../data/products';
import { Star } from '../components/Logo';
import { useReveal } from '../hooks/useMotionKit';
import styles from './Cart.module.css';

const FREE_OVER = 300;

const DELIVERY_OPTIONS = [
  { id: 'accra', label: 'Greater Accra', note: 'Same day before 2pm', fee: 30 },
  { id: 'collect', label: 'Collect in store', note: 'Osu, ready in two hours', fee: 0 },
  { id: 'region', label: 'Kumasi, Takoradi, Cape Coast', note: 'One to two working days', fee: 45 },
  { id: 'ghana', label: 'Rest of Ghana', note: 'Two to four working days', fee: 60 },
];

/* ── Cart ───────────────────────────────────────────────── */
export function Cart() {
  const { items, subtotal, updateQty, remove } = useCart();
  const [ship, setShip] = useState('accra');
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(null);
  const [placed, setPlaced] = useState(false);
  const ref = useReveal();

  const currency = items[0]?.currency || 'GH₵';
  const option = DELIVERY_OPTIONS.find((o) => o.id === ship);
  const freeQualified = subtotal >= FREE_OVER && ship === 'accra';
  const shipFee = items.length === 0 || freeQualified ? 0 : option.fee;
  const discount = applied ? Math.round(subtotal * applied.pct) : 0;
  const total = Math.max(0, subtotal - discount) + shipFee;
  const toFree = Math.max(0, FREE_OVER - subtotal);

  const applyCode = (e) => {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (c === 'VELOURA10') setApplied({ code: c, pct: 0.1 });
    else if (c === 'WELCOME5') setApplied({ code: c, pct: 0.05 });
    else setApplied({ code: c, pct: 0, invalid: true });
  };

  if (placed) {
    return (
      <div className={styles.page}>
        <PageHero eyebrow="Thank you" title="Order" accent="received." tone="mint" media="parcel" crumbs={[{ label: 'Cart' }]} />
        <div className="container">
          <div className={styles.done}>
            <Star className={styles.doneStar} />
            <h2 className="display-md">We will message you shortly.</h2>
            <p>
              This is a design sample, so no payment was taken and nothing will ship.
              On the live site you would now get a WhatsApp confirmation with your order number.
            </p>
            <div className={styles.doneActions}>
              <Link to="/shop" className="btn btn-primary">Keep shopping</Link>
              <Link to="/" className="link-arrow">Back home <span aria-hidden="true">&rarr;</span></Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page} ref={ref}>
      <PageHero
        eyebrow="Your cart"
        title={items.length ? `${items.length} ${items.length === 1 ? 'piece' : 'pieces'}` : 'Your cart is'}
        accent={items.length ? 'ready.' : 'empty.'}
        lede={items.length
          ? 'Check the sizes, choose how you want it delivered, then pay how you normally pay.'
          : 'Nothing in here yet. The shop is a good place to start.'}
        tone="rose"
        media="parcel"
        crumbs={[{ label: 'Cart' }]}
      />

      <section className={styles.body}>
        <div className="container">
          {items.length === 0 ? (
            <div className={styles.empty}>
              <Link to="/shop" className="btn btn-primary">Browse the shop</Link>
              <div className={styles.suggest}>
                <h2 className={styles.suggestHead}>Popular right now</h2>
                <div className={styles.suggestGrid}>
                  {getBestSellers().slice(0, 4).map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} onAdd={(x, o) => cartApi.add(x, o)} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.layout}>
              {/* ── Lines ───────────────────────── */}
              <div className={styles.lines}>
                <div className={styles.linesHead}>
                  <span>Item</span>
                  <span>Quantity</span>
                  <span>Total</span>
                </div>

                {items.map((it) => {
                  const product = PRODUCTS.find((p) => p.id === it.id);
                  return (
                    <div className={styles.line} key={it.key}>
                      <Link to={product ? `/product/${product.id}` : '/shop'} className={styles.lineThumb}>
                        <img src={it.image} alt={it.name} loading="lazy" />
                      </Link>

                      <div className={styles.lineInfo}>
                        <Link to={product ? `/product/${product.id}` : '/shop'} className={styles.lineName}>
                          {it.name}
                        </Link>
                        {it.size && <span className={styles.lineSize}>Size {it.size}</span>}
                        <span className={styles.lineUnit}>{it.currency} {it.price.toLocaleString()} each</span>
                        <button className={styles.lineRemove} onClick={() => remove(it.key)}>Remove</button>
                      </div>

                      <div className={styles.lineQty}>
                        <button onClick={() => updateQty(it.key, it.qty - 1)} aria-label="Decrease quantity">&minus;</button>
                        <span>{it.qty}</span>
                        <button onClick={() => updateQty(it.key, it.qty + 1)} aria-label="Increase quantity">+</button>
                      </div>

                      <div className={styles.lineTotal}>
                        {it.currency} {(it.price * it.qty).toLocaleString()}
                      </div>
                    </div>
                  );
                })}

                <Link to="/shop" className={`link-arrow ${styles.keep}`}>
                  Keep shopping <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>

              {/* ── Summary ─────────────────────── */}
              <aside className={styles.summary}>
                {toFree > 0 && ship === 'accra' && (
                  <div className={styles.freeBar}>
                    <p>Add <b>{currency} {toFree.toLocaleString()}</b> for free Accra delivery</p>
                    <span className={styles.freeTrack}>
                      <span className={styles.freeFill} style={{ transform: `scaleX(${Math.min(1, subtotal / FREE_OVER)})` }} />
                    </span>
                  </div>
                )}

                <div className={styles.sumBlock}>
                  <span className={styles.sumLabel}>Delivery</span>
                  <div className={styles.ships}>
                    {DELIVERY_OPTIONS.map((o) => (
                      <label key={o.id} className={`${styles.ship} ${ship === o.id ? styles.shipOn : ''}`}>
                        <input
                          type="radio"
                          name="delivery"
                          value={o.id}
                          checked={ship === o.id}
                          onChange={() => setShip(o.id)}
                        />
                        <span className={styles.shipBody}>
                          <b>{o.label}</b>
                          <i>{o.note}</i>
                        </span>
                        <span className={styles.shipFee}>
                          {o.fee === 0 || (o.id === 'accra' && subtotal >= FREE_OVER)
                            ? 'Free'
                            : `${currency} ${o.fee}`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <form className={styles.promo} onSubmit={applyCode}>
                  <label className="sr-only" htmlFor="promo">Discount code</label>
                  <input
                    id="promo"
                    placeholder="Discount code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <button type="submit">Apply</button>
                </form>
                {applied && (
                  <p className={applied.invalid ? styles.promoBad : styles.promoGood}>
                    {applied.invalid
                      ? `${applied.code} is not a valid code`
                      : `${applied.code} applied, ${Math.round(applied.pct * 100)} percent off`}
                  </p>
                )}

                <dl className={styles.totals}>
                  <div><dt>Subtotal</dt><dd>{currency} {subtotal.toLocaleString()}</dd></div>
                  {discount > 0 && (
                    <div><dt>Discount</dt><dd className={styles.minus}>&minus; {currency} {discount.toLocaleString()}</dd></div>
                  )}
                  <div>
                    <dt>Delivery</dt>
                    <dd>{shipFee === 0 ? <em>Free</em> : `${currency} ${shipFee}`}</dd>
                  </div>
                  <div className={styles.grand}><dt>Total</dt><dd>{currency} {total.toLocaleString()}</dd></div>
                </dl>

                <button className={`btn btn-primary ${styles.checkout}`} onClick={() => setPlaced(true)}>
                  Checkout
                </button>

                <div className={styles.pay}>
                  <span>MTN MoMo</span><span>Telecel Cash</span><span>Visa</span><span>Mastercard</span>
                </div>

                <ul className={styles.perks}>
                  <li><Star /> Discreet, unbranded packaging</li>
                  <li><Star /> Seven day exchange on unused pieces</li>
                </ul>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ── Wishlist ───────────────────────────────────────────── */
export function Wishlist() {
  const { ids, remove, clear } = useWishlist();
  const ref = useReveal();
  const saved = ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);

  return (
    <div className={styles.page} ref={ref}>
      <PageHero
        eyebrow="Saved"
        title="Your"
        accent="wishlist."
        lede={saved.length
          ? 'Saved on this device. We will message you if anything here is running low.'
          : 'Tap the heart on any piece to keep it here for later.'}
        tone="sea"
        media="soft"
        crumbs={[{ label: 'Wishlist' }]}
      />

      <section className={styles.body}>
        <div className="container">
          {saved.length === 0 ? (
            <div className={styles.empty}>
              <Link to="/shop" className="btn btn-primary">Browse the shop</Link>
            </div>
          ) : (
            <>
              <div className={styles.wishHead}>
                <p className={styles.count}><b>{saved.length}</b> saved</p>
                <button className={styles.clear} onClick={clear}>Clear all</button>
              </div>
              <div className={styles.wishGrid}>
                {saved.map((p, i) => (
                  <div className={styles.wishItem} key={p.id}>
                    <ProductCard product={p} index={i} onAdd={(x, o) => cartApi.add(x, o)} />
                    <button className={styles.wishRemove} onClick={() => remove(p.id)}>Remove</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
