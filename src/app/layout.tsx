import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import ThemeApplier from '@/components/shell/ThemeApplier';
import Header from '@/components/shell/Header';
import Footer from '@/components/shell/Footer';
import CategoryDrawer from '@/components/shell/CategoryDrawer';
import CartDrawer from '@/components/shell/CartDrawer';
import FavoritesDrawer from '@/components/shell/FavoritesDrawer';
import Toast from '@/components/ui/Toast';
import FloatingActions from '@/components/ui/FloatingActions';
import { ApiDataProvider } from '@/hooks/useApiData';
import { getCategories, getProducts } from '@/lib/api';
import { readTaxonomy } from '@/lib/site-settings';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-serif' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Joyas con alma`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'joyería artesanal', 'piedras naturales', 'cristales', 'complementos energéticos',
    'plata 925', 'acero quirúrgico', 'amuletos', 'péndulos', 'La Botica del Alma',
    'Rafaela', 'Santa Fe', 'Argentina',
  ],
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Joyas con alma`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Joyas con alma`,
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);
  // Taxonomía de filtros (listas editables desde el panel), resuelta con defaults.
  const taxonomy = readTaxonomy();

  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${cormorant.variable} ${jetbrains.variable}`}>
      <body>
        <ApiDataProvider initialCategories={categories} initialProducts={products} initialTaxonomy={taxonomy}>
          <ThemeApplier />
          <Header />
          {children}
          <Footer />
          <CategoryDrawer />
          <CartDrawer />
          <FavoritesDrawer />
          <Toast />
          <FloatingActions />
        </ApiDataProvider>
      </body>
    </html>
  );
}
