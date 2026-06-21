import VineDecoration from '@/components/ui/VineDecoration';

interface ErrorStateProps {
  /** Etiqueta corta superior (ej. "404", "Error") */
  code?: string;
  title: string;
  message: string;
  /** Botones / acciones */
  children?: React.ReactNode;
}

/**
 * Estado visual reutilizable para páginas de error y vacíos,
 * con el lenguaje de la marca (enredadera + serif itálica).
 */
export default function ErrorState({ code, title, message, children }: ErrorStateProps) {
  return (
    <main className="error-state">
      {code && <p className="eyebrow">{code}</p>}
      <VineDecoration />
      <h1 className="error-state-title">{title}</h1>
      <p className="error-state-msg">{message}</p>
      {children && <div className="error-state-actions">{children}</div>}
    </main>
  );
}
