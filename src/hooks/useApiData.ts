'use client'

import { createContext, useContext, ReactNode, createElement } from 'react'
import { CATEGORIES, PRODUCTS } from '@/lib/data'
import type { Category, Product } from '@/lib/types'
import type { ApiProduct, ApiCategory } from '@/lib/api'

// subcat comes from the static catalog — the backend model doesn't have this field
const SUBCAT_MAP: Record<string, string> = {}
for (const p of PRODUCTS) {
  if (p.subcat) SUBCAT_MAP[p.id] = p.subcat
}

function mapApiProduct(api: ApiProduct): Product {
  return {
    id:      api.id,
    cat:     api.categoryId,
    subcat:  SUBCAT_MAP[api.id],
    name:    api.name,
    price:   api.price,
    was:     api.originalPrice,
    tone:    api.tone,
    label:   api.label,
    tags:    api.tags ?? [],
    rating:  api.rating  ?? 0,
    reviews: api.reviews ?? 0,
    // Galería: solo las fotos cargadas. La portada es la primera (o el imageUrl legacy).
    images:  api.images ?? [],
    image:   api.images?.[0] ?? api.imageUrl,
    stock:   api.stock,
    new:     api.isNew,
  }
}

type ApiDataCtx = {
  categories: Category[]
  products: Product[]
}

const ApiDataContext = createContext<ApiDataCtx>({
  categories: CATEGORIES,
  products: [],
})

type ProviderProps = {
  children: ReactNode
  initialCategories?: ApiCategory[]
  initialProducts?: ApiProduct[]
}

export function ApiDataProvider({ children, initialCategories = [], initialProducts = [] }: ProviderProps) {
  // La base de datos es la única fuente de verdad: la web muestra exactamente
  // los productos que hay en la base. Si no hay ninguno (activo), la tienda
  // queda vacía — ya no se usa ningún catálogo de demostración de respaldo.
  const products = initialProducts.map(mapApiProduct)

  const catCountMap: Record<string, number> = {}
  initialCategories.forEach(c => { catCountMap[c.id] = c.productCount })

  const categories = CATEGORIES.map(c => ({
    ...c,
    count: catCountMap[c.id] ?? c.count,
  }))

  return createElement(ApiDataContext.Provider, { value: { categories, products } }, children)
}

export function useCategories(): Category[] {
  return useContext(ApiDataContext).categories
}

export function useProducts(): Product[] {
  return useContext(ApiDataContext).products
}
