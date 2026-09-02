import { Link } from 'react-router-dom';
import { Monogram } from '../components/Logo';
import { CATEGORIES } from '../data/products';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.inner}>
          <Monogram className={styles.mark} />
          <span className="eyebrow">Page not found</span>
          <h1 className="display-lg">
            This one is not<br />
            <em className="serif-italic tinted">on the rail.</em>
          </h1>
          <p className="lede">
            The page may have moved, or the link may be old. The shop is right here.
          </p>

          <div className={styles.actions}>
            <Link to="/shop" className="btn btn-primary">Go to the shop</Link>
            <Link to="/" className="link-arrow">Back home <span aria-hidden="true">&rarr;</span></Link>
          </div>

          <div className={styles.cats}>
            {CATEGORIES.map((c) => (
              <Link key={c.id} to={`/shop?cat=${c.id}`}>{c.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
