'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, ChevronRight, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRecentlyViewed } from '@/hooks/use-recently-viewed'
import { useCart } from '@/hooks/use-cart'
import { toast } from 'sonner'
import type { Product } from '@/lib/types'

interface RecentlyViewedProps {
  currentId: number
}

export function RecentlyViewed({ currentId }: RecentlyViewedProps) {
  const { getViewedIdsExcluding, isLoaded } = useRecentlyViewed()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const viewedIds = useMemo(() => {
    return getViewedIdsExcluding(currentId).slice(0, 8)
  }, [getViewedIdsExcluding, currentId])

  useEffect(() => {
    if (!isLoaded || viewedIds.length === 0) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchProducts() {
      try {
        const fetchedProducts: Product[] = []

        const promises = viewedIds.map(async (id) => {
          try {
            const res = await fetch(`/api/products/${id}`)
            if (res.ok) {
              return await res.json()
            }
          } catch {
            return null
          }
          return null
        })

        const results = await Promise.all(promises)

        if (!cancelled) {
          const validProducts = results.filter((p): p is Product => p !== null)
          const orderedProducts = viewedIds
            .map(id => validProducts.find(p => p.id === id))
            .filter((p): p is Product => p !== undefined)

          setProducts(orderedProducts)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      cancelled = true
    }
  }, [viewedIds, isLoaded])

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      name: product.name,
      final_price: Number(product.final_price),
      image_url: product.image_url || '',
    })
    toast.success(`${product.name} added to cart!`, {
      icon: <ShoppingCart className="w-4 h-4" />,
    })
  }

  if (!isLoaded || loading) {
    return null
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="py-8 sm:py-16 space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">Recently Viewed</h2>
          <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pick up where you left off</p>
        </div>
        <Link href="/products" className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#C8102B] flex items-center gap-2 hover:translate-x-1 transition-transform">
          Full Catalog <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-3 sm:gap-6 sm:grid sm:grid-cols-4 min-w-max sm:min-w-0">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group w-[140px] sm:w-auto flex-shrink-0"
            >
              <Link href={`/products/${product.id}`} className="block space-y-3 sm:space-y-4">
                <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#f8f8f8] border border-border group-hover:shadow-xl group-hover:shadow-primary/5 transition-all relative">
                  <Image
                    src={product.image_url || '/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-contain p-3 sm:p-4 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg text-[8px] sm:text-[10px] font-bold text-foreground shadow-sm">
                      View Detail
                    </div>
                  </div>
                  {product.stock_status === 'OUT' && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                      <span className="bg-rose-500 text-white text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Out</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1 px-1">
                  <p className="text-[7px] sm:text-[9px] text-primary font-black uppercase tracking-[0.2em]">
                    {product.brand_name || "Satty's"}
                  </p>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 group-hover:text-[#C8102B] transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-black text-foreground">₹{Number(product.final_price).toLocaleString('en-IN')}</span>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="p-1.5 sm:p-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg transition-all"
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
