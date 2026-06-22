import React, { useState, useEffect, Suspense } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import Loader from './components/Loader';
import Navigation from './components/Navigation';
import Hero3D from './components/Hero3D';
import About from './components/About';
import PropertyGrid from './components/PropertyGrid';
import ValueAdds from './components/ValueAdds';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './Noise.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Lenis for smooth momentum scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Stop scrolling while loading
    if (loading) {
      lenis.stop();
    } else {
      lenis.start();
    }

    return () => {
      lenis.destroy();
    };
  }, [loading]);

  return (
    <>
      <div className="noise"></div>
      
      <AnimatePresence mode="wait">
        {loading && <Loader key="loader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <Navigation />
      <main>
        <Suspense fallback={null}>
          <Hero3D />
        </Suspense>
        {!loading && (
          <>
            <About />
            <PropertyGrid />
            <ValueAdds />
            <Contact />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
