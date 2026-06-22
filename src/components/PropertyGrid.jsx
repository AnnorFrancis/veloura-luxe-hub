import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Droplets, Wifi, MapPin } from 'lucide-react';
import PropertyModal from './PropertyModal';
import styles from './PropertyGrid.module.css';

const properties = [
  {
    id: 1,
    title: "The Eden Penthouse",
    location: "Cantonments, Accra",
    price: "GH₵ 12,500,000",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    status: "For Sale",
    infra: ["Solar", "Polytank", "Fiber"],
    beds: 4,
    baths: 4.5,
    sqm: 450
  },
  {
    id: 2,
    title: "Trasacco Executive Villa",
    location: "East Legon, Accra",
    price: "GH₵ 18,200,000",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    status: "Verified Title",
    infra: ["Solar", "Polytank", "Fiber"],
    beds: 6,
    baths: 7,
    sqm: 850
  },
  {
    id: 3,
    title: "Airport Heights Apartment",
    location: "Airport Residential Area",
    price: "GH₵ 6,800,000",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    status: "Off-Plan",
    infra: ["Gen Set", "Polytank", "Fiber"],
    beds: 3,
    baths: 3.5,
    sqm: 220
  },
  {
    id: 4,
    title: "East Legon Hills Luxury",
    location: "East Legon Hills, Accra",
    price: "$350,000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    status: "For Sale",
    infra: ["Solar", "Polytank"],
    beds: 4,
    baths: 4.5,
    sqm: 320
  },
  {
    id: 5,
    title: "Lakeside Modern Home",
    location: "Lakeside/Adenta",
    price: "GH₵ 2,000,000",
    image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=800&q=80",
    status: "New Build",
    infra: ["Fiber"],
    beds: 3,
    baths: 3,
    sqm: 200
  },
  {
    id: 6,
    title: "Ashaley Botwe Resale",
    location: "Ashaley Botwe",
    price: "GH₵ 1,600,000",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    status: "Resale",
    infra: ["Polytank"],
    beds: 3,
    baths: 2.5,
    sqm: 180
  }
];

const PropertyGrid = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  return (
    <>
      <section className={`${styles.section} section-padding`} id="properties">
        <div className="container">
          <div className={styles.header}>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={styles.title}
            >
              Exclusive <i>Listings</i>
            </motion.h2>
            <div className={styles.filters}>
              <button className={`${styles.filterBtn} ${styles.active}`}>All</button>
              <button className={styles.filterBtn}>Cantonments</button>
              <button className={styles.filterBtn}>East Legon</button>
            </div>
          </div>

          <div className={styles.grid}>
            {properties.map((prop, index) => (
              <motion.div 
                key={prop.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className={styles.card}
                onClick={() => setSelectedProperty(prop)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.imageWrapper}>
                  <img src={prop.image} alt={prop.title} />
                  <span className={styles.badge}>{prop.status}</span>
                </div>
                <div className={styles.content}>
                  <div className={styles.price}>{prop.price}</div>
                  <h3 className={styles.titleCard}>{prop.title}</h3>
                  <div className={styles.location}>
                    <MapPin size={16} /> {prop.location}
                  </div>
                  <div className={styles.infraTags}>
                    {prop.infra.includes("Solar") && (
                      <span className={styles.tag}><Sun /> Solar Setup</span>
                    )}
                    {prop.infra.includes("Polytank") && (
                      <span className={styles.tag}><Droplets /> Reserve Water</span>
                    )}
                    {prop.infra.includes("Fiber") && (
                      <span className={styles.tag}><Wifi /> Fiber Ready</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProperty && (
          <PropertyModal 
            property={selectedProperty} 
            onClose={() => setSelectedProperty(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyGrid;
