import type { Metadata } from 'next';
import './globals.css';
import ThemeApplier from '@/components/shell/ThemeApplier';
import Header from '@/components/shell/Header';
import Footer from '@/components/shell/Footer';
import CategoryDrawer from '@/components/shell/CategoryDrawer';
import CartDrawer from '@/components/shell/CartDrawer';
import Toast from '@/components/ui/Toast';
import FloatingActions from '@/components/ui/FloatingActions';

export const metadata: Metadata = {
  title: 'La Botica del Alma — Joyas con alma',
  description: 'Cristales, velas y amuletos seleccionados uno por uno. Envíos a todo el país.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Manrope:wght@300;400;500;600&family=Work+Sans:wght@300;400;500&family=Libre+Caslon+Text:wght@400;700&family=JetBrains+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeApplier />
        <Header />
        {children}
        <Footer />
        <CategoryDrawer />
        <CartDrawer />
        <Toast />
        <FloatingActions />
      </body>
    </html>
  );
}
