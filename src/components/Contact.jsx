import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import styles from './Contact.module.css';

const Contact = () => {
  return (
    <section className={`${styles.section} section-padding`} id="contact">
      <div className="container">
        <div className={styles.grid}>
          
          <div className={styles.content}>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={styles.subtitle}
            >
              Get in Touch
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={styles.title}
            >
              Start Your <i>Journey</i>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={styles.description}
            >
              Whether you are looking for an investment property, a family home, or need comprehensive diaspora management services, our expert team is ready to assist you.
            </motion.p>

            <div className={styles.contactInfo}>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={styles.infoItem}
              >
                <div className={styles.iconWrapper}><MapPin size={24} /></div>
                <div className={styles.infoText}>
                  <h4>Our Office</h4>
                  <p>15 Independence Avenue<br />East Legon, Accra</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className={styles.infoItem}
              >
                <div className={styles.iconWrapper}><Phone size={24} /></div>
                <div className={styles.infoText}>
                  <h4>Phone</h4>
                  <p>+233 24 991 4335</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className={styles.infoItem}
              >
                <div className={styles.iconWrapper}><Mail size={24} /></div>
                <div className={styles.infoText}>
                  <h4>Email</h4>
                  <p>info@kingoforiproperties.com</p>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={styles.formBox}
          >
            <h3>Send a Message</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" required />
              </div>
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" required />
              </div>
              <div className={styles.inputGroup}>
                <label>Interest</label>
                <input type="text" placeholder="e.g. 4 Bedroom Villa in Cantonments" />
              </div>
              <div className={styles.inputGroup}>
                <label>Message</label>
                <textarea rows="4" placeholder="How can we help you?" required></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>Submit Inquiry</button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
