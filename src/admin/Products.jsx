import { useMemo, useState } from 'react';
import { INVENTORY, stockState } from './data';
import { CATEGORIES } from '../data/products';
import Intro from './Intro';
import s from './admin.module.css';

const money = (n) => `GH₵ ${n.toLocaleString()}`;
const STOCK_FILTERS = [
  { id: 'all', label: 'Everything' },
  { id: 'low', label: 'Nearly finished' },
  { id: 'out', label: 'Finished' },
];

export default function Products() {
  const [levels, setLevels] = useState(() =>
    Object.fromEntries(INVENTORY.map((i) => [i.id, i.stock]))
  );
  const [cat, setCat] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('revenue');
  const [shown, setShown] = useState(25);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = INVENTORY.filter((i) => {
      if (cat !== 'all' && i.category !== cat) return false;
      const state = stockState({ ...i, stock: levels[i.id] });
      if (stockFilter === 'low' && state !== 'low') return false;
      if (stockFilter === 'out' && state !== 'out') return false;
      if (!term) return true;
      return i.name.toLowerCase().includes(term) || i.sku.toLowerCase().includes(term);
    });
    const by = {
      revenue: (a, b) => b.revenue30 - a.revenue30,
      stockAsc: (a, b) => levels[a.id] - levels[b.id],
      priceDesc: (a, b) => b.price - a.price,
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return [...list].sort(by[sort]);
  }, [cat, stockFilter, q, sort, levels]);

  const adjust = (id, delta) =>
    setLevels((p) => ({ ...p, [id]: Math.max(0, p[id] + delta) }));

  const lowCount = INVENTORY.filter((i) => stockState({ ...i, stock: levels[i.id] }) === 'low').length;
  const outCount = INVENTORY.filter((i) => levels[i.id] === 0).length;

  return (
    <>
      <Intro>
        Everything you sell, with the price and how many are left. When stock
        comes in or goes out, change the number here and the shop updates
        straight away.
      </Intro>

      <div className={s.kpis}>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Products listed</span>
          <div className={s.kpiValue}>{INVENTORY.length}</div>
          <span className={s.kpiDelta}>Across {CATEGORIES.length} departments</span>
        </div>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Pieces on the shelf</span>
          <div className={s.kpiValue}>{Object.values(levels).reduce((a, b) => a + b, 0).toLocaleString()}</div>
          <span className={s.kpiDelta}>Counted across every department</span>
        </div>
        <div className={`${s.kpi} ${lowCount ? s.kpiWarn : ''}`}>
          <span className={s.kpiLabel}>Nearly finished</span>
          <div className={s.kpiValue}>{lowCount}</div>
          <span className={`${s.kpiDelta} ${s.kpiBad}`}>Time to order more</span>
        </div>
        <div className={`${s.kpi} ${outCount ? s.kpiWarn : ''}`}>
          <span className={s.kpiLabel}>Finished</span>
          <div className={s.kpiValue}>{outCount}</div>
          <span className={`${s.kpiDelta} ${s.kpiBad}`}>Nobody can buy these</span>
        </div>
      </div>

      <div className={s.toolbar}>
        <div className={s.chips}>
          <button className={`${s.chip} ${cat === 'all' ? s.chipOn : ''}`} onClick={() => setCat('all')}>
            All <i>{INVENTORY.length}</i>
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`${s.chip} ${cat === c.id ? s.chipOn : ''}`}
              onClick={() => setCat(c.id)}
            >
              {c.short} <i>{INVENTORY.filter((i) => i.category === c.id).length}</i>
            </button>
          ))}
        </div>

        <div className={s.toolRight}>
          <label className={s.search}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" strokeLinecap="round" />
            </svg>
            <input placeholder="Search by name or code" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>

          <select className={s.select} value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
            {STOCK_FILTERS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>

          <select className={s.select} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="revenue">Best sellers first</option>
            <option value="stockAsc">Running out first</option>
            <option value="priceDesc">Most expensive first</option>
            <option value="name">Name A to Z</option>
          </select>
        </div>
      </div>

      <section className={s.card}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Product</th><th>Code</th><th>Price</th>
                <th>Sold this month</th><th>In stock</th><th>Add or remove</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, shown).map((i) => {
                const stock = levels[i.id];
                const state = stockState({ ...i, stock });
                return (
                  <tr key={i.id} className={state !== 'ok' ? s.rowWarn : ''}>
                    <td>
                      <span className={s.cellProduct}>
                        <img src={i.image} alt="" loading="lazy" />
                        <span>
                          <b>{i.name}</b>
                          <i>{i.tagline}</i>
                        </span>
                      </span>
                    </td>
                    <td className={s.mono}>{i.sku}</td>
                    <td><b>{money(i.price)}</b></td>
                    <td>{i.sold30}</td>
                    <td>
                      <span className={`${s.tag} ${state === 'out' ? s.tagOut : state === 'low' ? s.tagLow : s.tagOk}`}>
                        {stock === 0 ? 'Finished' : stock}
                      </span>
                    </td>
                    <td>
                      <span className={s.stepper}>
                        <button onClick={() => adjust(i.id, -1)} aria-label={`Reduce stock for ${i.name}`}>&minus;</button>
                        <button onClick={() => adjust(i.id, 10)} aria-label={`Add ten to ${i.name}`}>+10</button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && <p className={s.emptyNote}>Nothing matches those filters.</p>}
        </div>

        {shown < rows.length && (
          <div className={s.more}>
            <button className={s.ghostBtn} onClick={() => setShown((n) => n + 25)}>
              Show {Math.min(25, rows.length - shown)} more of {rows.length}
            </button>
          </div>
        )}
      </section>
    </>
  );
}
