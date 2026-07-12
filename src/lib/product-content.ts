// Motor de "contenido tentativo" de la ficha del producto.
//
// Arma el texto sugerido de cada solapa (Descripción, Cómo usar, Cuidados,
// Envíos) a partir del material y la categoría del producto. Se usa en DOS
// lugares a la vez para que siempre coincidan:
//   1. En el panel, como placeholder de cada campo (lo que verá la dueña).
//   2. En la web, como texto de respaldo cuando la dueña deja el campo vacío.
// Así, "todos los dijes de acero" muestran el mismo cuidado por defecto, y la
// dueña solo escribe algo si quiere cambiarlo.

export interface ProductContentInput {
  name?: string
  cat?: string
  tags?: string[]
}

export interface ProductContent {
  description: string
  howToUse: string
  care: string
  shipping: string
}

// Junta nombre + categoría + tags en un solo texto para detectar palabras clave.
function haystack(p: ProductContentInput): string {
  return [p.name ?? '', p.cat ?? '', ...(p.tags ?? [])].join(' ').toLowerCase()
}

// ── Detección de material (mismo criterio que la ficha pública) ──
const MATERIAL_KEYWORDS = [
  'plata', 'acero', 'gamuza', 'hilo', 'alpaca', 'cuero', 'piedra', 'bruto',
  'cuarzo', 'amatista', 'obsidiana', 'labradorita', 'ojo turco', 'nácar',
  'nacar', 'turquesa', 'metal', 'hematite', 'madera', 'cristal', 'ágata',
  'agata', 'jade', 'ónix', 'onix',
]

function isSku(tag: string): boolean {
  return /^[A-Z]{3,5}\d{4,5}$/i.test(tag.trim())
}
function isMaterialTag(tag: string): boolean {
  const t = tag.toLowerCase().trim()
  return MATERIAL_KEYWORDS.some(m => t.includes(m))
}

type MaterialGroup = 'acero' | 'plata' | 'piedra' | 'madera' | 'cordon'

function detectMaterialGroups(h: string): MaterialGroup[] {
  const groups: MaterialGroup[] = []
  if (h.includes('acero')) groups.push('acero')
  if (h.includes('plata') || h.includes('alpaca')) groups.push('plata')
  if (['piedra', 'cuarzo', 'amatista', 'obsidiana', 'labradorita', 'turquesa',
       'hematite', 'ojo turco', 'nacar', 'nácar', 'cristal', 'agata', 'ágata',
       'jade', 'onix', 'ónix', 'bruto'].some(k => h.includes(k))) groups.push('piedra')
  if (h.includes('madera')) groups.push('madera')
  if (h.includes('gamuza') || h.includes('hilo') || h.includes('cuero')) groups.push('cordon')
  return groups
}

const CARE_BY_MATERIAL: Record<MaterialGroup, string> = {
  acero: 'Acero quirúrgico: no se oxida ni pierde el color, incluso en contacto con el agua. Limpialo con un paño suave (si querés, con agua y jabón neutro) y secalo bien. Evitá el contacto prolongado con perfumes y productos químicos.',
  plata: 'Plata / alpaca: con el tiempo puede oscurecerse de forma natural. Devolvele el brillo frotándola con un paño seco o un paño especial para plata. Guardala en un lugar seco, lejos de la humedad, y evitá perfumes y cremas en contacto directo.',
  piedra: 'Piedras naturales: cada una es única y puede variar en color y forma. Limpiala con un paño suave y evitá golpes. Podés descargar su energía pasándola por el humo de un sahumerio de salvia o palo santo. Evitá el contacto prolongado con el agua y la luz solar directa.',
  madera: 'Madera natural: mantenela seca y lejos de la humedad. Limpiala con un paño apenas húmedo y secá enseguida. Evitá perfumes, cremas y el contacto prolongado con el agua.',
  cordon: 'Cordón de gamuza / hilo: evitá mojarlo para que no pierda color ni se afloje. Guardalo estirado, sin nudos y en un lugar seco. Sacátelo antes de bañarte o nadar.',
}

const CARE_DEFAULT =
  'Guardá la pieza en un lugar seco, lejos de la luz directa. Si es de metal, lucila con un paño suave. Evitá el contacto con perfumes, cremas y el agua.'

// ── Cómo usar: según el tipo de producto ──
type ProductKind = 'sahumerio' | 'vela' | 'joya'

function detectKind(h: string): ProductKind {
  if (['sahumerio', 'sahumo', 'incienso', 'palo santo', 'sahu'].some(k => h.includes(k))) return 'sahumerio'
  if (h.includes('vela')) return 'vela'
  return 'joya'
}

const HOW_TO_USE: Record<ProductKind, string> = {
  joya: '1. Limpiá la pieza con el humo de un sahumerio de salvia o palo santo.\n2. Dedicá una intención clara antes de usarla.\n3. Llevala cerca en los momentos en que necesites su energía.',
  sahumerio: '1. Encendé la punta del sahumerio y dejá que prenda unos segundos.\n2. Apagá la llama soplando con suavidad para que empiece a largar humo.\n3. Recorré con el humo los ambientes o la pieza que quieras limpiar, acompañando con tu intención.\n\nNunca lo dejes encendido sin supervisión.',
  vela: '1. Ubicá la vela en un lugar seguro, lejos de corrientes de aire y de materiales inflamables.\n2. Encendela acompañando con tu intención.\n3. Dejala consumirse un rato y apagala con cuidado.\n\nNunca la dejes encendida sin supervisión.',
}

const SHIPPING_DEFAULT =
  'Envíos a todo el país a coordinar por WhatsApp (3 a 7 días hábiles). Retiro gratuito en nuestro punto de entrega en A. Lincoln 85, Rafaela, Santa Fe.'

// Devuelve el contenido sugerido de las 4 solapas para un producto.
export function buildProductContent(p: ProductContentInput): ProductContent {
  const h = haystack(p)
  const publicTags = (p.tags ?? []).filter(t => !isSku(t))
  const materiales = publicTags.filter(isMaterialTag)
  const intenciones = publicTags.filter(t => !isMaterialTag(t))

  const nombre = (p.name ?? '').trim() || 'esta pieza'
  const descParts = [
    `Pieza seleccionada a mano desde pequeños talleres. Cada unidad es levemente distinta — esa es su belleza. La energía de ${nombre.toLowerCase()} acompaña momentos de reflexión, intención y pausa.`,
  ]
  if (materiales.length) descParts.push(`Materiales: ${materiales.join(', ')}.`)
  if (intenciones.length) descParts.push(`Propiedades energéticas: ${intenciones.join(', ')}.`)

  const groups = detectMaterialGroups(h)
  const care = groups.length
    ? groups.map(g => CARE_BY_MATERIAL[g]).join('\n\n')
    : CARE_DEFAULT

  return {
    description: descParts.join('\n\n'),
    howToUse: HOW_TO_USE[detectKind(h)],
    care,
    shipping: SHIPPING_DEFAULT,
  }
}
