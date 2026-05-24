import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import ThemeApplier from '@/components/shell/ThemeApplier';
import Header from '@/components/shell/Header';
import Footer from '@/components/shell/Footer';
import CategoryDrawer from '@/components/shell/CategoryDrawer';
import CartDrawer from '@/components/shell/CartDrawer';
import Toast from '@/components/ui/Toast';
import FloatingActions from '@/components/ui/FloatingActions';
import { ApiDataProvider } from '@/hooks/useApiData';
import { getCategories, getProducts } from '@/lib/api';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-serif' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'La Botica del Alma — Joyas con alma',
  description: 'Cristales, velas y amuletos seleccionados uno por uno. Envíos a todo el país.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${cormorant.variable} ${jetbrains.variable}`}>
      <body>
        <ApiDataProvider initialCategories={categories} initialProducts={products}>
          <ThemeApplier />
          <Header />
          {children}
          <Footer />
          <CategoryDrawer />
          <CartDrawer />
          <Toast />
          <FloatingActions />
        </ApiDataProvider>
      </body>
    </html>
  );
}
