import { Category, Collection, PriceRange, Product, Tone } from './types';

// ── Verified Unsplash images ──────────────────────────────────────────────────
const IMG_RING_SILVER    = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80';
const IMG_RING_STEEL     = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80';
const IMG_RING_ALPACA    = 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&w=800&q=80';
const IMG_COLLAR_SILVER  = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80';
const IMG_COLLAR_GOLD    = 'https://images.unsplash.com/photo-1573408301185-9519f94816b8?auto=format&fit=crop&w=800&q=80';
const IMG_COLLAR_WHITE   = 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80';
const IMG_COLLAR_STONES  = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80';
const IMG_COLLAR_THREAD  = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80';
const IMG_DIJE_SILVER    = 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80';
const IMG_DIJE_STEEL     = 'https://images.unsplash.com/photo-1613139944551-2cd5db5a0e7e?auto=format&fit=crop&w=800&q=80';
const IMG_PULSERA_SILVER = 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&w=800&q=80';
const IMG_PULSERA_GOLD   = 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80';
const IMG_PULSERA_GAMUZA = 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80';
const IMG_PULSERA_PIEDRA = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80';
const IMG_ARO_SILVER     = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80';
const IMG_ARO_STEEL      = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80';
const IMG_ARO_ALPACA     = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80';
const IMG_TOBILLERA      = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80';
const IMG_TOBILLERA_PIEDRA='https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&w=800&q=80';
const IMG_AMATISTA       = 'https://images.unsplash.com/photo-1567333528660-d4387a67cfbb?auto=format&fit=crop&w=800&q=80';
const IMG_CUARZO_ROSA    = 'https://images.unsplash.com/photo-1614362984535-6490656a8412?auto=format&fit=crop&w=800&q=80';
const IMG_OBSIDIANA      = 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=800&q=80';
const IMG_CITRINO        = 'https://images.unsplash.com/photo-1609151376730-f246f5734c3b?auto=format&fit=crop&w=800&q=80';
const IMG_PENDULO        = 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80';
const IMG_ORACULO        = 'https://images.unsplash.com/photo-1635332043388-5a4af42795bd?auto=format&fit=crop&w=800&q=80';
const IMG_BOTELLA        = 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80';
const IMG_BUDA           = 'https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?auto=format&fit=crop&w=800&q=80';
const IMG_AMULETO        = 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80';

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORY_DEFS: Omit<Category, 'count'>[] = [];

export const COLLECTIONS: Collection[] = [
  { id: 'plata',     name: 'Colección Plata',      subtitle: 'Joyería 925 artesanal',    image: IMG_COLLAR_SILVER },
  { id: 'piedras',   name: 'Piedras del Alma',     subtitle: 'Naturales y sin procesar', image: IMG_AMATISTA      },
  { id: 'bienestar', name: 'Bienestar & Rituales', subtitle: 'Complementos energéticos', image: IMG_ORACULO       },
];

export const TONES: Record<string, Tone> = {
  sage:   { bg: '#c9d3c1', fg: '#5a6b52', label: 'Salvia'  },
  clay:   { bg: '#d6bfa5', fg: '#6b5539', label: 'Arcilla' },
  rose:   { bg: '#dcc5bf', fg: '#7a5a55', label: 'Rosado'  },
  stone:  { bg: '#c7c2b8', fg: '#5d574c', label: 'Piedra'  },
  moss:   { bg: '#b5b89a', fg: '#565a3f', label: 'Musgo'   },
  cream:  { bg: '#e8ddc9', fg: '#7a6a4d', label: 'Crema'   },
  indigo: { bg: '#b3b6c4', fg: '#4f5366', label: 'Índigo'  },
  ember:  { bg: '#d6b8a0', fg: '#7a5535', label: 'Ámbar'   },
};

export const PRODUCTS: Product[] = [];

// Counts computed from actual product list — always in sync
export const CATEGORIES: Category[] = CATEGORY_DEFS.map(c => ({
  ...c,
  count: PRODUCTS.filter(p => p.cat === c.id).length,
}));

export const PRICE_RANGES: PriceRange[] = [
  { id: 'pr1', label: 'Hasta $10.000',     min: 0,     max: 10000    },
  { id: 'pr2', label: '$10.000 – $20.000', min: 10000, max: 20000    },
  { id: 'pr3', label: '$20.000 – $30.000', min: 20000, max: 30000    },
  { id: 'pr4', label: 'Más de $30.000',    min: 30000, max: Infinity },
];

export const MATERIALS = [
  'Plata', 'Acero quirúrgico', 'Acero dorado', 'Acero blanco', 'Alpaca', 'Gamuza', 'Hilos',
];

export const INTENTIONS = [
  'crecimiento personal',
  'amor',
  'abundancia',
  'prosperidad',
  'escudos y protección',
  'calma y paz interior',
  'concreción',
  'comunicación',
  'sanación y procesos',
];
