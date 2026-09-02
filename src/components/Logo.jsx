import { useId } from 'react';
import styles from './Logo.module.css';

const B = import.meta.env.BASE_URL || '/';

/**
 * The brand artwork, used as supplied by the client. Three cuts of the one
 * original file so the lockup never has to be squeezed into a shape it was
 * not drawn for:
 *
 *   lockup  mark beside the wordmark, for bars and other short spaces
 *   full    the original artwork, for footers, covers and quiet moments
 *   mark    the figure alone, for tight corners and the app icon
 */
const ART = {
  lockup: { file: 'veloura-lockup', w: 700, h: 280 },
  full: { file: 'veloura-logo', w: 760, h: 388 },
  mark: { file: 'veloura-mark', w: 280, h: 413 },
};

/**
 * The Veloura Luxe Hub logo.
 *
 * Height is set in CSS and the width follows, so the artwork keeps its
 * proportions wherever it lands.
 */
export default function Logo({
  variant = 'lockup',
  className = '',
  priority = false,
  alt = 'Veloura Luxe Hub',
}) {
  const art = ART[variant] || ART.lockup;
  return (
    <picture className={styles.pic}>
      <source srcSet={`${B}brand/${art.file}.webp`} type="image/webp" />
      <img
        className={`${styles.art} ${styles[variant]} ${className}`}
        src={`${B}brand/${art.file}.png`}
        width={art.w}
        height={art.h}
        alt={alt}
        draggable="false"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
      />
    </picture>
  );
}

/** The figure alone, drawn from the same original file. */
export function Monogram({ className = '', title }) {
  return <Logo variant="mark" className={className} alt={title || ''} />;
}

/** Small three-leaf sprig used as a section ornament. */
export function Sprig({ className = '', flip = false }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      className={`${styles.sprig} ${className}`}
      viewBox="0 0 120 90"
      fill="none"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <defs>
        <linearGradient id={`${id}-o`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#899059" />
          <stop offset="100%" stopColor="#A8A46F" />
        </linearGradient>
        <linearGradient id={`${id}-p`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#F0A7B2" />
          <stop offset="100%" stopColor="#DE8896" />
        </linearGradient>
      </defs>
      <path d="M8 86C30 74 52 56 72 34c8-9 15-17 22-26" stroke="#8A7F3F" strokeWidth="1.6" strokeLinecap="round" opacity=".75" />
      <path d="M30 70c-9-3-17-11-18-21 11-2 21 3 26 11 1 2-3 9-8 10z" fill={`url(#${id}-p)`} opacity=".9" />
      <path d="M56 46c-4-10-2-22 6-29 8 7 10 19 6 29-1 3-11 3-12 0z" fill={`url(#${id}-o)`} opacity=".92" />
      <path d="M74 40c9-4 21-3 28 4-7 8-19 10-28 6-3-2-3-9 0-10z" fill={`url(#${id}-o)`} opacity=".8" />
      <path d="M44 62c-6 3-14 2-19-3 5-5 13-6 19-3 2 1 2 5 0 6z" fill={`url(#${id}-p)`} opacity=".7" />
    </svg>
  );
}

/** Four-point star from the HUB rule. */
export function Star({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" width="12" height="12">
      <path d="M12 0c.7 6.4 4.9 10.6 12 12-7.1 1.4-11.3 5.6-12 12-.7-6.4-4.9-10.6-12-12C7.1 10.6 11.3 6.4 12 0z" fill="currentColor" />
    </svg>
  );
}
