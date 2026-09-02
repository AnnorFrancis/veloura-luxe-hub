import { Star } from './Logo';
import styles from './Marquee.module.css';

export default function Marquee({ items, speed = 42, tone = 'rose' }) {
  const run = [...items, ...items];
  return (
    <div className={styles.wrap} data-tone={tone} aria-hidden="true">
      <div className={styles.track} style={{ '--dur': `${speed}s` }}>
        {[0, 1].map((copy) => (
          <div className={styles.group} key={copy}>
            {run.map((t, n) => (
              <span className={styles.item} key={`${copy}-${n}`}>
                {t}
                <Star className={styles.star} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
