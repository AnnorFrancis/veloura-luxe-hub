import { useState } from 'react';
import PageHero from '../components/PageHero';
import { Star } from '../components/Logo';
import { EDITORIAL } from '../data/products';
import { STORE } from '../data/site';
import { useReveal } from '../hooks/useMotionKit';
import styles from './Contact.module.css';

const TOPICS = ['Size & fit', 'An order', 'Wholesale', 'Something else'];

export default function Contact() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [sent, setSent] = useState(false);
  const ref = useReveal();

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    e.target.reset();
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className={styles.page} ref={ref}>
      <PageHero
        eyebrow="Say hello"
        title="Come get"
        accent="measured."
        lede="Walk into the Osu shop, message us on WhatsApp, or send a note below. We answer within the hour on working days."
        tone="mint"
        media="contact"
        crumbs={[{ label: 'Contact' }]}
      />

      <section className={styles.body}>
        <div className="container">
          <div className={styles.grid}>
            {/* ── Form ───────────────────────────── */}
            <div className={`${styles.formCard} reveal`}>
              <form onSubmit={submit}>
                <div className={styles.topics}>
                  <span className={styles.label}>I’m asking about</span>
                  <div className={styles.topicRow}>
                    {TOPICS.map((t) => (
                      <button
                        type="button"
                        key={t}
                        className={`${styles.topic} ${topic === t ? styles.topicOn : ''}`}
                        onClick={() => setTopic(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.row}>
                  <label className={styles.field}>
                    <span className={styles.label}>Name</span>
                    <input type="text" name="name" required placeholder="Ama Mensah" />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>Phone</span>
                    <input type="tel" name="phone" required placeholder="+233 20 000 0000" />
                  </label>
                </div>

                <label className={styles.field}>
                  <span className={styles.label}>Email</span>
                  <input type="email" name="email" required placeholder="you@email.com" />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Message</span>
                  <textarea name="message" rows="5" required placeholder="Tell us what you are looking for…" />
                </label>

                <button type="submit" className={`btn btn-primary ${styles.submit}`}>
                  {sent ? 'Message sent ✓' : 'Send message'}
                </button>
                {sent && (
                  <p className={styles.sentNote}>
                    <Star /> Thank you. This is a design sample, so nothing was actually sent.
                  </p>
                )}
              </form>
            </div>

            {/* ── Side ───────────────────────────── */}
            <aside className={styles.side}>
              <figure className={`${styles.shot} reveal`}>
                <img src={EDITORIAL.fitting} alt="Fitting room at the Osu shop" loading="lazy" />
                <figcaption>The fitting room · Osu</figcaption>
              </figure>

              <div className={`${styles.card} reveal`} data-tone="rose">
                <h3>Visit the shop</h3>
                <p>{STORE.street}<br />{STORE.area}</p>
                <a href="https://maps.google.com/?q=Oxford+Street+Osu+Accra" target="_blank" rel="noreferrer" className="link-arrow">
                  Open in Maps <span aria-hidden="true">→</span>
                </a>
              </div>

              <div className={`${styles.card} reveal`} data-tone="mint">
                <h3>Opening hours</h3>
                <dl className={styles.hours}>
                  {STORE.hours.map(([d, h]) => (
                    <div key={d}><dt>{d}</dt><dd>{h}</dd></div>
                  ))}
                </dl>
              </div>

              <div className={`${styles.card} reveal`} data-tone="sea">
                <h3>Reach us directly</h3>
                <div className={styles.links}>
                  <a href={STORE.phoneHref}>{STORE.phone}</a>
                  <a href={`mailto:${STORE.email}`}>{STORE.email}</a>
                  <a href="#" onClick={(e) => e.preventDefault()}>WhatsApp us</a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
