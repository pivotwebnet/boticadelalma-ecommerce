'use client'

import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { ImportProductRow, ImportResult, ApiProduct } from '@/lib/api'

// Mapeo de encabezados de la planilla de la dueña (Google Sheets) a los campos
// que necesita el importador. Comparación tolerante a mayúsculas/tildes/espacios.
const HEADER_MAP: Record<string, keyof ImportProductRow | 'skip'> = {
  'codigo': 'code',
  'proveedor': 'provider',
  'tipo de producto': 'productType',
  'producto': 'name',
  'piedra': 'stone',
  'categoria': 'categoryName',
  'stock actual': 'stock',
  'costo unidad': 'costPrice',
  'stock minimo': 'minStock',
  'precio minorista': 'price',
}

function normalizeHeader(h: string): string {
  // Descompone tildes (NFD) y descarta los caracteres de acento combinantes (U+0300–U+036F).
  const decomposed = h.normalize('NFD')
  let stripped = ''
  for (const ch of decomposed) {
    const code = ch.codePointAt(0) ?? 0
    if (code < 0x0300 || code > 0x036f) stripped += ch
  }
  return stripped.toLowerCase().trim().replace(/\s+/g, ' ')
}

function toNumber(v: unknown): number {
  if (typeof v === 'number') return v
  const n = parseFloat(String(v ?? '0').replace(/[^\d.-]/g, ''))
  return isNaN(n) ? 0 : n
}

// La planilla de la dueña no completa la columna "Categoría", pero sí "Tipo de producto".
// Cuando falta la categoría, derivamos una de las 8 categorías reales de la tienda a partir
// del tipo. La clave se normaliza (sin tildes, sin espacios, minúsculas) para tolerar
// variantes como "Aros"/"AROS"/"aros" o "Tobillera/pulsera"/"Tobillera/ pulsera".
const TYPE_TO_CATEGORY: Record<string, string> = {
  aros: 'Aros', aritos: 'Aros',
  dije: 'Dijes', amuleto: 'Dijes',
  anillo: 'Anillos',
  collar: 'Collares', collarcaucho: 'Collares', mala: 'Collares',
  pulsera: 'Pulseras',
  tobillerapulsera: 'Tobilleras',
  piedra: 'Piedras Naturales', piedras: 'Piedras Naturales', huevo: 'Piedras Naturales', corazon: 'Piedras Naturales',
  relicario: 'Complementos', relicariocompletoconpiedraycadena: 'Complementos',
  botellas: 'Complementos', frasco: 'Complementos', guashas: 'Complementos', kit: 'Complementos',
  llavero: 'Complementos', pendulo: 'Complementos', cadena: 'Complementos', perforaoreja: 'Complementos',
  punzon: 'Complementos', vara: 'Complementos',
}

function normalizeValue(v: string): string {
  const decomposed = v.normalize('NFD')
  let stripped = ''
  for (const ch of decomposed) {
    const code = ch.codePointAt(0) ?? 0
    if (code < 0x0300 || code > 0x036f) stripped += ch
  }
  return stripped.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

// Tipo conocido → su categoría; tipo desconocido o vacío → "Complementos" (cajón general).
function categoryFromType(productType: string): string {
  const key = normalizeValue(productType)
  return TYPE_TO_CATEGORY[key] ?? 'Complementos'
}

interface ParsedRow extends ImportProductRow {
  _rowIndex: number
  _valid: boolean
  _issue?: string
}

export default function ImportarPage() {
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [fileName, setFileName] = useState('')
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    setError('')
    setResult(null)
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const wb = XLSX.read(data, { type: 'binary' })
        const sheet = wb.Sheets[wb.SheetNames[0]]
        const raw: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' })

        const parsed: ParsedRow[] = raw.map((rawRow, i) => {
          const mapped: Partial<ImportProductRow> = {}
          for (const [key, val] of Object.entries(rawRow)) {
            const field = HEADER_MAP[normalizeHeader(key)]
            if (!field || field === 'skip') continue
            if (field === 'stock' || field === 'price' || field === 'costPrice' || field === 'minStock') {
              ;(mapped as any)[field] = toNumber(val)
            } else {
              ;(mapped as any)[field] = String(val ?? '').trim()
            }
          }

          const code = mapped.code ?? ''
          const name = mapped.name ?? ''
          // Si la planilla no trae categoría, la derivamos del "Tipo de producto".
          const categoryName = (mapped.categoryName || '').trim() || categoryFromType(mapped.productType ?? '')
          let issue: string | undefined
          if (!code) issue = 'Sin código'
          else if (!name) issue = 'Sin nombre de producto'
          else if (!categoryName) issue = 'Sin categoría'

          return {
            code, name, categoryName,
            provider: mapped.provider || undefined,
            productType: mapped.productType || undefined,
            stone: mapped.stone || undefined,
            stock: mapped.stock ?? 0,
            price: mapped.price ?? 0,
            costPrice: mapped.costPrice,
            minStock: mapped.minStock,
            _rowIndex: i + 2, // +2: fila 1 es encabezado, planillas arrancan en 1
            _valid: !issue,
            _issue: issue,
          }
        }).filter(r => r.code || r.name) // ignora filas totalmente vacías

        setRows(parsed)
      } catch {
        setError('No se pudo leer el archivo. Verificá que sea un .xlsx, .xls o .csv válido.')
        setRows([])
      }
    }
    reader.readAsBinaryString(file)
  }

  async function handleImport() {
    const valid = rows.filter(r => r._valid)
    if (valid.length === 0) return
    setImporting(true)
    setError('')
    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valid.map(({ _rowIndex, _valid, _issue, ...row }) => row)),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setResult(data as ImportResult)
        setRows([])
        setFileName('')
      } else {
        setError(data?.error ?? 'No se pudo importar la planilla.')
      }
    } catch {
      setError('Error de conexión al importar.')
    } finally {
      setImporting(false)
    }
  }

  // Descarga los productos actuales de la tienda en el mismo formato de columnas
  // que la planilla de la dueña, para que pueda editarlo y volver a subirlo.
  async function handleExport() {
    setExporting(true)
    setError('')
    try {
      const products: ApiProduct[] = await fetch('/api/admin/products')
        .then(r => (r.ok ? r.json() : []))
        .catch(() => [])
      if (!Array.isArray(products) || products.length === 0) {
        setError('No hay productos para descargar.')
        return
      }
      // Mismas columnas y orden que su Excel (encabezados que el importador reconoce).
      const data = products.map(p => ({
        'Código': p.code ?? '',
        'PROVEEDOR': p.provider ?? '',
        'Tipo de producto': p.productType ?? '',
        'PRODUCTO': p.name,
        'Piedra': p.stone ?? '',
        'Categoría': p.categoryName ?? '',
        'Stock actual': p.stock ?? 0,
        'Costo unidad': p.costPrice ?? '',
        'Stock mínimo': p.minStock ?? '',
        'Precio Minorista': p.price ?? 0,
      }))
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'INVENTARIO')
      const today = new Date().toISOString().slice(0, 10)
      XLSX.writeFile(wb, `stock-botica-del-alma-${today}.xlsx`)
    } finally {
      setExporting(false)
    }
  }

  const validCount = rows.filter(r => r._valid).length
  const invalidCount = rows.length - validCount

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 6 }}>
          Panel Admin
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontStyle: 'italic', margin: 0 }}>
          Importar planilla de stock
        </h1>
        <p style={{ color: 'var(--fg-muted)', fontSize: 13.5, marginTop: 8, maxWidth: 640 }}>
          Subí el Excel exportado de tu Google Sheets (Archivo → Descargar → Microsoft Excel).
          Se actualizan los productos que ya existan (por Código) y se crean los que sean nuevos,
          junto con las categorías que falten.
        </p>
      </div>

      <div style={{
        border: '1px solid var(--line)', borderRadius: 12, padding: '18px 22px', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 16, background: 'var(--surface)', flexWrap: 'wrap',
      }}>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          style={{
            padding: '10px 20px', borderRadius: 8, border: '1px solid var(--brand-orange)',
            background: 'transparent', color: 'var(--brand-orange)', fontSize: 13.5, fontWeight: 600,
            cursor: exporting ? 'wait' : 'pointer', opacity: exporting ? 0.6 : 1, whiteSpace: 'nowrap',
          }}
        >
          {exporting ? 'Generando…' : '⬇  Descargar Excel del stock actual'}
        </button>
        <span style={{ fontSize: 12.5, color: 'var(--fg-muted)', lineHeight: 1.45 }}>
          Baja todos los productos en el mismo formato de la planilla. Podés editarlo (precios, stock,
          productos nuevos) y volver a subirlo acá para actualizar la tienda.
        </span>
      </div>

      <div style={{
        border: '1px dashed var(--line)', borderRadius: 12, padding: 28,
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
        background: 'var(--surface)',
      }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            padding: '10px 20px', borderRadius: 8, border: 'none',
            background: 'var(--brand-orange)', color: '#fff', fontSize: 13.5, fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Elegir archivo
        </button>
        <input
          ref={inputRef} type="file" accept=".xlsx,.xls,.csv"
          style={{ display: 'none' }}
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
          {fileName || 'Ningún archivo seleccionado'}
        </span>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px', borderRadius: 8, marginBottom: 20,
          background: 'rgba(224,101,87,0.12)', border: '1px solid rgba(224,101,87,0.3)',
          color: '#e06557', fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{
          padding: '16px 20px', borderRadius: 8, marginBottom: 20,
          background: 'rgba(155,174,136,0.12)', border: '1px solid rgba(155,174,136,0.35)',
          fontSize: 13.5, lineHeight: 1.6,
        }}>
          <strong>Importación completa.</strong><br />
          {result.created} producto(s) creado(s) · {result.updated} actualizado(s) · {result.categoriesCreated} categoría(s) nueva(s)
          {result.errors.length > 0 && (
            <div style={{ marginTop: 8, color: 'var(--fg-muted)' }}>
              Avisos: {result.errors.join(' — ')}
            </div>
          )}
          <div style={{
            marginTop: 14, padding: '14px 18px', borderRadius: 10,
            background: 'rgba(224,101,87,0.10)', border: '1px solid rgba(224,101,87,0.35)',
            borderLeft: '5px solid var(--brand-orange)',
            fontSize: 16, lineHeight: 1.55, fontWeight: 500, color: 'var(--fg)',
          }}>
            ⚠️ <strong>Importante:</strong> los productos nuevos quedan{' '}
            <strong style={{ color: 'var(--brand-orange)' }}>INACTIVOS</strong> y no se ven en la tienda
            hasta que les cargues las fotos en{' '}
            <a href="/admin/productos" style={{ color: 'var(--brand-orange)', fontWeight: 600 }}>Productos</a>.
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 13.5 }}>
              <strong>{rows.length}</strong> filas leídas · {validCount} listas para importar
              {invalidCount > 0 && <span style={{ color: '#e06557' }}> · {invalidCount} con problemas (se omiten)</span>}
            </div>
            <button
              type="button"
              onClick={handleImport}
              disabled={importing || validCount === 0}
              style={{
                padding: '9px 18px', borderRadius: 8, border: 'none',
                background: importing || validCount === 0 ? 'var(--line)' : 'var(--brand-orange)',
                color: importing || validCount === 0 ? 'var(--fg-muted)' : '#fff',
                fontSize: 13.5, fontWeight: 500,
                cursor: importing || validCount === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {importing ? 'Importando…' : `Importar ${validCount} producto(s)`}
            </button>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid var(--line)', borderRadius: 10 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: 'var(--surface)', textAlign: 'left' }}>
                  {['Fila', 'Código', 'Producto', 'Categoría', 'Proveedor', 'Stock', 'Precio', 'Estado'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)', color: 'var(--fg-soft)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r._rowIndex} style={{ borderBottom: '1px solid var(--line)', opacity: r._valid ? 1 : 0.55 }}>
                    <td style={{ padding: '8px 12px', color: 'var(--fg-soft)' }}>{r._rowIndex}</td>
                    <td style={{ padding: '8px 12px' }}>{r.code || '—'}</td>
                    <td style={{ padding: '8px 12px' }}>{r.name || '—'}</td>
                    <td style={{ padding: '8px 12px' }}>{r.categoryName || '—'}</td>
                    <td style={{ padding: '8px 12px' }}>{r.provider || '—'}</td>
                    <td style={{ padding: '8px 12px' }}>{r.stock}</td>
                    <td style={{ padding: '8px 12px' }}>${r.price}</td>
                    <td style={{ padding: '8px 12px' }}>
                      {r._valid
                        ? <span style={{ color: '#9bae88' }}>✓ OK</span>
                        : <span style={{ color: '#e06557' }}>{r._issue}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
