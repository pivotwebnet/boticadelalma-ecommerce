import type { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';

export const metadata: Metadata = {
  title: 'La Botica del Alma — Joyas con alma',
  description: 'Cristales, velas y amuletos seleccionados uno por uno. Envíos a todo el país.',
};

export default function HomePage() {
  return <HomeClient />;
}
