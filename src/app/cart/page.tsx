'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout'
import { useCart } from '@/hooks/use-cart'
import { Separator } from '@/components/ui/separator'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, count } = useCart()

  const handleCheckout = () => {
    const phoneNumber = '918200892368'

    let message = `*New Order from Satty's Website*%0A%0A`

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* (x${item.quantity}) - ₹${(Number(item.final_price) * item.quantity).toLocaleString('en-IN')}%0A`
    })

    message += `%0A*Total Amount: ₹${total.toLocaleString('en-IN')}*%0A%0A`
    message += `Please confirm my order. Thank you!`

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20 pb-8 sm:pt-32 sm:pb-12 lg:pt-48 lg:pb-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <Link href="/products">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground">Your Cart</h1>
            <span className="text-sm sm:text-base text-muted-foreground font-medium">({count})</span>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-3 sm:gap-6 p-3 sm:p-6 bg-card border border-border rounded-xl sm:rounded-3xl group transition-all hover:shadow-xl hover:shadow-primary/5"
                    >
                      <div className="relative w-20 h-20 sm:w-32 sm:h-32 bg-muted rounded-lg sm:rounded-2xl overflow-hidden flex-shrink-0 border border-border group-hover:border-primary/20 transition-colors">
                        <Image
                          src={item.image_url || '/placeholder.png'}
                          alt={item.name}
                          fill
                          className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-xl font-display font-bold text-foreground mb-0.5 sm:mb-1 group-hover:text-primary transition-colors line-clamp-2">{item.name}</h3>
                        <p className="text-primary font-display font-bold text-sm sm:text-lg mb-2 sm:mb-4">₹ {Number(item.final_price).toLocaleString('en-IN')}</p>

                        <div className="flex items-center gap-2 sm:gap-4">
                          <div className="flex items-center bg-muted rounded-full p-0.5 sm:p-1 border border-border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 sm:h-8 sm:w-8 rounded-full hover:bg-background transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                            <span className="w-6 sm:w-10 text-center font-bold text-foreground text-sm sm:text-base">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 sm:h-8 sm:w-8 rounded-full hover:bg-background transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 rounded-full transition-colors h-6 w-6 sm:h-8 sm:w-8"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
                        <p className="text-xl font-display font-bold text-foreground">₹ {(Number(item.final_price) * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-xl sm:rounded-3xl p-4 sm:p-8 sticky top-24 shadow-xl shadow-primary/5">
                  <h2 className="text-lg sm:text-2xl font-display font-bold text-foreground mb-4 sm:mb-6">Order Summary</h2>

                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <div className="flex justify-between text-sm sm:text-base text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-display font-bold text-foreground">₹ {total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-emerald-600 font-medium">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-base sm:text-lg font-display font-bold text-foreground">Total</span>
                      <span className="text-xl sm:text-3xl font-display font-bold text-primary">₹ {total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full h-11 sm:h-14 bg-primary hover:bg-primary/90 text-white text-sm sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-primary/20 gap-2 transition-all hover:scale-[1.02]"
                  >
                    Checkout Now
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>

                  <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                    Secure Checkout Guaranteed
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 sm:py-20 px-4 bg-card border border-border rounded-2xl sm:rounded-[3rem] shadow-xl shadow-primary/5"
            >
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <ShoppingBag className="w-7 h-7 sm:w-10 sm:h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl sm:text-3xl font-display font-bold text-foreground mb-3 sm:mb-4">Your cart is empty</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed">
                Looks like you haven&apos;t added any premium items yet. Explore our collection and find something special!
              </p>
              <Link href="/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-xl sm:rounded-2xl px-8 sm:px-12 h-11 sm:h-14 font-bold shadow-lg shadow-primary/20 text-sm sm:text-base">
                  Start Shopping
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
