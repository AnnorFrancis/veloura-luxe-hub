import { useState } from 'react';
import Hero from '../sections/Hero';
import Categories from '../sections/Categories';
import BestSellers from '../sections/BestSellers';
import About from '../sections/About';
import Promise from '../sections/Promise';
import ProductModal from '../components/ProductModal';
import { cartApi } from '../hooks/useCart';

export default function Home() {
  const [quick, setQuick] = useState(null);
  const handleAdd = (p, opts) => cartApi.add(p, opts);

  return (
    <div className="page">
      <Hero />
      <Categories />
      <BestSellers onQuickView={setQuick} onAdd={handleAdd} />
      <About />
      <Promise />
      <ProductModal product={quick} onClose={() => setQuick(null)} onAdd={handleAdd} />
    </div>
  );
}
