'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Info, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import { toast } from 'sonner'

interface ProductInfoProps {
    product: any
}

export function ProductInfo({ product }: ProductInfoProps) {
    const { addToCart } = useCart()
    const [isDescOpen, setIsDescOpen] = useState(false)

    const sellingPrice = Number(product.final_price)
    const basePrice = Number(product.base_price)

    // Only apply discount logic if base_price (MRP) is set and is higher than selling price
    const hasDiscount = basePrice > sellingPrice
    const mrp = hasDiscount ? basePrice : sellingPrice

    const discount = hasDiscount
        ? Math.round(((basePrice - sellingPrice) / basePrice) * 100)
        : 0

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            final_price: product.final_price,
            image_url: product.image_url || ''
        })
        toast.success('Successfully added to cart')
    }

    const handleBuyNow = () => {
        const phoneNumber = '918200892368'
        const productUrl = typeof window !== 'undefined' ? window.location.href : ''
        const price = Number(product.final_price).toLocaleString('en-IN')

        const message = encodeURIComponent(
            `Hi, I want to order:

Product: ${product.name}
Price: ₹${price}
Quantity: 1

Link: ${productUrl}

Please confirm my order. Thank you!`
        )

        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
    }

    return (
        <div className="flex flex-col gap-1 items-start">
            <span className="text-[#878787] font-bold text-sm tracking-wide uppercase mb-1">
                {product.brand_name || 'Satty\'s Original'}
            </span>

            <h1 className="text-xl font-medium text-[#212121] leading-relaxed mb-0.5">{product.name}</h1>

            <span className="text-[#388e3c] text-sm font-bold mb-1.5">Special price</span>

            {discount > 0 ? (
                <div className="flex items-center gap-3 mb-2 price-lining">
                    <span className="text-[28px] font-bold text-[#212121]">₹{Number(sellingPrice).toLocaleString('en-IN')}</span>
                    <span className="text-base text-[#878787] line-through">₹{Number(mrp).toLocaleString('en-IN')}</span>
                    <span className="text-[#388e3c] font-bold text-[16px]">{discount}% off</span>
                    <Info className="w-4 h-4 text-[#878787] cursor-pointer" />
                </div>
            ) : (
                <div className="flex items-center gap-3 mb-2 price-lining">
                    <span className="text-[28px] font-bold text-[#212121]">₹{Number(sellingPrice).toLocaleString('en-IN')}</span>
                </div>
            )}

            <div className="flex items-center gap-4 mb-8">
                {product.rating_count && product.rating_count > 0 ? (
                    <>
                        <div className="flex items-center gap-1 bg-[#388e3c] text-white px-1.5 py-0.5 rounded text-xs font-bold ring-1 ring-[#388e3c]/20 price-lining">
                            {product.rating_average || 0} <Star className="w-3 h-3 fill-current" />
                        </div>
                        <span className="text-sm text-[#878787] font-bold price-lining">{product.rating_count?.toLocaleString()} ratings</span>
                        <div className="w-[1px] h-4 bg-border/60 mx-2" />
                    </>
                ) : null}

                <div className="flex items-center gap-1.5 border-none p-0">
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        product.stock_status === 'OUT' ? "text-rose-500" : "text-[#388e3c]"
                    )}>
                        {product.stock_status === 'OUT' ? 'Out of Stock' : 'In Stock'}
                    </span>
                </div>
            </div>

            <div className="w-full mb-10 border border-border/40 rounded-sm overflow-hidden bg-white shadow-sm">
                <button
                    onClick={() => setIsDescOpen(!isDescOpen)}
                    className="w-full flex items-center justify-between p-4 bg-[#f9f9f9] hover:bg-[#f1f1f1] transition-colors"
                >
                    <h3 className="text-base font-bold text-[#212121]">Product Description</h3>
                    <ChevronRight className={cn("w-5 h-5 text-[#878787] transition-transform", isDescOpen && "rotate-90")} />
                </button>
                <AnimatePresence initial={false}>
                    {isDescOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-4 overflow-hidden"
                        >
                            <p className="text-sm text-[#212121] leading-relaxed">
                                {product.description || "Indulge in the aromatic excellence of Satty's premium ingredients."}
                            </p>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mt-6 border-t pt-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-[#878787] uppercase">Brand</p>
                                    <p className="text-sm text-[#212121] font-medium">{product.brand_name || 'Satty\'s'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-[#878787] uppercase">Pack Size</p>
                                    <p className="text-sm text-[#212121] font-medium">{product.pack_size || '500g'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-[#878787] uppercase">Shelf Life</p>
                                    <p className="text-sm text-[#212121] font-medium">{product.shelf_life || '12 Months'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-[#878787] uppercase">Authentic</p>
                                    <p className="text-sm text-[#212121] font-medium">100% Original</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>



            <div className="hidden lg:flex gap-4 pt-12 w-full">
                <Button onClick={handleAddToCart} className="flex-1 h-14 bg-[#ff9f00] hover:bg-[#ff9000] text-white font-bold text-base rounded shadow-lg active:scale-[0.98] transition-all">
                    Add to Cart
                </Button>
                <Button onClick={handleBuyNow} className="flex-1 h-14 bg-[#fb641b] hover:bg-[#f05000] text-white font-bold text-base rounded shadow-lg active:scale-[0.98] transition-all">
                    Buy Now
                </Button>
            </div>
        </div>
    )
}
