import React from 'react';
import { motion } from 'framer-motion';
import styles from './Hero3D.module.css';

const Hero3D = () => {
  return (
    <section className={styles.hero}>
      {/* Editorial Image Collage Background */}
      <div className={styles.visualsContainer}>
        {/* Main large image */}
        <motion.div 
          className={styles.imageMain}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80" alt="Luxury Villa" />
        </motion.div>

        {/* Floating secondary image (Top Right) */}
        <motion.div 
          className={styles.imageSecondary1}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: [-10, 10, -10] }}
          transition={{ 
            opacity: { duration: 1, delay: 0.5 },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80" alt="Interior Details" />
        </motion.div>

        {/* Floating secondary image (Bottom Left) */}
        <motion.div 
          className={styles.imageSecondary2}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: [10, -10, 10] }}
          transition={{ 
            opacity: { duration: 1, delay: 0.8 },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }
          }}
        >
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" alt="Modern Architecture" />
        </motion.div>
        
        {/* Verification Badge */}
        <motion.div 
          className={styles.trustBadge}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2, type: "spring" }}
        >
          <div className={styles.badgeInner}>
            <span className={styles.badgeStar}>★</span>
            <span className={styles.badgeText}>Verified Titles</span>
          </div>
        </motion.div>
      </div>

      {/* UI Overlay */}
      <div className={styles.overlay}>
        <div className={styles.content}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={styles.badge}
          >
            Premium Ghanaian Real Estate
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={styles.title}
          >
            <span>Elevating Living</span>
            <span>in <i>Ghana</i></span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={styles.description}
          >
            Curating the finest properties across Cantonments, East Legon, and Airport Residential. Designed for the local elite and the returning diaspora.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={styles.ctaGroup}
          >
            <a href="#properties" className={styles.primaryBtn} style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>Explore Properties</a>
            <a href="#diaspora" className={styles.secondaryBtn} style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>Diaspora Services</a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero3D;
