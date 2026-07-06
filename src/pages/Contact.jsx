import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Contact.module.css';

const REASONS = [
  { id: 'order', label: 'Order or delivery' },
  { id: 'sizing', label: 'Sizing help' },
  { id: 'appointment', label: 'Book an appointment' },
  { id: 'wholesale', label: 'Wholesale' },
  { id: 'other', label: 'Something else' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', reason: 'order', message: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const submit = (e) => {
    e.preventDefault();
    setStatus('sent');
    setTimeout(() => {
      setStatus('idle');
      setForm({ name: '', email: '', phone: '', reason: 'order', message: '' });
    }, 3200);
  };

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="page">
      <section className={styles.hero}>
        <div className="container">
          <span className="eyebrow">Contact</span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={styles.title}
          >
            We reply fast.
          </motion.h1>
          <p className={styles.lede}>
            Call, WhatsApp, or fill out the form. A real person on our team will get
            back to you within a few hours during business days.
          </p>
        </div>
      </section>

      <section className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={styles.form}
            >
              <div className={styles.grid2}>
                <label className={styles.field}>
                  <span>Name</span>
                  <input type="text" required value={form.name} onChange={update('name')} placeholder="Your name" />
                </label>
                <label className={styles.field}>
                  <span>Email</span>
                  <input type="email" required value={form.email} onChange={update('email')} placeholder="you@somewhere.com" />
                </label>
              </div>
              <label className={styles.field}>
                <span>Phone (optional)</span>
                <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+233 55 ..." />
              </label>

              <div className={styles.reasons}>
                <span className={styles.reasonLabel}>How can we help?</span>
                <div className={styles.chips}>
                  {REASONS.map(r => (
                    <button key={r.id} type="button"
                      onClick={() => setForm(f => ({ ...f, reason: r.id }))}
                      className={`${styles.chip} ${form.reason === r.id ? styles.chipOn : ''}`}
                    >{r.label}</button>
                  ))}
                </div>
              </div>

              <label className={styles.field}>
                <span>Message</span>
                <textarea rows="6" required value={form.message} onChange={update('message')}
                  placeholder="Tell us what you need." />
              </label>

              <button type="submit" className={styles.submit}>
                {status === 'sent' ? 'Thanks — we\'ll get back to you' : 'Send message'}
              </button>
            </motion.form>

            <aside className={styles.aside}>
              <div className={styles.block}>
                <span className="eyebrow">Straight to us</span>
                <a href="mailto:hello@metamen.co" className={styles.big}>hello@metamen.co</a>
                <a href="tel:+233559990102" className={styles.medium}>+233 55 999 0102</a>
                <a href="#" className={styles.medium}>Chat on WhatsApp</a>
              </div>

              <div className={styles.block}>
                <span className="eyebrow">Visit</span>
                <div className={styles.loc}>
                  <h4>Osu, Accra</h4>
                  <p>15 Ring Road<br/>Opposite Frankie's</p>
                  <span>Mon–Sat · 9am–7pm</span>
                </div>
              </div>

              <div className={styles.block}>
                <span className="eyebrow">Follow</span>
                <div className={styles.social}>
                  <a href="#">Instagram — <em>@metamen.co</em></a>
                  <a href="#">TikTok — <em>@metamen.co</em></a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
