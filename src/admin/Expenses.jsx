import { useMemo, useState } from 'react';
import { EXPENSES, REVENUE_30, COST_OF_GOODS_30 } from './data';
import Intro from './Intro';
import s from './admin.module.css';

const money = (n) => `GH₵ ${n.toLocaleString()}`;

/**
 * Money going out. Kept to one list and one total, because the only questions
 * that matter here are what did I spend and on what.
 */
export default function Expenses() {
  const [kind, setKind] = useState('All');

  const kinds = useMemo(
    () => ['All', ...Array.from(new Set(EXPENSES.map((e) => e.category)))],
    []
  );
  const rows = kind === 'All' ? EXPENSES : EXPENSES.filter((e) => e.category === kind);

  const running = EXPENSES.reduce((sum, e) => sum + e.amount, 0);
  const spent = running + COST_OF_GOODS_30;
  const earned = REVENUE_30;
  const kept = earned - spent;
  const biggest = [...EXPENSES].sort((a, b) => b.amount - a.amount)[0];

  return (
    <>
      <Intro>
        The running costs of the shop this month: rent, wages, bills and the
        rest. What you paid for stock is counted separately, from the pieces
        that actually sold.
      </Intro>

      <div className={s.kpis}>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Money in this month</span>
          <div className={s.kpiValue}>{money(earned)}</div>
          <span className={s.kpiDelta}>From sales and orders</span>
        </div>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Money out this month</span>
          <div className={s.kpiValue}>{money(spent)}</div>
          <span className={s.kpiDelta}>{money(COST_OF_GOODS_30)} of it was stock you sold</span>
        </div>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Left over</span>
          <div className={s.kpiValue}>{money(kept)}</div>
          <span className={`${s.kpiDelta} ${kept > 0 ? s.kpiUp : s.kpiBad}`}>
            {kept > 0 ? 'The shop is ahead this month' : 'The shop is behind this month'}
          </span>
        </div>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Biggest single cost</span>
          <div className={s.kpiValue}>{money(biggest.amount)}</div>
          <span className={s.kpiDelta}>{biggest.what}</span>
        </div>
      </div>

      <div className={s.toolbar}>
        <div className={s.chips}>
          {kinds.map((k) => (
            <button
              key={k}
              className={`${s.chip} ${kind === k ? s.chipOn : ''}`}
              onClick={() => setKind(k)}
            >
              {k}
              <i>{k === 'All' ? EXPENSES.length : EXPENSES.filter((e) => e.category === k).length}</i>
            </button>
          ))}
        </div>
        <button className={s.primaryBtn}>Add a payment</button>
      </div>

      <section className={s.card}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr><th>What it was for</th><th>Kind</th><th>Paid with</th><th>When</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id}>
                  <td><b>{e.what}</b></td>
                  <td><span className={`${s.tag} ${s.tagOk}`}>{e.category}</span></td>
                  <td className={s.sub}>{e.paidWith}</td>
                  <td className={s.sub}>{e.daysAgo === 1 ? 'yesterday' : `${e.daysAgo} days ago`}</td>
                  <td><b>{money(e.amount)}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
