import { useMemo, useState } from 'react';
import { timeAgo } from './data';
import { useOrders } from '../store/useShop';
import { live } from '../store/live';
import Intro from './Intro';
import s from './admin.module.css';

const money = (n) => `GH₵ ${n.toLocaleString()}`;
const FILTERS = ['All', 'Paid', 'Packing', 'Shipped', 'Delivered', 'Refunded'];
const FLOW = ['Paid', 'Packing', 'Shipped', 'Delivered'];

const tagFor = (status) => ({
  Paid: s.tagPaid, Packing: s.tagPacking, Shipped: s.tagShipped,
  Delivered: s.tagOk, Refunded: s.tagOut,
}[status] || s.tagOk);

export default function Orders() {
  /* Orders placed on the website arrive at the top of this list without a
     reload, which is the whole point of the two being one system. */
  const orders = useOrders();
  const [moved, setMoved] = useState({});
  const statusOf = (o) => moved[o.id] || o.status;
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState(null);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return orders.filter((o) => {
      const st = statusOf(o);
      if (filter !== 'All' && st !== filter) return false;
      if (!term) return true;
      return (
        o.id.toLowerCase().includes(term) ||
        o.customer.toLowerCase().includes(term) ||
        o.area.toLowerCase().includes(term)
      );
    });
    // statusOf reads `moved`, which is already a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, q, moved, orders]);

  const open = orders.find((o) => o.id === openId);
  const advance = (o) => {
    const i = FLOW.indexOf(statusOf(o));
    if (i > -1 && i < FLOW.length - 1) setMoved((p) => ({ ...p, [o.id]: FLOW[i + 1] }));
  };

  /* A return puts the pieces back on the shelf, so the website shows them
     for sale again straight away. */
  const refund = (o) => {
    live.refundOrder(o);
    setMoved((p) => ({ ...p, [o.id]: 'Refunded' }));
    setOpenId(null);
  };

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'All' ? orders.length : orders.filter((o) => statusOf(o) === f).length;
    return acc;
  }, {});

  return (
    <>
      <Intro>
        Everything bought online or on WhatsApp that still has to be packed and
        sent. Move an order along as you go and the customer sees the same
        thing on their side.
      </Intro>

      <div className={s.toolbar}>
        <div className={s.chips}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`${s.chip} ${filter === f ? s.chipOn : ''}`}
              onClick={() => setFilter(f)}
            >
              {f} <i>{counts[f]}</i>
            </button>
          ))}
        </div>
        <label className={s.search}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Search order, customer or area"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </div>

      <section className={s.card}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Order</th><th>Customer</th><th>Items</th><th>Came from</th>
                <th>Paid with</th><th>Total</th><th>Status</th><th>When</th><th />
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className={s.rowClickable} onClick={() => setOpenId(o.id)}>
                  <td className={s.mono}>{o.id}</td>
                  <td>
                    <b>{o.customer}</b>
                    <i className={s.sub}>{o.area}</i>
                  </td>
                  <td>{o.items}</td>
                  <td>{o.channel}</td>
                  <td>{o.payment}</td>
                  <td><b>{money(o.total)}</b></td>
                  <td><span className={`${s.tag} ${tagFor(statusOf(o))}`}>{statusOf(o)}</span></td>
                  <td className={s.sub}>{timeAgo(o.hoursAgo)}</td>
                  <td>
                    {FLOW.indexOf(statusOf(o)) > -1 && FLOW.indexOf(statusOf(o)) < 3 && (
                      <button
                        className={s.smallBtn}
                        onClick={(e) => { e.stopPropagation(); advance(o); }}
                      >
                        Mark {FLOW[FLOW.indexOf(statusOf(o)) + 1].toLowerCase()}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className={s.emptyNote}>No orders match that search.</p>}
        </div>
      </section>

      {/* ── Detail drawer ────────────────────────── */}
      {open && (
        <>
          <button className={s.drawerScrim} onClick={() => setOpenId(null)} aria-label="Close order" />
          <aside className={s.drawer}>
            <header className={s.drawerHead}>
              <div>
                <span className={s.cardEyebrow}>Order</span>
                <h2>{open.id}</h2>
              </div>
              <button className={s.iconBtn} onClick={() => setOpenId(null)} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div className={s.drawerBody}>
              <dl className={s.defs}>
                <div><dt>Customer</dt><dd>{open.customer}</dd></div>
                <div><dt>Phone</dt><dd>{open.phone}</dd></div>
                <div><dt>Deliver to</dt><dd>{open.area}</dd></div>
                <div><dt>Channel</dt><dd>{open.channel}</dd></div>
                <div><dt>Payment</dt><dd>{open.payment}</dd></div>
                <div><dt>Placed</dt><dd>{timeAgo(open.hoursAgo)}</dd></div>
              </dl>

              <div className={s.drawerLines}>
                {open.lines.map((l, i) => (
                  <div className={s.drawerLine} key={`${l.id}-${i}`}>
                    <img src={l.image} alt="" loading="lazy" />
                    <div>
                      <b>{l.name}</b>
                      <i>Size {l.size} · {l.qty} × {money(l.price)}</i>
                    </div>
                    <b>{money(l.price * l.qty)}</b>
                  </div>
                ))}
              </div>

              <dl className={s.totals}>
                <div><dt>Subtotal</dt><dd>{money(open.subtotal)}</dd></div>
                <div><dt>Delivery</dt><dd>{open.shipping === 0 ? 'Free' : money(open.shipping)}</dd></div>
                <div className={s.grand}><dt>Total</dt><dd>{money(open.total)}</dd></div>
              </dl>

              <div className={s.drawerActions}>
                <span className={`${s.tag} ${tagFor(statusOf(open))}`}>{statusOf(open)}</span>
                {FLOW.indexOf(statusOf(open)) > -1 && FLOW.indexOf(statusOf(open)) < 3 && (
                  <button className={s.primaryBtn} onClick={() => advance(open)}>
                    Mark {FLOW[FLOW.indexOf(statusOf(open)) + 1].toLowerCase()}
                  </button>
                )}
                <button className={s.ghostBtn}>Print waybill</button>
                {statusOf(open) !== 'Refunded' && (
                  <button className={s.ghostBtn} onClick={() => refund(open)}>
                    Refund and take back
                  </button>
                )}
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
