'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import Icon from '@/components/ui/Icon';
import SearchBox from './SearchBox';

export default function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const setDrawerOpen = useStore(s => s.setDrawerOpen);
  const setCartOpen = useStore(s => s.setCartOpen);
  const cart = useStore(s => s.cart);
  const favs = useStore(s => s.favs);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="announcebar">
        <span>· ENVÍO GRATIS DESDE $120.000 ·</span>
        <span>· 3 cuotas sin interés ·</span>
        <span>· PUNTO DE RETIRO EN RAFAELA, SANTA FE ·</span>
      </div>
      <div className="header-main">
        <button
          className="icon-btn menu-btn"
          onClick={() => setDrawerOpen(true)}
          aria-label="Menú"
        >
          <Icon name="menu" size={20} />
          <span>Categorías</span>
        </button>

        <button className="brand" onClick={() => router.push('/')} aria-label="Inicio">
          <span className="brand-mark">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="15" r="13" stroke="currentColor" strokeWidth="0.8" />
              <path d="M15 6c-3 3-3 12 0 18M15 6c3 3 3 12 0 18" stroke="currentColor" strokeWidth="0.8" fill="none" />
              <circle cx="15" cy="15" r="2" fill="currentColor" />
            </svg>
          </span>
          <span className="brand-name">
            <span className="brand-line1">La Botica</span>
            <span className="brand-line2">del Alma</span>
          </span>
        </button>

        <div className="header-search">
          <SearchBox />
        </div>

        <div className="header-actions">
          <button className="hdr-link" aria-label="Mi cuenta">
            <Icon name="user" size={18} />
            <span>Mi cuenta</span>
          </button>
          <button className="hdr-link" aria-label="Favoritos">
            <Icon name="heart" size={18} />
            {mounted && favs.length > 0 && (
              <span className="count-badge">{favs.length}</span>
            )}
          </button>
          <button
            className="hdr-link bag-link"
            onClick={() => setCartOpen(true)}
            aria-label="Carrito"
          >
            <Icon name="bag" size={18} />
            <span>Carrito</span>
            {mounted && cartCount > 0 && (
              <span className="count-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
