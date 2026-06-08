import { Suspense } from 'react';
import CatalogClient from '@/components/catalog/CatalogClient';

export const metadata = {
  title: 'Catálogo completo — La Botica del Alma',
};

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogClient />
    </Suspense>
  );
}
