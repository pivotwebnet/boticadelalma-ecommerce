export interface Product {
  id: string;
  cat: string;
  name: string;
  price: number;
  was?: number;
  tone: string;
  label: string;
  tags: string[];
  rating: number;
  reviews: number;
  image?: string;
  new?: boolean;
  fav?: boolean;
}

export interface SubCategory {
  id: string;
  name: string;
  count?: number;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
  group?: string;
  subcategories?: SubCategory[];
}

export interface Collection {
  id: string;
  name: string;
  subtitle: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Tone {
  bg: string;
  fg: string;
  label: string;
}

export interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

export interface Comment {
  id: string;
  text: string;
  rating: number;
  createdAt: string;
  author: string;
}

export interface Purchase {
  orderId: string;       // ID de la orden en el backend .NET
  paymentId?: string;    // ID de MercadoPago (integración futura)
  buyerName: string;
  products: string[];    // IDs de productos comprados
  confirmedAt: string;
}

export interface Theme {
  palette: 'sage' | 'clay' | 'stone' | 'indigo';
  typography: 'default' | 'serif' | 'modern' | 'editorial';
  dark: boolean;
  cardStyle: 'line' | 'soft' | 'flat';
  density: 'compact' | 'regular' | 'comfy';
}
