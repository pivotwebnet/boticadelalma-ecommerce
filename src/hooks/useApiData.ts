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

  // Mapeamos los productos finales usando los datos reales del servidor.
  // Los datos del API tienen precedencia sobre los estáticos para los campos editables.
  // Si un producto no está en el servidor, cae de vuelta al estático con rating 0.
  const products = PRODUCTS.map(staticProd => {
    const liveProd = (initialProducts as any[]).find(p => p.id === staticProd.id)
    if (!liveProd) return { ...staticProd, rating: 0, reviews: 0 }

    return {
      ...staticProd,
      name:    liveProd.name     ?? staticProd.name,
      price:   liveProd.price    ?? staticProd.price,
      was:     liveProd.originalPrice ?? staticProd.was,
      tone:    liveProd.tone     ?? staticProd.tone,
      label:   liveProd.label    ?? staticProd.label,
      tags:    liveProd.tags     ?? staticProd.tags,
      image:   liveProd.imageUrl ?? staticProd.image,
      rating:  liveProd.rating   ?? 0,
      reviews: liveProd.reviews  ?? 0,
      new:     liveProd.isNew    ?? staticProd.new,
    }
  })

  const categories = CATEGORIES.map(c => ({
    ...c,
    count: catCountMap[c.id] ?? 0,
  }))

  return createElement(ApiDataContext.Provider, { value: { categories, products } }, children)
}

export function useCategories(): Category[] {
  return useContext(ApiDataContext).categories
}

export function useProducts(): Product[] {
  return useContext(ApiDataContext).products
}
