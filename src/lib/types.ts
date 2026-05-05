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
  new?: boolean;
  fav?: boolean;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
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

export interface Theme {
  palette: 'sage' | 'clay' | 'stone' | 'indigo';
  typography: 'default' | 'serif' | 'modern' | 'editorial';
  dark: boolean;
  cardStyle: 'line' | 'soft' | 'flat';
  density: 'compact' | 'regular' | 'comfy';
}
