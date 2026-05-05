import { Category, Collection, PriceRange, Product, Tone } from './types';

export const CATEGORIES: Category[] = [
  { id: 'collares',  name: 'Collares',             count: 42, icon: 'necklace'  },
  { id: 'cristales', name: 'Cristales & Piedras',  count: 68, icon: 'crystal'   },
  { id: 'inciensos', name: 'Inciensos & Sahumerios',count: 31, icon: 'incense'  },
  { id: 'velas',     name: 'Velas Rituales',        count: 24, icon: 'candle'   },
  { id: 'tarot',     name: 'Tarot & Oráculos',      count: 19, icon: 'tarot'    },
  { id: 'accesorios',name: 'Accesorios',            count: 37, icon: 'accessory'},
];

export const COLLECTIONS: Collection[] = [
  { id: 'luna-nueva', name: 'Luna Nueva', subtitle: 'Rituales de intención' },
  { id: 'raiz',       name: 'Raíz',       subtitle: 'Piedras de anclaje'    },
  { id: 'herencia',   name: 'Herencia',   subtitle: 'Plata trabajada a mano'},
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
  // Collares
  { id: 'p01', cat: 'collares', name: 'Colgante Luna Creciente',   price: 18500, was: 24000, tone: 'stone',  label: 'colgante · plata',    tags: ['plata 925', 'hecho a mano'],      rating: 4.8, reviews: 124, new: false },
  { id: 'p02', cat: 'collares', name: 'Collar Raíz de Árbol',      price: 22800,             tone: 'moss',   label: 'collar · bronce',     tags: ['bronce', 'cordón'],               rating: 4.9, reviews: 87,  new: true  },
  { id: 'p03', cat: 'collares', name: 'Gargantilla Cuarzo Rosa',   price: 14900,             tone: 'rose',   label: 'gargantilla',         tags: ['cuarzo rosa', 'amor'],            rating: 4.7, reviews: 203           },
  { id: 'p04', cat: 'collares', name: 'Colgante Ojo Turco',        price: 9800,              tone: 'indigo', label: 'colgante',            tags: ['protección'],                     rating: 4.6, reviews: 56            },
  // Cristales
  { id: 'p05', cat: 'cristales',name: 'Amatista en Bruto — 250g', price: 12500,             tone: 'indigo', label: 'cristal · bruto',     tags: ['amatista', 'intuición'],          rating: 4.9, reviews: 312, new: true  },
  { id: 'p06', cat: 'cristales',name: 'Cuarzo Blanco Pulido',      price: 6400,              tone: 'cream',  label: 'cristal · pulido',    tags: ['claridad'],                       rating: 4.8, reviews: 178           },
  { id: 'p07', cat: 'cristales',name: 'Set Chakras 7 Piedras',     price: 24900, was: 29500, tone: 'sage',   label: 'set · 7 piezas',      tags: ['chakras', 'set'],                 rating: 5.0, reviews: 91            },
  { id: 'p08', cat: 'cristales',name: 'Obsidiana Negra Pulida',    price: 7900,              tone: 'stone',  label: 'cristal · pulido',    tags: ['obsidiana', 'protección'],        rating: 4.7, reviews: 142           },
  { id: 'p09', cat: 'cristales',name: 'Citrino Natural',           price: 8900,              tone: 'ember',  label: 'cristal',             tags: ['abundancia'],                     rating: 4.8, reviews: 67            },
  // Inciensos
  { id: 'p10', cat: 'inciensos',name: 'Palo Santo — 5 varas',      price: 4800,              tone: 'clay',   label: 'sahumerio',           tags: ['palo santo', 'Perú'],             rating: 4.9, reviews: 421           },
  { id: 'p11', cat: 'inciensos',name: 'Salvia Blanca Atado',       price: 6500,              tone: 'sage',   label: 'sahumerio',           tags: ['salvia', 'limpieza'],             rating: 4.9, reviews: 356, new: true  },
  { id: 'p12', cat: 'inciensos',name: 'Inciensos Nag Champa x12',  price: 3200,              tone: 'ember',  label: 'incienso · caja',     tags: ['India'],                          rating: 4.7, reviews: 289           },
  { id: 'p13', cat: 'inciensos',name: 'Resina Mirra 30g',          price: 5400,              tone: 'ember',  label: 'resina',              tags: ['mirra', 'meditación'],            rating: 4.8, reviews: 74            },
  // Velas
  { id: 'p14', cat: 'velas',    name: 'Vela 7 Días — Abundancia', price: 5200,              tone: 'cream',  label: 'vela ritual',         tags: ['abundancia', '7 días'],           rating: 4.8, reviews: 198           },
  { id: 'p15', cat: 'velas',    name: 'Vela Miel & Canela',        price: 4200,              tone: 'clay',   label: 'vela aromática',      tags: ['miel'],                           rating: 4.9, reviews: 112           },
  { id: 'p16', cat: 'velas',    name: 'Vela Salvia — Limpieza',   price: 4800,              tone: 'sage',   label: 'vela ritual',         tags: ['limpieza'],                       rating: 4.9, reviews: 267, new: true  },
  // Tarot
  { id: 'p17', cat: 'tarot',    name: 'Tarot Rider-Waite Clásico',price: 18900,             tone: 'cream',  label: 'baraja · 78 cartas',  tags: ['principiantes'],                  rating: 4.9, reviews: 512           },
  { id: 'p18', cat: 'tarot',    name: 'Oráculo de la Luna',        price: 22400,             tone: 'indigo', label: 'oráculo · 44 cartas', tags: ['luna', 'intuición'],              rating: 4.8, reviews: 143           },
  { id: 'p19', cat: 'tarot',    name: 'Mantel de Tarot Bordado',   price: 9500,              tone: 'moss',   label: 'mantel 55x55cm',      tags: ['accesorio'],                      rating: 4.7, reviews: 62            },
  // Accesorios
  { id: 'p20', cat: 'accesorios',name: 'Porta Sahumerios Cerámica',price: 6800,              tone: 'clay',   label: 'cerámica',            tags: ['hecho a mano'],                   rating: 4.8, reviews: 89            },
  { id: 'p21', cat: 'accesorios',name: 'Campana Tibetana Mini',    price: 14500,             tone: 'ember',  label: 'bronce',              tags: ['sonido', 'meditación'],           rating: 4.9, reviews: 54,  new: true  },
  { id: 'p22', cat: 'accesorios',name: 'Cuenco de Cuarzo 8"',      price: 32900,             tone: 'cream',  label: 'cuenco sonoro',       tags: ['sonoterapia'],                    rating: 5.0, reviews: 38            },
  { id: 'p23', cat: 'accesorios',name: 'Bolsita Ritual Lino',      price: 2900,              tone: 'sage',   label: 'accesorio',           tags: ['lino natural'],                   rating: 4.6, reviews: 127           },
];

export const PRICE_RANGES: PriceRange[] = [
  { id: 'pr1', label: 'Hasta $5.000',        min: 0,     max: 5000      },
  { id: 'pr2', label: '$5.000 – $10.000',    min: 5000,  max: 10000     },
  { id: 'pr3', label: '$10.000 – $20.000',   min: 10000, max: 20000     },
  { id: 'pr4', label: 'Más de $20.000',      min: 20000, max: Infinity  },
];

export const MATERIALS = ['Plata 925', 'Bronce', 'Cuarzo', 'Amatista', 'Obsidiana', 'Cerámica', 'Lino'];
export const INTENTIONS = ['Protección', 'Abundancia', 'Amor', 'Limpieza', 'Intuición', 'Anclaje'];
