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
    image:   api.imageUrl,
    new:     api.isNew,
  }
}

type ApiDataCtx = {
  categories: Category[]
  products: Product[]
}

const ApiDataContext = createContext<ApiDataCtx>({
  categories: CATEGORIES,
  products: PRODUCTS,
})

type ProviderProps = {
  children: ReactNode
  initialCategories?: ApiCategory[]
  initialProducts?: ApiProduct[]
}

export function ApiDataProvider({ children, initialCategories = [], initialProducts = [] }: ProviderProps) {
  // Use API as source of truth; fall back to static data when the API is empty
  const products = initialProducts.length > 0
    ? initialProducts.map(mapApiProduct)
    : PRODUCTS

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
