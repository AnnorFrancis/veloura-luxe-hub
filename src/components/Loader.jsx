import { useEffect, useState } from 'react';
import Logo, { Sprig, Star } from './Logo';
import styles from './Loader.module.css';

const FILL_MS = 1900;   // wordmark ink-in
const EXIT_MS = 900;    // curtain split (CSS keyframe)
const BAIL_MS = 4600;   // absolute ceiling

/**
 * The entry curtain.
 *
 * Nothing here waits on an animation to finish. The exit is a CSS keyframe
 * and the unmount is a `setTimeout`, so a throttled rAF, a backgrounded
 * tab, low-power mode, a slow phone, can never leave the curtain stuck
 * over the page.
 */
export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let raf;
    let exitTimer;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (t) => {
      const p = Math.min(1, (t - start) / FILL_MS);
      setProgress(Math.round(ease(p) * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setLeaving(true);
        exitTimer = setTimeout(onComplete, EXIT_MS);
      }
    };
    raf = requestAnimationFrame(tick);

    // Belt and braces: lift the curtain no matter what happened above.
    const bail = setTimeout(onComplete, BAIL_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      clearTimeout(bail);
    };
  }, [onComplete]);

  return (
    <div className={`${styles.loader} ${leaving ? styles.leaving : ''}`} aria-hidden="true">
      <span className={`${styles.panel} ${styles.panelTop}`} />
      <span className={`${styles.panel} ${styles.panelBottom}`} />

      <div className={styles.aurora}>
        <span className={`blob ${styles.b1}`} />
        <span className={`blob ${styles.b2}`} />
        <span className={`blob ${styles.b3}`} />
      </div>

      <div className={styles.center}>
        <Sprig className={styles.sprigTop} />

        <div className={styles.markWrap}>
          <span className={styles.markGhost}>
            <Logo variant="full" className={styles.markArt} priority />
          </span>
          <span className={styles.markFill} style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}>
            <Logo variant="full" className={styles.markArt} priority />
          </span>
        </div>

        <div className={styles.meta}>
          <span className={styles.tagline}>
            <Star className={styles.star} /> Osu, Accra
          </span>
          <span className={styles.count}>{String(progress).padStart(3, '0')}</span>
        </div>

        <div className={styles.track}>
          <span className={styles.fill} style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>
    </div>
  );
}
