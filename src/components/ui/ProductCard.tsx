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
    <article className={`product-card group density-${d}`}>
      <div className="product-media" onClick={() => router.push(`/producto/${product.id}`)}>
        <div className="product-image-wrap">
          <ProductPlaceholder tone={product.tone} label={product.label} aspectRatio={4/5} rounded={false} />
        </div>
        
        <button
          className={`fav-btn${isFav ? ' is-active' : ''}`}
          aria-label="Favorito"
          onClick={e => { e.stopPropagation(); toggleFav(product.id); }}
        >
          <Icon name={isFav ? 'heart-fill' : 'heart'} size={18} />
        </button>

        <div className="product-badges">
          {product.new && <span className="badge-elite badge-new">Novedad</span>}
          {discount > 0 && <span className="badge-elite badge-sale">-{discount}%</span>}
        </div>

        <div className="quick-add-wrap">
          <button
            className="btn-quick-add"
            onClick={e => { e.stopPropagation(); addToCart(product); }}
          >
            <Icon name="plus" size={16} /> <span>Añadir al carrito</span>
          </button>
        </div>
      </div>

      <div className="product-body">
        <div className="product-info-top">
          <span className="product-category-label">{product.label}</span>
          <div className="product-rating-mini">
            <Icon name="star" size={10} />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <h3 
          className="product-title font-serif text-2xl italic tracking-tight cursor-pointer"
          onClick={() => router.push(`/producto/${product.id}`)}
        >
          {product.name}
        </h3>

        <div className="product-footer">
          <div className="product-price-elite">
            <span className="price-current">{fmt(product.price)}</span>
            {product.was && <span className="price-old">{fmt(product.was)}</span>}
          </div>
          <span className="product-reviews-count">{product.reviews} reseñas</span>
        </div>
      </div>
    </article>
  );
}
