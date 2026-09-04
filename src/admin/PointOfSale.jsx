import { useMemo, useState } from 'react';
import { PAY_METHODS } from './data';
import { useCatalogue, stockState } from '../store/useShop';
import { live } from '../store/live';
import { CATEGORIES } from '../data/products';
import Intro from './Intro';
import s from './admin.module.css';

const money = (n) => `GH₵ ${n.toLocaleString()}`;

/**
 * The counter. Someone is standing in the shop, so this has to be quick:
 * find the piece, add it, take the money, done.
 *
 * The ticket is component state and the sale is not written anywhere, which
 * is the honest behaviour for a sample. Everything the owner would touch on
 * a real day is here and works.
 */
export default function PointOfSale() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [ticket, setTicket] = useState([]);
  const [pay, setPay] = useState(PAY_METHODS[0]);
  const [done, setDone] = useState(null);
  const catalogue = useCatalogue();

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return catalogue
      .filter((i) => (cat === 'all' || i.category === cat)
        && (!term || i.name.toLowerCase().includes(term) || i.sku.toLowerCase().includes(term)))
      .slice(0, 18);
  }, [q, cat, catalogue]);

  const add = (item) => {
    setTicket((t) => {
      const found = t.find((l) => l.id === item.id);
      if (found) return t.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l));
      return [...t, { id: item.id, name: item.name, price: item.price, image: item.image, qty: 1 }];
    });
  };

  const step = (id, by) =>
    setTicket((t) => t
      .map((l) => (l.id === id ? { ...l, qty: l.qty + by } : l))
      .filter((l) => l.qty > 0));

  const total = ticket.reduce((sum, l) => sum + l.price * l.qty, 0);
  const pieces = ticket.reduce((sum, l) => sum + l.qty, 0);

  /* A counter sale is an order like any other: it drops the stock the
     website shows and lands in Orders next to the online ones. Sold on
     credit, it opens an account in the Credit Book instead. */
  const complete = () => {
    const order = live.placeOrder({
      lines: ticket.map((l) => ({ ...l, stock: catalogue.find((c) => c.id === l.id)?.stock ?? 0 })),
      customer: pay === 'On credit' ? 'Counter customer' : 'Walk-in customer',
      area: 'Osu shop',
      phone: '',
      channel: 'In store',
      payment: pay,
      onCredit: pay === 'On credit',
    });
    setDone({ pieces, total, pay, id: order.id });
    setTicket([]);
  };

  if (done) {
    return (
      <>
        <Intro>
          Sell to someone standing in front of you.
        </Intro>
        <section className={`${s.card} ${s.saleDone}`}>
          <span className={s.saleTick} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2>Sale complete</h2>
          <p className={s.saleRef}>Recorded as {done.id}</p>
          <p className={s.saleSum}>
            {done.pieces} {done.pieces === 1 ? 'piece' : 'pieces'} for <b>{money(done.total)}</b>
            {done.pay === 'On credit' ? ', put on credit.' : `, paid by ${done.pay}.`}
          </p>
          <button className={s.primaryBtn} onClick={() => setDone(null)}>Start the next sale</button>
        </section>
      </>
    );
  }

  return (
    <>
      <Intro>
        Sell to someone standing in front of you. Find the piece, add it to the
        list on the right, take the money, then press Finish sale.
      </Intro>

      <div className={s.pos}>
        {/* ── Find a piece ──────────────────────── */}
        <section className={s.card}>
          <header className={s.cardHead}>
            <div>
              <span className={s.cardEyebrow}>Step one</span>
              <h2>Find the piece</h2>
            </div>
          </header>

          <label className={s.search}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" strokeLinecap="round" />
            </svg>
            <input
              placeholder="Type a name, or the code on the tag"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>

          <div className={`${s.chips} ${s.posChips}`}>
            <button className={`${s.chip} ${cat === 'all' ? s.chipOn : ''}`} onClick={() => setCat('all')}>
              Everything
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`${s.chip} ${cat === c.id ? s.chipOn : ''}`}
                onClick={() => setCat(c.id)}
              >
                {c.short}
              </button>
            ))}
          </div>

          <div className={s.posGrid}>
            {results.map((i) => {
              const out = stockState(i) === 'out';
              return (
                <button
                  key={i.id}
                  className={`${s.posItem} ${out ? s.posItemOut : ''}`}
                  onClick={() => !out && add(i)}
                  disabled={out}
                  title={out ? 'Finished, none left to sell' : 'Add to the sale'}
                >
                  <img src={i.image} alt="" loading="lazy" />
                  <b>{i.name}</b>
                  <i>{money(i.price)}</i>
                  <em className={out ? s.posOutTag : s.posLeftTag}>
                    {out ? 'Finished' : `${i.stock} left`}
                  </em>
                </button>
              );
            })}
          </div>
          {results.length === 0 && <p className={s.emptyNote}>Nothing matches that. Try a shorter word.</p>}
        </section>

        {/* ── The ticket ────────────────────────── */}
        <section className={`${s.card} ${s.ticket}`}>
          <header className={s.cardHead}>
            <div>
              <span className={s.cardEyebrow}>Step two</span>
              <h2>This sale</h2>
            </div>
            {ticket.length > 0 && (
              <button className={s.linkBtn} onClick={() => setTicket([])}>Clear</button>
            )}
          </header>

          {ticket.length === 0 ? (
            <p className={s.emptyNote}>
              Nothing added yet. Tap a piece on the left and it will appear here.
            </p>
          ) : (
            <ul className={s.ticketList}>
              {ticket.map((l) => (
                <li key={l.id}>
                  <img src={l.image} alt="" loading="lazy" />
                  <span className={s.ticketMain}>
                    <b>{l.name}</b>
                    <i>{money(l.price)} each</i>
                  </span>
                  <span className={s.stepper}>
                    <button onClick={() => step(l.id, -1)} aria-label={`One less ${l.name}`}>&minus;</button>
                    <b className={s.stepperQty}>{l.qty}</b>
                    <button onClick={() => step(l.id, 1)} aria-label={`One more ${l.name}`}>+</button>
                  </span>
                  <b className={s.ticketLine}>{money(l.price * l.qty)}</b>
                </li>
              ))}
            </ul>
          )}

          <div className={s.ticketFoot}>
            <div className={s.ticketTotal}>
              <span>{pieces} {pieces === 1 ? 'piece' : 'pieces'}</span>
              <b>{money(total)}</b>
            </div>

            <span className={s.fieldLabel}>How are they paying?</span>
            <div className={s.payRow}>
              {PAY_METHODS.map((p) => (
                <button
                  key={p}
                  className={`${s.chip} ${pay === p ? s.chipOn : ''}`}
                  onClick={() => setPay(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            {pay === 'On credit' && (
              <p className={s.hint}>
                This goes into the Credit Book so you can chase it later.
              </p>
            )}

            <button
              className={s.primaryBtn}
              onClick={complete}
              disabled={ticket.length === 0}
            >
              Finish sale
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
