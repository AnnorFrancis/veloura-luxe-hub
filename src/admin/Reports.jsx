import {
  SALES_7D, CATEGORY_MIX, TOP_PRODUCTS, EXPENSES, ORDERS, CUSTOMERS, LOW_STOCK,
  REVENUE_30, COST_OF_GOODS_30, UNITS_30,
} from './data';
import Intro from './Intro';
import s from './admin.module.css';

const money = (n) => `GH₵ ${n.toLocaleString()}`;

/**
 * The month in sentences rather than charts. The owner asked for plain
 * answers, so every line here reads like something a person would say, with
 * the number sitting inside it.
 */
export default function Reports() {
  const month = REVENUE_30;
  const running = EXPENSES.reduce((sum, e) => sum + e.amount, 0);
  const spent = COST_OF_GOODS_30 + running;
  const kept = month - spent;
  const best = CATEGORY_MIX[0];
  const quietest = CATEGORY_MIX[CATEGORY_MIX.length - 1];
  const bestDay = [...SALES_7D].sort((a, b) => b.revenue - a.revenue)[0];
  const orders = ORDERS.length;
  const repeat = CUSTOMERS.filter((c) => c.orders > 1).length;
  const avg = Math.round(month / Math.max(1, SALES_7D.reduce((sum, d) => sum + d.orders, 0) * 4.345));

  const lines = [
    { k: 'Money in', v: money(month), t: 'What the shop took this month, shop and online together.' },
    { k: 'Money out', v: money(spent), t: `${money(COST_OF_GOODS_30)} on the stock you sold, ${money(running)} on rent, wages and bills.` },
    { k: 'Left over', v: money(kept), t: kept > 0 ? 'What the shop kept after paying for everything.' : 'The shop spent more than it took this month.' },
    { k: 'Average sale', v: money(avg), t: 'What a customer spends in one go, on average.' },
    { k: 'Pieces sold', v: String(UNITS_30), t: 'Counted across the shop and online together.' },
    { k: 'Busiest day', v: bestDay.d, t: `${bestDay.d} brought in ${money(bestDay.revenue)}, more than any other day.` },
    { k: 'Best department', v: best.name, t: `${best.units} pieces sold, ${money(best.revenue)} taken.` },
    { k: 'Slowest department', v: quietest.name, t: `Only ${quietest.units} pieces sold. Worth a promotion or less stock.` },
    { k: 'Online orders', v: String(orders), t: 'Placed on the website or WhatsApp. The rest were sold over the counter.' },
    { k: 'Regulars', v: String(repeat), t: `${repeat} of ${CUSTOMERS.length} customers have bought more than once.` },
    { k: 'Needs restocking', v: String(LOW_STOCK.length), t: 'Pieces that are finished or nearly finished.' },
  ];

  return (
    <>
      <Intro>
        How the shop is doing this month, written out in words. Nothing here to
        press, it is just the picture.
      </Intro>

      <section className={s.card}>
        <header className={s.cardHead}>
          <div>
            <span className={s.cardEyebrow}>This month</span>
            <h2>The short version</h2>
          </div>
        </header>
        <ul className={s.reportList}>
          {lines.map((l) => (
            <li key={l.k}>
              <span className={s.reportKey}>{l.k}</span>
              <b className={s.reportVal}>{l.v}</b>
              <span className={s.reportNote}>{l.t}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.card}>
        <header className={s.cardHead}>
          <div>
            <span className={s.cardEyebrow}>Selling fastest</span>
            <h2>Your five best pieces</h2>
          </div>
        </header>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr><th>Piece</th><th>Sold this month</th><th>Money it brought in</th></tr>
            </thead>
            <tbody>
              {TOP_PRODUCTS.slice(0, 5).map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className={s.cellProduct}>
                      <img src={p.image} alt="" loading="lazy" />
                      <span><b>{p.name}</b><i>{p.tagline}</i></span>
                    </span>
                  </td>
                  <td>{p.sold30}</td>
                  <td><b>{money(p.revenue30)}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
