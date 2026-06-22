import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Video, Globe2 } from 'lucide-react';
import styles from './ValueAdds.module.css';

const ValueAdds = () => {
  return (
    <section className={`${styles.section} section-padding`} id="diaspora">
      <div className="container">
        <div className={styles.grid}>
          
          <div className={styles.content}>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={styles.subtitle}
            >
              The Trust Advantage
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={styles.title}
            >
              Seamless Investment for the <i>Diaspora</i>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={styles.description}
            >
              Distance shouldn't mean uncertainty. Our exclusive Diaspora Portal gives you complete transparency and legal security when investing in Ghanaian real estate from abroad.
            </motion.p>

            <div className={styles.features}>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={styles.feature}
              >
                <div className={styles.iconWrapper}><Video size={24} /></div>
                <div className={styles.featureText}>
                  <h4>Weekly Progress Visuals</h4>
                  <p>Log in to your private dashboard to see weekly 4K video and photo updates of your off-plan property development.</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className={styles.feature}
              >
                <div className={styles.iconWrapper}><ShieldCheck size={24} /></div>
                <div className={styles.featureText}>
                  <h4>Verified Land Titles</h4>
                  <p>Every property in our portfolio has undergone rigorous legal scrutiny. We guarantee litigation-free, verified titles.</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className={styles.feature}
              >
                <div className={styles.iconWrapper}><Globe2 size={24} /></div>
                <div className={styles.featureText}>
                  <h4>Remote Closing</h4>
                  <p>Secure digital contracts and integrated payment gateways allowing for smooth transactions in USD, GBP, or GH₵.</p>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={styles.imageSide}
          >
            <div className={styles.imageWrapper}>
              <img src="https://images.unsplash.com/photo-1558442074-3c19857bc1dc?auto=format&fit=crop&w=800&q=80" alt="Modern Interior" />
            </div>
            
            {/* Mockup of the Client Dashboard feature */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className={styles.floatingCard}
            >
              <div className={styles.cardTitle}>Cantonments Villa — Phase 2</div>
              <div className={styles.progress}>
                <div className={styles.progressFill}></div>
              </div>
              <div className={styles.status}>Roofing completed. Plastering in progress. Updated 2 hrs ago.</div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ValueAdds;
