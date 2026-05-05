'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { fmt } from '@/lib/utils';
import { Product } from '@/lib/types';
import Icon from './Icon';
import ProductPlaceholder from './ProductPlaceholder';

interface ProductCardProps {
  product: Product;
  density?: 'compact' | 'regular' | 'comfy';
}

export default function ProductCard({ product, density }: ProductCardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const addToCart = useStore(s => s.addToCart);
  const toggleFav = useStore(s => s.toggleFav);
  const favs = useStore(s => s.favs);
  const themeDensity = useStore(s => s.theme.density);

  useEffect(() => setMounted(true), []);

  const isFav = mounted && favs.includes(product.id);
  const d = density ?? themeDensity;
  const discount = product.was
    ? Math.round((1 - product.price / product.was) * 100)
    : 0;

  return (
    <article className={`product-card density-${d}`}>
      <div className="product-media" onClick={() => router.push(`/producto/${product.id}`)}>
        <ProductPlaceholder tone={product.tone} label={product.label} />
        <button
          className={`fav-btn${isFav ? ' is-active' : ''}`}
          aria-label="Favorito"
          onClick={e => { e.stopPropagation(); toggleFav(product.id); }}
        >
          <Icon name={isFav ? 'heart-fill' : 'heart'} size={16} />
        </button>
        <div className="product-badges">
          {product.new && <span className="badge badge-new">Nuevo</span>}
          {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
        </div>
        <button
          className="quick-add"
          onClick={e => { e.stopPropagation(); addToCart(product); }}
        >
          <Icon name="bag" size={14} /> <span>Agregar</span>
        </button>
      </div>
      <div className="product-body">
        <h3 onClick={() => router.push(`/producto/${product.id}`)}>{product.name}</h3>
        <div className="product-meta">
          <Icon name="star" size={11} />
          <span>{product.rating.toFixed(1)}</span>
          <span className="sep">·</span>
          <span className="reviews">{product.reviews} reseñas</span>
        </div>
        <div className="product-price">
          <strong>{fmt(product.price)}</strong>
          {product.was && <span className="price-was">{fmt(product.was)}</span>}
        </div>
      </div>
    </article>
  );
}
