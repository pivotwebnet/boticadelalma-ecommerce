// Cliente servidor para el backend ASP.NET Core.
// Solo usar desde route handlers (src/app/api/**), nunca desde componentes cliente.

const API_URL = process.env.API_URL ?? 'http://localhost:5066'

// Clave compartida con el backend para endpoints administrativos.
// Debe coincidir con AdminApiKey del backend. Vacía en dev = sin exigencia.
const ADMIN_KEY = process.env.BACKEND_ADMIN_KEY ?? ''

// Headers para llamadas administrativas (mutaciones y lecturas privadas).
function adminHeaders(json = false): Record<string, string> {
  const h: Record<string, string> = {}
  if (json) h['Content-Type'] = 'application/json'
  if (ADMIN_KEY) h['X-Admin-Key'] = ADMIN_KEY
  return h
}

export interface ApiComment {
  id: string
  productId: string
  orderId: string
  author: string
  text: string
  rating: number
  createdAt: string
}

export interface ApiOrder {
  id: string
  status: string
  total: number
  customerName: string
  customerEmail: string
  customerPhone?: string
  address?: string
  city?: string
  notes?: string
  createdAt: string
  updatedAt: string
  items: ApiOrderItem[]
}

export interface ApiOrderItem {
  id: string
  productId: string
  productName: string
  pricePaid: number
  quantity: number
}

export interface CreateOrderInput {
  customerName: string
  customerEmail: string
  customerPhone?: string
  address?: string
  city?: string
  notes?: string
  // El backend recalcula precio y nombre desde la DB; solo importan productId y quantity.
  items: { productId: string; productName?: string; pricePaid?: number; quantity: number }[]
  status?: string
}

export async function getComments(productId: string): Promise<ApiComment[]> {
  try {
    const res = await fetch(`${API_URL}/api/comments/product/${productId}`)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function createComment(dto: {
  productId: string
  orderId: string
  author: string
  text: string
  rating: number
}): Promise<{ ok: boolean; status: number; data: unknown }> {
  const res = await fetch(`${API_URL}/api/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}

export async function getAllOrders(): Promise<ApiOrder[]> {
  try {
    const res = await fetch(`${API_URL}/api/orders`, { headers: adminHeaders(), cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

export async function getOrder(id: string): Promise<ApiOrder | null> {
  try {
    const res = await fetch(`${API_URL}/api/orders/${id}`, { headers: adminHeaders() })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function updateOrderStatus(id: string, status: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: adminHeaders(true),
      body: JSON.stringify({ status }),
    })
    if (res.ok) return { ok: true }
    const data = await res.json().catch(() => null)
    return { ok: false, error: typeof data === 'string' ? data : (data?.error ?? 'Error al actualizar estado') }
  } catch { return { ok: false, error: 'Error de conexión' } }
}

export async function getAllComments(): Promise<ApiComment[]> {
  try {
    const res = await fetch(`${API_URL}/api/comments`, { headers: adminHeaders(), cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

export async function deleteComment(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/comments/${id}`, { method: 'DELETE', headers: adminHeaders() })
    return res.ok
  } catch { return false }
}

// ─── Products & Categories ───────────────────────────────────────────────────

export interface ApiCategory {
  id: string
  name: string
  icon: string
  isActive: boolean
  sortOrder: number
  productCount: number
}

export interface ApiProduct {
  id: string
  name: string
  categoryId: string
  categoryName?: string
  price: number
  originalPrice?: number
  tone: string
  label: string
  tags: string[]
  isNew: boolean
  isActive: boolean
  rating: number
  reviews: number
  imageUrl?: string
  images: string[]
  stock: number
  createdAt: string
  updatedAt: string
}

export interface GetProductsParams {
  categoryId?: string
  search?: string
  material?: string
  intention?: string
  isNew?: boolean
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'name'
  includeInactive?: boolean
}

export async function getProducts(params?: GetProductsParams): Promise<ApiProduct[]> {
  try {
    const qs = new URLSearchParams()
    if (params?.categoryId)           qs.set('categoryId', params.categoryId)
    if (params?.search)               qs.set('search',     params.search)
    if (params?.material)             qs.set('material',   params.material)
    if (params?.intention)            qs.set('intention',  params.intention)
    if (params?.isNew != null)        qs.set('isNew',      String(params.isNew))
    if (params?.minPrice != null)     qs.set('minPrice',   String(params.minPrice))
    if (params?.maxPrice != null)     qs.set('maxPrice',   String(params.maxPrice))
    if (params?.sortBy)               qs.set('sortBy',     params.sortBy)
    if (params?.includeInactive)      qs.set('includeInactive', 'true')
    const res = await fetch(`${API_URL}/api/products?${qs}`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

export async function getProduct(id: string): Promise<ApiProduct | null> {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function getCategories(opts?: { includeInactive?: boolean }): Promise<ApiCategory[]> {
  try {
    // El panel admin pide includeInactive=true (sin cache) para poder reactivar
    // categorías desactivadas; el catálogo público usa la versión cacheada.
    const url = opts?.includeInactive
      ? `${API_URL}/api/categories?includeInactive=true`
      : `${API_URL}/api/categories`
    const res = await fetch(url, opts?.includeInactive
      ? { cache: 'no-store' }
      : { next: { revalidate: 60, tags: ['categories'] } })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

export async function createProduct(dto: unknown): Promise<{ ok: boolean; data: unknown }> {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      method: 'POST', headers: adminHeaders(true),
      body: JSON.stringify(dto),
    })
    return { ok: res.ok, data: await res.json() }
  } catch { return { ok: false, data: { error: 'Error de conexión' } } }
}

export async function updateProduct(id: string, dto: unknown): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'PUT', headers: adminHeaders(true),
      body: JSON.stringify(dto),
    })
    if (res.ok) return { ok: true }
    const data = await res.json().catch(() => null)
    return { ok: false, error: typeof data === 'string' ? data : (data?.error ?? data?.title ?? 'Error al actualizar') }
  } catch { return { ok: false, error: 'Error de conexión' } }
}

// Ajuste masivo de precios sobre un conjunto de productos elegido en el panel.
export async function bulkAdjustPrices(
  productIds: string[], percent: number, mode: 'discount' | 'increase',
): Promise<{ ok: boolean; updated?: number; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/products/bulk-price`, {
      method: 'POST', headers: adminHeaders(true),
      body: JSON.stringify({ productIds, percent, mode }),
    })
    const data = await res.json().catch(() => null)
    if (res.ok) return { ok: true, updated: (data as { updated?: number })?.updated }
    return { ok: false, error: typeof data === 'string' ? data : ((data as { error?: string })?.error ?? 'No se pudo aplicar el ajuste.') }
  } catch { return { ok: false, error: 'Error de conexión' } }
}

export async function deleteProduct(id: string): Promise<{ ok: boolean; softDeleted?: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE', headers: adminHeaders() })
    if (!res.ok) return { ok: false }
    const data = await res.json().catch(() => ({}))
    return { ok: true, softDeleted: data?.softDeleted, message: data?.message }
  } catch { return { ok: false } }
}

export async function createCategory(dto: unknown): Promise<{ ok: boolean; data: unknown }> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      method: 'POST', headers: adminHeaders(true),
      body: JSON.stringify(dto),
    })
    return { ok: res.ok, data: await res.json() }
  } catch { return { ok: false, data: { error: 'Error de conexión' } } }
}

export async function updateCategory(id: string, dto: unknown): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/categories/${id}`, {
      method: 'PUT', headers: adminHeaders(true),
      body: JSON.stringify(dto),
    })
    return res.ok
  } catch { return false }
}

export async function deleteCategory(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/categories/${id}`, { method: 'DELETE', headers: adminHeaders() })
    if (res.ok) return { ok: true }
    const data = await res.json().catch(() => ({}))
    return { ok: false, error: data || 'Error al eliminar' }
  } catch { return { ok: false, error: 'Error de conexión' } }
}

export async function reordenarCategorias(idsOrdenados: string[]): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/categories/reordenar`, {
      method: 'POST',
      headers: adminHeaders(true),
      body: JSON.stringify(idsOrdenados),
    })
    return res.ok
  } catch {
    return false
  }
}

// `admin: true` adjunta la X-Admin-Key para que el backend acepte fijar el estado
// inicial (ventas manuales del panel). El checkout público llama SIN admin: el
// backend ignora cualquier `status` que venga y la orden nace "pending".
export async function createOrder(
  dto: CreateOrderInput,
  opts?: { admin?: boolean },
): Promise<{ ok: boolean; data: ApiOrder | { error: string } }> {
  try {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: opts?.admin ? adminHeaders(true) : { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    const data = await res.json()
    return { ok: res.ok, data }
  } catch {
    return { ok: false, data: { error: 'No se pudo conectar con el servidor' } }
  }
}
