import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ textAlign: 'center', padding: '120px 32px' }}>
      <p className="eyebrow">404</p>
      <h1 style={{ fontSize: 'clamp(32px,4vw,52px)', marginBottom: 16 }}>
        Página no encontrada
      </h1>
      <p style={{ color: 'var(--fg-muted)', marginBottom: 32 }}>
        La pieza que buscás no existe o fue movida.
      </p>
      <Link href="/" className="btn btn-primary btn-md">
        Volver al inicio
      </Link>
    </main>
  );
}
