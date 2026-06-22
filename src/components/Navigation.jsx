import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import styles from './Navigation.module.css';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.logo}>
          <span className={styles.logoText}>KING OFORI</span>
          <span className={styles.logoDot}></span>
        </div>
        
        <div className={styles.links}>
          <a href="#properties" className={styles.link}>Properties</a>
          <a href="#diaspora" className={styles.link}>Diaspora Portal</a>
          <a href="#about" className={styles.link}>About Us</a>
        </div>

        <a href="#contact" className={styles.cta} style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>Book Consultation</a>

        <button 
          className={styles.hamburger} 
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={28} color="var(--accent-forest)" />
        </button>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className={styles.mobileMenu}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          >
            <button 
              className={styles.mobileClose} 
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={32} color="var(--surface-white)" />
            </button>
            
            <div className={styles.mobileLinks}>
              <a href="#properties" onClick={() => setMobileMenuOpen(false)}>Properties</a>
              <a href="#diaspora" onClick={() => setMobileMenuOpen(false)}>Diaspora Portal</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)}>About Us</a>
            </div>
            
            <a href="#contact" className={styles.mobileCta} onClick={() => setMobileMenuOpen(false)} style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>Book Consultation</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
