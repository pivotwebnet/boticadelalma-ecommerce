export default function Loading() {
  return (
    <main className="loading-state" aria-busy="true" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <p className="loading-text">Cargando…</p>
    </main>
  );
}
