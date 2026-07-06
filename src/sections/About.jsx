import { motion } from 'framer-motion';
import { EDITORIAL } from '../data/products';
import styles from './About.module.css';

export default function About() {
  return (
    <section className={`section-padding ${styles.section}`}>
      <div className="container">
        <div className={styles.grid}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.mediaCol}
          >
            <div className={styles.media}>
              <img src={EDITORIAL.wave} alt="Wave Zip Polo" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={styles.textCol}
          >
            <span className="eyebrow">About</span>
            <h2 className={styles.title}>
              Made for Ghanaian men,<br/>with the care they deserve.
            </h2>
            <p>
              We started META Men because the Ghanaian man deserves better than
              a mall rack. Every piece we sell is chosen by hand — for fit, for
              fabric, for how it wears in Accra heat.
            </p>
            <p>
              Whether you are heading to church, a wedding at Kempinski,
              or a Saturday at Labadi, we want you to leave the house
              feeling put together. That's the whole point.
            </p>

            <div className={styles.stats}>
              <div><strong>3</strong><span>Years serving Accra</span></div>
              <div><strong>1,200+</strong><span>Men dressed</span></div>
              <div><strong>4.9</strong><span>Google rating</span></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
