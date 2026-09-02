import { Link } from 'react-router-dom';
import Aurora from './Aurora';
import { Sprig } from './Logo';
import styles from './PageHero.module.css';

const B = import.meta.env.BASE_URL || '/';

const PALETTES = {
  rose: ['#FFD9C6', '#C7E8F0', '#FBD3DC', '#FFFCFA'],
  mint: ['#CFEBDD', '#FFD9C6', '#C7E8F0', '#FFFCFA'],
  sea: ['#C7E8F0', '#CFEBDD', '#FFE6D6', '#FFFCFA'],
  sun: ['#FFEFC9', '#FFD9C6', '#CFEBDD', '#FFFCFA'],
};

/**
 * The header every inner page opens with. One title, one sentence, and a
 * photograph behind it so no page ever opens on flat colour. The wash holds
 * the left side near-solid, which is where the words live.
 */
export default function PageHero({
  eyebrow,
  title,
  accent,
  lede,
  tone = 'rose',
  media,
  crumbs,
  children,
}) {
  return (
    <header className={`${styles.hero} ${media ? styles.hasMedia : ''}`}>
      {media ? (
        <>
          <div
            className={styles.bg}
            style={{ backgroundImage: `url(${B}backdrop/${media}.webp)` }}
            aria-hidden="true"
          />
          <div className={styles.wash} aria-hidden="true" />
        </>
      ) : (
        <Aurora className={styles.aurora} palette={PALETTES[tone] || PALETTES.rose} intensity={0.55} />
      )}

      <div className={`container ${styles.inner}`}>
        {crumbs && (
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label}>
                <i aria-hidden="true">/</i>
                {c.to ? <Link to={c.to}>{c.label}</Link> : <b>{c.label}</b>}
              </span>
            ))}
          </nav>
        )}

        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className={`display-xl ${styles.title}`}>
          {title}
          {accent && (
            <>
              {' '}
              <em className="serif-italic tinted">{accent}</em>
            </>
          )}
        </h1>
        {lede && <p className={`lede ${styles.lede}`}>{lede}</p>}
        {children}
        <Sprig className={styles.sprig} />
      </div>
    </header>
  );
}
