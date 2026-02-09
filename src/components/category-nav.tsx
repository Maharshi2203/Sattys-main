'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Category } from '@/lib/types'

export function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="hidden md:block w-full border-b border-border/60 shadow-sm bg-white overflow-hidden">
        <div className="max-w-[1248px] mx-auto px-4 h-11 flex items-center gap-4 overflow-x-auto scrollbar-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <div className="hidden md:block w-full border-b border-border/60 shadow-sm bg-white overflow-visible z-40 relative">
      <div className="max-w-[1248px] mx-auto px-4 h-11 flex items-center justify-start gap-1 overflow-visible">
        {categories.map((cat) => (
          <div key={cat.id} className="relative group h-full flex items-center">
            <Link
              href={`/products?category=${cat.id}`}
              className="flex items-center gap-1.5 text-sm font-bold text-[#333] hover:text-[#2874f0] transition-colors whitespace-nowrap px-4 py-2"
            >
              {cat.name}
              <ChevronRight className="w-3.5 h-3.5 text-[#878787] group-hover:rotate-90 transition-transform duration-300" />
            </Link>

            {/* Dropdown Menu */}
            {cat.products && cat.products.length > 0 && (
              <div className="absolute top-full left-0 w-64 bg-white border border-border/60 shadow-xl rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform group-hover:translate-y-0 translate-y-2">
                <div className="py-2">
                  <p className="px-4 py-2 text-[10px] uppercase font-black tracking-widest text-[#878787] border-b border-border/40 mb-1">
                    Top {cat.name}
                  </p>
                  {cat.products.slice(0, 5).map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-md bg-gray-100 border border-border overflow-hidden flex-shrink-0">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400 font-bold">N/A</div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-[#333] truncate group-hover/item:text-[#2874f0] transition-colors">{product.name}</p>
                        <p className="text-[10px] text-[#878787] font-medium">
                          ₹{Number(product.final_price).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </Link>
                  ))}
                  {cat.products.length > 5 && (
                    <Link
                      href={`/products?category=${cat.id}`}
                      className="block text-center py-2 text-xs font-bold text-[#2874f0] hover:underline"
                    >
                      View All ({cat.products.length})
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
