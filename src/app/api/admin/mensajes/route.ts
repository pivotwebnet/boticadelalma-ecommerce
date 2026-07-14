import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DATA_DIR } from '@/lib/storage';

export async function GET() {
  try {
    const contactosPath = path.join(DATA_DIR, 'contactos.json');
    const arrepentimientosPath = path.join(DATA_DIR, 'arrepentimientos.json');

    let contactos = [];
    let arrepentimientos = [];

    // Leer contactos
    if (fs.existsSync(contactosPath)) {
      try {
        const fileContent = fs.readFileSync(contactosPath, 'utf-8');
        contactos = JSON.parse(fileContent);
      } catch (err) {
        console.error('Error parseando contactos.json:', err);
      }
    }

    // Leer arrepentimientos
    if (fs.existsSync(arrepentimientosPath)) {
      try {
        const fileContent = fs.readFileSync(arrepentimientosPath, 'utf-8');
        arrepentimientos = JSON.parse(fileContent);
      } catch (err) {
        console.error('Error parseando arrepentimientos.json:', err);
      }
    }

    // Ordenar de más reciente a más antiguo
    contactos.sort((a: { fecha: string }, b: { fecha: string }) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    arrepentimientos.sort((a: { fechaSolicitud: string }, b: { fechaSolicitud: string }) => new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime());

    return NextResponse.json({
      contactos,
      arrepentimientos,
    });
  } catch (error) {
    console.error('Error en API admin mensajes:', error);
    return NextResponse.json(
      { error: 'Error al cargar los mensajes del servidor.' },
      { status: 500 }
    );
  }
}
