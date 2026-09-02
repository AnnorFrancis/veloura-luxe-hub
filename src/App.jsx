import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import Loader from './components/Loader';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import './App.css';
import './Noise.css';

/* Everything past the landing page is fetched on demand, so the first
   paint only carries what the home page actually needs. */
const Collections = lazy(() => import('./pages/Collections'));
const Product = lazy(() => import('./pages/Product'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Journal = lazy(() => import('./pages/Journal').then((m) => ({ default: m.Journal })));
const JournalPost = lazy(() => import('./pages/Journal').then((m) => ({ default: m.JournalPost })));
const Cart = lazy(() => import('./pages/Cart').then((m) => ({ default: m.Cart })));
const Wishlist = lazy(() => import('./pages/Cart').then((m) => ({ default: m.Wishlist })));
const SizeGuide = lazy(() => import('./pages/Help').then((m) => ({ default: m.SizeGuide })));
const Delivery = lazy(() => import('./pages/Help').then((m) => ({ default: m.Delivery })));
const Care = lazy(() => import('./pages/Help').then((m) => ({ default: m.Care })));
const Faq = lazy(() => import('./pages/Help').then((m) => ({ default: m.Faq })));
const Legal = lazy(() => import('./pages/Help').then((m) => ({ default: m.Legal })));
const NotFound = lazy(() => import('./pages/NotFound'));
const Admin = lazy(() => import('./pages/Admin'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

/* Route changes fade the incoming page in with a CSS keyframe.
   Deliberately no `AnimatePresence mode="wait"`: that holds the new page
   back until an exit animation finishes, and if rAF is throttled, on a
   backgrounded tab or a slow phone, it never does. Nothing here waits. */
function AppRoutes() {
  const location = useLocation();
  return (
    <div className="route-fade" key={location.pathname}>
      <Suspense fallback={<div className="route-hold" />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Collections />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:slug" element={<JournalPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/care" element={<Care />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/terms" element={<Legal />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const lenisRef = useRef(null);

  /* Smooth scroll, created once and torn down only on unmount so a
     re-render can never leave the page in a stopped state. */
  useEffect(() => {
    if (isAdmin) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove('lenis-stopped');
    };
  }, [isAdmin]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (loading) lenis.stop();
    else lenis.start();
  }, [loading]);

  /* Hard guarantee: whatever happens, the curtain lifts. */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div className="noise" aria-hidden="true" />
      <ScrollToTop />

      {loading && !isAdmin && <Loader onComplete={() => setLoading(false)} />}

      {!isAdmin && <Navigation onOpenCart={() => setCartOpen(true)} />}

      <main>
        <AppRoutes />
      </main>

      {!isAdmin && <Footer />}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
