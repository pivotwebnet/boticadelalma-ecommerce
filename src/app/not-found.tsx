import Link from 'next/link';
import ErrorState from '@/components/ui/ErrorState';

export default function NotFound() {
  return (
    <ErrorState
      code="404"
      title="Página no encontrada"
      message="La pieza que buscás no existe o fue movida. Quizás encuentres lo que buscás explorando el catálogo."
    >
      <Link href="/" className="btn btn-primary btn-md">
        Volver al inicio
      </Link>
      <Link href="/catalogo" className="btn btn-ghost btn-md">
        Ver el catálogo
      </Link>
    </ErrorState>
  );
}
