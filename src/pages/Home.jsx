import Hero from '../sections/Hero';
import Categories from '../sections/Categories';
import BestSellers from '../sections/BestSellers';
import Lookbook from '../sections/Lookbook';
import StoryStrip from '../sections/StoryStrip';
import JournalStrip from '../sections/JournalStrip';
import Promise from '../sections/Promise';
import Marquee from '../components/Marquee';
import { cartApi } from '../hooks/useCart';
import { MARQUEE } from '../data/products';

export default function Home() {
  const handleAdd = (p, opts) => cartApi.add(p, opts);

  return (
    <div className="page">
      <Hero />
      <Marquee items={MARQUEE} tone="peach" />
      <Categories />
      <BestSellers onAdd={handleAdd} />
      <Lookbook />
      <StoryStrip />
      <JournalStrip />
      <Promise />
    </div>
  );
}
