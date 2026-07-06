import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './Loader.module.css';

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const duration = 1300;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      setProgress(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onComplete, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <motion.div
      className={styles.loader}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.center}>
        <div className={styles.wordmark}>META MEN</div>
        <div className={styles.progressWrap}>
          <div className={styles.progressBar} style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>
    </motion.div>
  );
}
