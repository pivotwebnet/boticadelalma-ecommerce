import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DATA_DIR } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, mensaje } = await req.json();

    if (!nombre?.trim() || !email?.trim() || !mensaje?.trim()) {
      return NextResponse.json(
        { error: 'Todos los campos (nombre, email y mensaje) son obligatorios.' },
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
              <p><strong>Nombre:</strong> ${nuevoContacto.nombre}</p>
              <p><strong>Email de contacto:</strong> ${nuevoContacto.email}</p>
              <p><strong>Mensaje:</strong></p>
              <p style="background: #f4f4f4; padding: 15px; border-radius: 8px; font-style: italic;">
                "${nuevoContacto.mensaje}"
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
