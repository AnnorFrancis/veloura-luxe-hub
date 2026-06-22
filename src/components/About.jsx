import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import styles from './About.module.css';

const About = () => {
  return (
    <section className={`${styles.section} section-padding`} id="about">
      <div className="container">
        <div className={styles.grid}>
          
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={styles.imageSide}
          >
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" 
              alt="Luxury Ghanaian Villa" 
              className={styles.mainImage} 
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className={styles.overlayBox}
            >
              <div className={styles.statNumber}>15+</div>
              <div className={styles.statText}>Years Dominating Prime Accra Real Estate</div>
            </motion.div>
          </motion.div>

          <div className={styles.content}>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={styles.subtitle}
            >
              Since 2009
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={styles.title}
            >
              Setting the Standard in <i>Ghana</i>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={styles.description}
            >
              King Ofori Real Estate is not just a brokerage; we are custodians of Ghana's most exclusive properties. With over 15 years of experience, we bridge the gap between local market nuances and international luxury standards.
            </motion.p>

            <ul className={styles.list}>
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={styles.listItem}
              >
                <CheckCircle2 size={20} className={styles.icon} /> <strong>Markets:</strong> Accra, Kumasi, Tema, Takoradi
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className={styles.listItem}
              >
                <CheckCircle2 size={20} className={styles.icon} /> <strong>Segments:</strong> Residential, Commercial, Land & Plots
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className={styles.listItem}
              >
                <CheckCircle2 size={20} className={styles.icon} /> Rigorous legal title verification
              </motion.li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
