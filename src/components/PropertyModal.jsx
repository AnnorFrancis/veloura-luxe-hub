import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Sun, Droplets, Wifi } from 'lucide-react';
import styles from './PropertyModal.module.css';

const PropertyModal = ({ property, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!property) return null;

  return (
    <motion.div 
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className={styles.modal}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>

        <img src={property.image} alt={property.title} className={styles.heroImage} />

        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.price}>{property.price}</div>
            <h2 className={styles.title}>{property.title}</h2>
            <div className={styles.location}>
              <MapPin size={18} /> {property.location}
            </div>
          </div>

          <div className={styles.specs}>
            <div className={styles.specItem}>
              <span className={styles.specValue}>{property.beds || 4}</span>
              <span className={styles.specLabel}>Bedrooms</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specValue}>{property.baths || 4.5}</span>
              <span className={styles.specLabel}>Bathrooms</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specValue}>{property.sqm || 450}</span>
              <span className={styles.specLabel}>Square Meters</span>
            </div>
          </div>

          <p className={styles.description}>
            {property.description || "This stunning property offers the pinnacle of luxury living in Accra. Featuring state-of-the-art finishes, expansive living spaces, and world-class amenities. Perfect for high-net-worth individuals or diplomats seeking security, prestige, and comfort."}
          </p>

          <div className={styles.infraTags}>
            {property.infra.includes("Solar") && (
              <span className={styles.tag}><Sun size={18} /> Full Solar/Inverter System</span>
            )}
            {property.infra.includes("Polytank") && (
              <span className={styles.tag}><Droplets size={18} /> 10,000L Reserve Water</span>
            )}
            {property.infra.includes("Fiber") && (
              <span className={styles.tag}><Wifi size={18} /> Fiber Optic Internet Ready</span>
            )}
          </div>

          <div className={styles.contactForm}>
            <h3>Inquire About This Property</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className={styles.inputGroup}>
                <input type="text" placeholder="Full Name" required />
              </div>
              <div className={styles.inputGroup}>
                <input type="email" placeholder="Email Address" required />
              </div>
              <div className={styles.inputGroup}>
                <textarea placeholder="Your Message" rows="4" required></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>Send Inquiry</button>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PropertyModal;
