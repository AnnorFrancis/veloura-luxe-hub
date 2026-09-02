import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo, { Sprig, Star } from './Logo';
import { FOOTER_NAV, STORE } from '../data/site';
import styles from './Footer.module.css';

const B = import.meta.env.BASE_URL || '/';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setEmail('');
    setTimeout(() => setSent(false), 3200);
  };

  return (
    <footer className={styles.footer}>
      {/* ── Newsletter ──────────────────────────────── */}
      <div className={styles.band}>
        <span
          className={styles.bandTexture}
          style={{ backgroundImage: `url(${B}backdrop/soft.webp)` }}
          aria-hidden="true"
        />
        <span className={`blob ${styles.bandBlobA}`} aria-hidden="true" />
        <span className={`blob ${styles.bandBlobB}`} aria-hidden="true" />
        <div className={`container ${styles.bandInner}`}>
          <div className={styles.bandCopy}>
            <span className="eyebrow">Join the list</span>
            <h2 className="display-md">
              First look at new arrivals,<br />
              <em className="serif-italic tinted">and the restocks.</em>
            </h2>
          </div>

          <form className={styles.form} onSubmit={submit}>
            <label className="sr-only" htmlFor="nl">Email address</label>
            <input
              id="nl"
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className={styles.formBtn}>
              {sent ? 'Welcome' : 'Subscribe'}
            </button>
          </form>
        </div>
        <Sprig className={styles.bandSprig} />
      </div>

      {/* ── Main ────────────────────────────────────── */}
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Logo variant="full" className={styles.footLogo} />
            <p className={styles.blurb}>
              Intimates and everyday essentials, chosen by hand in Accra and
              delivered discreetly across Ghana.
            </p>
            <div className={styles.contact}>
              <a href={`mailto:${STORE.email}`}>{STORE.email}</a>
              <a href={STORE.phoneHref}>{STORE.phone}</a>
              <span><Star /> {STORE.street}, {STORE.area}</span>
            </div>
            <div className={styles.social}>
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="Instagram">Instagram</a>
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="TikTok">TikTok</a>
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="WhatsApp">WhatsApp</a>
            </div>
          </div>

          {FOOTER_NAV.map((col) => (
            <nav className={styles.col} key={col.title} aria-label={col.title}>
              <h3>{col.title}</h3>
              {col.links.map((l) => (
                <Link key={l.to + l.label} to={l.to}>{l.label}</Link>
              ))}
            </nav>
          ))}
        </div>

        <div className={styles.watermark} aria-hidden="true">VELOURA</div>

        <div className={styles.bar}>
          <span>&copy; {new Date().getFullYear()} {STORE.name}, {STORE.area}</span>
          <div className={styles.pay}>
            <span>We accept</span>
            <em>MTN MoMo</em><em>Telecel Cash</em><em>Visa</em><em>Mastercard</em>
          </div>
        </div>
      </div>
    </footer>
  );
}
