import { Link } from 'react-router-dom';
import { JOURNAL } from '../data/site';
import { useReveal } from '../hooks/useMotionKit';
import styles from './JournalStrip.module.css';

export default function JournalStrip() {
  const ref = useReveal();
  const posts = JOURNAL.slice(0, 3);

  return (
    <section className={`section-padding ${styles.section}`} ref={ref}>
      <div className="container">
        <header className={styles.head}>
          <div className="reveal">
            <span className="eyebrow">Journal</span>
            <h2 className={`display-lg ${styles.title}`}>
              Notes from the<br />
              <em className="serif-italic tinted">fitting room.</em>
            </h2>
          </div>
          <Link to="/journal" className={`link-arrow ${styles.all}`}>
            All notes <span aria-hidden="true">&rarr;</span>
          </Link>
        </header>

        <div className={styles.grid}>
          {posts.map((post, i) => (
            <Link
              to={`/journal/${post.slug}`}
              className={`${styles.card} reveal`}
              key={post.slug}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className={styles.media}>
                <img src={post.image} alt={post.title} loading="lazy" />
              </span>
              <span className={styles.meta}>
                <b>{post.cat}</b>
                <i>{post.read} read</i>
              </span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
