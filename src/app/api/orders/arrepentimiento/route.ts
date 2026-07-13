import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getOrder, getAllOrders } from '@/lib/api';
import { DATA_DIR } from '@/lib/storage';
import { escapeHtml } from '@/lib/utils';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // Anti-abuso: máx 10 por minuto por IP. También frena que se use el endpoint para
  // sondear qué órdenes existen probando IDs a mansalva.
  if (!rateLimit(`arrepentimiento:${clientIp(req)}`, 10, 60_000)) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Esperá un momento e intentá de nuevo.' },
      { status: 429 }
    );
  }

  try {
    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json({ error: 'Petición inválida.' }, { status: 400 });
    }
    const { orderId, email } = (payload ?? {}) as Record<string, unknown>;

    if (typeof orderId !== 'string' || typeof email !== 'string' || !orderId.trim() || !email.trim()) {
      return NextResponse.json(
        { error: 'El ID de la orden y el correo electrónico son obligatorios.' },
        { status: 400 }
      );
    }

    let targetOrderId = orderId.trim();

    // Si es un ID corto (de 8 caracteres), buscamos en la lista completa para obtener el UUID completo
    if (targetOrderId.length === 8) {
      const allOrders = await getAllOrders();
      const match = allOrders.find((o) => o.id.toLowerCase().startsWith(targetOrderId.toLowerCase()));
      if (match) {
        targetOrderId = match.id;
      } else {
        return NextResponse.json(
          { error: 'No se encontró ninguna orden con el código de 8 dígitos provisto.' },
          { status: 404 }
        );
      }
    }

    // El ID de orden debe ser un GUID válido (de 36 caracteres)
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!guidRegex.test(targetOrderId)) {
      return NextResponse.json(
        { error: 'El identificador de la orden no tiene un formato válido.' },
        { status: 400 }
      );
    }

    // Buscamos la orden en el backend .NET (utiliza la BACKEND_ADMIN_KEY configurada)
    const order = await getOrder(targetOrderId);

    if (!order) {
      return NextResponse.json(
        { error: 'No se encontró ninguna orden con el identificador provisto. Verificá que sea correcto.' },
        { status: 404 }
      );
    }

    // Validamos el email registrado en la orden
    if (order.customerEmail.toLowerCase().trim() !== email.toLowerCase().trim()) {
      return NextResponse.json(
        { error: 'El correo electrónico ingresado no coincide con el registrado en esta compra.' },
        { status: 400 }
      );
    }

    // Validamos que esté dentro del plazo legal de 10 días corridos
    const orderDate = new Date(order.createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - orderDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 10) {
      return NextResponse.json(
        { error: 'El plazo legal de 10 días corridos para revocar la compra ha vencido.' },
        { status: 400 }
      );
    }

    // Si ya está cancelada, no hace falta procesarla
    if (order.status === 'cancelled') {
      return NextResponse.json({
        status: 'cancelled',
        message: 'Esta orden ya se encuentra cancelada en el sistema.',
        orderId: order.id,
      });
    }

    // Registramos la solicitud de arrepentimiento
    const nuevaSolicitud = {
      id: Math.random().toString(36).substring(2, 9),
      orderId: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      orderTotal: order.total,
      orderStatus: order.status,
      fechaSolicitud: new Date().toISOString(),
      estadoSolicitud: 'pendiente_aprobacion', // pendiente_aprobacion, aprobada, rechazada
    };

    // 1. Respaldo persistente local (en el DATA_DIR)
    const filePath = path.join(DATA_DIR, 'arrepentimientos.json');
    let solicitudes = [];

    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        solicitudes = JSON.parse(fileContent);
      }
    } catch (e) {
      console.error('Error leyendo arrepentimientos.json:', e);
    }

    solicitudes.push(nuevaSolicitud);

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(solicitudes, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error escribiendo arrepentimientos.json:', e);
    }

    // 2. Envío de Email al Administrador (si existe la API Key de Resend en el entorno)
    const RESEND_KEY = process.env.RESEND_API_KEY;
    let emailEnviado = false;

    if (RESEND_KEY) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'Botica del Alma <onboarding@resend.dev>',
            to: process.env.CONTACTO_RECEIVER_EMAIL || 'laboticadelalma1@gmail.com',
            subject: `⚠️ Solicitud de Arrepentimiento de Compra - Orden #${order.id.slice(0, 8)}`,
            html: `
              <h2>Solicitud de Arrepentimiento (Revocación de Compra)</h2>
              <p>El cliente ha solicitado cancelar su compra. <strong>Debés revisar si ya hiciste el pedido al mayorista antes de cancelarla en el panel.</strong></p>
              <hr />
              <p><strong>ID de Orden:</strong> ${escapeHtml(order.id)}</p>
              <p><strong>Cliente:</strong> ${escapeHtml(order.customerName)} (${escapeHtml(order.customerEmail)})</p>
              <p><strong>Monto Total de la Orden:</strong> $${escapeHtml(order.total)}</p>
              <p><strong>Estado Actual de la Orden:</strong> ${escapeHtml(order.status)}</p>
              <p><strong>Fecha de Compra:</strong> ${new Date(order.createdAt).toLocaleString('es-AR')}</p>
              <p><strong>Fecha de Solicitud de Arrepentimiento:</strong> ${new Date(nuevaSolicitud.fechaSolicitud).toLocaleString('es-AR')}</p>
              <hr />
              <p><em>Para aplicar la cancelación y reponer el stock, ingresá al Panel de Administración y cambiá el estado de la orden a <strong>Cancelado</strong>.</em></p>
            `,
          }),
        });

        if (response.ok) {
          emailEnviado = true;
        }
      } catch (err) {
        console.error('Error enviando email de arrepentimiento:', err);
      }
    }

    // Respondemos con el éxito del registro
    return NextResponse.json({
      status: 'pending_approval',
      message: 'Tu solicitud de arrepentimiento de compra ha sido registrada con éxito (Trámite #' + order.id.slice(0, 8) + '). El comercio evaluará el estado de preparación de tu pedido y se contactará a la brevedad para confirmar la cancelación y coordinar el reembolso en caso de corresponder.',
      orderId: order.id,
      emailSent: emailEnviado,
    });
  } catch (error) {
    console.error('Error en arrepentimiento:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error interno al procesar la solicitud.' },
      { status: 500 }
    );
  }
}
