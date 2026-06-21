'use client';

import { useEffect } from 'react';
import './globals.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es">
      <body>
        <main className="error-state">
          <p className="eyebrow">Error</p>
          <h1 className="error-state-title">Algo salió mal</h1>
          <p className="error-state-msg">
            Tuvimos un problema inesperado. Probá recargar la página; si el
            inconveniente continúa, volvé en unos minutos.
          </p>
          <div className="error-state-actions">
            <button onClick={() => reset()} className="btn btn-primary btn-md">
              Reintentar
            </button>
            {/* Recarga dura a propósito: resetea todo el estado tras un error crítico */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="btn btn-ghost btn-md">
              Volver al inicio
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
