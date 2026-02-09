'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/contact', label: 'Contact' },
  { href: '/about', label: 'About' },
]

import { useEffect } from 'react'

export function HomeHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { count } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-2 sm:py-4" : "bg-transparent py-4 sm:py-8"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center flex-shrink-0">
              <Logo
                className="transition-all duration-300"
                responsive
                height={scrolled ? 28 : undefined}
              />
            </Link>

          <div className="flex items-center gap-4 sm:gap-8 xl:gap-10">
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-base lg:text-lg font-medium tracking-wide transition-all cursor-pointer group",
                    scrolled ? "text-gray-900 hover:text-[#C8102B]" : "text-white hover:text-white/80"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
                    scrolled ? "bg-[#C8102B]" : "bg-white"
                  )} />
                </Link>
              ))}
            </nav>

            <div className="hidden sm:flex items-center">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className={cn(
                  "relative transition-all",
                  scrolled ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/10"
                )}>
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#C8102B] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                      {count}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            <button
              className={cn(
                "md:hidden p-1.5 sm:p-2 transition-all",
                scrolled ? "text-gray-900" : "text-white"
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 sm:w-8 sm:h-8" /> : <Menu className="w-6 h-6 sm:w-8 sm:h-8" />}
            </button>
          </div>
        </div>

        <div className={cn(
          "md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl transition-all duration-300 overflow-hidden shadow-xl",
          mobileMenuOpen ? "max-h-screen border-b border-gray-100" : "max-h-0"
        )}>
          <nav className="flex flex-col p-6 sm:p-8 gap-4 sm:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-900 text-xl sm:text-2xl font-medium hover:text-[#C8102B] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-gray-100">
              <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-900 group">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 group-hover:text-[#C8102B] transition-colors" />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#C8102B] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </div>
                <span className="text-xl sm:text-2xl font-medium group-hover:text-[#C8102B] transition-colors">Cart</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
