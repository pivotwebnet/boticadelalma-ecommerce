'use client'

import { createContext, useContext, ReactNode, createElement } from 'react'
import { CATEGORIES, PRODUCTS } from '@/lib/data'
import type { Category, Product } from '@/lib/types'

type ApiCategory = { id: string; productCount: number }
type ApiProductStats = { id: string; rating: number; reviews: number }

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
  initialProducts?: ApiProductStats[]
}

export function ApiDataProvider({ children, initialCategories = [], initialProducts = [] }: ProviderProps) {
  const catCountMap: Record<string, number> = {}
  initialCategories.forEach(c => { catCountMap[c.id] = c.productCount })

  const prodStatsMap: Record<string, ApiProductStats> = {}
  initialProducts.forEach(p => { prodStatsMap[p.id] = p })

  const categories = CATEGORIES.map(c => ({
    ...c,
    count: catCountMap[c.id] ?? c.count,
  }))

  const products = PRODUCTS.map(p => ({
    ...p,
    rating: prodStatsMap[p.id]?.rating ?? p.rating,
    reviews: prodStatsMap[p.id]?.reviews ?? p.reviews,
  }))

  return createElement(ApiDataContext.Provider, { value: { categories, products } }, children)
}

export function useCategories(): Category[] {
  return useContext(ApiDataContext).categories
}

export function useProducts(): Product[] {
  return useContext(ApiDataContext).products
}
