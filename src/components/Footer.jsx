import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              KING OFORI PROPERTIES <span className={styles.logoDot}></span>
            </div>
            <p className={styles.description}>
              Ghana's premier luxury real estate agency. Specializing in prime residential, commercial, and land properties across Accra, Kumasi, Tema, and Takoradi since 2009.
            </p>
          </div>
          
          <div className={styles.column}>
            <h4>Services</h4>
            <div className={styles.links}>
              <a href="#">Residential Sales</a>
              <a href="#">Commercial Properties</a>
              <a href="#">Land & Plots</a>
              <a href="#">Diaspora Management</a>
            </div>
          </div>
          
          <div className={styles.column}>
            <h4>Contact & Socials</h4>
            <div className={styles.links}>
              <a href="mailto:info@kingoforiproperties.com">info@kingoforiproperties.com</a>
              <a href="tel:+233249914335">+233 24 991 4335</a>
              <a href="#">15 Independence Avenue, East Legon</a>
              <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                <a href="#">Facebook</a> | <a href="#">LinkedIn</a> | <a href="#">Instagram</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <div>&copy; {new Date().getFullYear()} King Ofori Real Estate. All rights reserved.</div>
          <div>Designed to Convert.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
