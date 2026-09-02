import { useState } from 'react';
import { STORE } from '../data/site';
import s from './admin.module.css';

const SHIPPING = [
  ['Greater Accra', 'GH₵ 30', 'Free over GH₵ 300'],
  ['Kumasi, Takoradi, Cape Coast', 'GH₵ 45', 'One to two days'],
  ['Rest of Ghana', 'GH₵ 60', 'Two to four days'],
  ['Collect in store', 'Free', 'Ready in two hours'],
];

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [toggles, setToggles] = useState({
    discreet: true,
    lowStockAlerts: true,
    whatsappReceipts: true,
    payOnDelivery: true,
    holdSoldOut: false,
  });

  const flip = (k) => setToggles((p) => ({ ...p, [k]: !p[k] }));

  const save = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  return (
    <div className={s.row2}>
      <section className={s.card}>
        <header className={s.cardHead}>
          <div>
            <span className={s.cardEyebrow}>Shop</span>
            <h2>Details</h2>
          </div>
        </header>
        <form className={s.form} onSubmit={save}>
          <label>
            <span>Shop name</span>
            <input defaultValue={STORE.name} />
          </label>
          <div className={s.formRow}>
            <label>
              <span>Street</span>
              <input defaultValue={STORE.street} />
            </label>
            <label>
              <span>Area</span>
              <input defaultValue={STORE.area} />
            </label>
          </div>
          <div className={s.formRow}>
            <label>
              <span>Phone</span>
              <input defaultValue={STORE.phone} />
            </label>
            <label>
              <span>Email</span>
              <input defaultValue={STORE.email} />
            </label>
          </div>
          <label>
            <span>Free delivery threshold</span>
            <input defaultValue="300" />
          </label>
          <div className={s.formActions}>
            <button type="submit" className={s.primaryBtn}>{saved ? 'Saved' : 'Save changes'}</button>
            {saved && <span className={s.savedNote}>Details updated</span>}
          </div>
        </form>
      </section>

      <div className={s.stack}>
        <section className={s.card}>
          <header className={s.cardHead}>
            <div>
              <span className={s.cardEyebrow}>Preferences</span>
              <h2>How the shop runs</h2>
            </div>
          </header>
          <ul className={s.prefs}>
            {[
              ['discreet', 'Discreet packaging on every order', 'No branding or product names on the label'],
              ['lowStockAlerts', 'Low stock alerts', 'Warn me when a piece hits its reorder point'],
              ['whatsappReceipts', 'WhatsApp receipts', 'Send order confirmations by WhatsApp'],
              ['payOnDelivery', 'Pay on delivery in Accra', 'Riders can collect momo or cash'],
              ['holdSoldOut', 'Keep sold out items listed', 'Show them greyed out instead of hiding'],
            ].map(([k, title, note]) => (
              <li key={k}>
                <div>
                  <b>{title}</b>
                  <i>{note}</i>
                </div>
                <button
                  className={`${s.switch} ${toggles[k] ? s.switchOn : ''}`}
                  onClick={() => flip(k)}
                  aria-pressed={toggles[k]}
                  aria-label={title}
                >
                  <span />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className={s.card}>
          <header className={s.cardHead}>
            <div>
              <span className={s.cardEyebrow}>Delivery</span>
              <h2>Rates</h2>
            </div>
          </header>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead><tr><th>Zone</th><th>Rate</th><th>Note</th></tr></thead>
              <tbody>
                {SHIPPING.map((r) => (
                  <tr key={r[0]}>
                    <td><b>{r[0]}</b></td>
                    <td>{r[1]}</td>
                    <td className={s.sub}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
