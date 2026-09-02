import { useState } from 'react';
import { Link } from 'react-router-dom';
import Overview from '../admin/Overview';
import Orders from '../admin/Orders';
import Products from '../admin/Products';
import Customers from '../admin/Customers';
import Appointments from '../admin/Appointments';
import Marketing from '../admin/Marketing';
import Settings from '../admin/Settings';
import Logo from '../components/Logo';
import { LOW_STOCK, ORDERS, APPOINTMENTS } from '../admin/data';
import styles from './Admin.module.css';

const NAV = [
  { id: 'overview', label: 'Overview', icon: 'M4 13h6V4H4zM14 20h6v-9h-6zM4 20h6v-4H4zM14 8h6V4h-6z' },
  { id: 'orders', label: 'Orders', icon: 'M5 8h14l-1.2 12H6.2zM9 8V6.5a3 3 0 0 1 6 0V8' },
  { id: 'products', label: 'Products', icon: 'M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7' },
  { id: 'customers', label: 'Customers', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0' },
  { id: 'appointments', label: 'Fittings', icon: 'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4' },
  { id: 'marketing', label: 'Marketing', icon: 'M4 10v4h4l6 5V5L8 10zM18 9a4 4 0 0 1 0 6' },
  { id: 'settings', label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.5 19l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.7 7.5l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1.3z' },
];

const VIEWS = {
  overview: Overview,
  orders: Orders,
  products: Products,
  customers: Customers,
  appointments: Appointments,
  marketing: Marketing,
  settings: Settings,
};

const counts = {
  orders: ORDERS.filter((o) => o.status === 'Paid' || o.status === 'Packing').length,
  products: LOW_STOCK.length,
  appointments: APPOINTMENTS.filter((a) => a.day === 'Today').length,
};

export default function Admin() {
  const [view, setView] = useState('overview');
  const [navOpen, setNavOpen] = useState(false);
  const View = VIEWS[view];
  const current = NAV.find((n) => n.id === view);

  return (
    <div className={styles.wrap}>
      <aside className={`${styles.side} ${navOpen ? styles.sideOpen : ''}`}>
        <div className={styles.sideHead}>
          <Logo variant="lockup" className={styles.logo} alt="Veloura Luxe Hub" />
          <span className={styles.subLogo}>Management</span>
        </div>

        <nav className={styles.sideNav}>
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`${styles.sideLink} ${view === n.id ? styles.sideLinkOn : ''}`}
              onClick={() => { setView(n.id); setNavOpen(false); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d={n.icon} />
              </svg>
              {n.label}
              {counts[n.id] > 0 && <span className={styles.badge}>{counts[n.id]}</span>}
            </button>
          ))}
        </nav>

        <div className={styles.sideFoot}>
          <Link to="/" className={styles.viewSite}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            View the shop
          </Link>
          <div className={styles.user}>
            <span className={styles.avatar}>B</span>
            <div>
              <div className={styles.sfName}>Beverly A.</div>
              <div className={styles.sfRole}>Owner</div>
            </div>
          </div>
        </div>
      </aside>

      {navOpen && <button className={styles.scrim} onClick={() => setNavOpen(false)} aria-label="Close menu" />}

      <main className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setNavOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
          <div>
            <div className={styles.hi}>Good evening, Beverly</div>
            <h1 className={styles.h1}>{current.label}</h1>
          </div>
          <div className={styles.topRight}>
            <span className={styles.date}>Monday, 31 August 2026</span>
          </div>
        </header>

        <div className={styles.viewBody} key={view}>
          <View onNavigate={setView} />
        </div>
      </main>
    </div>
  );
}
