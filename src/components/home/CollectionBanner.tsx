import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import ProductPlaceholder from '@/components/ui/ProductPlaceholder';

export default function CollectionBanner() {
  return (
    <section className="collection-banner">
      <div className="cb-media">
        <ProductPlaceholder
          tone="indigo"
          label="luna nueva · editorial"
          aspectRatio={16 / 10}
          rounded={false}
        />
      </div>
      <div className="cb-copy">
        <span className="eyebrow">Colección</span>
        <h2>Luna Nueva</h2>
        <p>
          Una serie de objetos para acompañar los ciclos: cuarzos lunares, velas de
          intención y una baraja pensada para los comienzos.
        </p>
        <Link href="/categoria/cristales" className="btn btn-primary btn-md">
          Ver colección <Icon name="arrow-r" size={16} />
        </Link>
      </div>
    </section>
  );
}
