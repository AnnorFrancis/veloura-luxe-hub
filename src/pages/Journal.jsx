import { Link, useParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { JOURNAL, findPost } from '../data/site';
import { useReveal } from '../hooks/useMotionKit';
import { Star } from '../components/Logo';
import styles from './Journal.module.css';

/* ── Index ──────────────────────────────────────────────── */
export function Journal() {
  const ref = useReveal();
  const [lead, ...rest] = JOURNAL;

  return (
    <div className={styles.page} ref={ref}>
      <PageHero
        eyebrow="Journal"
        title="Fit, care and"
        accent="what actually lasts."
        lede="Short, practical notes from the fitting room. No filler."
        tone="mint"
        media="journal"
        crumbs={[{ label: 'Journal' }]}
      />

      <section className={styles.body}>
        <div className="container">
          <Link to={`/journal/${lead.slug}`} className={`${styles.lead} reveal`}>
            <span className={styles.leadMedia}>
              <img src={lead.image} alt={lead.title} loading="lazy" />
            </span>
            <span className={styles.leadCopy}>
              <span className={styles.meta}>
                <b>{lead.cat}</b>
                <i>{lead.date}</i>
                <i>{lead.read} read</i>
              </span>
              <h2 className="display-md">{lead.title}</h2>
              <p>{lead.excerpt}</p>
              <span className="link-arrow">Read it <span aria-hidden="true">&rarr;</span></span>
            </span>
          </Link>

          <div className={styles.grid}>
            {rest.map((post, i) => (
              <Link
                to={`/journal/${post.slug}`}
                className={`${styles.card} reveal`}
                key={post.slug}
                style={{ transitionDelay: `${(i % 3) * 70}ms` }}
              >
                <span className={styles.cardMedia}>
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
    </div>
  );
}

/* ── Article ────────────────────────────────────────────── */
export function JournalPost() {
  const { slug } = useParams();
  const post = findPost(slug);
  const ref = useReveal();

  if (!post) {
    return (
      <div className={styles.missing}>
        <div className="container">
          <h1 className="display-lg">That note has moved.</h1>
          <Link to="/journal" className="btn btn-primary">Back to the journal</Link>
        </div>
      </div>
    );
  }

  const more = JOURNAL.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <article className={styles.article} ref={ref} key={slug}>
      <PageHero
        eyebrow={post.cat}
        title={post.title}
        lede={post.excerpt}
        tone="mint"
        media="journal"
        crumbs={[{ label: 'Journal', to: '/journal' }, { label: post.title }]}
      >
        <span className={styles.byline}>
          <Star /> {post.date} · {post.read} read
        </span>
      </PageHero>

      <div className="container">
        <figure className={`${styles.hero} reveal`}>
          <img src={post.image} alt={post.title} />
        </figure>

        <div className={`${styles.prose} reveal`}>
          {post.body.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>

        <div className={`${styles.cta} reveal`}>
          <div>
            <span className="eyebrow">Need a hand?</span>
            <h2 className="display-md">We will size you in fifteen minutes.</h2>
          </div>
          <Link to="/contact" className="btn btn-primary">Book a fitting</Link>
        </div>

        <section className={styles.more}>
          <h2 className={styles.moreHead}>Keep reading</h2>
          <div className={styles.grid}>
            {more.map((p) => (
              <Link to={`/journal/${p.slug}`} className={styles.card} key={p.slug}>
                <span className={styles.cardMedia}>
                  <img src={p.image} alt={p.title} loading="lazy" />
                </span>
                <span className={styles.meta}>
                  <b>{p.cat}</b>
                  <i>{p.read} read</i>
                </span>
                <h3>{p.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
