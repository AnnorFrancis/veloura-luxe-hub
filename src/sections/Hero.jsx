import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HERO_PORTRAIT } from '../data/products';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.grid}>
        <div className={styles.textCol}>
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Menswear · Accra
          </motion.span>

          <h1 className={styles.title}>
            <span className={styles.line}>
              <motion.span
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={styles.inner}
              >Well-dressed men,</motion.span>
            </span>
            <span className={styles.line}>
              <motion.span
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className={styles.inner}
              >always.</motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className={styles.lede}
          >
            Considered shirts, trousers, shoes and fragrance — made for the
            Ghanaian man who cares how he shows up.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className={styles.actions}
          >
            <Link to="/collections" className={styles.primary}>Shop the collection</Link>
            <Link to="/contact" className={styles.link}>Book a fitting →</Link>
          </motion.div>
        </div>

        <motion.div
          className={styles.mediaCol}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.mediaWrap}>
            <img src={HERO_PORTRAIT} alt="Ocean Stripe Knit Polo" />
          </div>
          <div className={styles.mediaCaption}>
            <span>Featured</span>
            <p>Ocean Stripe Knit Polo — GH₵ 420</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
