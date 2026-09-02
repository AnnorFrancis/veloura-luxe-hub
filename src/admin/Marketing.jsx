import { useState } from 'react';
import { DISCOUNTS, ORDERS } from './data';
import s from './admin.module.css';

const money = (n) => `GH₵ ${n.toLocaleString()}`;
const CHANNELS = ['Website', 'WhatsApp', 'In store', 'Instagram'];

export default function Marketing() {
  const [codes, setCodes] = useState(DISCOUNTS);
  const toggle = (code) =>
    setCodes((p) => p.map((c) => (c.code === code ? { ...c, active: !c.active } : c)));

  const byChannel = CHANNELS.map((ch) => {
    const list = ORDERS.filter((o) => o.channel === ch);
    return { ch, orders: list.length, revenue: list.reduce((a, o) => a + o.total, 0) };
  }).sort((a, b) => b.revenue - a.revenue);
  const maxRev = Math.max(...byChannel.map((c) => c.revenue));

  return (
    <>
      <div className={s.kpis}>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>On the mailing list</span>
          <div className={s.kpiValue}>1,284</div>
          <span className={`${s.kpiDelta} ${s.kpiUp}`}>96 signed up this month</span>
        </div>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Discount codes used</span>
          <div className={s.kpiValue}>{codes.reduce((a, c) => a + c.used, 0)}</div>
          <span className={s.kpiDelta}>Across {codes.length} offers</span>
        </div>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Orders this month</span>
          <div className={s.kpiValue}>{ORDERS.length}</div>
          <span className={`${s.kpiDelta} ${s.kpiUp}`}>From {new Set(ORDERS.map((o) => o.customerId)).size} customers</span>
        </div>
      </div>

      <section className={s.card}>
        <header className={s.cardHead}>
          <div>
            <span className={s.cardEyebrow}>Last 30 days</span>
            <h2>Where orders come from</h2>
          </div>
        </header>
        <ul className={s.bars}>
          {byChannel.map((c) => (
            <li key={c.ch}>
              <span className={s.barTop}>
                <b>{c.ch}</b>
                <i>{c.orders} orders, {money(c.revenue)}</i>
              </span>
              <span className={s.barTrack}>
                <span className={s.barFill} style={{ width: `${(c.revenue / maxRev) * 100}%` }} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.card}>
        <header className={s.cardHead}>
          <div>
            <span className={s.cardEyebrow}>Discounts</span>
            <h2>Your codes</h2>
          </div>
          <button className={s.primaryBtn}>New code</button>
        </header>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr><th>Code</th><th>What it does</th><th>Times used</th><th>Ends</th><th>On or off</th></tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr key={c.code}>
                  <td className={s.mono}><b>{c.code}</b></td>
                  <td>{c.type}</td>
                  <td>{c.used}{c.cap ? <span className={s.sub}> of {c.cap}</span> : null}</td>
                  <td className={s.sub}>{c.ends}</td>
                  <td>
                    <button
                      className={`${s.toggle} ${c.active ? s.toggleOn : ''}`}
                      onClick={() => toggle(c.code)}
                      aria-pressed={c.active}
                    >
                      <span />
                      {c.active ? 'On' : 'Off'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
