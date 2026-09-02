import { useMemo, useState } from 'react';
import { CUSTOMERS } from './data';
import Intro from './Intro';
import s from './admin.module.css';

const money = (n) => `GH₵ ${n.toLocaleString()}`;
const TIERS = ['All', 'VIP', 'Regular', 'New'];

export default function Customers() {
  const [tier, setTier] = useState('All');
  const [q, setQ] = useState('');

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return CUSTOMERS.filter((c) => {
      if (tier !== 'All' && c.tier !== tier) return false;
      if (!term) return true;
      return c.name.toLowerCase().includes(term) || c.area.toLowerCase().includes(term) || c.phone.includes(term);
    });
  }, [tier, q]);

  const totalSpend = CUSTOMERS.reduce((a, c) => a + c.spend, 0);
  const repeat = CUSTOMERS.filter((c) => c.orders > 1).length;
  const fitted = CUSTOMERS.filter((c) => c.fitted).length;

  return (
    <>
      <Intro>
        Everyone who has bought from you. Look somebody up before they arrive so
        you already know their size and what they like.
      </Intro>

      <div className={s.kpis}>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Customers</span>
          <div className={s.kpiValue}>{CUSTOMERS.length}</div>
          <span className={s.kpiDelta}>On the list</span>
        </div>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Spent with you</span>
          <div className={s.kpiValue}>{money(totalSpend)}</div>
          <span className={`${s.kpiDelta} ${s.kpiUp}`}>{money(Math.round(totalSpend / CUSTOMERS.length))} each on average</span>
        </div>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Came back again</span>
          <div className={s.kpiValue}>{repeat}</div>
          <span className={`${s.kpiDelta} ${s.kpiUp}`}>Out of {CUSTOMERS.length} customers</span>
        </div>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Measured in store</span>
          <div className={s.kpiValue}>{fitted}</div>
          <span className={s.kpiDelta}>You know their size already</span>
        </div>
      </div>

      <div className={s.toolbar}>
        <div className={s.chips}>
          {TIERS.map((t) => (
            <button key={t} className={`${s.chip} ${tier === t ? s.chipOn : ''}`} onClick={() => setTier(t)}>
              {t} <i>{t === 'All' ? CUSTOMERS.length : CUSTOMERS.filter((c) => c.tier === t).length}</i>
            </button>
          ))}
        </div>
        <label className={s.search}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" strokeLinecap="round" />
          </svg>
          <input placeholder="Search name, area or phone" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>

      <section className={s.card}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Customer</th><th>Area</th><th>Phone</th><th>Orders</th>
                <th>Spent</th><th>Last order</th><th>Size on file</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span className={s.cellPerson}>
                      <span className={s.initial}>{c.name[0]}</span>
                      <span>
                        <b>{c.name}</b>
                        <i>
                          <span className={`${s.tag} ${c.tier === 'VIP' ? s.tagVip : c.tier === 'Regular' ? s.tagOk : s.tagNew}`}>
                            {c.tier}
                          </span>
                        </i>
                      </span>
                    </span>
                  </td>
                  <td>{c.area}</td>
                  <td className={s.mono}>{c.phone}</td>
                  <td>{c.orders}</td>
                  <td><b>{money(c.spend)}</b></td>
                  <td className={s.sub}>{c.lastSeen} days ago</td>
                  <td>{c.fitted ? <span className={s.yes}>Yes</span> : <span className={s.sub}>Not yet</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className={s.emptyNote}>No customers match that search.</p>}
        </div>
      </section>

    </>
  );
}
