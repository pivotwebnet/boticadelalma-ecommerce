import { Category, Collection, PriceRange, Product, Tone } from './types';

export const CATEGORIES: Category[] = [
  // Joyería
  { id: 'anillos',    name: 'Anillos',    count: 0, icon: 'ring',     group: 'Joyería' },
  { id: 'collares',   name: 'Collares',   count: 0, icon: 'necklace', group: 'Joyería' },
  { id: 'dijes',      name: 'Dijes',      count: 0, icon: 'charm',    group: 'Joyería' },
  { id: 'pulseras',   name: 'Pulseras',   count: 0, icon: 'bracelet', group: 'Joyería' },
  { id: 'aros',       name: 'Aros',       count: 0, icon: 'earring',  group: 'Joyería' },
  { id: 'tobilleras', name: 'Tobilleras', count: 0, icon: 'anklet',   group: 'Joyería' },
  // Piedras & Complementos
  {
    id: 'piedras', name: 'Piedras Naturales', count: 0, icon: 'crystal',
    subcategories: [
      { id: 'piedras-bruto',     name: 'En Bruto'   },
      { id: 'piedras-roladas',   name: 'Roladas'    },
      { id: 'piedras-especiales',name: 'Especiales' },
    ]
  },
  {
    id: 'complementos', name: 'Complementos', count: 0, icon: 'accessory',
    subcategories: [
      { id: 'comp-botellas',      name: 'Botellas Energéticas'      },
      { id: 'comp-lapices',       name: 'Lápices Energéticos'       },
      { id: 'comp-pendulos',      name: 'Péndulos y Tableros'       },
      { id: 'comp-figuras',       name: 'Figuras Especiales'        },
      { id: 'comp-instrumentos',  name: 'Instrumentos de Bienestar' },
      { id: 'comp-oraculos',      name: 'Oráculos'                  },
      { id: 'comp-amuletos',      name: 'Amuletos'                  },
    ]
  },
];

export const COLLECTIONS: Collection[] = [
  { id: 'plata',     name: 'Colección Plata',     subtitle: 'Joyería 925 artesanal'    },
  { id: 'piedras',   name: 'Piedras del Alma',    subtitle: 'Naturales y sin procesar' },
  { id: 'bienestar', name: 'Bienestar & Rituales',subtitle: 'Complementos energéticos' },
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
  // ── Anillos ──────────────────────────────────────────────────────────────────
  { id: 'a01', cat: 'anillos',    name: 'Anillo Plata 925 Minimalista',    price: 19500,            tone: 'stone',  label: 'anillo · plata',          tags: ['plata', 'amor', 'comunicación'],              rating: 0, reviews: 0, new: true,  image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80' },
  { id: 'a02', cat: 'anillos',    name: 'Anillo Acero Quirúrgico Liso',    price: 9800,             tone: 'cream',  label: 'anillo · acero',          tags: ['acero quirúrgico', 'concreción'],             rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1611085583191-a3b13b24424a?auto=format&fit=crop&w=800&q=80' },
  { id: 'a03', cat: 'anillos',    name: 'Anillo Alpaca Luna',              price: 6500,             tone: 'rose',   label: 'anillo · alpaca',         tags: ['alpaca', 'amor', 'intuición'],               rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80' },
  // ── Collares ─────────────────────────────────────────────────────────────────
  { id: 'c01', cat: 'collares',   name: 'Collar Plata 925 Celestial',      price: 24900,            tone: 'stone',  label: 'collar · plata',          tags: ['plata', 'amor', 'comunicación'],              rating: 0, reviews: 0, new: true,  image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80' },
  { id: 'c02', cat: 'collares',   name: 'Collar Acero Dorado Cadena Fina', price: 13500,            tone: 'ember',  label: 'collar · acero dorado',   tags: ['acero dorado', 'prosperidad'],               rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1611085583191-a3b13b24424a?auto=format&fit=crop&w=800&q=80' },
  { id: 'c03', cat: 'collares',   name: 'Collar Acero Blanco Minimalista', price: 11900,            tone: 'cream',  label: 'collar · acero blanco',   tags: ['acero blanco', 'calma'],                     rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' },
  { id: 'c04', cat: 'collares',   name: 'Collar Cuarzo Rosa Escallas',     price: 16900,            tone: 'rose',   label: 'collar · piedras',        tags: ['piedras', 'escallas', 'amor', 'sanación'],   rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' },
  { id: 'c05', cat: 'collares',   name: 'Collar Hilos Con Dije',           price: 8900,             tone: 'sage',   label: 'collar · hilos',          tags: ['hilos', 'protección', 'amor'],               rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80' },
  { id: 'c06', cat: 'collares',   name: 'Collar Alpaca Artesanal',         price: 7500,             tone: 'moss',   label: 'collar · alpaca',         tags: ['alpaca', 'crecimiento personal'],             rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80' },
  // ── Dijes ────────────────────────────────────────────────────────────────────
  { id: 'd01', cat: 'dijes',      name: 'Dije Plata 925 Ojo Celeste',      price: 14500,            tone: 'indigo', label: 'dije · plata',            tags: ['plata', 'protección', 'escudos'],            rating: 0, reviews: 0, new: true,  image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80' },
  { id: 'd02', cat: 'dijes',      name: 'Dije Acero Quirúrgico Ángel',     price: 7800,             tone: 'stone',  label: 'dije · acero',            tags: ['acero quirúrgico', 'protección'],            rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80' },
  { id: 'd03', cat: 'dijes',      name: 'Dije Alpaca Luna Creciente',      price: 5900,             tone: 'rose',   label: 'dije · alpaca',           tags: ['alpaca', 'amor', 'intuición'],               rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80' },
  // ── Pulseras ─────────────────────────────────────────────────────────────────
  { id: 'pu01', cat: 'pulseras',  name: 'Pulsera Plata 925 Eslabones',     price: 21500,            tone: 'stone',  label: 'pulsera · plata',         tags: ['plata', 'amor'],                             rating: 0, reviews: 0, new: true,  image: 'https://images.unsplash.com/photo-1611085583191-a3b13b24424a?auto=format&fit=crop&w=800&q=80' },
  { id: 'pu02', cat: 'pulseras',  name: 'Pulsera Acero Dorado Delicada',   price: 11500,            tone: 'ember',  label: 'pulsera · acero dorado',  tags: ['acero dorado', 'prosperidad', 'abundancia'], rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1611085583191-a3b13b24424a?auto=format&fit=crop&w=800&q=80' },
  { id: 'pu03', cat: 'pulseras',  name: 'Pulsera Gamuza Con Turquesa',     price: 9200,             tone: 'clay',   label: 'pulsera · gamuza',        tags: ['gamuza', 'calma', 'protección'],             rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' },
  { id: 'pu04', cat: 'pulseras',  name: 'Pulsera Piedras Roladas Cuarzo',  price: 14900,            tone: 'cream',  label: 'pulsera · piedras',       tags: ['piedras', 'roladas', 'sanación', 'calma'],   rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&w=800&q=80' },
  // ── Aros ─────────────────────────────────────────────────────────────────────
  { id: 'ar01', cat: 'aros',      name: 'Aros Argolla Plata 925',          price: 17500,            tone: 'stone',  label: 'aros · plata',            tags: ['plata', 'comunicación', 'amor'],             rating: 0, reviews: 0, new: true,  image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80' },
  { id: 'ar02', cat: 'aros',      name: 'Aros Acero Quirúrgico Mini Aro',  price: 9500,             tone: 'cream',  label: 'aros · acero',            tags: ['acero quirúrgico', 'amor'],                  rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1611085583191-a3b13b24424a?auto=format&fit=crop&w=800&q=80' },
  { id: 'ar03', cat: 'aros',      name: 'Aros Alpaca Boho Tejidos',        price: 6800,             tone: 'moss',   label: 'aros · alpaca',           tags: ['alpaca', 'crecimiento personal'],             rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' },
  // ── Tobilleras ───────────────────────────────────────────────────────────────
  { id: 'to01', cat: 'tobilleras',name: 'Tobillera Acero Dorado Fina',     price: 10900,            tone: 'ember',  label: 'tobillera · acero dorado',tags: ['acero dorado', 'prosperidad'],               rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1611085583191-a3b13b24424a?auto=format&fit=crop&w=800&q=80' },
  { id: 'to02', cat: 'tobilleras',name: 'Tobillera Hilos Artesanal',       price: 7500,             tone: 'sage',   label: 'tobillera · hilos',       tags: ['hilos', 'amor'],                             rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80' },
  { id: 'to03', cat: 'tobilleras',name: 'Tobillera Piedras Escallas',      price: 12900,            tone: 'rose',   label: 'tobillera · piedras',     tags: ['piedras', 'escallas', 'sanación', 'amor'],   rating: 0, reviews: 0, new: true,  image: 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&w=800&q=80' },
  // ── Piedras Naturales ────────────────────────────────────────────────────────
  { id: 'pi01', cat: 'piedras',   name: 'Amatista En Bruto Pequeña',       price: 5500,             tone: 'indigo', label: 'piedra · en bruto',       tags: ['sanación', 'calma', 'intuición'],            rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1567333528660-d4387a67cfbb?auto=format&fit=crop&w=800&q=80' },
  { id: 'pi02', cat: 'piedras',   name: 'Amatista En Bruto Grande',        price: 18900,            tone: 'indigo', label: 'piedra · en bruto',       tags: ['sanación', 'intuición', 'crecimiento personal'], rating: 0, reviews: 0, new: true, image: 'https://images.unsplash.com/photo-1567333528660-d4387a67cfbb?auto=format&fit=crop&w=800&q=80' },
  { id: 'pi03', cat: 'piedras',   name: 'Cuarzo Rosa Rolado Mediano',      price: 6900,             tone: 'rose',   label: 'piedra · rolada',         tags: ['amor', 'calma', 'sanación'],                 rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' },
  { id: 'pi04', cat: 'piedras',   name: 'Obsidiana Negra Rolada',          price: 7800,             tone: 'stone',  label: 'piedra · rolada',         tags: ['protección', 'escudos', 'concreción'],       rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=800&q=80' },
  { id: 'pi05', cat: 'piedras',   name: 'Citrino Natural Especial',        price: 24500, was: 29000, tone: 'ember',  label: 'piedra · especial',       tags: ['abundancia', 'prosperidad'],                 rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1614362984535-6490656a8412?auto=format&fit=crop&w=800&q=80' },
  // ── Complementos ─────────────────────────────────────────────────────────────
  { id: 'co01', cat: 'complementos',name: 'Péndulo De Cuarzo Con Tablero', price: 18500,            tone: 'cream',  label: 'péndulo · cuarzo',        tags: ['sanación', 'comunicación', 'intuición'],     rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&w=800&q=80' },
  { id: 'co02', cat: 'complementos',name: 'Oráculo Del Alma — 44 Cartas', price: 22900,            tone: 'indigo', label: 'oráculo · 44 cartas',     tags: ['intuición', 'comunicación'],                 rating: 0, reviews: 0, new: true,  image: 'https://images.unsplash.com/photo-1635332043388-5a4af42795bd?auto=format&fit=crop&w=800&q=80' },
  { id: 'co03', cat: 'complementos',name: 'Botella Energética Con Amatista',price: 15900,           tone: 'indigo', label: 'botella · amatista',      tags: ['sanación', 'abundancia', 'bienestar'],       rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1567333528660-d4387a67cfbb?auto=format&fit=crop&w=800&q=80' },
  { id: 'co04', cat: 'complementos',name: 'Figura Buda Jade Pequeña',      price: 12500,            tone: 'sage',   label: 'figura · jade',           tags: ['calma', 'prosperidad'],                      rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&w=800&q=80' },
  { id: 'co05', cat: 'complementos',name: 'Amuleto Ojo Protector',         price: 9800,             tone: 'ember',  label: 'amuleto',                 tags: ['protección', 'escudos'],                     rating: 0, reviews: 0,           image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80' },
];

export const PRICE_RANGES: PriceRange[] = [
  { id: 'pr1', label: 'Hasta $10.000',        min: 0,     max: 10000     },
  { id: 'pr2', label: '$10.000 – $20.000',    min: 10000, max: 20000     },
  { id: 'pr3', label: '$20.000 – $30.000',    min: 20000, max: 30000     },
  { id: 'pr4', label: 'Más de $30.000',       min: 30000, max: Infinity  },
];

export const MATERIALS = [
  'Plata', 'Acero quirúrgico', 'Acero dorado', 'Acero blanco', 'Alpaca', 'Gamuza', 'Hilos',
];

// Intenciones normalizadas en minúsculas para los filtros del catálogo
export const INTENTIONS = [
  'amor', 'prosperidad', 'abundancia', 'protección', 'escudos',
  'calma', 'crecimiento personal', 'concreción', 'comunicación', 'sanación',
];
