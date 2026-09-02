import s from './admin.module.css';

/**
 * The one-line explanation that opens every section.
 *
 * The shop owner is not a software person, so each section says in plain
 * words what it is for and what she can do here, before she meets a single
 * number. No jargon, no abbreviations, no more than two short sentences.
 */
export default function Intro({ children }) {
  return <p className={s.intro}>{children}</p>;
}
