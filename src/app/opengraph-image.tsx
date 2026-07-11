import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/lib/site';

// Imagen de previsualización (WhatsApp, Instagram, Facebook, Google) generada
// dinámicamente con la identidad de marca. No depende de assets externos.
export const alt = `${SITE_NAME} — Joyería artesanal, piedras naturales y complementos energéticos`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F7F1D7',
          color: '#2a2820',
          fontFamily: 'Georgia, serif',
          padding: 64,
        }}
      >
        {/* Marco decorativo */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            right: 40,
            bottom: 40,
            border: '2px solid #2A5E36',
            borderRadius: 16,
          }}
        />
        <div
          style={{
            fontSize: 26,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: '#2A5E36',
            marginBottom: 28,
          }}
        >
          Joyería · Piedras Naturales · Complementos
        </div>
        <div
          style={{
            fontSize: 112,
            fontStyle: 'italic',
            lineHeight: 1.05,
            textAlign: 'center',
            maxWidth: 900,
          }}
        >
          La Botica del Alma
        </div>
        {/* Divisor dorado */}
        <div
          style={{
            width: 120,
            height: 3,
            backgroundColor: '#D4AF37',
            marginTop: 36,
            marginBottom: 32,
          }}
        />
        <div style={{ fontSize: 32, color: '#6a6558', textAlign: 'center' }}>
          Seleccionados uno por uno · Envíos a todo el país
        </div>
      </div>
    ),
    { ...size },
  );
}
