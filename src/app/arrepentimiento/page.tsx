'use client';

import { useState } from 'react';
import InfoPageLayout from '@/components/ui/InfoPageLayout';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';

interface ResultData {
  status: 'cancelled' | 'pending_approval' | 'shipped_pending_return';
  message: string;
  orderId?: string;
}

export default function ArrepentimientoPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ResultData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!orderId.trim() || !email.trim()) {
      setError('Por favor completá todos los campos.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders/arrepentimiento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderId.trim(),
          email: email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ocurrió un error al procesar tu solicitud.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Error de conexión. Intentá de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <InfoPageLayout
      eyebrow="Derecho de Revocación"
      title="Botón de Arrepentimiento"
      subtitle="Conforme a la ley de Defensa del Consumidor, podés solicitar la cancelación de tu compra dentro de los 10 días corridos de realizada."
    >
      <div className="max-w-md mx-auto py-8">
        {!result ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8 rounded-[2rem] bg-accent/5 border border-accent/10 shadow-sm">
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              Ingresá los datos de tu compra para iniciar la solicitud de cancelación de forma automática.
            </p>

            <div className="flex flex-col gap-2">
              <label htmlFor="order-id" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                Código de la Orden (8 dígitos)
              </label>
              <input
                id="order-id"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Ej: F47AC10B"
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors text-sm font-mono uppercase"
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                Correo Electrónico Registrado
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maria@ejemplo.com"
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors text-sm"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs flex items-center gap-2">
                <Icon name="info" size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full mt-2"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Confirmar revocación'}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-6 p-8 rounded-[2rem] bg-accent/5 border border-accent/10 shadow-sm text-center items-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              result.status === 'pending_approval' ? 'bg-amber-100 text-amber-700' :
              result.status === 'shipped_pending_return' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
            }`}>
              <Icon name={result.status === 'cancelled' ? 'check' : 'clock'} size={32} stroke={2} />
            </div>

            <h3 className="font-serif text-2xl italic text-stone-800">
              {result.status === 'pending_approval' ? 'Solicitud Recibida' :
               result.status === 'shipped_pending_return' ? 'Trámite Registrado' : 'Cancelación Exitosa'}
            </h3>

            <p className="text-stone-600 font-light text-sm leading-relaxed">
              {result.message}
            </p>

            {result.orderId && (
              <div className="bg-stone-100 border border-stone-200 px-4 py-2.5 rounded-xl text-stone-500 text-xs font-mono">
                Código de Trámite: {result.orderId}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
              <Link href="/" className="btn btn-ghost btn-md w-full flex-1">
                Ir al inicio
              </Link>
              <Link href="/catalogo" className="btn btn-primary btn-md w-full flex-1">
                Ver catálogo
              </Link>
            </div>

            {result.status === 'shipped_pending_return' && (
              <a
                href={`https://wa.me/5493492274535?text=${encodeURIComponent('Hola, inicié el trámite de arrepentimiento de la orden #' + (result.orderId ? result.orderId.slice(0, 8) : '') + ' y quiero coordinar la devolución.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm mt-2 text-brand-orange hover:bg-brand-orange/5 font-semibold flex items-center justify-center gap-2"
              >
                <Icon name="whatsapp" size={16} />
                Coordinar devolución por WhatsApp
              </a>
            )}
          </div>
        )}
      </div>
    </InfoPageLayout>
  );
}
