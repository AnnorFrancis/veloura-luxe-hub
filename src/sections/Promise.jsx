import { motion } from 'framer-motion';
import styles from './Promise.module.css';

const ITEMS = [
  { t: 'Free Accra delivery', s: 'On orders above GH₵ 500. Same-day for orders before 2pm.' },
  { t: 'Try before you keep', s: 'Free 7-day exchange on all shirts, trousers and shoes.' },
  { t: 'Real customer support', s: 'Call, WhatsApp or DM us — a real person replies in minutes.' },
  { t: 'Paystack secure checkout', s: 'Mobile money, cards, bank — pay how you already pay.' },
];

export default function Promise() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {ITEMS.map((it, i) => (
            <motion.div key={it.t}
              className={styles.item}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
            >
              <span className={styles.num}>0{i + 1}</span>
              <div>
                <h4>{it.t}</h4>
                <p>{it.s}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
