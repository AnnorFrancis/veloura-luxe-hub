import { SUPPLIERS, LOW_STOCK } from './data';
import { CATEGORIES } from '../data/products';
import Intro from './Intro';
import s from './admin.module.css';

const label = (id) => (CATEGORIES.find((c) => c.id === id) || {}).label || id;

/**
 * Who to ring when something runs out. Deliberately just a contact book with
 * the one useful extra: how many pieces in their department need reordering
 * right now, so the call has a reason.
 */
export default function Suppliers() {
  const rows = SUPPLIERS.map((sup) => ({
    ...sup,
    needed: LOW_STOCK.filter((i) => i.category === sup.supplies).length,
  })).sort((a, b) => b.needed - a.needed);

  const toCall = rows.filter((r) => r.needed > 0).length;

  return (
    <>
      <Intro>
        The people you buy from. When something runs out, this is where you
        find the number to call.
      </Intro>

      <div className={s.kpis}>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Suppliers</span>
          <div className={s.kpiValue}>{SUPPLIERS.length}</div>
          <span className={s.kpiDelta}>One for every department</span>
        </div>
        <div className={`${s.kpi} ${toCall ? s.kpiWarn : ''}`}>
          <span className={s.kpiLabel}>Worth calling now</span>
          <div className={s.kpiValue}>{toCall}</div>
          <span className={`${s.kpiDelta} ${toCall ? s.kpiBad : ''}`}>
            They supply something you are short of
          </span>
        </div>
      </div>

      <section className={s.card}>
        <header className={s.cardHead}>
          <div>
            <span className={s.cardEyebrow}>Most urgent first</span>
            <h2>Who to call</h2>
          </div>
        </header>

        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Supplier</th><th>Supplies</th><th>Who to ask for</th>
                <th>Phone</th><th>Payment</th><th>Need to order</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={r.needed > 4 ? s.rowWarn : ''}>
                  <td>
                    <span className={s.cellPerson}>
                      <span className={s.initial}>{r.name[0]}</span>
                      <span>
                        <b>{r.name}</b>
                        <i>{r.area}</i>
                      </span>
                    </span>
                  </td>
                  <td>{label(r.supplies)}</td>
                  <td className={s.sub}>{r.contact}</td>
                  <td className={s.mono}>{r.phone}</td>
                  <td className={s.sub}>{r.terms}</td>
                  <td>
                    {r.needed > 0 ? (
                      <span className={`${s.tag} ${r.needed > 4 ? s.tagOut : s.tagLow}`}>
                        {r.needed} {r.needed === 1 ? 'piece' : 'pieces'}
                      </span>
                    ) : (
                      <span className={s.sub}>Nothing needed</span>
                    )}
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
