'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import ErrorState from '@/components/ui/ErrorState';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log para diagnóstico (se podría enviar a un servicio de monitoreo)
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      code="Error"
      title="Algo salió mal"
      message="Tuvimos un inconveniente al mostrar esta página. Probá de nuevo en un momento; si el problema persiste, volvé al inicio."
    >
      <button onClick={() => reset()} className="btn btn-primary btn-md">
        Reintentar
      </button>
      <Link href="/" className="btn btn-ghost btn-md">
        Volver al inicio
      </Link>
    </ErrorState>
  );
}
