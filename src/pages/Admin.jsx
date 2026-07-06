import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import styles from './Admin.module.css';

const SALES_7D = [
  { d: 'Mon', v: 4200 },
  { d: 'Tue', v: 6100 },
  { d: 'Wed', v: 4900 },
  { d: 'Thu', v: 7300 },
  { d: 'Fri', v: 10700 },
  { d: 'Sat', v: 14450 },
  { d: 'Sun', v: 9600 },
];

const CAT_MIX = [
  { name: 'Shirts & Polos', value: 46, color: '#1E2D26' },
  { name: 'Shoes & Sandals', value: 24, color: '#8C4A2A' },
  { name: 'Trousers', value: 16, color: '#C9B79B' },
  { name: 'Fragrance', value: 10, color: '#B8613D' },
  { name: 'Accessories', value: 4, color: '#6C7770' },
];

const ORDERS = [
  { id: 'MM-1421', name: 'Kwame Osei',       item: 'Ocean Stripe Knit Polo',   total: 'GH₵ 420',  status: 'Paid',      when: '12m ago', accent: 'ok' },
  { id: 'MM-1420', name: 'Ama B. (gift)',    item: 'META N°1 Perfume Oil',     total: 'GH₵ 260',  status: 'Paid',      when: '38m ago', accent: 'ok' },
  { id: 'MM-1419', name: 'Nii-Ayite A.',     item: 'Navy Slim Trouser',        total: 'GH₵ 680',  status: 'Shipped',   when: '2h ago',  accent: 'brass' },
  { id: 'MM-1418', name: 'Selorm G.',        item: 'Black Bit Loafer',         total: 'GH₵ 720',  status: 'Paid',      when: '3h ago',  accent: 'ok' },
  { id: 'MM-1417', name: 'Kojo M.',          item: 'White Cross-Strap Sandal', total: 'GH₵ 380',  status: 'Fulfilled', when: '5h ago',  accent: 'muted' },
  { id: 'MM-1416', name: 'Adam H. (London)', item: 'Wave Zip Polo — Chocolate',total: 'GH₵ 460',  status: 'Paid',      when: '7h ago',  accent: 'ok' },
  { id: 'MM-1415', name: 'Nadia I.',         item: 'Sunday EDP · 100ml',       total: 'GH₵ 420',  status: 'Fulfilled', when: '9h ago',  accent: 'muted' },
];

const TOP_PRODUCTS = [
  { p: 'Ocean Stripe Knit Polo', revenue: 18480 },
  { p: 'Black Bit Loafer',       revenue: 21600 },
  { p: 'Navy Slim Trouser',      revenue: 16320 },
  { p: 'META N°1 Perfume Oil',   revenue: 10920 },
  { p: 'White Cross-Strap Sandal', revenue: 9880 },
];

const KPIS = [
  { label: 'Revenue · 7d', value: 'GH₵ 57,250', delta: '+18%', up: true },
  { label: 'Orders · 7d', value: '128',        delta: '+9%',  up: true },
  { label: 'Avg. order',   value: 'GH₵ 447',   delta: '+4%',  up: true },
  { label: 'Return rate',  value: '2.1%',      delta: '-0.4%',up: true },
];

export default function Admin() {
  const [range, setRange] = useState('7d');

  return (
    <div className={styles.wrap}>
      <aside className={styles.side}>
        <div className={styles.sideHead}>
          <span className={styles.logo}>META MEN</span>
          <span className={styles.subLogo}>Dashboard</span>
        </div>
        <nav className={styles.sideNav}>
          {['Overview', 'Orders', 'Products', 'Customers', 'Marketing', 'Appointments', 'Reports', 'Settings'].map((l, i) => (
            <button key={l} className={`${styles.sideLink} ${i === 0 ? styles.sideLinkOn : ''}`}>
              <span className={styles.dot}></span>
              {l}
              {i === 1 && <span className={styles.badge}>7</span>}
            </button>
          ))}
        </nav>
        <div className={styles.sideFoot}>
          <div className={styles.avatar}>N</div>
          <div>
            <div className={styles.sfName}>Nana Adjei</div>
            <div className={styles.sfRole}>Owner</div>
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <div className={styles.hi}>Good evening, Nana</div>
            <h1 className={styles.h1}>Sunday · 6 July 2026</h1>
          </div>
          <div className={styles.topRight}>
            <div className={styles.ranges}>
              {['24h', '7d', '30d', 'YTD'].map(r => (
                <button key={r} onClick={() => setRange(r)}
                  className={`${styles.range} ${range === r ? styles.rangeOn : ''}`}
                >{r}</button>
              ))}
            </div>
            <button className={styles.newBtn}>+ New product</button>
          </div>
        </div>

        <div className={styles.kpis}>
          {KPIS.map((k, i) => (
            <motion.div key={k.label} className={styles.kpi}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <span className={styles.kpiLabel}>{k.label}</span>
              <div className={styles.kpiValue}>{k.value}</div>
              <span className={`${styles.kpiDelta} ${k.up ? styles.kpiUp : ''}`}>{k.delta}</span>
              <svg className={styles.kpiSpark} viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0 22 Q 20 24 30 17 T 60 13 T 100 6" fill="none" stroke="#8C4A2A" strokeWidth="1.2"/>
                <path d="M0 22 Q 20 24 30 17 T 60 13 T 100 6 L 100 30 L 0 30 Z" fill="#8C4A2A" opacity="0.14"/>
              </svg>
            </motion.div>
          ))}
        </div>

        <div className={styles.rowA}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <div>
                <span className="eyebrow">Revenue</span>
                <h3>Last 7 days</h3>
              </div>
              <div className={styles.legend}>
                <span><span style={{ background: '#1E2D26' }}></span>Revenue</span>
              </div>
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer>
                <AreaChart data={SALES_7D} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E2D26" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#1E2D26" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(30,45,38,0.08)" vertical={false} />
                  <XAxis dataKey="d" axisLine={false} tickLine={false} stroke="#6C7770" style={{ fontSize: 11, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} stroke="#6C7770" style={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#F7F3EA', border: '1px solid rgba(30,45,38,0.14)', fontSize: 12, color: '#1E2D26', borderRadius: 4 }} />
                  <Area type="monotone" dataKey="v" stroke="#1E2D26" strokeWidth={2} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <div>
                <span className="eyebrow">Category mix</span>
                <h3>Where sales come from</h3>
              </div>
            </div>
            <div className={styles.pieWrap}>
              <div style={{ height: 200, width: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={CAT_MIX} innerRadius={58} outerRadius={94} paddingAngle={2} dataKey="value">
                      {CAT_MIX.map((c, i) => <Cell key={i} fill={c.color} stroke="none" />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#F7F3EA', border: '1px solid rgba(30,45,38,0.14)', fontSize: 12, color: '#1E2D26', borderRadius: 4 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className={styles.pieLegend}>
                {CAT_MIX.map(c => (
                  <li key={c.name}>
                    <span className={styles.pieDot} style={{ background: c.color }}></span>
                    <span>{c.name}</span>
                    <em>{c.value}%</em>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.rowB}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <div>
                <span className="eyebrow">Recent orders</span>
                <h3>Live · Auto-refreshing</h3>
              </div>
              <button className={styles.linkBtn}>View all →</button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order</th><th>Customer</th><th>Item</th><th>Total</th><th>Status</th><th>When</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.map(o => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.name}</td>
                    <td>{o.item}</td>
                    <td>{o.total}</td>
                    <td><span className={`${styles.pill} ${styles[`pill_${o.accent}`]}`}>{o.status}</span></td>
                    <td>{o.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <div>
                <span className="eyebrow">Top pieces</span>
                <h3>By revenue · 7d</h3>
              </div>
            </div>
            <div style={{ height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={TOP_PRODUCTS} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(30,45,38,0.08)" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} stroke="#6C7770" style={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="p" width={140} axisLine={false} tickLine={false} stroke="#3F4E44" style={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#F7F3EA', border: '1px solid rgba(30,45,38,0.14)', fontSize: 12, color: '#1E2D26', borderRadius: 4 }} />
                  <Bar dataKey="revenue" fill="#8C4A2A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className={styles.rowC}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <div>
                <span className="eyebrow">Automations</span>
                <h3>Working while you sleep</h3>
              </div>
              <button className={styles.linkBtn}>+ New rule</button>
            </div>
            <div className={styles.automations}>
              {[
                { t: 'Low stock alert',        s: 'When any product dips below 3 · SMS Nana',      on: true },
                { t: 'Abandoned bag reminder', s: '20 min after abandon · Send WhatsApp message',    on: true },
                { t: 'VIP customer alert',     s: 'Orders over GH₵ 3,000 · Flag for a personal call', on: true },
                { t: 'Weekly digest',          s: 'Sundays 8pm · Recap the week to Nana',            on: false },
              ].map(a => (
                <div key={a.t} className={styles.auto}>
                  <div>
                    <div className={styles.autoT}>{a.t}</div>
                    <div className={styles.autoS}>{a.s}</div>
                  </div>
                  <label className={styles.switch}>
                    <input type="checkbox" defaultChecked={a.on} />
                    <span></span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <div>
                <span className="eyebrow">Inventory</span>
                <h3>What needs eyes</h3>
              </div>
            </div>
            <div className={styles.stockList}>
              {[
                { name: 'META N°1 Perfume Oil',        stock: 2, warn: true },
                { name: 'Black Bit Loafer · 42',       stock: 3, warn: true },
                { name: 'Ocean Stripe Polo · L',       stock: 6, warn: false },
                { name: 'White Sneaker · 43',          stock: 11, warn: false },
                { name: 'Brown Derby · 41',            stock: 4, warn: true },
              ].map(s => (
                <div key={s.name} className={styles.stock}>
                  <span>{s.name}</span>
                  <span className={`${styles.stockN} ${s.warn ? styles.stockWarn : ''}`}>{s.stock} in stock</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
