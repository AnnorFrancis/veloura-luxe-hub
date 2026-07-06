import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    window.addEventListener('mousemove', onMove);

    let raf;
    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.14;
      ring.current.y += (pos.current.y - ring.current.y) * 0.14;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    // Hover state on interactive elements
    const onOver = (e) => {
      const target = e.target;
      if (!ringRef.current) return;
      if (target.closest('a, button, [data-cursor="pointer"]')) {
        ringRef.current.classList.add('cursor-hover');
        const label = target.closest('[data-cursor-label]')?.dataset.cursorLabel;
        if (label && labelRef.current) {
          labelRef.current.textContent = label;
          labelRef.current.classList.add('show');
        }
      } else {
        ringRef.current.classList.remove('cursor-hover');
        if (labelRef.current) labelRef.current.classList.remove('show');
      }
    };
    document.addEventListener('mouseover', onOver);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label"></span>
      </div>
      <style>{`
        .cursor-dot, .cursor-ring {
          position: fixed;
          top: 0; left: 0;
          pointer-events: none;
          z-index: 10000;
          will-change: transform;
        }
        .cursor-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--brass-light);
          margin: -3px 0 0 -3px;
          mix-blend-mode: difference;
        }
        .cursor-ring {
          width: 36px; height: 36px;
          border: 1px solid var(--ivory-secondary);
          border-radius: 50%;
          transition: width 0.35s var(--ease-out-expo), height 0.35s var(--ease-out-expo), background 0.35s;
          display: flex; align-items: center; justify-content: center;
          mix-blend-mode: difference;
        }
        .cursor-ring.cursor-hover {
          width: 64px; height: 64px;
          background: var(--ivory-primary);
          border-color: var(--ivory-primary);
        }
        .cursor-label {
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--bg-primary);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .cursor-label.show { opacity: 1; }
        @media (hover: none) {
          .cursor-dot, .cursor-ring { display: none; }
        }
      `}</style>
    </>
  );
}
