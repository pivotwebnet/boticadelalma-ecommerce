import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Theme, Purchase } from '@/lib/types';

interface StoreState {
  cart: CartItem[];
  favs: string[];
  drawerOpen: boolean;
  cartOpen: boolean;
  favsOpen: boolean;
  theme: Theme;
  purchase: Purchase | null;
  cartLocked: boolean;
  toast: { msg: string } | null;

  addToCart: (product: Product, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  toggleFav: (id: string) => void;
  setDrawerOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setFavsOpen: (open: boolean) => void;
  setTheme: <K extends keyof Theme>(key: K, value: Theme[K]) => void;
  setPurchase: (p: Purchase) => void;
  clearPurchase: () => void;
  clearCart: () => void;
  lockCart: () => void;
  showToast: (msg: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      favs: [],
      drawerOpen: false,
      cartOpen: false,
      favsOpen: false,
      purchase: null,
      cartLocked: false,
      toast: null,
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

        get().showToast('Agregado al carrito');
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

      setDrawerOpen: (open) => set(open ? { drawerOpen: true, favsOpen: false } : { drawerOpen: false }),
      setCartOpen: (open) => set(open ? { cartOpen: true, favsOpen: false } : { cartOpen: false }),
      setFavsOpen: (open) => set(open ? { favsOpen: true, cartOpen: false, drawerOpen: false } : { favsOpen: false }),

      setTheme: (key, value) =>
        set(state => ({ theme: { ...state.theme, [key]: value } })),

      setPurchase: (p) => set({ purchase: p }),
      clearPurchase: () => set({ purchase: null, cartLocked: false }),
      clearCart: () => set({ cart: [] }),
      lockCart: () => set({ cartLocked: true }),

      showToast: (msg) => {
        set({ toast: { msg } });
        setTimeout(() => set({ toast: null }), 3000);
      },
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