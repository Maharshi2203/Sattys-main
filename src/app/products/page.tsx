'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout'
import { ProductCard } from '@/components/product-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Search, Filter, X, Package, LayoutGrid, List } from 'lucide-react'
import type { Product, Category } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '')
  const [stockStatus, setStockStatus] = useState(searchParams.get('stock') || '')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [maxPrice, setMaxPrice] = useState(5000)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [searchParams])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchParams.get('search')) params.set('search', searchParams.get('search')!)
      if (searchParams.get('category')) params.set('category', searchParams.get('category')!)
      if (searchParams.get('stock')) params.set('stock', searchParams.get('stock')!)
      if (searchParams.get('minPrice')) params.set('minPrice', searchParams.get('minPrice')!)
      if (searchParams.get('maxPrice')) params.set('maxPrice', searchParams.get('maxPrice')!)

      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data)

      if (data.length > 0) {
        const max = Math.max(...data.map((p: Product) => Number(p.final_price)))
        const calculatedMax = Math.ceil(max / 500) * 500 || 5000
        setMaxPrice(calculatedMax)
        if (!searchParams.get('maxPrice')) {
          setPriceRange([0, calculatedMax])
        }
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (categoryId && categoryId !== 'all') params.set('category', categoryId)
    if (stockStatus && stockStatus !== 'all') params.set('stock', stockStatus)
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString())
    if (priceRange[1] < maxPrice) params.set('maxPrice', priceRange[1].toString())
    router.push(`/products?${params.toString()}`)
    setFiltersOpen(false)
  }, [search, categoryId, stockStatus, priceRange, maxPrice, router])

  const clearFilters = () => {
    setSearch('')
    setCategoryId('')
    setStockStatus('')
    setPriceRange([0, maxPrice])
    router.push('/products')
    setFiltersOpen(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFEFEC] text-[#1a1a1a] selection:bg-primary/10">
      <Header />

        <main className="flex-1">
          <section className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh] min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] w-full overflow-hidden flex items-center justify-center">
              <video
                autoPlay
                muted
                loop
                playsInline
                controlsList="nodownload"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
              >
                <source src="https://res.cloudinary.com/dsxes4hgu/video/upload/v1769956658/Untitled_design_2_zmezab.mp4" type="video/mp4" />
              </video>

            <div className="absolute inset-0 bg-black/50 z-10" />

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 text-center pt-16 sm:pt-24 lg:pt-32">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="space-y-3 sm:space-y-6"
              >
                <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-8xl font-display font-bold text-white tracking-tight drop-shadow-2xl">
                  Explore Excellence
                </h1>
                <p className="text-sm sm:text-lg lg:text-xl xl:text-2xl text-white/90 leading-relaxed font-medium max-w-3xl mx-auto drop-shadow-lg px-2">
                  Discover our curated selection of premium products, where quality meets craftsmanship in every detail.
                </p>

                <div className="pt-4 sm:pt-8">
                  <div className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                    Premium Collection
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 relative z-20">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
              <aside className="w-full lg:w-80 flex-shrink-0">
                <div className="lg:sticky lg:top-28">
                  <div className="flex items-center justify-between mb-4 lg:mb-8 px-1 lg:px-2">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-[#1a1a1a]">Filters</h2>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={clearFilters}
                      className="text-primary hover:text-primary/80 font-bold p-0 text-sm"
                    >
                      Reset All
                    </Button>
                  </div>

                  <div className="space-y-4 lg:space-y-8 bg-white/60 backdrop-blur-3xl border border-black/5 rounded-2xl lg:rounded-[2.5rem] p-4 sm:p-6 lg:p-8 shadow-[0_20px_80px_-20px_rgba(200,16,43,0.08)] ring-1 ring-black/5">
                    <form onSubmit={handleSearchSubmit} className="space-y-2 lg:space-y-3">
                      <Label className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black text-black/40">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                        <Input
                          placeholder="What are you looking for?"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="pl-10 sm:pl-12 h-11 sm:h-14 bg-white border-black/5 rounded-xl lg:rounded-2xl focus:ring-primary text-black placeholder:text-black/20 text-sm sm:text-base"
                        />
                      </div>
                    </form>

                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4">
                      <div className="space-y-2 lg:space-y-3">
                        <Label className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black text-black/40">Category</Label>
                        <Select value={categoryId} onValueChange={setCategoryId}>
                          <SelectTrigger className="h-11 sm:h-14 bg-white border-black/5 rounded-xl lg:rounded-2xl text-black text-sm">
                            <SelectValue placeholder="All Collections" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl lg:rounded-2xl bg-white border-black/5 text-black">
                            <SelectItem value="all">All Collections</SelectItem>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 lg:space-y-3">
                        <Label className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black text-black/40">Availability</Label>
                        <Select value={stockStatus} onValueChange={setStockStatus}>
                          <SelectTrigger className="h-11 sm:h-14 bg-white border-black/5 rounded-xl lg:rounded-2xl text-black text-sm">
                            <SelectValue placeholder="Any Status" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl lg:rounded-2xl bg-white border-black/5 text-black">
                            <SelectItem value="all">Any Status</SelectItem>
                            <SelectItem value="IN">In Stock</SelectItem>
                            <SelectItem value="OUT">Out of Stock</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4 lg:space-y-6 hidden sm:block">
                      <div className="flex justify-between items-end">
                        <Label className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black text-black/40">Price Range</Label>
                        <span className="text-xs sm:text-sm font-bold text-primary">₹ {priceRange[0]} - ₹ {priceRange[1]}</span>
                      </div>
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        max={maxPrice}
                        step={50}
                        className="py-4"
                      />
                    </div>

                    <Button
                      onClick={applyFilters}
                      className="w-full h-11 sm:h-14 bg-gradient-to-r from-primary to-[#ff3d5e] hover:to-[#ff1a40] text-white font-bold rounded-xl lg:rounded-2xl shadow-[0_10px_30px_-10px_rgba(200,16,43,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-white/10 text-sm sm:text-base"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </aside>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-white/10">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-[#1a1a1a]">
                    {loading ? 'Discovering...' : `${products.length} Products`}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 sm:mt-2">
                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                    <p className="text-[8px] sm:text-[10px] text-black/40 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-black">Curated for your premium lifestyle</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white/40 p-1 rounded-xl sm:rounded-2xl border border-black/5 shadow-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode('grid')}
                      className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl transition-all duration-200 ${
                        viewMode === 'grid'
                          ? 'bg-white shadow-sm text-primary'
                          : 'text-black/30 hover:text-black hover:bg-white/50'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode('list')}
                      className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl transition-all duration-200 ${
                        viewMode === 'list'
                          ? 'bg-white shadow-sm text-primary'
                          : 'text-black/30 hover:text-black hover:bg-white/50'
                      }`}
                    >
                      <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-8" : "flex flex-col gap-3 sm:gap-4"}>
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={
                        viewMode === 'grid'
                          ? "aspect-square sm:aspect-[4/5] bg-black/5 animate-pulse rounded-xl sm:rounded-2xl lg:rounded-[2.5rem] border border-black/5"
                          : "h-20 sm:h-28 lg:h-32 w-full bg-black/5 animate-pulse rounded-xl sm:rounded-2xl border border-black/5"
                      }
                    />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 sm:py-24 px-4 bg-white/40 border border-black/5 rounded-2xl sm:rounded-[3rem] shadow-xl"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Package className="w-7 h-7 sm:w-10 sm:h-10 text-black/20" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-display font-bold text-[#1a1a1a] mb-2 sm:mb-3">No Results Found</h3>
                  <p className="text-sm sm:text-base text-black/40 mb-6 sm:mb-8 max-w-xs mx-auto">Try refining your search or adjusting filters to discover more.</p>
                  <Button variant="outline" onClick={clearFilters} className="rounded-lg sm:rounded-xl px-6 sm:px-8 border-black/10 text-[#1a1a1a] hover:bg-black/5 font-bold text-sm sm:text-base">Clear All Filters</Button>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className={
                    viewMode === 'grid'
                      ? "grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-8"
                      : "flex flex-col gap-3 sm:gap-4"
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} viewMode={viewMode} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
