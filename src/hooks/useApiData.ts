'use client'

import { createContext, useContext, ReactNode, createElement } from 'react'
import { CATEGORIES, PRODUCTS } from '@/lib/data'
import type { Category, Product } from '@/lib/types'
import type { ApiProduct, ApiCategory } from '@/lib/api'

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
  const catCountMap: Record<string, number> = {}
  initialCategories.forEach(c => { catCountMap[c.id] = c.productCount })

  const products = PRODUCTS.map(staticProd => {
    const liveProd = initialProducts.find(p => p.id === staticProd.id)
    if (!liveProd) return { ...staticProd, rating: 0, reviews: 0 }

    return {
      ...staticProd,
      name:    liveProd.name          ?? staticProd.name,
      price:   liveProd.price         ?? staticProd.price,
      was:     liveProd.originalPrice ?? staticProd.was,
      tone:    liveProd.tone          ?? staticProd.tone,
      label:   liveProd.label         ?? staticProd.label,
      tags:    liveProd.tags          ?? staticProd.tags,
      image:   liveProd.imageUrl      ?? staticProd.image,
      rating:  liveProd.rating        ?? 0,
      reviews: liveProd.reviews       ?? 0,
      new:     liveProd.isNew         ?? staticProd.new,
    }
  })

  // c.count is already computed from PRODUCTS in data.ts; API overrides if available
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
