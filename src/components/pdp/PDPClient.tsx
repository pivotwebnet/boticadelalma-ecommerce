'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store/useStore';
import { CATEGORIES } from '@/lib/data';
import { useProducts } from '@/hooks/useApiData';
import { fmt } from '@/lib/utils';
import { Product } from '@/lib/types';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Icon from '@/components/ui/Icon';
import Stars from '@/components/ui/Stars';
import Button from '@/components/ui/Button';
import ProductPlaceholder from '@/components/ui/ProductPlaceholder';
import ProductCard from '@/components/ui/ProductCard';
import CommentSection from '@/components/comments/CommentSection';

type Tab = 'desc' | 'ritual' | 'care' | 'ship';

interface PDPClientProps {
  product: Product;
}

export default function PDPClient({ product }: PDPClientProps) {
  const [mounted, setMounted] = useState(false);
  const [qty, setQty] = useState(1);
  const [mainIdx, setMainIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zPos, setZPos] = useState({ x: 50, y: 50 });
  const [tab, setTab] = useState<Tab>('desc');
  const imgRef = useRef<HTMLDivElement>(null);

  const addToCart = useStore(s => s.addToCart);
  const toggleFav = useStore(s => s.toggleFav);
  const favs = useStore(s => s.favs);
  const allProducts = useProducts();

  useEffect(() => setMounted(true), []);

  const category = CATEGORIES.find(c => c.id === product.cat) ?? CATEGORIES[0];;
  const related = allProducts.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 4);
  
  // Use product prop directly if it's updated, otherwise try to find in liveProducts
  const displayRating = product.rating || 0;
  const displayReviews = product.reviews || 0;
  // Galería: SOLO las fotos realmente cargadas. Si no hay ninguna, se usa un
  // placeholder (no se inventan miniaturas vacías).
  const gallery = product.images && product.images.length > 0
    ? product.images
    : (product.image ? [product.image] : []);
  const safeIdx = Math.min(mainIdx, Math.max(0, gallery.length - 1));
  const mainSrc = gallery[safeIdx];

  const isFav = mounted && favs.includes(product.id);
  const discount = product.was
    ? Math.round((1 - product.price / product.was) * 100)
    : 0;

  const isMaterial = (tag: string) => {
    const t = tag.toLowerCase().trim();
    const materialsList = [
      'plata', 'acero', 'gamuza', 'hilo', 'alpaca', 
      'piedra', 'bruto', 'cuarzo', 'amatista', 
      'obsidiana', 'labradorita', 'ojo turco', 'nácar', 
      'nacar', 'turquesa', 'metal'
    ];
    return materialsList.some(m => t.includes(m));
  };

  const materiales = product.tags.filter(isMaterial);
  const intenciones = product.tags.filter(t => !isMaterial(t));

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const r = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setZPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const TABS: [Tab, string][] = [
    ['desc', 'Descripción'],
    ['ritual', 'Cómo usar'],
    ['care', 'Cuidados'],
    ['ship', 'Envíos'],
  ];

  return (
    <main className="pdp">
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: category.name, href: `/catalogo?cat=${category.id}` },
          { label: product.name },
        ]}
      />

      <div className="pdp-main">
        {/* Galería — solo las fotos realmente cargadas */}
        <div className="pdp-gallery">
          {gallery.length > 1 && (
            <div className="thumbs">
              {gallery.map((src, idx) => (
                <button
                  key={src + idx}
                  className={`thumb${idx === safeIdx ? ' on' : ''}`}
                  onClick={() => setMainIdx(idx)}
                >
                  <img src={src} alt={`${product.name} — foto ${idx + 1}`} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
          <div
            ref={imgRef}
            className={`main-image${zoom ? ' zoomed' : ''}`}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={onMouseMove}
          >
            <div
              className="zoom-cursor"
              style={{ transform: `translate(${zPos.x}%, ${zPos.y}%) translate(-50%,-50%)` }}
            >
              <Icon name="zoom" size={18} />
            </div>
            <div
              className="zoom-wrap"
              style={zoom ? { transform: `scale(2)`, transformOrigin: `${zPos.x}% ${zPos.y}%` } : {}}
            >
              {mainSrc ? (
                <img src={mainSrc} alt={product.name} className="object-cover w-full h-full" />
              ) : (
                <ProductPlaceholder tone={product.tone} label={product.label} aspectRatio={1} />
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="pdp-info">
          <div className="pdp-badges">
            {product.new && <span className="badge badge-new">Nuevo</span>}
            {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
          </div>
          <h1>{product.name}</h1>
          <div className="pdp-rating">
            <Stars value={displayRating} size={14} />
            <span>{displayRating.toFixed(1)}</span>
            <span className="sep">·</span>
            <a>{displayReviews} reseñas</a>
          </div>
          <div className="pdp-price">
            <strong>{fmt(product.price)}</strong>
            {product.was && <span className="price-was">{fmt(product.was)}</span>}
            <span className="pdp-installments">
              o 3 cuotas sin interés de <b>{fmt(product.price / 3)}</b>
            </span>
          </div>

          <ul className="pdp-tags">
            {product.tags.map(t => <li key={t}>· {t}</li>)}
          </ul>

          <div className="pdp-qty">
            <span className="qty-label">Cantidad</span>
            <div className="qty-stepper">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Restar">
                <Icon name="minus" size={14} />
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)} aria-label="Sumar">
                <Icon name="plus" size={14} />
              </button>
            </div>
            <span className="stock">
              <span className="dot" /> En stock — envío en 48h
            </span>
          </div>

          <div className="pdp-ctas">
            <Button
              variant="primary"
              size="lg"
              full
              icon="bag"
              onClick={() => addToCart(product, qty)}
            >
              Agregar al carrito — {fmt(product.price * qty)}
            </Button>
            <button
              className={`icon-btn${isFav ? ' is-active' : ''}`}
              onClick={() => toggleFav(product.id)}
              aria-label="Favorito"
            >
              <Icon name={isFav ? 'heart-fill' : 'heart'} size={18} />
            </button>
          </div>

          <div className="pdp-perks">
            <div><Icon name="truck" size={16} stroke={1.3} /><span>Envío a coordinar (Gratis en Rafaela)</span></div>
            <div><Icon name="shield" size={16} stroke={1.3} /><span>Compra protegida</span></div>
            <div><Icon name="leaf" size={16} stroke={1.3} /><span>Empaque de papel reciclado</span></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="pdp-tabs">
        <nav className="tabs-nav">
          {TABS.map(([id, label]) => (
            <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="tabs-body">
          {tab === 'desc' && (
            <div>
              <p>
                Pieza seleccionada a mano desde pequeños talleres. Cada unidad es levemente
                distinta — esa es su belleza. La energía de {product.name.toLowerCase()} acompaña
                momentos de reflexión, intención y pausa.
              </p>
              {materiales.length > 0 && <p><b>Materiales:</b> {materiales.join(', ')}.</p>}
              {intenciones.length > 0 && <p><b>Propiedades energéticas:</b> {intenciones.join(', ')}.</p>}
            </div>
          )}
          {tab === 'ritual' && (
            <ul className="steps">
              <li><b>1.</b> Limpiá la pieza con sahumerio de salvia o palo santo.</li>
              <li><b>2.</b> Dedicá una intención clara antes de usarla.</li>
              <li><b>3.</b> Llevala cerca en los momentos que necesites su energía.</li>
            </ul>
          )}
          {tab === 'care' && (
            <p>
              Guardá en lugar seco, lejos de la luz directa. Si es metal, puliselo con un paño
              suave. Evitá perfumes y cremas en contacto directo.
            </p>
          )}
          {tab === 'ship' && (
            <p>
              Envíos a todo el país a coordinar por WhatsApp (3 a 7 días hábiles). Retiro gratuito en nuestro punto de entrega en A. Lincoln 85, Rafaela, Santa Fe.
            </p>
          )}
        </div>
      </div>

      {/* Opiniones */}
      <CommentSection productId={product.id} />

      {/* Relacionados */}
      <section className="related-pieces section">
        <header className="section-head">
          <span className="eyebrow">Podría acompañarte</span>
          <h2>Piezas relacionadas</h2>
        </header>
        <div className="product-grid grid-regular">
          {related.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
