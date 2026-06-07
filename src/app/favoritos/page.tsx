'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/store/useStore'
import { useProducts } from '@/hooks/useApiData'
import ProductCard from '@/components/ui/ProductCard'
import Icon from '@/components/ui/Icon'

export default function FavoritosPage() {
  const [mounted, setMounted] = useState(false)
  const favs = useStore(s => s.favs)
  const allProducts = useProducts()

  useEffect(() => setMounted(true), [])

  const favorites = mounted ? allProducts.filter(p => favs.includes(p.id)) : []

  return (
    <main className="max-w-7xl mx-auto px-5 py-20 min-h-[60vh]">
      <div className="mb-10">
        <span className="eyebrow">Tu lista</span>
        <h1 className="font-serif text-4xl italic text-stone-800 mt-1">Favoritos</h1>
        {mounted && (
          <p className="text-stone-500 mt-2 text-sm">
            {favorites.length === 0
              ? 'Todavía no tenés piezas guardadas.'
              : `${favorites.length} ${favorites.length === 1 ? 'pieza guardada' : 'piezas guardadas'}`}
          </p>
        )}
      </div>

      {mounted && favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-stone-400">
          <Icon name="heart" size={40} stroke={1} />
          <p className="text-center text-stone-500">
            Guardá las piezas que más te gustan<br />
            tocando el corazón en cada producto.
          </p>
          <Link href="/catalogo" className="btn btn-ghost btn-sm mt-2">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="product-grid grid-regular">
          {favorites.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  )
}
