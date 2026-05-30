// Cliente servidor para el backend ASP.NET Core.
// Solo usar desde route handlers (src/app/api/**), nunca desde componentes cliente.

const API_URL = process.env.API_URL ?? 'http://localhost:5066'

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
  items: { productId: string; productName: string; pricePaid: number; quantity: number }[]
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
    const res = await fetch(`${API_URL}/api/orders`)
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

export async function getOrder(id: string): Promise<ApiOrder | null> {
  try {
    const res = await fetch(`${API_URL}/api/orders/${id}`)
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    return res.ok
  } catch { return false }
}

export async function getAllComments(): Promise<ApiComment[]> {
  try {
    const res = await fetch(`${API_URL}/api/comments`)
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

export async function deleteComment(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/comments/${id}`, { method: 'DELETE' })
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
  createdAt: string
  updatedAt: string
}

export async function getProducts(params?: { categoryId?: string; search?: string }): Promise<ApiProduct[]> {
  try {
    const qs = new URLSearchParams()
    if (params?.categoryId) qs.set('categoryId', params.categoryId)
    if (params?.search) qs.set('search', params.search)
    const res = await fetch(`${API_URL}/api/products?${qs}`, {
      next: { revalidate: 60, tags: ['products'] },
    })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

export async function getProduct(id: string): Promise<ApiProduct | null> {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      next: { revalidate: 60, tags: [`product-${id}`] },
    })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function getCategories(): Promise<ApiCategory[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 60, tags: ['categories'] },
    })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

export async function createProduct(dto: unknown): Promise<{ ok: boolean; data: unknown }> {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    return { ok: res.ok, data: await res.json() }
  } catch { return { ok: false, data: { error: 'Error de conexión' } } }
}

export async function updateProduct(id: string, dto: unknown): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    return res.ok
  } catch { return false }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    return (await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' })).ok
  } catch { return false }
}

export async function createCategory(dto: unknown): Promise<{ ok: boolean; data: unknown }> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    return { ok: res.ok, data: await res.json() }
  } catch { return { ok: false, data: { error: 'Error de conexión' } } }
}

export async function updateCategory(id: string, dto: unknown): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/categories/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    return res.ok
  } catch { return false }
}

export async function deleteCategory(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/categories/${id}`, { method: 'DELETE' })
    if (res.ok) return { ok: true }
    const data = await res.json().catch(() => ({}))
    return { ok: false, error: data || 'Error al eliminar' }
  } catch { return { ok: false, error: 'Error de conexión' } }
}

export async function createOrder(dto: CreateOrderInput): Promise<{ ok: boolean; data: ApiOrder | { error: string } }> {
  try {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    const data = await res.json()
    return { ok: res.ok, data }
  } catch {
    return { ok: false, data: { error: 'No se pudo conectar con el servidor' } }
  }
}
