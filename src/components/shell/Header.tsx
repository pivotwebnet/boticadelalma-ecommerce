'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useStore } from '@/store/useStore';
import { useProducts } from '@/hooks/useApiData';

import Icon from '@/components/ui/Icon';
import SearchBox from './SearchBox';

const ANNOUNCE_ITEMS = [
  '· ENVÍO GRATIS DESDE $120.000 ·',
  '· 3 cuotas sin interés ·',
  '· PUNTO DE RETIRO EN A. LINCOLN 85 (RAFAELA) ·',
];
// Una "mitad" repite los mensajes hasta superar el ancho de pantalla;
// se duplica (HALF + HALF) para que translateX(-50%) cicle sin cortes.
const ANNOUNCE_HALF = [...ANNOUNCE_ITEMS, ...ANNOUNCE_ITEMS, ...ANNOUNCE_ITEMS];
const ANNOUNCE_LOOP = [...ANNOUNCE_HALF, ...ANNOUNCE_HALF];

export default function Header() {

  const router = useRouter();

  const [mounted, setMounted] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const setDrawerOpen = useStore(
    (s) => s.setDrawerOpen
  );

  const setCartOpen = useStore(
    (s) => s.setCartOpen
  );

  const setFavsOpen = useStore(
    (s) => s.setFavsOpen
  );

  const cart = useStore(
    (s) => s.cart
  );

  const favs = useStore(
    (s) => s.favs
  );

  const products = useProducts();

  // =========================
  // MOUNT
  // =========================

  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetch('/api/site-settings')
      .then(r => r.json())
      .then((s: { logoUrl?: string | null }) => {
        if (s?.logoUrl) setLogoUrl(s.logoUrl);
      })
      .catch(() => {});
  }, []);

  // =========================
  // SCROLL EFFECT
  // =========================

  useEffect(() => {

    const onScroll = () => {
      setScrolled(
        window.scrollY > 24
      );
    };

    window.addEventListener(
      'scroll',
      onScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        'scroll',
        onScroll
      );

  }, []);

  // =========================
  // CART COUNT
  // =========================

  const cartCount = cart.reduce(
    (sum, i) => sum + i.qty,
    0
  );

  // Solo contamos favoritos que existen en el catálogo actual,
  // para que el badge coincida con el drawer y no infle por IDs huérfanos.
  const favCount = products.reduce(
    (sum, p) => (favs.includes(p.id) ? sum + 1 : sum),
    0
  );

  return (

    <header
      className={`
        fixed
        top-0
        left-0
        z-50
        w-full
        premium-transition
        border-b
        ${
          scrolled
            ? `
              border-black/5
              bg-[#f7f1e7]/88
              backdrop-blur-md
              shadow-[0_10px_35px_rgba(0,0,0,0.04)]
            `
            : `
              border-black/5
              bg-[#f7f1e7]/92
              backdrop-blur-md
            `
        }
      `}
    >

      {/* ANNOUNCE BAR */}

      <div
        className={`
          overflow-hidden
          premium-transition
          ${
            scrolled
              ? 'max-h-0 opacity-0'
              : 'max-h-12 opacity-100'
          }
        `}
      >

        <div className="announcebar">

          <div className="announcebar-track">
            {ANNOUNCE_LOOP.map((t, i) => (
              <span key={i} aria-hidden={i >= ANNOUNCE_ITEMS.length ? true : undefined}>
                {t}
              </span>
            ))}
          </div>

        </div>

      </div>

      {/* MAIN */}

      <div
        className={`
          premium-transition
          ${
            scrolled
              ? 'py-2.5'
              : 'py-4'
          }
        `}
      >

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5">

          {/* LEFT */}

          <button
            className="
              icon-btn
              menu-btn
              premium-transition
            "
            onClick={() =>
              setDrawerOpen(true)
            }
            aria-label="Menú"
            data-tooltip="Menú de categorías"
            data-tooltip-dir="down"
          >

            <Icon
              name="menu"
              size={20}
            />

            <span>
              Categorías
            </span>

          </button>

          {/* BRAND */}

          <button
            className="
              brand
              premium-transition
              hover:opacity-80
              drop-shadow-[0_2px_10px_rgba(0,0,0,0.05)]
            "
            onClick={() =>
              router.push('/')
            }
            aria-label="Inicio"
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="La Botica del Alma" style={{ maxHeight: '40px', maxWidth: '180px', objectFit: 'contain' }} />
            ) : (
              <>
                <span className="brand-mark">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                  >
                    <circle
                      cx="15"
                      cy="15"
                      r="13"
                      stroke="currentColor"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M15 6c-3 3-3 12 0 18M15 6c3 3 3 12 0 18"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      fill="none"
                    />
                    <circle
                      cx="15"
                      cy="15"
                      r="2"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className="brand-name">
                  <span className="brand-line1">La Botica</span>
                  <span className="brand-line2">del Alma</span>
                </span>
              </>
            )}
          </button>

          {/* SEARCH */}

          <div
            className="
              hidden
              lg:block
              flex-1
              max-w-[420px]
            "
          >

            <SearchBox />

          </div>

          {/* ACTIONS */}

          <div className="header-actions flex items-center gap-5">

            {/* FAVORITES */}

            <button
              className="
                hdr-link
                premium-transition
                relative
              "
              onClick={() => setFavsOpen(true)}
              aria-label="Favoritos"
              data-tooltip="Ver favoritos"
              data-tooltip-dir="down"
            >

              <Icon
                name="heart"
                size={18}
              />

              {mounted &&
                favCount > 0 && (
                  <span className="count-badge">
                    {favCount}
                  </span>
                )}

            </button>

            {/* CART */}

            <button
              className="
                hdr-link
                bag-link
                premium-transition
                relative
              "
              onClick={() =>
                setCartOpen(true)
              }
              aria-label="Carrito"
              data-tooltip="Ver carrito"
              data-tooltip-dir="down"
            >

              <Icon
                name="bag"
                size={18}
              />

              <span>
                Carrito
              </span>

              {mounted &&
                cartCount > 0 && (
                  <span className="count-badge">
                    {cartCount}
                  </span>
                )}

            </button>

          </div>

        </div>

      </div>

    </header>
  );
}