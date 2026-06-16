import path from 'path'

// Directorio de estado escribible de la app (contraseña del panel, settings de la
// tienda, imágenes subidas). En contenedores (Coolify/Docker) el filesystem es
// efímero, así que esto DEBE apuntar a un volumen persistente: definir la env
// `DATA_DIR` (ej. /app/data) y montar ahí un volumen. En local cae a ./data.
export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), 'data')

// Las imágenes subidas se guardan acá (dentro del volumen) y se sirven por
// /api/media/<archivo>, no desde /public (que se hornea en la imagen Docker).
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')
