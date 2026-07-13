import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DATA_DIR } from '@/lib/storage';
import { escapeHtml } from '@/lib/utils';
import { tooMany } from '@/lib/rate-limit';

// Topes de largo para el formulario de contacto público. Deben coincidir con
// los maxLength del formulario en src/app/contacto/page.tsx.
const MAX_NOMBRE = 100;
const MAX_EMAIL = 150;
const MAX_MENSAJE = 2000;

export async function POST(req: NextRequest) {
  // Anti-spam: máx 5 consultas por minuto por IP (evita inundar el mail y Resend) + tope global.
  if (tooMany(req, 'contacto', 5, 60_000)) {
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
    const { nombre, email, mensaje } = (payload ?? {}) as Record<string, unknown>;

    if (typeof nombre !== 'string' || typeof email !== 'string' || typeof mensaje !== 'string' ||
        !nombre.trim() || !email.trim() || !mensaje.trim()) {
      return NextResponse.json(
        { error: 'Todos los campos (nombre, email y mensaje) son obligatorios.' },
        { status: 400 }
      );
    }

    if (nombre.trim().length > MAX_NOMBRE) {
      return NextResponse.json(
        { error: `El nombre es demasiado largo (máximo ${MAX_NOMBRE} caracteres).` },
        { status: 400 }
      );
    }
    if (email.trim().length > MAX_EMAIL) {
      return NextResponse.json(
        { error: `El correo electrónico es demasiado largo (máximo ${MAX_EMAIL} caracteres).` },
        { status: 400 }
      );
    }
    if (mensaje.trim().length > MAX_MENSAJE) {
      return NextResponse.json(
        { error: `El mensaje es demasiado largo (máximo ${MAX_MENSAJE} caracteres).` },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'El correo electrónico ingresado no tiene un formato válido.' },
        { status: 400 }
      );
    }

    const nuevoContacto = {
      id: Math.random().toString(36).substring(2, 9),
      nombre: nombre.trim(),
      email: email.trim(),
      mensaje: mensaje.trim(),
      fecha: new Date().toISOString(),
    };

    // 1. Respaldo persistente local (en el DATA_DIR)
    const filePath = path.join(DATA_DIR, 'contactos.json');
    let contactos = [];

    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        contactos = JSON.parse(fileContent);
      }
    } catch (e) {
      console.error('Error leyendo contactos.json:', e);
    }

    contactos.push(nuevoContacto);

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(contactos, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error escribiendo contactos.json:', e);
    }

    // 2. Envío real por Email (si existe la API Key de Resend en el entorno)
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
            subject: `Nuevo mensaje de contacto de ${nuevoContacto.nombre}`,
            html: `
              <h2>Nueva consulta desde la Web</h2>
              <p><strong>Nombre:</strong> ${escapeHtml(nuevoContacto.nombre)}</p>
              <p><strong>Email de contacto:</strong> ${escapeHtml(nuevoContacto.email)}</p>
              <p><strong>Mensaje:</strong></p>
              <p style="background: #f4f4f4; padding: 15px; border-radius: 8px; font-style: italic;">
                "${escapeHtml(nuevoContacto.mensaje)}"
              </p>
              <hr />
              <p style="font-size: 11px; color: #777;">Recibido el ${new Date(nuevoContacto.fecha).toLocaleString('es-AR')}</p>
            `,
          }),
        });

        if (response.ok) {
          emailEnviado = true;
        } else {
          console.error('Resend falló al enviar el email:', await response.text());
        }
      } catch (err) {
        console.error('Error enviando email por Resend:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Consulta registrada correctamente.',
      backupSaved: true,
      emailSent: emailEnviado,
    });
  } catch (error) {
    console.error('Error en API de contacto:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar tu consulta.' },
      { status: 500 }
    );
  }
}
