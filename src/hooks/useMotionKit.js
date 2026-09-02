import { useCallback, useEffect, useRef, useState } from 'react';

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * 3D pointer tilt. Returns a ref plus handlers, attach to any element
 * that has `transform-style: preserve-3d` and a perspective parent.
 * Writes CSS custom properties so the CSS owns the final transform.
 */
export function useTilt({ max = 9, scale = 1.02, glare = true } = {}) {
  const ref = useRef(null);
  const frame = useRef(0);

  const onMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el || reduced()) return;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--rx', `${(0.5 - py) * max * 2}deg`);
        el.style.setProperty('--ry', `${(px - 0.5) * max * 2}deg`);
        el.style.setProperty('--sc', scale);
        if (glare) {
          el.style.setProperty('--gx', `${px * 100}%`);
          el.style.setProperty('--gy', `${py * 100}%`);
          el.style.setProperty('--go', '1');
        }
      });
    },
    [max, scale, glare]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--sc', 1);
    el.style.setProperty('--go', '0');
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return { ref, onPointerMove: onMove, onPointerLeave: onLeave };
}

/**
 * IntersectionObserver reveal. Adds `.in` once per element, then stops
 * watching it.
 *
 * The list under a reveal container is not fixed. Switching department,
 * changing the sort or loading more swaps the cards for ones that did not
 * exist when this hook first ran, and an element that is never observed
 * stays at `opacity: 0` for good. So a MutationObserver picks up anything
 * that arrives later and hands it to the same IntersectionObserver.
 */
export function useReveal({ threshold = 0, rootMargin = '0px 0px -4% 0px' } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const show = (n) => n.classList.add('in');
    const collect = () => {
      if (el.hasAttribute('data-reveal-self')) return [el];
      const found = Array.from(el.querySelectorAll('.reveal'));
      return found.length ? found : [el];
    };

    if (reduced() || !('IntersectionObserver' in window)) {
      collect().forEach(show);
      const mo = new MutationObserver(() => collect().forEach(show));
      mo.observe(el, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    const watched = new WeakSet();
    let bail;

    const sweep = () => {
      const all = collect();
      all.forEach((n) => {
        if (watched.has(n) || n.classList.contains('in')) return;
        watched.add(n);
        io.observe(n);
      });
      // Safety net: anything still hidden shortly after gets shown anyway.
      clearTimeout(bail);
      bail = setTimeout(() => all.forEach(show), 1400);
    };

    sweep();

    // Only childList, so adding `.in` above cannot retrigger this.
    const mo = new MutationObserver(sweep);
    mo.observe(el, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(bail);
    };
  }, [threshold, rootMargin]);

  return ref;
}

/** Normalised 0→1 scroll progress across an element. */
export function useScrollProgress() {
  const ref = useRef(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height + window.innerHeight;
      const seen = window.innerHeight - r.top;
      setP(Math.max(0, Math.min(1, seen / total)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return [ref, p];
}

/** Count from 0 → `to` once the element is on screen. */
export function useCountUp(to, { duration = 1600 } = {}) {
  const ref = useRef(null);
  const [n, setN] = useState(() => (reduced() ? to : 0));

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return undefined;

    let raf, started = false;
    const run = () => {
      const start = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - start) / duration);
        setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        run();
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);

    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration]);

  return [ref, n];
}

export { reduced as prefersReducedMotion };
