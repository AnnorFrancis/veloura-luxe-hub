import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { Star } from '../components/Logo';
import { useReveal } from '../hooks/useMotionKit';
import { SIZE_GUIDE, DELIVERY, CARE, FAQ, LEGAL, STORE } from '../data/site';
import styles from './Help.module.css';

/* One layout serves every help page. Each page below feeds it content. */
function Shell({ page, tone, crumb, media, children }) {
  const ref = useReveal();
  return (
    <div className={styles.page} ref={ref}>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        lede={page.lede}
        tone={tone}
        media={media}
        crumbs={[{ label: crumb }]}
      />
      <section className={styles.body}>
        <div className="container">
          <div className={styles.layout}>
            <div className={styles.main}>{children}</div>

            <aside className={styles.aside}>
              <figure className={`${styles.shot} reveal`}>
                <img src={page.hero} alt="" loading="lazy" />
              </figure>
              <div className={`${styles.helpCard} reveal`}>
                <Star className={styles.helpStar} />
                <h3>Still unsure?</h3>
                <p>Message us on WhatsApp and a real person will answer, usually within the hour.</p>
                <a href={STORE.phoneHref} className="btn btn-primary">Talk to us</a>
                <Link to="/contact" className="link-arrow">Visit the shop <span aria-hidden="true">&rarr;</span></Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Size guide ─────────────────────────────────────────── */
export function SizeGuide() {
  return (
    <Shell page={SIZE_GUIDE} tone="rose" crumb="Size guide" media="fit">
      {SIZE_GUIDE.tables.map((t) => (
        <div className={`${styles.block} reveal`} key={t.caption}>
          <h2 className={styles.h2}>{t.caption}</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>{t.head.map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {t.rows.map((r) => (
                  <tr key={r[0]}>
                    {r.map((cell, i) => (i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <ul className={`${styles.notes} reveal`}>
        {SIZE_GUIDE.notes.map((n) => (
          <li key={n}><Star /> {n}</li>
        ))}
      </ul>
    </Shell>
  );
}

/* ── Delivery ───────────────────────────────────────────── */
export function Delivery() {
  return (
    <Shell page={DELIVERY} tone="sea" crumb="Delivery & returns" media="parcel">
      {DELIVERY.sections.map((s) => (
        <div className={`${styles.block} reveal`} key={s.h}>
          <h2 className={styles.h2}>{s.h}</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Where</th><th>How long</th><th>Cost</th></tr>
              </thead>
              <tbody>
                {s.rows.map((r) => (
                  <tr key={r[0]}>
                    <th scope="row">{r[0]}</th>
                    <td>{r[1]}</td>
                    <td className={styles.num}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {DELIVERY.blocks.map((b) => (
        <div className={`${styles.block} reveal`} key={b.h}>
          <h2 className={styles.h2}>{b.h}</h2>
          {b.p.map((t) => <p key={t} className={styles.p}>{t}</p>)}
        </div>
      ))}
    </Shell>
  );
}

/* ── Care ───────────────────────────────────────────────── */
export function Care() {
  return (
    <Shell page={CARE} tone="mint" crumb="Care guide" media="care">
      {CARE.blocks.map((b, i) => (
        <div className={`${styles.block} reveal`} key={b.h}>
          <span className={styles.num2}>{String(i + 1).padStart(2, '0')}</span>
          <h2 className={styles.h2}>{b.h}</h2>
          {b.p.map((t) => <p key={t} className={styles.p}>{t}</p>)}
        </div>
      ))}
    </Shell>
  );
}

/* ── FAQ ────────────────────────────────────────────────── */
function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className={styles.acc}>
      {items.map((it, i) => (
        <div className={`${styles.accItem} ${open === i ? styles.accOpen : ''}`} key={it.q}>
          <button
            className={styles.accHead}
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
          >
            <span>{it.q}</span>
            <i aria-hidden="true" />
          </button>
          <div className={styles.accBody} hidden={open !== i}>
            <p>{it.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Faq() {
  return (
    <Shell page={FAQ} tone="sun" crumb="FAQ" media="soft">
      {FAQ.groups.map((g) => (
        <div className={`${styles.block} reveal`} key={g.title}>
          <h2 className={styles.h2}>{g.title}</h2>
          <Accordion items={g.items} />
        </div>
      ))}
    </Shell>
  );
}

/* ── Legal ──────────────────────────────────────────────── */
export function Legal() {
  return (
    <Shell page={LEGAL} tone="mint" crumb="Terms & privacy" media="sea">
      {LEGAL.blocks.map((b) => (
        <div className={`${styles.block} reveal`} key={b.h}>
          <h2 className={styles.h2}>{b.h}</h2>
          {b.p.map((t) => <p key={t} className={styles.p}>{t}</p>)}
        </div>
      ))}
      <p className={`${styles.stamp} reveal`}>Last updated 31 August 2026</p>
    </Shell>
  );
}
