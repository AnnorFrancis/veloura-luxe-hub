import { Suspense, lazy, useEffect, useState } from 'react';

/* three.js is heavy, so the shader canvas loads as its own chunk.
   A CSS gradient of the same palette paints instantly underneath and
   stays put on reduced-motion, small screens, or if WebGL is missing. */
const AuroraCanvas = lazy(() => import('./AuroraCanvas'));

const cssFallback = (p) => ({
  background: `radial-gradient(62% 68% at 20% 26%, ${p[0]} 0%, transparent 64%),
               radial-gradient(58% 64% at 82% 32%, ${p[1]} 0%, transparent 62%),
               radial-gradient(66% 70% at 52% 88%, ${p[2]} 0%, transparent 64%),
               ${p[3]}`,
});

export default function Aurora({
  palette = ['#FFC9AE', '#8FD3E2', '#F7B3C0', '#FFFCFA'],
  intensity = 0.85,
  className = '',
  webgl = false,
}) {
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!webgl) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 620px)').matches;
    if (reduce || small) return undefined;

    // Only upgrade to WebGL once the browser is idle, never block first paint.
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 400));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => setLive(true));
    return () => cancel(id);
  }, [webgl]);

  return (
    <div className={className} aria-hidden="true" style={cssFallback(palette)}>
      {live && (
        <Suspense fallback={null}>
          <div className="aurora-live">
            <AuroraCanvas palette={palette} intensity={intensity} />
          </div>
        </Suspense>
      )}
    </div>
  );
}
