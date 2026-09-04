import { useState } from 'react';
import { useCredit } from '../store/useShop';
import { live } from '../store/live';
import Intro from './Intro';
import s from './admin.module.css';

const money = (n) => `GH₵ ${n.toLocaleString()}`;

/**
 * Who still owes money. Buying now and paying later is normal here, and the
 * thing that actually gets forgotten is who owes what and for how long, so
 * that is all this page shows.
 */
export default function CreditBook() {
  /* Anything sold on credit at the counter lands here by itself. */
  const open = useCredit();
  const [cleared, setCleared] = useState(0);
  const owed = open.reduce((sum, c) => sum + c.owed, 0);
  const late = open.filter((c) => c.daysOwing > 30);

  return (
    <>
      <Intro>
        People who took something home and have not paid yet. Ring them, and
        when the money comes in press Paid to clear them off the list.
      </Intro>

      <div className={s.kpis}>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Owed to you</span>
          <div className={s.kpiValue}>{money(owed)}</div>
          <span className={s.kpiDelta}>Across {open.length} {open.length === 1 ? 'person' : 'people'}</span>
        </div>
        <div className={`${s.kpi} ${late.length ? s.kpiWarn : ''}`}>
          <span className={s.kpiLabel}>Waiting over a month</span>
          <div className={s.kpiValue}>{late.length}</div>
          <span className={`${s.kpiDelta} ${late.length ? s.kpiBad : ''}`}>
            {late.length ? 'Worth a phone call today' : 'Nobody is running late'}
          </span>
        </div>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Cleared today</span>
          <div className={s.kpiValue}>{cleared}</div>
          <span className={s.kpiDelta}>Marked as paid on this screen</span>
        </div>
      </div>

      <section className={s.card}>
        <header className={s.cardHead}>
          <div>
            <span className={s.cardEyebrow}>Longest waiting first</span>
            <h2>Still to be paid</h2>
          </div>
        </header>

        {open.length === 0 ? (
          <p className={s.emptyNote}>Everybody has paid. Nothing outstanding.</p>
        ) : (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Customer</th><th>Phone</th><th>Took home</th>
                  <th>Owes</th><th>Waiting</th><th>Paid?</th>
                </tr>
              </thead>
              <tbody>
                {open.map((c) => (
                  <tr key={c.id} className={c.daysOwing > 30 ? s.rowWarn : ''}>
                    <td>
                      <span className={s.cellPerson}>
                        <span className={s.initial}>{c.name[0]}</span>
                        <span>
                          <b>{c.name}</b>
                          <i>{c.area}</i>
                        </span>
                      </span>
                    </td>
                    <td className={s.mono}>{c.phone}</td>
                    <td className={s.sub}>{c.tookHome}</td>
                    <td><b>{money(c.owed)}</b></td>
                    <td>
                      <span className={`${s.tag} ${c.daysOwing > 30 ? s.tagOut : s.tagOk}`}>
                        {c.daysOwing} days
                      </span>
                    </td>
                    <td>
                      <button
                        className={s.ghostBtn}
                        onClick={() => { live.settleCredit(c.id, c.name); setCleared((n) => n + 1); }}
                      >
                        Mark paid
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
