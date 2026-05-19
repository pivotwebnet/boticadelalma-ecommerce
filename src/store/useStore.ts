import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Theme, Purchase } from '@/lib/types';

interface StoreState {
  cart: CartItem[];
  favs: string[];
  drawerOpen: boolean;
  cartOpen: boolean;
  theme: Theme;
  purchase: Purchase | null;
  cartLocked: boolean;

  addToCart: (product: Product, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  toggleFav: (id: string) => void;
  setDrawerOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setTheme: <K extends keyof Theme>(key: K, value: Theme[K]) => void;
  setPurchase: (p: Purchase) => void;
  clearPurchase: () => void;
  lockCart: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      favs: [],
      drawerOpen: false,
      cartOpen: false,
      purchase: null,
      cartLocked: false,
      theme: {
        palette: 'sage',
        typography: 'default',
        dark: false,
        cardStyle: 'line',
        density: 'regular',
      },

      addToCart: (product, qty = 1) => {
        if (get().cartLocked) return;
        
        set((state) => {
          const existing = state.cart.find(i => i.product.id === product.id);
          const cart = existing
            ? state.cart.map(i =>
                i.product.id === product.id ? { ...i, qty: i.qty + qty } : i
              )
            : [...state.cart, { product, qty }];
          return { 
            cart,
            cartOpen: true // Mantenemos la apertura inmediata del carrito
          };
        });
      },

      updateQty: (id, qty) => {
        if (get().cartLocked) return;
        set(state => ({
          cart: state.cart.map(i => (i.product.id === id ? { ...i, qty } : i)),
        }));
      },

      removeFromCart: (id) => {
        if (get().cartLocked) return;
        set(state => ({
          cart: state.cart.filter(i => i.product.id !== id),
        }));
      },

      toggleFav: (id) =>
        set(state => ({
          favs: state.favs.includes(id)
            ? state.favs.filter(x => x !== id)
            : [...state.favs, id],
        })),

      setDrawerOpen: (open) => set({ drawerOpen: open }),
      setCartOpen: (open) => set({ cartOpen: open }),

      setTheme: (key, value) =>
        set(state => ({ theme: { ...state.theme, [key]: value } })),

      setPurchase: (p) => set({ purchase: p }),
      clearPurchase: () => set({ purchase: null, cartLocked: false }),
      lockCart: () => set({ cartLocked: true }),
    }),
    {
      name: 'la-botica-store',
      partialize: state => ({
        cart: state.cart,
        favs: state.favs,
        theme: state.theme,
        purchase: state.purchase,
        cartLocked: state.cartLocked,
      }),
    }
  )
);