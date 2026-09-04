import {
  AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { KPIS, SALES_7D } from './data';
import { useOrders, useFittings, useCatalogue, useActivity, stockState } from '../store/useShop';
import Intro from './Intro';
import s from './admin.module.css';

const money = (n) => `GH₵ ${n.toLocaleString()}`;

const tip = {
  background: '#FFFCFA',
  border: '1px solid rgba(42,32,40,0.14)',
  borderRadius: 10,
  fontSize: 12,
  color: '#2A2028',
  boxShadow: '0 12px 30px -18px rgba(42,32,40,.5)',
};

/**
 * The opening screen answers three questions and nothing else: what has to
 * go out today, what has to be reordered, and who is coming in. One chart,
 * because the shape of the week is worth a glance and a second chart is not.
 */
export default function Overview({ onNavigate }) {
  const orders = useOrders();
  const fittings = useFittings();
  const catalogue = useCatalogue();
  const activity = useActivity();
  const toPack = orders.filter((o) => o.status === 'Paid' || o.status === 'Packing');
  const today = fittings.filter((a) => a.day === 'Today' || a.isNew);
  const lowStock = catalogue.filter((i) => stockState(i) !== 'ok').sort((a, b) => a.stock - b.stock);

  return (
    <>
      <Intro>
        What needs doing today. Everything waiting for you is on this screen,
        and each list takes you straight to the section that handles it.
      </Intro>

      <div className={s.kpis}>
        {KPIS.map((k) => (
          <div className={`${s.kpi} ${k.warn ? s.kpiWarn : ''}`} key={k.id}>
            <span className={s.kpiLabel}>{k.label}</span>
            <div className={s.kpiValue}>{k.value}</div>
            <span className={`${s.kpiDelta} ${k.up ? s.kpiUp : k.warn ? s.kpiBad : ''}`}>{k.delta}</span>
          </div>
        ))}
      </div>

      {/* ── The week at a glance ─────────────────── */}
      <section className={s.card}>
        <header className={s.cardHead}>
          <div>
            <span className={s.cardEyebrow}>This week</span>
            <h2>Money in, day by day</h2>
          </div>
          <span className={s.pill}>{money(SALES_7D.reduce((a, d) => a + d.revenue, 0))} in total</span>
        </header>
        <div style={{ height: 230 }}>
          <ResponsiveContainer>
            <AreaChart data={SALES_7D} margin={{ top: 8, right: 26, left: 26, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E4738A" stopOpacity={0.42} />
                  <stop offset="100%" stopColor="#E4738A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(42,32,40,0.07)" vertical={false} />
              <XAxis
                dataKey="d"
                axisLine={false}
                tickLine={false}
                stroke="#786A74"
                style={{ fontSize: 11, fontWeight: 600 }}
              />
              <Tooltip contentStyle={tip} formatter={(v) => money(v)} labelFormatter={(d) => d} />
              <Area type="monotone" dataKey="revenue" name="Money in" stroke="#C2415C" strokeWidth={2.2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {activity.length > 0 && (
        <section className={s.card}>
          <header className={s.cardHead}>
            <div>
              <span className={s.cardEyebrow}>Live</span>
              <h2>Just happened</h2>
            </div>
            <span className={s.pill}>Shop and counter</span>
          </header>
          <ul className={s.feed}>
            {activity.slice(0, 6).map((a) => (
              <li key={a.id}>
                <span className={`${s.feedDot} ${s[`feed_${a.kind}`] || ''}`} aria-hidden="true" />
                {a.text}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── What needs doing ─────────────────────── */}
      <div className={s.row3}>
        <section className={s.card}>
          <header className={s.cardHead}>
            <div>
              <span className={s.cardEyebrow}>{toPack.length} waiting</span>
              <h2>Pack and send</h2>
            </div>
            <button className={s.linkBtn} onClick={() => onNavigate('orders')}>Open orders</button>
          </header>
          <ul className={s.list}>
            {toPack.slice(0, 5).map((o) => (
              <li key={o.id}>
                <div className={s.listMain}>
                  <b>{o.customer}</b>
                  <i>{o.items} {o.items === 1 ? 'piece' : 'pieces'} to {o.area}</i>
                </div>
                <div className={s.listSide}>
                  <span className={`${s.tag} ${o.status === 'Paid' ? s.tagPaid : s.tagPacking}`}>{o.status}</span>
                  <b>{money(o.total)}</b>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${s.card} ${s.cardAlert}`}>
          <header className={s.cardHead}>
            <div>
              <span className={s.cardEyebrow}>{lowStock.length} to order</span>
              <h2>Order more</h2>
            </div>
            <button className={s.linkBtn} onClick={() => onNavigate('products')}>Open stock</button>
          </header>
          <ul className={s.list}>
            {lowStock.slice(0, 5).map((i) => (
              <li key={i.id}>
                <div className={s.listMain}>
                  <b>{i.name}</b>
                  <i>{i.sold30} sold this month</i>
                </div>
                <div className={s.listSide}>
                  <span className={`${s.tag} ${stockState(i) === 'out' ? s.tagOut : s.tagLow}`}>
                    {i.stock === 0 ? 'Finished' : `${i.stock} left`}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={s.card}>
          <header className={s.cardHead}>
            <div>
              <span className={s.cardEyebrow}>{today.length} booked</span>
              <h2>In today</h2>
            </div>
            <button className={s.linkBtn} onClick={() => onNavigate('appointments')}>Open diary</button>
          </header>
          {today.length === 0 ? (
            <p className={s.emptyNote}>Nobody booked in today.</p>
          ) : (
            <ul className={s.list}>
              {today.map((a) => (
                <li key={a.id}>
                  <div className={s.listMain}>
                    <b>{a.name}</b>
                    <i>{a.service}</i>
                  </div>
                  <div className={s.listSide}>
                    <span className={s.timeTag}>{a.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
