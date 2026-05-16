import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond, Fraunces, Manrope, Work_Sans, Libre_Caslon_Text, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import SessionProviderWrapper from '@/components/auth/SessionProviderWrapper';
import ThemeApplier from '@/components/shell/ThemeApplier';
import Header from '@/components/shell/Header';
import Footer from '@/components/shell/Footer';
import CategoryDrawer from '@/components/shell/CategoryDrawer';
import CartDrawer from '@/components/shell/CartDrawer';
import Toast from '@/components/ui/Toast';
import FloatingActions from '@/components/ui/FloatingActions';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-serif' });
const fraunces = Fraunces({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-fraunces' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-modern' });
const workSans = Work_Sans({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-work' });
const libreCaslon = Libre_Caslon_Text({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-editorial' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'La Botica del Alma — Joyas con alma',
  description: 'Cristales, velas y amuletos seleccionados uno por uno. Envíos a todo el país.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${cormorant.variable} ${fraunces.variable} ${manrope.variable} ${workSans.variable} ${libreCaslon.variable} ${jetbrains.variable}`}>
      <body>
        <SessionProviderWrapper>
        <ThemeApplier />
        <Header />
        {children}
        <Footer />
        <CategoryDrawer />
        <CartDrawer />
        <Toast />
        <FloatingActions />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
