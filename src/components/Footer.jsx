import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <div className={styles.logo}>META MEN</div>
            <p className={styles.blurb}>
              Considered menswear from Accra. Shirts, trousers, shoes and fragrance
              — chosen by hand, delivered to your door.
            </p>
            <div className={styles.contact}>
              <a href="mailto:hello@metamen.co">hello@metamen.co</a>
              <a href="tel:+233559990102">+233 55 999 0102</a>
              <span>15 Ring Road · Osu, Accra</span>
            </div>
          </div>

          <div className={styles.col}>
            <h4>Shop</h4>
            <Link to="/collections?cat=shirts">Shirts & Polos</Link>
            <Link to="/collections?cat=trousers">Trousers</Link>
            <Link to="/collections?cat=shoes">Shoes & Sandals</Link>
            <Link to="/collections?cat=fragrance">Fragrance</Link>
            <Link to="/collections?cat=accessories">Accessories</Link>
          </div>

          <div className={styles.col}>
            <h4>Support</h4>
            <a href="#">Size guide</a>
            <a href="#">Delivery & returns</a>
            <a href="#">Care instructions</a>
            <Link to="/contact">Contact us</Link>
          </div>

          <div className={styles.col}>
            <h4>Follow</h4>
            <a href="#">Instagram</a>
            <a href="#">TikTok</a>
            <a href="#">WhatsApp</a>
          </div>
        </div>

        <div className={styles.bar}>
          <span>© {new Date().getFullYear()} META Men · Accra, Ghana</span>
          <div className={styles.pay}>
            <span>We accept</span>
            <em>Visa</em><em>Mastercard</em><em>MTN MoMo</em><em>Vodafone Cash</em>
          </div>
        </div>
      </div>
    </footer>
  );
}
