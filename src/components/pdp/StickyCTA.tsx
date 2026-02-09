'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Zap, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { toast } from 'sonner'

interface StickyCTAProps {
    product: {
        id: number
        name: string
        final_price: number | string
        image_url?: string | null
    }
}

export function StickyCTA({ product }: StickyCTAProps) {
    const [isVisible, setIsVisible] = useState(false)
    const { addToCart } = useCart()

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY
            setIsVisible(scrollPos > 600)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleAddToCart = () => {
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
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ type: "spring", damping: 25, stiffness: 400 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-xl border-t border-border/50 shadow-[0_-8px_32px_rgba(0,0,0,0.1)] px-6 py-4"
                >
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
                        <div className="hidden sm:flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl border border-border overflow-hidden bg-white">
                                {product.image_url && (
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-foreground line-clamp-1">{product.name}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-foreground">₹{Number(product.final_price).toLocaleString()}</span>
                                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">In Stock</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-1 sm:flex-none items-center gap-3">
                            <Button
                                variant="outline"
                                className="hidden md:flex w-14 h-14 rounded-full border-border hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
                            >
                                <Heart className="w-6 h-6" />
                            </Button>
                            <Button
                                onClick={handleAddToCart}
                                className="flex-[2] md:flex-none md:w-56 h-14 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl gap-3 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
                            >
                                <ShoppingCart className="w-4 h-4" /> Add to Cart
                            </Button>
                            <Button
                                onClick={handleBuyNow}
                                className="flex-[3] md:flex-none md:w-64 h-14 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl gap-3 shadow-lg shadow-orange-600/20 transition-all active:scale-[0.98]"
                            >
                                <Zap className="w-4 h-4 fill-current" /> Buy Now
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
