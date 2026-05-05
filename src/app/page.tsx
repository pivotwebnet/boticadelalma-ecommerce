import Hero from '@/components/home/Hero';
import ValueStrip from '@/components/home/ValueStrip';
import CategoryGrid from '@/components/home/CategoryGrid';
import Featured from '@/components/home/Featured';
import CollectionBanner from '@/components/home/CollectionBanner';
import Icon from '@/components/ui/Icon';
import { PRODUCTS } from '@/lib/data';

export default function HomePage() {
  return (
    <main className="home">
      <Hero />
      <ValueStrip />
      <CategoryGrid />
      <Featured products={PRODUCTS} />
      <CollectionBanner />
      <section className="section editorial">
        <div className="ed-quote">
          <Icon name="moon" size={28} stroke={1.2} />
          <blockquote>
            &ldquo;Cada objeto que llega a tus manos fue elegido con cuidado. Son piezas pequeñas, con historia.&rdquo;
          </blockquote>
          <cite>— Valentina, curaduría</cite>
        </div>
      </section>
    </main>
  );
}
