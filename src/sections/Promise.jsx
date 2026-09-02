import { useReveal } from '../hooks/useMotionKit';
import styles from './Promise.module.css';

const ITEMS = [
  {
    t: 'Free Accra delivery',
    s: 'On every order above GH₵ 300. Same-day dispatch before 2pm.',
    tone: 'peach',
    icon: (
      <>
        <path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" />
      </>
    ),
  },
  {
    t: 'Discreet packaging',
    s: 'Plain outer wrap, no branding, no description on the label.',
    tone: 'sea',
    icon: (
      <>
        <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5z" /><path d="M12 12v8" /><path d="m4 8.5 8 3.5 8-3.5" />
      </>
    ),
  },
  {
    t: 'Fitted, not guessed',
    s: 'Send a photo or come in and we will size you properly, XS to 3XL.',
    tone: 'mint',
    icon: (
      <>
        <path d="M4 7h16v10H4z" /><path d="M8 7v3M12 7v5M16 7v3" />
      </>
    ),
  },
  {
    t: 'Pay how you pay',
    s: 'MTN MoMo, Telecel Cash, card or bank transfer at checkout.',
    tone: 'sun',
    icon: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /><path d="M7 15h4" />
      </>
    ),
  },
];

export default function Promise() {
  const ref = useReveal();
  return (
    <section className={styles.section} ref={ref}>
      <div className="container">
        <div className={styles.grid}>
          {ITEMS.map((it, i) => (
            <article
              key={it.t}
              className={`${styles.item} reveal`}
              data-tone={it.tone}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.icon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                     strokeLinecap="round" strokeLinejoin="round">
                  {it.icon}
                </svg>
              </span>
              <h3>{it.t}</h3>
              <p>{it.s}</p>
              <span className={styles.sheen} aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
