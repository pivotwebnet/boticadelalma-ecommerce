'use client';

import { useState } from 'react';
import InfoPageLayout from '@/components/ui/InfoPageLayout';
import Icon from '@/components/ui/Icon';

export default function ContactoPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      setError('Por favor completa todos los campos.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, mensaje }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ocurrió un error al enviar tu mensaje. Intentá de nuevo.');
      } else {
        setSuccess(true);
        setNombre('');
        setEmail('');
        setMensaje('');
      }
    } catch {
      setError('Error de conexión. Intentá de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <InfoPageLayout 
      eyebrow="Hablemos"
      title="Contacto"
      subtitle="¿Tenés alguna duda con tu pedido o necesitás asesoramiento personalizado? Estamos para ayudarte."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-12">
        <div className="flex flex-col gap-8">
          <p className="text-stone-600 font-light leading-relaxed text-lg">
            Creemos en la atención cercana. Si preferís no usar el formulario, podés escribirnos directamente por WhatsApp.
          </p>
          
          <div className="flex flex-col gap-6">
            <a 
              href="https://wa.me/5493492274535" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-accent hover:text-brand-orange transition-colors group"
            >
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">
                <Icon name="whatsapp" size={28} stroke={2} />
              </div>
              <span className="font-bold text-xl">+54 349 227-4535</span>
            </a>

            <div className="flex items-center gap-4 text-stone-500">
              <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center">
                <Icon name="map-pin" size={28} stroke={1.5} />
              </div>
              <span className="text-lg">A. Lincoln 85, Rafaela, Santa Fe</span>
            </div>
          </div>
        </div>

        <div>
          {!success ? (
            <form onSubmit={handleSubmit} className="p-10 rounded-[3rem] bg-accent/5 border border-accent/10 flex flex-col gap-6 h-fit shadow-sm">
              <div className="flex flex-col gap-2">
                <label htmlFor="nombre" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Nombre Completo *</label>
                <input 
                  id="nombre"
                  type="text" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre" 
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors text-sm" 
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Correo Electrónico *</label>
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

              <div className="flex flex-col gap-2">
                <label htmlFor="mensaje" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Mensaje *</label>
                <textarea 
                  id="mensaje"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="¿En qué podemos ayudarte?" 
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors min-h-[120px] text-sm font-inherit" 
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
                className="btn btn-primary btn-lg w-full mt-2" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          ) : (
            <div className="p-10 rounded-[3rem] bg-accent/5 border border-accent/10 flex flex-col gap-6 items-center text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                <Icon name="check" size={32} stroke={2} />
              </div>
              <h3 className="font-serif text-2xl italic text-stone-800">¡Mensaje Enviado!</h3>
              <p className="text-stone-600 font-light text-sm leading-relaxed">
                Gracias por escribirnos. Recibimos tu consulta correctamente y nos pondremos en contacto con vos a la brevedad a la dirección de email que nos indicaste.
              </p>
              <button 
                onClick={() => setSuccess(false)} 
                className="btn btn-ghost btn-sm mt-2"
              >
                Enviar otro mensaje
              </button>
            </div>
          )}
        </div>
      </div>
    </InfoPageLayout>
  );
}
