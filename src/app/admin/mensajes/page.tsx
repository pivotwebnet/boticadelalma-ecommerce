'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Contacto {
  id: string;
  nombre: string;
  email: string;
  mensaje: string;
  fecha: string;
}

interface Arrepentimiento {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  orderTotal: number;
  orderStatus: string;
  fechaSolicitud: string;
  estadoSolicitud: string;
}

type Tab = 'contactos' | 'arrepentimientos';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente de pago',
  paid: 'Pagado',
  shipped: 'Despachado / Enviado',
  cancelled: 'Cancelado',
};

export default function AdminMensajesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('contactos');
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [arrepentimientos, setArrepentimientos] = useState<Arrepentimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Contacto | Arrepentimiento | null>(null);

  useEffect(() => {
    fetch('/api/admin/mensajes')
      .then((r) => r.json())
      .then((data) => {
        setContactos(data.contactos || []);
        setArrepentimientos(data.arrepentimientos || []);
        if (data.contactos && data.contactos.length > 0) {
          setSelectedItem(data.contactos[0]);
        }
      })
      .catch((err) => console.error('Error cargando mensajes:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    const list = tab === 'contactos' ? contactos : arrepentimientos;
    setSelectedItem(list.length > 0 ? list[0] : null);
  };

  const selectItem = (item: Contacto | Arrepentimiento) => {
    setSelectedItem(item);
  };

  // Escucha cuando el admin hace clic en una respuesta rápida
  const handleQuickReplyClick = (optionIndex: number) => {
    if (activeTab === 'arrepentimientos' && optionIndex === 0 && selectedItem) {
      const a = selectedItem as Arrepentimiento;
      localStorage.setItem('pending_cancel_id', a.orderId);
      localStorage.setItem('pending_cancel_name', a.customerName);
      // Disparar evento personalizado para que el layout global actualice su estado
      window.dispatchEvent(new Event('pending-cancel-updated'));
    }
  };

  const getMailtoUrl = (item: Contacto | Arrepentimiento, optionIndex: number) => {
    let email = '';
    let subject = '';
    let body = '';

    if (activeTab === 'contactos') {
      const c = item as Contacto;
      email = c.email;
      subject = 'Contacto - La Botica del Alma';

      if (optionIndex === 0) {
        body = `Hola ${c.nombre},\n\nMuchas gracias por contactarte con La Botica del Alma. Recibimos tu consulta con respecto a:\n\n"${c.mensaje}"\n\nNos gustaría ayudarte a resolver tu duda de la mejor manera. ¿Podrías brindarnos más detalles o indicarnos qué pieza te interesa?\n\nQuedamos a tu disposición.\n\nCálidos saludos,\nEquipo de La Botica del Alma`;
      } else if (optionIndex === 1) {
        body = `Hola ${c.nombre},\n\n¡Muchas gracias por escribirnos! Con respecto a tu consulta: "${c.mensaje}".\n\nQueremos brindarte una atención más directa y fluida. ¿Te gustaría que continuemos conversando por WhatsApp? Podés escribirnos al +54 349 227-4535 o enviarnos tu número y te contactamos de inmediato.\n\nCálidos saludos,\nLa Botica del Alma`;
      } else {
        body = `Hola ${c.nombre},\n\nGracias por comunicarte con La Botica del Alma. Con respecto a las dudas sobre compras y envíos:\n\nRecordá que realizamos envíos a todo el país a través de Correo Argentino y Andreani (se coordinan las tarifas finales al concretar la orden). Si te encontrás en Rafaela, podés retirar tu pedido sin cargo coordinando previamente por WhatsApp.\n\nCualquier otra consulta, estamos a tu disposición.\n\nSaludos afectuosos,\nLa Botica del Alma`;
      }
    } else {
      const a = item as Arrepentimiento;
      email = a.customerEmail;
      subject = `Cancelación de Compra (Orden #${a.orderId.slice(0, 8)}) - La Botica del Alma`;

      if (optionIndex === 0) {
        body = `Hola ${a.customerName},\n\nRecibimos tu solicitud de arrepentimiento para la orden #${a.orderId}.\n\nTe informamos que hemos aprobado la cancelación de tu pedido ya que aún no había sido despachado. En las próximas horas estaremos procesando el reembolso total de los fondos a través del mismo medio de pago con el que realizaste la compra.\n\nCálidos saludos,\nLa Botica del Alma`;
      } else if (optionIndex === 1) {
        body = `Hola ${a.customerName},\n\nRecibimos tu solicitud de arrepentimiento para la orden #${a.orderId}.\n\nComo tu pedido ya ha sido despachado y se encuentra en viaje, necesitaremos coordinar el retorno físico de las piezas. Una vez que recibas el paquete en su empaque original sin abrir, por favor escribinos por WhatsApp al +54 349 227-4535 para que te enviemos la etiqueta de devolución y procedamos con el reembolso correspondiente tras recibirlo de vuelta.\n\nSaludos afectuosos,\nLa Botica del Alma`;
      } else {
        body = `Hola ${a.customerName},\n\nNos contactamos en relación a tu solicitud de revocación de compra para la orden #${a.orderId}.\n\nPara poder brindarte una mejor solución, nos gustaría consultarte el motivo de la cancelación o si tuviste algún inconveniente con el producto. Estamos a disposición para asistirte y ver de qué forma podemos resolverlo.\n\nAtentamente,\nLa Botica del Alma`;
      }
    }

    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)', color: 'var(--fg)', position: 'relative' }}>
      {/* Header */}
      <div style={{
        padding: '32px 40px 24px',
        borderBottom: '1px solid var(--line)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>
            Centro de Comunicaciones
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 500, margin: 0 }}>
            Mensajes Recibidos
          </h1>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => handleTabChange('contactos')}
            style={{
              padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 500,
              border: '1px solid',
              borderColor: activeTab === 'contactos' ? 'var(--brand-orange)' : 'var(--line)',
              background: activeTab === 'contactos' ? 'rgba(232,99,21,0.12)' : 'transparent',
              color: activeTab === 'contactos' ? 'var(--brand-orange)' : 'var(--fg-muted)',
              cursor: 'pointer', transition: 'all .15s',
            }}
          >
            Consultas ({contactos.length})
          </button>
          <button
            onClick={() => handleTabChange('arrepentimientos')}
            style={{
              padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 500,
              border: '1px solid',
              borderColor: activeTab === 'arrepentimientos' ? 'var(--brand-orange)' : 'var(--line)',
              background: activeTab === 'arrepentimientos' ? 'rgba(232,99,21,0.12)' : 'transparent',
              color: activeTab === 'arrepentimientos' ? 'var(--brand-orange)' : 'var(--fg-muted)',
              cursor: 'pointer', transition: 'all .15s',
            }}
          >
            Arrepentimientos ({arrepentimientos.length})
          </button>
        </div>
      </div>

      {/* Main Body */}
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-soft)' }}>
          Cargando mensajes del servidor...
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left Column: List */}
          <div style={{ width: '40%', borderRight: '1px solid var(--line)', overflowY: 'auto', background: 'var(--surface-under)' }}>
            {(activeTab === 'contactos' ? contactos : arrepentimientos).length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13.5 }}>
                No se encontraron registros de {activeTab === 'contactos' ? 'consultas de contacto' : 'solicitudes de arrepentimiento'}.
              </div>
            ) : (
              (activeTab === 'contactos' ? contactos : arrepentimientos).map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const isContact = activeTab === 'contactos';
                const name = isContact ? (item as Contacto).nombre : (item as Arrepentimiento).customerName;
                const date = isContact ? (item as Contacto).fecha : (item as Arrepentimiento).fechaSolicitud;
                const desc = isContact ? (item as Contacto).mensaje : `Solicitud de revocación de Orden #${(item as Arrepentimiento).orderId.slice(0, 8)}`;

                return (
                  <div
                    key={item.id}
                    onClick={() => selectItem(item)}
                    style={{
                      padding: '20px 24px',
                      borderBottom: '1px solid var(--line-soft)',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(255,255,255,0.02)' : 'transparent',
                      borderLeft: isSelected ? '3px solid var(--brand-orange)' : '3px solid transparent',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--fg)' }}>{name}</span>
                      <span style={{ fontSize: 10.5, color: 'var(--fg-soft)' }}>{formatDate(date)}</span>
                    </div>
                    <p style={{
                      margin: 0, fontSize: 12, color: 'var(--fg-muted)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {desc}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Detail & Predefined Answers */}
          <div style={{ flex: 1, padding: '40px', overflowY: 'auto', background: 'var(--surface)' }}>
            {selectedItem ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 640 }}>
                {/* Message Meta Info */}
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, margin: '0 0 8px 0', color: 'var(--fg)' }}>
                    {activeTab === 'contactos'
                      ? (selectedItem as Contacto).nombre
                      : (selectedItem as Arrepentimiento).customerName}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--fg-soft)' }}>
                    <span>
                      Email: <b>{activeTab === 'contactos'
                        ? (selectedItem as Contacto).email
                        : (selectedItem as Arrepentimiento).customerEmail}</b>
                    </span>
                    <span>
                      Fecha: {formatDate(activeTab === 'contactos'
                        ? (selectedItem as Contacto).fecha
                        : (selectedItem as Arrepentimiento).fechaSolicitud)}
                    </span>
                    {activeTab === 'arrepentimientos' && (
                      <>
                        <span>
                          Orden ID: <Link href={`/admin/ordenes?order=${(selectedItem as Arrepentimiento).orderId}`} style={{ color: 'var(--brand-orange)', textDecoration: 'underline', fontFamily: 'var(--font-mono)' }}>
                            {(selectedItem as Arrepentimiento).orderId}
                          </Link>
                        </span>
                        <span>
                          Monto total: <b>${(selectedItem as Arrepentimiento).orderTotal}</b>
                        </span>
                        <span>
                          Estado en base: <span style={{ textTransform: 'capitalize', color: 'var(--gold)', fontWeight: 600 }}>
                            {STATUS_LABELS[(selectedItem as Arrepentimiento).orderStatus] || (selectedItem as Arrepentimiento).orderStatus}
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                <div style={{
                  padding: '24px',
                  background: 'var(--bg)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                }}>
                  <span style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-soft)', display: 'block', marginBottom: 12 }}>
                    {activeTab === 'contactos' ? 'Mensaje recibido' : 'Detalles de la orden'}
                  </span>
                  <p style={{
                    margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--fg-muted)',
                    whiteSpace: 'pre-wrap', fontStyle: activeTab === 'contactos' ? 'italic' : 'normal',
                  }}>
                    {activeTab === 'contactos'
                      ? `"${(selectedItem as Contacto).mensaje}"`
                      : `El cliente solicita revocar la compra bajo el amparo legal de los 10 días de arrepentimiento. El estado actual de la orden es '${(selectedItem as Arrepentimiento).orderStatus}'. Podés proceder a cancelarla manualmente en la pestaña de Órdenes si es aprobado.`}
                  </p>
                </div>

                {/* Predefined Answers */}
                <div>
                  <h4 style={{
                    fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'var(--brand-orange)', fontWeight: 600, marginBottom: 16,
                  }}>
                    Respuesta rápida sugerida (Gmail style)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {activeTab === 'contactos' ? (
                      <>
                        <a
                          href={getMailtoUrl(selectedItem, 0)}
                          onClick={() => handleQuickReplyClick(0)}
                          className="btn btn-ghost"
                          style={{
                            display: 'block', textAlign: 'left', padding: '16px 20px',
                            border: '1px solid var(--line)', borderRadius: 10, textDecoration: 'none',
                            color: 'var(--fg-muted)', fontSize: 13, background: 'rgba(255,255,255,0.01)',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--brand-orange)';
                            e.currentTarget.style.color = 'var(--fg)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--line)';
                            e.currentTarget.style.color = 'var(--fg-muted)';
                          }}
                        >
                          <strong style={{ display: 'block', color: 'var(--fg)', marginBottom: 4 }}>1. Agradecimiento y solicitud de detalles</strong>
                          Responder confirmando recepción y consultando detalles adicionales de su inquietud.
                        </a>
                        <a
                          href={getMailtoUrl(selectedItem, 1)}
                          onClick={() => handleQuickReplyClick(1)}
                          className="btn btn-ghost"
                          style={{
                            display: 'block', textAlign: 'left', padding: '16px 20px',
                            border: '1px solid var(--line)', borderRadius: 10, textDecoration: 'none',
                            color: 'var(--fg-muted)', fontSize: 13, background: 'rgba(255,255,255,0.01)',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--brand-orange)';
                            e.currentTarget.style.color = 'var(--fg)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--line)';
                            e.currentTarget.style.color = 'var(--fg-muted)';
                          }}
                        >
                          <strong style={{ display: 'block', color: 'var(--fg)', marginBottom: 4 }}>2. Continuar asesoramiento por WhatsApp</strong>
                          Proponer trasladar la consulta a WhatsApp para una comunicación más directa.
                        </a>
                        <a
                          href={getMailtoUrl(selectedItem, 2)}
                          onClick={() => handleQuickReplyClick(2)}
                          className="btn btn-ghost"
                          style={{
                            display: 'block', textAlign: 'left', padding: '16px 20px',
                            border: '1px solid var(--line)', borderRadius: 10, textDecoration: 'none',
                            color: 'var(--fg-muted)', fontSize: 13, background: 'rgba(255,255,255,0.01)',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--brand-orange)';
                            e.currentTarget.style.color = 'var(--fg)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--line)';
                            e.currentTarget.style.color = 'var(--fg-muted)';
                          }}
                        >
                          <strong style={{ display: 'block', color: 'var(--fg)', marginBottom: 4 }}>3. Duda de Envíos y Puntos de Retiro</strong>
                          Enviar información predeterminada sobre envíos a todo el país o retiro en Rafaela.
                        </a>
                      </>
                    ) : (
                      <>
                        <a
                          href={getMailtoUrl(selectedItem, 0)}
                          onClick={() => handleQuickReplyClick(0)}
                          className="btn btn-ghost"
                          style={{
                            display: 'block', textAlign: 'left', padding: '16px 20px',
                            border: '1px solid var(--line)', borderRadius: 10, textDecoration: 'none',
                            color: 'var(--fg-muted)', fontSize: 13, background: 'rgba(255,255,255,0.01)',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--brand-orange)';
                            e.currentTarget.style.color = 'var(--fg)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--line)';
                            e.currentTarget.style.color = 'var(--fg-muted)';
                          }}
                        >
                          <strong style={{ display: 'block', color: 'var(--fg)', marginBottom: 4 }}>1. Aprobación y reembolso de dinero</strong>
                          Confirmar cancelación de la orden (pendiente/pagada) e indicar reintegro de fondos.
                        </a>
                        <a
                          href={getMailtoUrl(selectedItem, 1)}
                          onClick={() => handleQuickReplyClick(1)}
                          className="btn btn-ghost"
                          style={{
                            display: 'block', textAlign: 'left', padding: '16px 20px',
                            border: '1px solid var(--line)', borderRadius: 10, textDecoration: 'none',
                            color: 'var(--fg-muted)', fontSize: 13, background: 'rgba(255,255,255,0.01)',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--brand-orange)';
                            e.currentTarget.style.color = 'var(--fg)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--line)';
                            e.currentTarget.style.color = 'var(--fg-muted)';
                          }}
                        >
                          <strong style={{ display: 'block', color: 'var(--fg)', marginBottom: 4 }}>2. Coordinar devolución de producto (Despachado)</strong>
                          Indicar los pasos para devolver el paquete enviado y procesar el reintegro.
                        </a>
                        <a
                          href={getMailtoUrl(selectedItem, 2)}
                          onClick={() => handleQuickReplyClick(2)}
                          className="btn btn-ghost"
                          style={{
                            display: 'block', textAlign: 'left', padding: '16px 20px',
                            border: '1px solid var(--line)', borderRadius: 10, textDecoration: 'none',
                            color: 'var(--fg-muted)', fontSize: 13, background: 'rgba(255,255,255,0.01)',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--brand-orange)';
                            e.currentTarget.style.color = 'var(--fg)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--line)';
                            e.currentTarget.style.color = 'var(--fg-muted)';
                          }}
                        >
                          <strong style={{ display: 'block', color: 'var(--fg)', marginBottom: 4 }}>3. Consultar motivo de la cancelación</strong>
                          Preguntar por qué decide cancelar la orden para ofrecer alternativas o soporte.
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)' }}>
                Seleccioná un elemento de la lista para ver su detalle.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
