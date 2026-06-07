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
const CATEGORY_DEFS: Omit<Category, 'count'>[] = [
  {
    id: 'anillos', name: 'Anillos', icon: 'ring', group: 'Joyería', image: IMG_RING_SILVER,
    subcategories: [
      { id: 'anillos-plata',        name: 'Plata'             },
      { id: 'anillos-acero-qx',     name: 'Acero Quirúrgico'  },
      { id: 'anillos-acero-blanco', name: 'Acero Blanco'      },
      { id: 'anillos-alpaca',       name: 'Alpaca'            },
    ],
  },
  {
    id: 'collares', name: 'Collares', icon: 'necklace', group: 'Joyería', image: IMG_COLLAR_SILVER,
    subcategories: [
      { id: 'collares-plata',          name: 'Plata'              },
      { id: 'collares-acero-dorado',   name: 'Acero Dorado'       },
      { id: 'collares-acero-blanco',   name: 'Acero Blanco'       },
      { id: 'collares-acero-qx',       name: 'Acero Quirúrgico'   },
      { id: 'collares-gamuza',         name: 'Gamuza / Cordones'  },
      { id: 'collares-hilos',          name: 'Hilos'              },
      { id: 'collares-alpaca',         name: 'Alpaca'             },
      { id: 'collares-piedras-escalas',name: 'Piedras — Escalas'  },
      { id: 'collares-piedras-roladas',name: 'Piedras — Roladas'  },
    ],
  },
  {
    id: 'dijes', name: 'Dijes', icon: 'charm', group: 'Joyería', image: IMG_DIJE_SILVER,
    subcategories: [
      { id: 'dijes-plata',        name: 'Plata'            },
      { id: 'dijes-acero-blanco', name: 'Acero Blanco'     },
      { id: 'dijes-acero-qx',     name: 'Acero Quirúrgico' },
      { id: 'dijes-acero-dorado', name: 'Acero Dorado'     },
      { id: 'dijes-alpaca',       name: 'Alpaca'           },
    ],
  },
  {
    id: 'pulseras', name: 'Pulseras', icon: 'bracelet', group: 'Joyería', image: IMG_PULSERA_SILVER,
    subcategories: [
      { id: 'pulseras-plata',           name: 'Plata'             },
      { id: 'pulseras-acero-dorado',    name: 'Acero Dorado'      },
      { id: 'pulseras-acero-blanco',    name: 'Acero Blanco'      },
      { id: 'pulseras-acero-qx',        name: 'Acero Quirúrgico'  },
      { id: 'pulseras-gamuza',          name: 'Gamuza / Cordones' },
      { id: 'pulseras-hilos',           name: 'Hilos'             },
      { id: 'pulseras-alpaca',          name: 'Alpaca'            },
      { id: 'pulseras-piedras-escalas', name: 'Piedras — Escalas' },
      { id: 'pulseras-piedras-roladas', name: 'Piedras — Roladas' },
    ],
  },
  {
    id: 'aros', name: 'Aros', icon: 'earring', group: 'Joyería', image: IMG_ARO_SILVER,
    subcategories: [
      { id: 'aros-acero-blanco', name: 'Acero Blanco'     },
      { id: 'aros-acero-qx',     name: 'Acero Quirúrgico' },
      { id: 'aros-plata',        name: 'Plata'            },
      { id: 'aros-alpaca',       name: 'Alpaca'           },
    ],
  },
  {
    id: 'tobilleras', name: 'Tobilleras', icon: 'anklet', group: 'Joyería', image: IMG_TOBILLERA,
    subcategories: [
      { id: 'tobilleras-acero-dorado',    name: 'Acero Dorado'      },
      { id: 'tobilleras-acero-blanco',    name: 'Acero Blanco'      },
      { id: 'tobilleras-acero-qx',        name: 'Acero Quirúrgico'  },
      { id: 'tobilleras-gamuza',          name: 'Gamuza / Cordones' },
      { id: 'tobilleras-hilos',           name: 'Hilos'             },
      { id: 'tobilleras-piedras-escalas', name: 'Piedras — Escalas' },
      { id: 'tobilleras-piedras-roladas', name: 'Piedras — Roladas' },
    ],
  },
  {
    id: 'piedras', name: 'Piedras Naturales', icon: 'crystal', image: IMG_AMATISTA,
    subcategories: [
      { id: 'piedras-bruto',      name: 'En Bruto'   },
      { id: 'piedras-roladas',    name: 'Roladas'    },
      { id: 'piedras-especiales', name: 'Especiales' },
    ],
  },
  {
    id: 'complementos', name: 'Complementos', icon: 'accessory', image: IMG_ORACULO,
    subcategories: [
      { id: 'comp-botellas',     name: 'Botellas Energéticas'      },
      { id: 'comp-lapices',      name: 'Lápices y Lapiceras'       },
      { id: 'comp-pendulos',     name: 'Péndulos y Tableros'       },
      { id: 'comp-figuras',      name: 'Figuras Especiales'        },
      { id: 'comp-instrumentos', name: 'Instrumentos de Bienestar' },
      { id: 'comp-oraculos',     name: 'Oráculos'                  },
      { id: 'comp-amuletos',     name: 'Amuletos'                  },
    ],
  },
];

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

export const PRODUCTS: Product[] = [
  // ── Anillos — Plata ──────────────────────────────────────────────────────────
  { id: 'a01', cat: 'anillos', subcat: 'anillos-plata',        name: 'Anillo Plata 925 Minimalista',       price: 19500,             tone: 'stone',  label: 'anillo · plata',           tags: ['plata', 'amor', 'comunicación'],             rating: 0, reviews: 0, new: true, image: IMG_RING_SILVER  },
  { id: 'a04', cat: 'anillos', subcat: 'anillos-plata',        name: 'Anillo Plata 925 Piedra Lunar',      price: 22500,             tone: 'rose',   label: 'anillo · plata',           tags: ['plata', 'amor', 'intuición'],                rating: 0, reviews: 0,           image: IMG_RING_ALPACA  },
  { id: 'a09', cat: 'anillos', subcat: 'anillos-plata',        name: 'Anillo Plata 925 Aro Liso',          price: 15900,             tone: 'stone',  label: 'anillo · plata',           tags: ['plata', 'calma', 'comunicación'],            rating: 0, reviews: 0,           image: IMG_RING_SILVER  },

  // ── Anillos — Acero Quirúrgico ───────────────────────────────────────────────
  { id: 'a02', cat: 'anillos', subcat: 'anillos-acero-qx',     name: 'Anillo Acero Quirúrgico Liso',       price: 9800,              tone: 'cream',  label: 'anillo · acero quirúrgico', tags: ['acero quirúrgico', 'concreción'],           rating: 0, reviews: 0,           image: IMG_RING_STEEL   },
  { id: 'a05', cat: 'anillos', subcat: 'anillos-acero-qx',     name: 'Anillo Acero Quirúrgico Nudo Celta', price: 11200,             tone: 'stone',  label: 'anillo · acero quirúrgico', tags: ['acero quirúrgico', 'protección', 'escudos'], rating: 0, reviews: 0,           image: IMG_RING_STEEL   },
  { id: 'a10', cat: 'anillos', subcat: 'anillos-acero-qx',     name: 'Anillo Acero Quirúrgico Grabado',    price: 10500,             tone: 'cream',  label: 'anillo · acero quirúrgico', tags: ['acero quirúrgico', 'concreción'],           rating: 0, reviews: 0,           image: IMG_RING_STEEL   },

  // ── Anillos — Acero Blanco ───────────────────────────────────────────────────
  { id: 'a06', cat: 'anillos', subcat: 'anillos-acero-blanco', name: 'Anillo Acero Blanco Minimalista',    price: 9200,              tone: 'cream',  label: 'anillo · acero blanco',    tags: ['acero blanco', 'calma'],                    rating: 0, reviews: 0,           image: IMG_COLLAR_WHITE },
  { id: 'a07', cat: 'anillos', subcat: 'anillos-acero-blanco', name: 'Anillo Acero Blanco Con Zirconia',   price: 12400,             tone: 'rose',   label: 'anillo · acero blanco',    tags: ['acero blanco', 'amor', 'prosperidad'],      rating: 0, reviews: 0,           image: IMG_COLLAR_WHITE },
  { id: 'a11', cat: 'anillos', subcat: 'anillos-acero-blanco', name: 'Anillo Acero Blanco Midi',           price: 8900,              tone: 'cream',  label: 'anillo · acero blanco',    tags: ['acero blanco', 'calma'],                    rating: 0, reviews: 0,           image: IMG_COLLAR_WHITE },

  // ── Anillos — Alpaca ─────────────────────────────────────────────────────────
  { id: 'a03', cat: 'anillos', subcat: 'anillos-alpaca',       name: 'Anillo Alpaca Luna',                 price: 6500,              tone: 'rose',   label: 'anillo · alpaca',          tags: ['alpaca', 'amor', 'intuición'],              rating: 0, reviews: 0,           image: IMG_RING_ALPACA  },
  { id: 'a08', cat: 'anillos', subcat: 'anillos-alpaca',       name: 'Anillo Alpaca Con Turquesa',         price: 7800,              tone: 'sage',   label: 'anillo · alpaca',          tags: ['alpaca', 'calma', 'comunicación'],          rating: 0, reviews: 0,           image: IMG_ARO_ALPACA   },
  { id: 'a12', cat: 'anillos', subcat: 'anillos-alpaca',       name: 'Anillo Alpaca Flor',                 price: 6200,              tone: 'rose',   label: 'anillo · alpaca',          tags: ['alpaca', 'amor'],                           rating: 0, reviews: 0,           image: IMG_RING_ALPACA  },

  // ── Collares — Plata ─────────────────────────────────────────────────────────
  { id: 'c01', cat: 'collares', subcat: 'collares-plata',           name: 'Collar Plata 925 Celestial',       price: 24900,             tone: 'stone',  label: 'collar · plata',           tags: ['plata', 'amor', 'comunicación'],             rating: 0, reviews: 0, new: true, image: IMG_COLLAR_SILVER },
  { id: 'c10', cat: 'collares', subcat: 'collares-plata',           name: 'Collar Plata 925 Cadena Veneciana',price: 21500,             tone: 'stone',  label: 'collar · plata',           tags: ['plata', 'prosperidad'],                     rating: 0, reviews: 0,           image: IMG_COLLAR_SILVER },
  { id: 'c11', cat: 'collares', subcat: 'collares-plata',           name: 'Collar Plata 925 Gargantilla',     price: 18900,             tone: 'cream',  label: 'collar · plata',           tags: ['plata', 'calma', 'amor'],                   rating: 0, reviews: 0,           image: IMG_COLLAR_SILVER },

  // ── Collares — Acero Dorado ──────────────────────────────────────────────────
  { id: 'c02', cat: 'collares', subcat: 'collares-acero-dorado',   name: 'Collar Acero Dorado Cadena Fina',  price: 13500,             tone: 'ember',  label: 'collar · acero dorado',    tags: ['acero dorado', 'prosperidad', 'abundancia'],rating: 0, reviews: 0,           image: IMG_COLLAR_GOLD  },
  { id: 'c12', cat: 'collares', subcat: 'collares-acero-dorado',   name: 'Collar Acero Dorado Corazón',      price: 14900,             tone: 'ember',  label: 'collar · acero dorado',    tags: ['acero dorado', 'amor'],                     rating: 0, reviews: 0,           image: IMG_COLLAR_GOLD  },
  { id: 'c13', cat: 'collares', subcat: 'collares-acero-dorado',   name: 'Collar Acero Dorado Triple Aro',   price: 16200,             tone: 'ember',  label: 'collar · acero dorado',    tags: ['acero dorado', 'prosperidad'],              rating: 0, reviews: 0,           image: IMG_COLLAR_GOLD  },

  // ── Collares — Acero Blanco ──────────────────────────────────────────────────
  { id: 'c03', cat: 'collares', subcat: 'collares-acero-blanco',   name: 'Collar Acero Blanco Minimalista',  price: 11900,             tone: 'cream',  label: 'collar · acero blanco',    tags: ['acero blanco', 'calma'],                    rating: 0, reviews: 0,           image: IMG_COLLAR_WHITE },
  { id: 'c14', cat: 'collares', subcat: 'collares-acero-blanco',   name: 'Collar Acero Blanco Estrella',     price: 12800,             tone: 'cream',  label: 'collar · acero blanco',    tags: ['acero blanco', 'amor', 'comunicación'],     rating: 0, reviews: 0,           image: IMG_COLLAR_WHITE },

  // ── Collares — Acero Quirúrgico ──────────────────────────────────────────────
  { id: 'c07', cat: 'collares', subcat: 'collares-acero-qx',       name: 'Collar Acero Quirúrgico Veneziana', price: 11500,            tone: 'cream',  label: 'collar · acero quirúrgico', tags: ['acero quirúrgico', 'concreción'],           rating: 0, reviews: 0,           image: IMG_COLLAR_WHITE },
  { id: 'c15', cat: 'collares', subcat: 'collares-acero-qx',       name: 'Collar Acero Quirúrgico Rolo',     price: 10900,             tone: 'stone',  label: 'collar · acero quirúrgico', tags: ['acero quirúrgico', 'protección'],           rating: 0, reviews: 0,           image: IMG_COLLAR_WHITE },

  // ── Collares — Gamuza / Cordones ─────────────────────────────────────────────
  { id: 'c08', cat: 'collares', subcat: 'collares-gamuza',         name: 'Collar Gamuza Con Dije Plata',     price: 8900,              tone: 'clay',   label: 'collar · gamuza',          tags: ['gamuza', 'protección', 'crecimiento personal'], rating: 0, reviews: 0,       image: IMG_COLLAR_THREAD },
  { id: 'c16', cat: 'collares', subcat: 'collares-gamuza',         name: 'Collar Gamuza Ojo Turco',          price: 7500,              tone: 'clay',   label: 'collar · gamuza',          tags: ['gamuza', 'escudos', 'protección'],          rating: 0, reviews: 0,           image: IMG_COLLAR_THREAD },
  { id: 'c17', cat: 'collares', subcat: 'collares-gamuza',         name: 'Collar Gamuza Cuarzo Colgante',    price: 9400,              tone: 'sage',   label: 'collar · gamuza',          tags: ['gamuza', 'sanación', 'calma'],              rating: 0, reviews: 0,           image: IMG_COLLAR_THREAD },

  // ── Collares — Hilos ─────────────────────────────────────────────────────────
  { id: 'c05', cat: 'collares', subcat: 'collares-hilos',          name: 'Collar Hilos Con Dije',            price: 8900,              tone: 'sage',   label: 'collar · hilos',           tags: ['hilos', 'protección', 'amor'],              rating: 0, reviews: 0,           image: IMG_COLLAR_THREAD },
  { id: 'c18', cat: 'collares', subcat: 'collares-hilos',          name: 'Collar Hilos Macramé Piedra',      price: 10200,             tone: 'moss',   label: 'collar · hilos',           tags: ['hilos', 'crecimiento personal'],            rating: 0, reviews: 0,           image: IMG_ARO_ALPACA    },
  { id: 'c19', cat: 'collares', subcat: 'collares-hilos',          name: 'Collar Hilos Trenzado Artesanal',  price: 7800,              tone: 'clay',   label: 'collar · hilos',           tags: ['hilos', 'amor', 'calma'],                  rating: 0, reviews: 0,           image: IMG_ARO_ALPACA    },

  // ── Collares — Alpaca ────────────────────────────────────────────────────────
  { id: 'c06', cat: 'collares', subcat: 'collares-alpaca',         name: 'Collar Alpaca Artesanal',          price: 7500,              tone: 'moss',   label: 'collar · alpaca',          tags: ['alpaca', 'crecimiento personal'],           rating: 0, reviews: 0,           image: IMG_COLLAR_WHITE  },
  { id: 'c20', cat: 'collares', subcat: 'collares-alpaca',         name: 'Collar Alpaca Con Turquesa',       price: 9200,              tone: 'sage',   label: 'collar · alpaca',          tags: ['alpaca', 'calma', 'comunicación'],          rating: 0, reviews: 0,           image: IMG_ARO_ALPACA    },
  { id: 'c21', cat: 'collares', subcat: 'collares-alpaca',         name: 'Collar Alpaca Luna Nacar',         price: 8100,              tone: 'rose',   label: 'collar · alpaca',          tags: ['alpaca', 'amor', 'intuición'],              rating: 0, reviews: 0,           image: IMG_ARO_ALPACA    },

  // ── Collares — Piedras Escalas ───────────────────────────────────────────────
  { id: 'c04', cat: 'collares', subcat: 'collares-piedras-escalas',name: 'Collar Cuarzo Rosa Escalas',       price: 16900,             tone: 'rose',   label: 'collar · piedras escalas', tags: ['piedras', 'escalas', 'amor', 'sanación'],   rating: 0, reviews: 0,           image: IMG_COLLAR_STONES },
  { id: 'c22', cat: 'collares', subcat: 'collares-piedras-escalas',name: 'Collar Amatista Escalas',          price: 18500,             tone: 'indigo', label: 'collar · piedras escalas', tags: ['piedras', 'escalas', 'sanación', 'calma'],  rating: 0, reviews: 0,           image: IMG_COLLAR_STONES },
  { id: 'c23', cat: 'collares', subcat: 'collares-piedras-escalas',name: 'Collar Ónix Escalas Protección',   price: 14900,             tone: 'stone',  label: 'collar · piedras escalas', tags: ['piedras', 'escalas', 'protección', 'escudos'], rating: 0, reviews: 0,       image: IMG_COLLAR_STONES },

  // ── Collares — Piedras Roladas ───────────────────────────────────────────────
  { id: 'c09', cat: 'collares', subcat: 'collares-piedras-roladas',name: 'Collar Labradorita Rolada',        price: 19800,             tone: 'indigo', label: 'collar · piedras roladas', tags: ['piedras', 'roladas', 'intuición', 'crecimiento personal'], rating: 0, reviews: 0, image: IMG_COLLAR_STONES },
  { id: 'c24', cat: 'collares', subcat: 'collares-piedras-roladas',name: 'Collar Ojo De Tigre Rolado',       price: 17400,             tone: 'ember',  label: 'collar · piedras roladas', tags: ['piedras', 'roladas', 'prosperidad', 'concreción'],       rating: 0, reviews: 0, image: IMG_COLLAR_STONES },
  { id: 'c25', cat: 'collares', subcat: 'collares-piedras-roladas',name: 'Collar Fluorita Rolada Calma',     price: 15900,             tone: 'sage',   label: 'collar · piedras roladas', tags: ['piedras', 'roladas', 'calma', 'comunicación'],           rating: 0, reviews: 0, image: IMG_COLLAR_STONES },

  // ── Dijes — Plata ────────────────────────────────────────────────────────────
  { id: 'd01', cat: 'dijes', subcat: 'dijes-plata',        name: 'Dije Plata 925 Ojo Celeste',    price: 14500, tone: 'indigo', label: 'dije · plata',            tags: ['plata', 'protección', 'escudos'],          rating: 0, reviews: 0, new: true, image: IMG_DIJE_SILVER },
  { id: 'd06', cat: 'dijes', subcat: 'dijes-plata',        name: 'Dije Plata 925 Corazón Sagrado',price: 16800, tone: 'rose',   label: 'dije · plata',            tags: ['plata', 'amor', 'sanación'],               rating: 0, reviews: 0,           image: IMG_DIJE_SILVER },
  { id: 'd07', cat: 'dijes', subcat: 'dijes-plata',        name: 'Dije Plata 925 Estrella',       price: 12900, tone: 'stone',  label: 'dije · plata',            tags: ['plata', 'crecimiento personal'],            rating: 0, reviews: 0,           image: IMG_DIJE_SILVER },

  // ── Dijes — Acero Blanco ─────────────────────────────────────────────────────
  { id: 'd04', cat: 'dijes', subcat: 'dijes-acero-blanco', name: 'Dije Acero Blanco Infinito',   price: 8500,  tone: 'cream',  label: 'dije · acero blanco',     tags: ['acero blanco', 'amor', 'comunicación'],    rating: 0, reviews: 0,           image: IMG_DIJE_STEEL  },
  { id: 'd08', cat: 'dijes', subcat: 'dijes-acero-blanco', name: 'Dije Acero Blanco Mariposa',   price: 7800,  tone: 'rose',   label: 'dije · acero blanco',     tags: ['acero blanco', 'crecimiento personal'],    rating: 0, reviews: 0,           image: IMG_DIJE_STEEL  },
  { id: 'd09', cat: 'dijes', subcat: 'dijes-acero-blanco', name: 'Dije Acero Blanco Espiral',    price: 9100,  tone: 'cream',  label: 'dije · acero blanco',     tags: ['acero blanco', 'concreción'],              rating: 0, reviews: 0,           image: IMG_DIJE_STEEL  },

  // ── Dijes — Acero Quirúrgico ─────────────────────────────────────────────────
  { id: 'd02', cat: 'dijes', subcat: 'dijes-acero-qx',     name: 'Dije Acero Quirúrgico Ángel',  price: 7800,  tone: 'stone',  label: 'dije · acero quirúrgico', tags: ['acero quirúrgico', 'protección'],          rating: 0, reviews: 0,           image: IMG_DIJE_STEEL  },
  { id: 'd10', cat: 'dijes', subcat: 'dijes-acero-qx',     name: 'Dije Acero Quirúrgico Cruz',   price: 8200,  tone: 'cream',  label: 'dije · acero quirúrgico', tags: ['acero quirúrgico', 'sanación', 'protección'], rating: 0, reviews: 0,       image: IMG_DIJE_STEEL  },
  { id: 'd11', cat: 'dijes', subcat: 'dijes-acero-qx',     name: 'Dije Acero Quirúrgico Luna',   price: 7500,  tone: 'stone',  label: 'dije · acero quirúrgico', tags: ['acero quirúrgico', 'intuición'],           rating: 0, reviews: 0,           image: IMG_DIJE_STEEL  },

  // ── Dijes — Acero Dorado ─────────────────────────────────────────────────────
  { id: 'd05', cat: 'dijes', subcat: 'dijes-acero-dorado', name: 'Dije Acero Dorado Sol',        price: 9400,  tone: 'ember',  label: 'dije · acero dorado',     tags: ['acero dorado', 'prosperidad', 'abundancia'], rating: 0, reviews: 0,       image: IMG_COLLAR_GOLD },
  { id: 'd12', cat: 'dijes', subcat: 'dijes-acero-dorado', name: 'Dije Acero Dorado Trébol',     price: 8700,  tone: 'ember',  label: 'dije · acero dorado',     tags: ['acero dorado', 'abundancia'],              rating: 0, reviews: 0,           image: IMG_COLLAR_GOLD },
  { id: 'd13', cat: 'dijes', subcat: 'dijes-acero-dorado', name: 'Dije Acero Dorado Hamsa',      price: 10200, tone: 'ember',  label: 'dije · acero dorado',     tags: ['acero dorado', 'protección', 'escudos'],   rating: 0, reviews: 0,           image: IMG_COLLAR_GOLD },

  // ── Dijes — Alpaca ───────────────────────────────────────────────────────────
  { id: 'd03', cat: 'dijes', subcat: 'dijes-alpaca',       name: 'Dije Alpaca Luna Creciente',   price: 5900,  tone: 'rose',   label: 'dije · alpaca',           tags: ['alpaca', 'amor', 'intuición'],             rating: 0, reviews: 0,           image: IMG_RING_ALPACA },
  { id: 'd14', cat: 'dijes', subcat: 'dijes-alpaca',       name: 'Dije Alpaca Árbol de la Vida', price: 6800,  tone: 'moss',   label: 'dije · alpaca',           tags: ['alpaca', 'crecimiento personal'],           rating: 0, reviews: 0,           image: IMG_ARO_ALPACA  },
  { id: 'd15', cat: 'dijes', subcat: 'dijes-alpaca',       name: 'Dije Alpaca Elefante Fortuna', price: 5500,  tone: 'clay',   label: 'dije · alpaca',           tags: ['alpaca', 'prosperidad', 'abundancia'],     rating: 0, reviews: 0,           image: IMG_RING_ALPACA },

  // ── Pulseras — Plata ─────────────────────────────────────────────────────────
  { id: 'pu01', cat: 'pulseras', subcat: 'pulseras-plata',           name: 'Pulsera Plata 925 Eslabones',    price: 21500, tone: 'stone',  label: 'pulsera · plata',          tags: ['plata', 'amor'],                             rating: 0, reviews: 0, new: true, image: IMG_PULSERA_SILVER },
  { id: 'pu10', cat: 'pulseras', subcat: 'pulseras-plata',           name: 'Pulsera Plata 925 Rígida',       price: 23900, tone: 'stone',  label: 'pulsera · plata',          tags: ['plata', 'concreción', 'prosperidad'],        rating: 0, reviews: 0,           image: IMG_PULSERA_SILVER },
  { id: 'pu11', cat: 'pulseras', subcat: 'pulseras-plata',           name: 'Pulsera Plata 925 Charm',        price: 19800, tone: 'rose',   label: 'pulsera · plata',          tags: ['plata', 'amor', 'comunicación'],             rating: 0, reviews: 0,           image: IMG_PULSERA_SILVER },

  // ── Pulseras — Acero Dorado ──────────────────────────────────────────────────
  { id: 'pu02', cat: 'pulseras', subcat: 'pulseras-acero-dorado',    name: 'Pulsera Acero Dorado Delicada',  price: 11500, tone: 'ember',  label: 'pulsera · acero dorado',   tags: ['acero dorado', 'prosperidad', 'abundancia'], rating: 0, reviews: 0,           image: IMG_PULSERA_GOLD   },
  { id: 'pu12', cat: 'pulseras', subcat: 'pulseras-acero-dorado',    name: 'Pulsera Acero Dorado Rígida',    price: 12900, tone: 'ember',  label: 'pulsera · acero dorado',   tags: ['acero dorado', 'prosperidad'],               rating: 0, reviews: 0,           image: IMG_PULSERA_GOLD   },
  { id: 'pu13', cat: 'pulseras', subcat: 'pulseras-acero-dorado',    name: 'Pulsera Acero Dorado Cadena',    price: 13400, tone: 'ember',  label: 'pulsera · acero dorado',   tags: ['acero dorado', 'abundancia'],                rating: 0, reviews: 0,           image: IMG_PULSERA_GOLD   },

  // ── Pulseras — Acero Blanco ──────────────────────────────────────────────────
  { id: 'pu06', cat: 'pulseras', subcat: 'pulseras-acero-blanco',    name: 'Pulsera Acero Blanco Minimalista',price: 9800, tone: 'cream',  label: 'pulsera · acero blanco',   tags: ['acero blanco', 'calma'],                     rating: 0, reviews: 0,           image: IMG_COLLAR_WHITE   },
  { id: 'pu14', cat: 'pulseras', subcat: 'pulseras-acero-blanco',    name: 'Pulsera Acero Blanco Rígida',    price: 10900, tone: 'cream',  label: 'pulsera · acero blanco',   tags: ['acero blanco', 'concreción'],                rating: 0, reviews: 0,           image: IMG_COLLAR_WHITE   },
  { id: 'pu15', cat: 'pulseras', subcat: 'pulseras-acero-blanco',    name: 'Pulsera Acero Blanco Cadena',    price: 11200, tone: 'cream',  label: 'pulsera · acero blanco',   tags: ['acero blanco', 'calma', 'amor'],             rating: 0, reviews: 0,           image: IMG_COLLAR_WHITE   },

  // ── Pulseras — Acero Quirúrgico ──────────────────────────────────────────────
  { id: 'pu05', cat: 'pulseras', subcat: 'pulseras-acero-qx',        name: 'Pulsera Acero Quirúrgico Cadena',price: 10500, tone: 'stone',  label: 'pulsera · acero quirúrgico', tags: ['acero quirúrgico', 'concreción', 'protección'], rating: 0, reviews: 0,       image: IMG_RING_STEEL     },
  { id: 'pu16', cat: 'pulseras', subcat: 'pulseras-acero-qx',        name: 'Pulsera Acero Quirúrgico Rígida',price: 11800, tone: 'cream',  label: 'pulsera · acero quirúrgico', tags: ['acero quirúrgico', 'escudos'],              rating: 0, reviews: 0,           image: IMG_RING_STEEL     },
  { id: 'pu17', cat: 'pulseras', subcat: 'pulseras-acero-qx',        name: 'Pulsera Acero Quirúrgico Fina',  price: 9400,  tone: 'cream',  label: 'pulsera · acero quirúrgico', tags: ['acero quirúrgico', 'calma'],               rating: 0, reviews: 0,           image: IMG_RING_STEEL     },

  // ── Pulseras — Gamuza ────────────────────────────────────────────────────────
  { id: 'pu03', cat: 'pulseras', subcat: 'pulseras-gamuza',          name: 'Pulsera Gamuza Con Turquesa',    price: 9200,  tone: 'clay',   label: 'pulsera · gamuza',         tags: ['gamuza', 'calma', 'protección'],             rating: 0, reviews: 0,           image: IMG_PULSERA_GAMUZA },
  { id: 'pu18', cat: 'pulseras', subcat: 'pulseras-gamuza',          name: 'Pulsera Gamuza Cuarzo Rosado',   price: 10100, tone: 'rose',   label: 'pulsera · gamuza',         tags: ['gamuza', 'amor', 'sanación'],                rating: 0, reviews: 0,           image: IMG_PULSERA_GAMUZA },
  { id: 'pu19', cat: 'pulseras', subcat: 'pulseras-gamuza',          name: 'Pulsera Gamuza Obsidiana',       price: 9800,  tone: 'stone',  label: 'pulsera · gamuza',         tags: ['gamuza', 'protección', 'escudos'],           rating: 0, reviews: 0,           image: IMG_PULSERA_GAMUZA },

  // ── Pulseras — Hilos ─────────────────────────────────────────────────────────
  { id: 'pu07', cat: 'pulseras', subcat: 'pulseras-hilos',           name: 'Pulsera Hilos Artesanal',        price: 6800,  tone: 'moss',   label: 'pulsera · hilos',          tags: ['hilos', 'amor', 'crecimiento personal'],     rating: 0, reviews: 0,           image: IMG_ARO_ALPACA     },
  { id: 'pu20', cat: 'pulseras', subcat: 'pulseras-hilos',           name: 'Pulsera Hilos Macramé',          price: 7500,  tone: 'clay',   label: 'pulsera · hilos',          tags: ['hilos', 'calma'],                            rating: 0, reviews: 0,           image: IMG_ARO_ALPACA     },
  { id: 'pu21', cat: 'pulseras', subcat: 'pulseras-hilos',           name: 'Pulsera Hilos Multicolor',       price: 5900,  tone: 'sage',   label: 'pulsera · hilos',          tags: ['hilos', 'amor', 'comunicación'],             rating: 0, reviews: 0,           image: IMG_ARO_ALPACA     },

  // ── Pulseras — Alpaca ────────────────────────────────────────────────────────
  { id: 'pu08', cat: 'pulseras', subcat: 'pulseras-alpaca',          name: 'Pulsera Alpaca Multicolor',      price: 7200,  tone: 'rose',   label: 'pulsera · alpaca',         tags: ['alpaca', 'amor', 'alegría'],                 rating: 0, reviews: 0,           image: IMG_RING_ALPACA    },
  { id: 'pu22', cat: 'pulseras', subcat: 'pulseras-alpaca',          name: 'Pulsera Alpaca Eslabones',       price: 8400,  tone: 'clay',   label: 'pulsera · alpaca',         tags: ['alpaca', 'prosperidad'],                     rating: 0, reviews: 0,           image: IMG_RING_ALPACA    },
  { id: 'pu23', cat: 'pulseras', subcat: 'pulseras-alpaca',          name: 'Pulsera Alpaca Con Gema',        price: 9100,  tone: 'sage',   label: 'pulsera · alpaca',         tags: ['alpaca', 'calma', 'sanación'],               rating: 0, reviews: 0,           image: IMG_RING_ALPACA    },

  // ── Pulseras — Piedras Escalas ───────────────────────────────────────────────
  { id: 'pu09', cat: 'pulseras', subcat: 'pulseras-piedras-escalas', name: 'Pulsera Escalas Amatista',       price: 14500, tone: 'indigo', label: 'pulsera · piedras escalas', tags: ['piedras', 'escalas', 'sanación', 'calma'],   rating: 0, reviews: 0,           image: IMG_PULSERA_PIEDRA },
  { id: 'pu24', cat: 'pulseras', subcat: 'pulseras-piedras-escalas', name: 'Pulsera Escalas Cuarzo Rosa',    price: 13900, tone: 'rose',   label: 'pulsera · piedras escalas', tags: ['piedras', 'escalas', 'amor'],                rating: 0, reviews: 0,           image: IMG_PULSERA_PIEDRA },
  { id: 'pu25', cat: 'pulseras', subcat: 'pulseras-piedras-escalas', name: 'Pulsera Escalas Obsidiana',      price: 12800, tone: 'stone',  label: 'pulsera · piedras escalas', tags: ['piedras', 'escalas', 'protección', 'escudos'], rating: 0, reviews: 0,       image: IMG_PULSERA_PIEDRA },

  // ── Pulseras — Piedras Roladas ───────────────────────────────────────────────
  { id: 'pu04', cat: 'pulseras', subcat: 'pulseras-piedras-roladas', name: 'Pulsera Piedras Roladas Cuarzo', price: 14900, tone: 'cream',  label: 'pulsera · piedras roladas', tags: ['piedras', 'roladas', 'sanación', 'calma'],   rating: 0, reviews: 0,           image: IMG_PULSERA_PIEDRA },
  { id: 'pu26', cat: 'pulseras', subcat: 'pulseras-piedras-roladas', name: 'Pulsera Labradorita Rolada',     price: 16200, tone: 'indigo', label: 'pulsera · piedras roladas', tags: ['piedras', 'roladas', 'intuición'],           rating: 0, reviews: 0,           image: IMG_PULSERA_PIEDRA },
  { id: 'pu27', cat: 'pulseras', subcat: 'pulseras-piedras-roladas', name: 'Pulsera Ojo De Tigre Rolado',    price: 15400, tone: 'ember',  label: 'pulsera · piedras roladas', tags: ['piedras', 'roladas', 'prosperidad', 'concreción'], rating: 0, reviews: 0, image: IMG_PULSERA_PIEDRA },

  // ── Aros — Acero Blanco ──────────────────────────────────────────────────────
  { id: 'ar04', cat: 'aros', subcat: 'aros-acero-blanco', name: 'Aros Acero Blanco Aro Liso',     price: 8500,  tone: 'cream',  label: 'aros · acero blanco',     tags: ['acero blanco', 'calma', 'comunicación'],    rating: 0, reviews: 0,           image: IMG_ARO_STEEL   },
  { id: 'ar05', cat: 'aros', subcat: 'aros-acero-blanco', name: 'Aros Acero Blanco Argolla Mini', price: 9200,  tone: 'cream',  label: 'aros · acero blanco',     tags: ['acero blanco', 'amor'],                     rating: 0, reviews: 0,           image: IMG_ARO_STEEL   },
  { id: 'ar06', cat: 'aros', subcat: 'aros-acero-blanco', name: 'Aros Acero Blanco Colgante',     price: 10400, tone: 'cream',  label: 'aros · acero blanco',     tags: ['acero blanco', 'crecimiento personal'],     rating: 0, reviews: 0,           image: IMG_ARO_STEEL   },

  // ── Aros — Acero Quirúrgico ──────────────────────────────────────────────────
  { id: 'ar02', cat: 'aros', subcat: 'aros-acero-qx',    name: 'Aros Acero Quirúrgico Mini Aro', price: 9500,  tone: 'cream',  label: 'aros · acero quirúrgico', tags: ['acero quirúrgico', 'amor'],                 rating: 0, reviews: 0,           image: IMG_ARO_STEEL   },
  { id: 'ar07', cat: 'aros', subcat: 'aros-acero-qx',    name: 'Aros Acero Quirúrgico Largo',    price: 11200, tone: 'stone',  label: 'aros · acero quirúrgico', tags: ['acero quirúrgico', 'comunicación'],         rating: 0, reviews: 0,           image: IMG_ARO_STEEL   },
  { id: 'ar08', cat: 'aros', subcat: 'aros-acero-qx',    name: 'Aros Acero Quirúrgico Gota',     price: 10800, tone: 'cream',  label: 'aros · acero quirúrgico', tags: ['acero quirúrgico', 'amor'],                 rating: 0, reviews: 0,           image: IMG_ARO_STEEL   },

  // ── Aros — Plata ─────────────────────────────────────────────────────────────
  { id: 'ar01', cat: 'aros', subcat: 'aros-plata',       name: 'Aros Argolla Plata 925',         price: 17500, tone: 'stone',  label: 'aros · plata',            tags: ['plata', 'comunicación', 'amor'],            rating: 0, reviews: 0, new: true, image: IMG_ARO_SILVER  },
  { id: 'ar09', cat: 'aros', subcat: 'aros-plata',       name: 'Aros Plata 925 Gota Nacar',      price: 19800, tone: 'rose',   label: 'aros · plata',            tags: ['plata', 'amor', 'calma'],                   rating: 0, reviews: 0,           image: IMG_ARO_SILVER  },
  { id: 'ar10', cat: 'aros', subcat: 'aros-plata',       name: 'Aros Plata 925 Colgante Hoja',   price: 18200, tone: 'moss',   label: 'aros · plata',            tags: ['plata', 'crecimiento personal'],            rating: 0, reviews: 0,           image: IMG_ARO_SILVER  },

  // ── Aros — Alpaca ────────────────────────────────────────────────────────────
  { id: 'ar03', cat: 'aros', subcat: 'aros-alpaca',      name: 'Aros Alpaca Boho Tejidos',       price: 6800,  tone: 'moss',   label: 'aros · alpaca',           tags: ['alpaca', 'crecimiento personal'],           rating: 0, reviews: 0,           image: IMG_ARO_ALPACA  },
  { id: 'ar11', cat: 'aros', subcat: 'aros-alpaca',      name: 'Aros Alpaca Con Turquesa',       price: 7900,  tone: 'sage',   label: 'aros · alpaca',           tags: ['alpaca', 'calma', 'comunicación'],          rating: 0, reviews: 0,           image: IMG_ARO_ALPACA  },
  { id: 'ar12', cat: 'aros', subcat: 'aros-alpaca',      name: 'Aros Alpaca Colgante Flor',      price: 7200,  tone: 'rose',   label: 'aros · alpaca',           tags: ['alpaca', 'amor'],                           rating: 0, reviews: 0,           image: IMG_ARO_ALPACA  },

  // ── Tobilleras — Acero Dorado ────────────────────────────────────────────────
  { id: 'to01', cat: 'tobilleras', subcat: 'tobilleras-acero-dorado',    name: 'Tobillera Acero Dorado Fina',      price: 10900, tone: 'ember', label: 'tobillera · acero dorado',    tags: ['acero dorado', 'prosperidad'],              rating: 0, reviews: 0,           image: IMG_TOBILLERA        },
  { id: 'to08', cat: 'tobilleras', subcat: 'tobilleras-acero-dorado',    name: 'Tobillera Acero Dorado Eslabones', price: 12400, tone: 'ember', label: 'tobillera · acero dorado',    tags: ['acero dorado', 'abundancia'],               rating: 0, reviews: 0,           image: IMG_TOBILLERA        },
  { id: 'to09', cat: 'tobilleras', subcat: 'tobilleras-acero-dorado',    name: 'Tobillera Acero Dorado Cadena',    price: 11800, tone: 'ember', label: 'tobillera · acero dorado',    tags: ['acero dorado', 'prosperidad', 'concreción'],rating: 0, reviews: 0,           image: IMG_TOBILLERA        },

  // ── Tobilleras — Acero Blanco ────────────────────────────────────────────────
  { id: 'to05', cat: 'tobilleras', subcat: 'tobilleras-acero-blanco',    name: 'Tobillera Acero Blanco Delicada',  price: 9800,  tone: 'cream', label: 'tobillera · acero blanco',    tags: ['acero blanco', 'calma'],                    rating: 0, reviews: 0,           image: IMG_COLLAR_WHITE     },
  { id: 'to10', cat: 'tobilleras', subcat: 'tobilleras-acero-blanco',    name: 'Tobillera Acero Blanco Fina',      price: 8900,  tone: 'cream', label: 'tobillera · acero blanco',    tags: ['acero blanco', 'calma', 'amor'],            rating: 0, reviews: 0,           image: IMG_COLLAR_WHITE     },
  { id: 'to11', cat: 'tobilleras', subcat: 'tobilleras-acero-blanco',    name: 'Tobillera Acero Blanco Rígida',    price: 10500, tone: 'cream', label: 'tobillera · acero blanco',    tags: ['acero blanco', 'concreción'],               rating: 0, reviews: 0,           image: IMG_COLLAR_WHITE     },

  // ── Tobilleras — Acero Quirúrgico ────────────────────────────────────────────
  { id: 'to04', cat: 'tobilleras', subcat: 'tobilleras-acero-qx',        name: 'Tobillera Acero Quirúrgico',       price: 9200,  tone: 'stone', label: 'tobillera · acero quirúrgico', tags: ['acero quirúrgico', 'protección'],           rating: 0, reviews: 0,           image: IMG_TOBILLERA        },
  { id: 'to12', cat: 'tobilleras', subcat: 'tobilleras-acero-qx',        name: 'Tobillera Acero Quirúrgico Nudo',  price: 9900,  tone: 'stone', label: 'tobillera · acero quirúrgico', tags: ['acero quirúrgico', 'concreción'],           rating: 0, reviews: 0,           image: IMG_TOBILLERA        },
  { id: 'to13', cat: 'tobilleras', subcat: 'tobilleras-acero-qx',        name: 'Tobillera Acero Quirúrgico Fina',  price: 8600,  tone: 'cream', label: 'tobillera · acero quirúrgico', tags: ['acero quirúrgico', 'calma'],               rating: 0, reviews: 0,           image: IMG_TOBILLERA        },

  // ── Tobilleras — Gamuza ──────────────────────────────────────────────────────
  { id: 'to06', cat: 'tobilleras', subcat: 'tobilleras-gamuza',          name: 'Tobillera Gamuza Con Dije',        price: 7900,  tone: 'clay',  label: 'tobillera · gamuza',          tags: ['gamuza', 'amor', 'protección'],             rating: 0, reviews: 0,           image: IMG_PULSERA_GAMUZA   },
  { id: 'to14', cat: 'tobilleras', subcat: 'tobilleras-gamuza',          name: 'Tobillera Gamuza Cuarzo',          price: 8500,  tone: 'rose',  label: 'tobillera · gamuza',          tags: ['gamuza', 'amor', 'sanación'],               rating: 0, reviews: 0,           image: IMG_PULSERA_GAMUZA   },
  { id: 'to15', cat: 'tobilleras', subcat: 'tobilleras-gamuza',          name: 'Tobillera Gamuza Ojo Turco',       price: 7400,  tone: 'indigo',label: 'tobillera · gamuza',          tags: ['gamuza', 'escudos', 'protección'],          rating: 0, reviews: 0,           image: IMG_PULSERA_GAMUZA   },

  // ── Tobilleras — Hilos ───────────────────────────────────────────────────────
  { id: 'to02', cat: 'tobilleras', subcat: 'tobilleras-hilos',           name: 'Tobillera Hilos Artesanal',        price: 7500,  tone: 'sage',  label: 'tobillera · hilos',           tags: ['hilos', 'amor'],                            rating: 0, reviews: 0,           image: IMG_ARO_ALPACA       },
  { id: 'to16', cat: 'tobilleras', subcat: 'tobilleras-hilos',           name: 'Tobillera Hilos Macramé',          price: 8200,  tone: 'clay',  label: 'tobillera · hilos',           tags: ['hilos', 'crecimiento personal'],            rating: 0, reviews: 0,           image: IMG_ARO_ALPACA       },
  { id: 'to17', cat: 'tobilleras', subcat: 'tobilleras-hilos',           name: 'Tobillera Hilos Multicolor',       price: 6800,  tone: 'moss',  label: 'tobillera · hilos',           tags: ['hilos', 'amor', 'calma'],                   rating: 0, reviews: 0,           image: IMG_ARO_ALPACA       },

  // ── Tobilleras — Piedras Escalas ─────────────────────────────────────────────
  { id: 'to03', cat: 'tobilleras', subcat: 'tobilleras-piedras-escalas', name: 'Tobillera Piedras Escalas',        price: 12900, tone: 'rose',  label: 'tobillera · piedras escalas', tags: ['piedras', 'escalas', 'sanación', 'amor'],   rating: 0, reviews: 0, new: true, image: IMG_TOBILLERA_PIEDRA },
  { id: 'to18', cat: 'tobilleras', subcat: 'tobilleras-piedras-escalas', name: 'Tobillera Escalas Amatista',       price: 13800, tone: 'indigo',label: 'tobillera · piedras escalas', tags: ['piedras', 'escalas', 'calma', 'sanación'],  rating: 0, reviews: 0,           image: IMG_TOBILLERA_PIEDRA },
  { id: 'to19', cat: 'tobilleras', subcat: 'tobilleras-piedras-escalas', name: 'Tobillera Escalas Obsidiana',      price: 12200, tone: 'stone', label: 'tobillera · piedras escalas', tags: ['piedras', 'escalas', 'protección'],         rating: 0, reviews: 0,           image: IMG_TOBILLERA_PIEDRA },

  // ── Tobilleras — Piedras Roladas ─────────────────────────────────────────────
  { id: 'to07', cat: 'tobilleras', subcat: 'tobilleras-piedras-roladas', name: 'Tobillera Piedras Roladas',        price: 11900, tone: 'cream', label: 'tobillera · piedras roladas', tags: ['piedras', 'roladas', 'calma', 'sanación'],  rating: 0, reviews: 0,           image: IMG_TOBILLERA_PIEDRA },
  { id: 'to20', cat: 'tobilleras', subcat: 'tobilleras-piedras-roladas', name: 'Tobillera Cuarzo Rolado',          price: 12500, tone: 'rose',  label: 'tobillera · piedras roladas', tags: ['piedras', 'roladas', 'amor'],               rating: 0, reviews: 0,           image: IMG_TOBILLERA_PIEDRA },
  { id: 'to21', cat: 'tobilleras', subcat: 'tobilleras-piedras-roladas', name: 'Tobillera Labradorita Rolada',     price: 13400, tone: 'indigo',label: 'tobillera · piedras roladas', tags: ['piedras', 'roladas', 'intuición', 'crecimiento personal'], rating: 0, reviews: 0, image: IMG_TOBILLERA_PIEDRA },

  // ── Piedras — En Bruto ───────────────────────────────────────────────────────
  { id: 'pi01', cat: 'piedras', subcat: 'piedras-bruto', name: 'Amatista En Bruto Pequeña',  price: 5500,              tone: 'indigo', label: 'piedra · en bruto',  tags: ['en bruto', 'sanación', 'calma', 'intuición'],           rating: 0, reviews: 0,           image: IMG_AMATISTA   },
  { id: 'pi02', cat: 'piedras', subcat: 'piedras-bruto', name: 'Amatista En Bruto Grande',   price: 18900,             tone: 'indigo', label: 'piedra · en bruto',  tags: ['en bruto', 'sanación', 'intuición', 'crecimiento personal'], rating: 0, reviews: 0, new: true, image: IMG_AMATISTA },
  { id: 'pi06', cat: 'piedras', subcat: 'piedras-bruto', name: 'Pirita En Bruto Mediana',    price: 12400,             tone: 'ember',  label: 'piedra · en bruto',  tags: ['en bruto', 'prosperidad', 'abundancia', 'concreción'],  rating: 0, reviews: 0,           image: IMG_CITRINO    },

  // ── Piedras — Roladas ────────────────────────────────────────────────────────
  { id: 'pi03', cat: 'piedras', subcat: 'piedras-roladas', name: 'Cuarzo Rosa Rolado Mediano',  price: 6900,           tone: 'rose',   label: 'piedra · rolada',   tags: ['roladas', 'amor', 'calma', 'sanación'],                 rating: 0, reviews: 0,           image: IMG_CUARZO_ROSA },
  { id: 'pi04', cat: 'piedras', subcat: 'piedras-roladas', name: 'Obsidiana Negra Rolada',      price: 7800,           tone: 'stone',  label: 'piedra · rolada',   tags: ['roladas', 'protección', 'escudos', 'concreción'],       rating: 0, reviews: 0,           image: IMG_OBSIDIANA   },
  { id: 'pi07', cat: 'piedras', subcat: 'piedras-roladas', name: 'Labradorita Rolada Grande',   price: 11500,          tone: 'indigo', label: 'piedra · rolada',   tags: ['roladas', 'intuición', 'crecimiento personal'],         rating: 0, reviews: 0,           image: IMG_AMATISTA    },

  // ── Piedras — Especiales ─────────────────────────────────────────────────────
  { id: 'pi05', cat: 'piedras', subcat: 'piedras-especiales', name: 'Citrino Natural Especial', price: 24500, was: 29000, tone: 'ember',  label: 'piedra · especial', tags: ['especiales', 'abundancia', 'prosperidad'],             rating: 0, reviews: 0,           image: IMG_CITRINO     },
  { id: 'pi08', cat: 'piedras', subcat: 'piedras-especiales', name: 'Turmalina Especial',       price: 21900,             tone: 'stone',  label: 'piedra · especial', tags: ['especiales', 'protección', 'escudos', 'sanación'],     rating: 0, reviews: 0,           image: IMG_OBSIDIANA   },
  { id: 'pi09', cat: 'piedras', subcat: 'piedras-especiales', name: 'Selenita Natural Grande',  price: 19500,             tone: 'cream',  label: 'piedra · especial', tags: ['especiales', 'calma', 'sanación', 'comunicación'],    rating: 0, reviews: 0,           image: IMG_CUARZO_ROSA },

  // ── Complementos — Botellas Energéticas ──────────────────────────────────────
  { id: 'co03', cat: 'complementos', subcat: 'comp-botellas',     name: 'Botella Energética Con Amatista', price: 15900, tone: 'indigo', label: 'botella · amatista',  tags: ['sanación', 'abundancia', 'calma'],               rating: 0, reviews: 0,           image: IMG_BOTELLA    },
  { id: 'co08', cat: 'complementos', subcat: 'comp-botellas',     name: 'Botella Energética Cuarzo Rosa',  price: 14500, tone: 'rose',   label: 'botella · cuarzo rosa',tags: ['amor', 'sanación', 'calma'],                    rating: 0, reviews: 0,           image: IMG_BOTELLA    },
  { id: 'co09', cat: 'complementos', subcat: 'comp-botellas',     name: 'Botella Energética Citrino',      price: 17900, tone: 'ember',  label: 'botella · citrino',   tags: ['abundancia', 'prosperidad', 'concreción'],      rating: 0, reviews: 0,           image: IMG_BOTELLA    },

  // ── Complementos — Lápices y Lapiceras ───────────────────────────────────────
  { id: 'co06', cat: 'complementos', subcat: 'comp-lapices',      name: 'Lápiz Energético Amatista',       price: 9800,  tone: 'indigo', label: 'lápiz · amatista',    tags: ['sanación', 'intuición', 'calma'],               rating: 0, reviews: 0,           image: IMG_PENDULO    },
  { id: 'co10', cat: 'complementos', subcat: 'comp-lapices',      name: 'Lápiz Energético Cuarzo Rosa',    price: 8900,  tone: 'rose',   label: 'lápiz · cuarzo rosa', tags: ['amor', 'sanación'],                             rating: 0, reviews: 0,           image: IMG_PENDULO    },
  { id: 'co11', cat: 'complementos', subcat: 'comp-lapices',      name: 'Lapicera Energética Turmalina',   price: 11500, tone: 'stone',  label: 'lapicera · turmalina', tags: ['protección', 'escudos', 'concreción'],         rating: 0, reviews: 0,           image: IMG_PENDULO    },

  // ── Complementos — Péndulos y Tableros ───────────────────────────────────────
  { id: 'co01', cat: 'complementos', subcat: 'comp-pendulos',     name: 'Péndulo De Cuarzo Con Tablero',   price: 18500, tone: 'cream',  label: 'péndulo · cuarzo',    tags: ['sanación', 'comunicación', 'intuición'],        rating: 0, reviews: 0,           image: IMG_PENDULO    },
  { id: 'co12', cat: 'complementos', subcat: 'comp-pendulos',     name: 'Péndulo Amatista Hexagonal',      price: 14900, tone: 'indigo', label: 'péndulo · amatista',  tags: ['intuición', 'sanación', 'calma'],               rating: 0, reviews: 0,           image: IMG_PENDULO    },
  { id: 'co13', cat: 'complementos', subcat: 'comp-pendulos',     name: 'Tablero Radiestesia Madera',      price: 22400, tone: 'clay',   label: 'tablero · madera',    tags: ['intuición', 'comunicación'],                    rating: 0, reviews: 0,           image: IMG_PENDULO    },

  // ── Complementos — Figuras Especiales ────────────────────────────────────────
  { id: 'co04', cat: 'complementos', subcat: 'comp-figuras',      name: 'Figura Buda Jade Pequeña',        price: 12500, tone: 'sage',   label: 'figura · jade',       tags: ['calma', 'prosperidad'],                         rating: 0, reviews: 0,           image: IMG_BUDA       },
  { id: 'co14', cat: 'complementos', subcat: 'comp-figuras',      name: 'Figura Elefante Cuarzo Rosa',     price: 16800, tone: 'rose',   label: 'figura · cuarzo',     tags: ['amor', 'prosperidad', 'abundancia'],            rating: 0, reviews: 0,           image: IMG_BUDA       },
  { id: 'co15', cat: 'complementos', subcat: 'comp-figuras',      name: 'Figura Dragón Obsidiana',         price: 21500, tone: 'stone',  label: 'figura · obsidiana',  tags: ['protección', 'escudos', 'concreción'],          rating: 0, reviews: 0,           image: IMG_BUDA       },

  // ── Complementos — Instrumentos de Bienestar ─────────────────────────────────
  { id: 'co07', cat: 'complementos', subcat: 'comp-instrumentos', name: 'Cuenco Tibetano Pequeño',         price: 28500, tone: 'ember',  label: 'cuenco · tibetano',   tags: ['sanación', 'calma', 'comunicación'],            rating: 0, reviews: 0,           image: IMG_BUDA       },
  { id: 'co16', cat: 'complementos', subcat: 'comp-instrumentos', name: 'Cuenco Tibetano Mediano',         price: 38900, tone: 'ember',  label: 'cuenco · tibetano',   tags: ['sanación', 'calma', 'crecimiento personal'],    rating: 0, reviews: 0,           image: IMG_BUDA       },
  { id: 'co17', cat: 'complementos', subcat: 'comp-instrumentos', name: 'Sahumerio Blanco del Alma',       price: 8900,  tone: 'cream',  label: 'sahumerio',           tags: ['sanación', 'calma', 'protección'],              rating: 0, reviews: 0,           image: IMG_BUDA       },

  // ── Complementos — Oráculos ──────────────────────────────────────────────────
  { id: 'co02', cat: 'complementos', subcat: 'comp-oraculos',     name: 'Oráculo Del Alma — 44 Cartas',   price: 22900, tone: 'indigo', label: 'oráculo · 44 cartas', tags: ['intuición', 'comunicación', 'crecimiento personal'], rating: 0, reviews: 0, new: true, image: IMG_ORACULO },
  { id: 'co18', cat: 'complementos', subcat: 'comp-oraculos',     name: 'Tarot Del Despertar',             price: 26500, tone: 'indigo', label: 'oráculo · tarot',     tags: ['intuición', 'comunicación'],                    rating: 0, reviews: 0,           image: IMG_ORACULO    },
  { id: 'co19', cat: 'complementos', subcat: 'comp-oraculos',     name: 'Oráculo Angelical — 33 Cartas',  price: 19800, tone: 'cream',  label: 'oráculo · angelical', tags: ['comunicación', 'amor', 'protección'],           rating: 0, reviews: 0,           image: IMG_ORACULO    },

  // ── Complementos — Amuletos ──────────────────────────────────────────────────
  { id: 'co05', cat: 'complementos', subcat: 'comp-amuletos',     name: 'Amuleto Ojo Protector',           price: 9800,  tone: 'ember',  label: 'amuleto',             tags: ['protección', 'escudos'],                        rating: 0, reviews: 0,           image: IMG_AMULETO    },
  { id: 'co20', cat: 'complementos', subcat: 'comp-amuletos',     name: 'Amuleto Hamsa Plata',             price: 14200, tone: 'stone',  label: 'amuleto · plata',     tags: ['protección', 'escudos', 'amor'],                rating: 0, reviews: 0,           image: IMG_AMULETO    },
  { id: 'co21', cat: 'complementos', subcat: 'comp-amuletos',     name: 'Amuleto Árbol Vida Cuarzo',       price: 11900, tone: 'sage',   label: 'amuleto · cuarzo',    tags: ['protección', 'crecimiento personal', 'amor'],   rating: 0, reviews: 0,           image: IMG_AMULETO    },
];

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
  'amor', 'prosperidad', 'abundancia', 'protección', 'escudos',
  'calma', 'crecimiento personal', 'concreción', 'comunicación', 'sanación',
];
