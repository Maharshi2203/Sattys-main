'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/lib/types'
import { useCart } from '@/hooks/use-cart'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
  viewMode?: 'grid' | 'list'
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    addToCart({
      id: product.id,
      name: product.name,
      final_price: Number(product.final_price),
      image_url: product.image_url || '',
    })
    toast.success(`${product.name} added to cart!`, {
      icon: <ShoppingCart className="w-4 h-4" />,
      action: {
        label: 'View Cart',
        onClick: () => window.location.href = '/cart'
      }
    })
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        layout
        className="group bg-white rounded-xl sm:rounded-2xl border border-black/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 w-full"
      >
        <Link href={`/products/${product.id}`} className="flex items-center gap-3 sm:gap-6 p-3 sm:p-5">
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-[#f8f8f8] rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={product.image_url || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-contain p-2 sm:p-3 group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-1 left-1 flex flex-col gap-1 z-10">
              {product.stock_status === 'OUT' && (
                <span className="bg-rose-500 text-white text-[6px] sm:text-[8px] font-black px-1 sm:px-1.5 py-0.5 rounded-sm uppercase">OUT</span>
              )}
              {product.is_featured && (
                <span className="bg-amber-400 text-black text-[6px] sm:text-[8px] font-black px-1 sm:px-1.5 py-0.5 rounded-sm uppercase flex items-center gap-0.5">
                  <Star className="w-1.5 h-1.5 sm:w-2 sm:h-2 fill-current" />
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 py-1">
            <p className="text-[8px] sm:text-[10px] text-primary font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-1">
              {product.brand_name || "Satty's Original"}
            </p>
            <h3 className="text-sm sm:text-lg lg:text-xl font-display font-bold text-[#1a1a1a] mb-1 sm:mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-xs sm:text-sm text-black/50 line-clamp-2 hidden sm:block mb-2">
              {product.description || 'Premium quality product from Satty\'s collection.'}
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
                <span className="text-[9px] sm:text-xs font-bold text-gray-700">4.5</span>
              </div>
              <span className="text-[8px] sm:text-xs text-gray-400">(1.2k reviews)</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 sm:gap-3 flex-shrink-0">
            <div className="text-right">
              <p className="text-[8px] sm:text-[9px] text-black/30 uppercase tracking-wider mb-0.5 hidden sm:block">Price</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-display font-bold text-[#1a1a1a]">
                ₹{Number(product.final_price).toLocaleString('en-IN')}
              </p>
            </div>
            <Button
              onClick={handleAddToCart}
              className="h-8 sm:h-10 lg:h-12 px-3 sm:px-4 lg:px-6 bg-primary hover:bg-primary/90 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <span className="hidden xs:inline">Add</span>
            </Button>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      layout
      className="group bg-white rounded-2xl sm:rounded-[2.8rem] border border-black/5 overflow-hidden transition-all duration-500 flex flex-col h-full"
    >
      <Link href={`/products/${product.id}`} className="flex-1 flex flex-col">
        <div className="block sm:hidden flex flex-col h-full p-2.5">
          <div className="relative aspect-square bg-[#f8f8f8] rounded-xl overflow-hidden flex items-center justify-center mb-2.5">
            <Image
              src={product.image_url || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-contain p-3 group-hover:scale-110 transition-transform duration-700"
            />

            <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
              {product.stock_status === 'OUT' ? (
                <span className="bg-rose-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm uppercase">OUT OF STOCK</span>
              ) : product.is_featured && (
                <span className="bg-amber-400 text-black text-[7px] font-black px-1.5 py-0.5 rounded-sm uppercase flex items-center gap-0.5">
                  <Star className="w-2 h-2 fill-current" /> FEATURED
                </span>
              )}
            </div>

            <div className="absolute bottom-1.5 right-1.5 z-20">
              <Button
                onClick={handleAddToCart}
                className="h-7 px-3 bg-white hover:bg-emerald-50 text-emerald-600 border border-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                ADD
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-1 flex-1 px-0.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 border border-emerald-600 flex items-center justify-center p-[2px]">
                <div className="w-1 h-1 bg-emerald-600 rounded-full" />
              </div>
              <span className="text-[10px] font-bold text-gray-500">{product.pack_size || '1 unit'}</span>
            </div>

            <h3 className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight min-h-[2rem] mt-0.5">
              {product.name}
            </h3>

            <div className="flex items-center gap-1 mt-0.5">
              <div className="flex items-center bg-gray-100 px-1 py-0.5 rounded gap-0.5">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span className="text-[9px] font-bold text-gray-700">4.5</span>
              </div>
              <span className="text-[9px] font-medium text-gray-400">(1.2k)</span>
            </div>

            <div className="flex items-center gap-1 mt-0.5">
              <div className="flex items-center gap-1 opacity-60">
                <div className="w-2.5 h-2.5 rounded-full border border-gray-400 flex items-center justify-center">
                  <div className="w-1 h-1 border-b border-r border-gray-400 rotate-45 -translate-y-[1px]" />
                </div>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">12 MINS</span>
              </div>
            </div>

            <div className="mt-auto pt-2 flex items-center justify-between">
              <p className="text-base font-black text-gray-950">
                ₹{Number(product.final_price).toLocaleString('en-IN')}
              </p>
              {product.stock_status === 'OUT' ? (
                <span className="text-[9px] font-bold text-rose-500 italic">Sold Out</span>
              ) : (
                <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1 rounded">Only 2 left</span>
              )}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex flex-col h-full flex-1">
          <div className="relative aspect-[4/5] bg-gradient-to-b from-gray-50 to-[#fdfaf8] overflow-hidden flex items-center justify-center p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,16,43,0.03),transparent_70%)]" />
            <Image
              src={product.image_url || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-contain p-4 group-hover:scale-110 transition-transform duration-[1.2s] ease-[cubic-bezier(0.2,0,0,1)] z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.08)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/[0.02] to-transparent z-0" />

            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
              {product.stock_status === 'OUT' && (
                <Badge className="bg-rose-50 text-rose-600 border border-rose-200 backdrop-blur-md px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-sm">
                  Out of Stock
                </Badge>
              )}
              {product.is_featured && (
                <Badge className="bg-amber-50 text-amber-700 border border-amber-200 backdrop-blur-md px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-sm">
                  <Star className="w-2.5 h-2.5 mr-1 fill-current" />
                  Featured
                </Badge>
              )}
            </div>

            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 delay-100">
              <Button size="icon" variant="secondary" className="rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-8 pt-6 flex-1 flex flex-col">
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.4em] mb-3">
              {product.brand_name || 'Satty\'s Original'}
            </p>
            <h3 className="font-display text-2xl font-bold text-[#1a1a1a] mb-6 line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>

            <div className="mt-auto pt-4 flex items-center justify-between border-t border-black/[0.05]">
              <div className="price-lining">
                <p className="text-[9px] text-black/30 uppercase tracking-[0.2em] mb-1 font-bold">Starting From</p>
                <p className="text-3xl font-display font-bold text-[#1a1a1a] tracking-tight">
                  ₹ {Number(product.final_price).toLocaleString('en-IN')}
                </p>
              </div>

              <Button
                onClick={handleAddToCart}
                size="icon"
                className="h-14 w-14 bg-white hover:bg-primary text-primary hover:text-white border border-black/5 rounded-[1.3rem] shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_20px_-5px_rgba(200,16,43,0.3)] transition-all duration-500 hover:scale-110 active:scale-90 group/btn"
              >
                <ShoppingCart className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
