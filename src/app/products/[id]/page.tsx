import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout'
import { ChevronRight, Share2 } from 'lucide-react'
import type { Product } from '@/lib/types'
import { supabaseAdmin } from '@/lib/supabase'

import { ImageGallery } from '@/components/pdp/ImageGallery'
import { ProductInfo } from '@/components/pdp/ProductInfo'

import { RecentlyViewed } from '@/components/pdp/RecentlyViewed'
import { RecentlyViewedTracker } from '@/components/pdp/RecentlyViewedTracker'
import { StickyCTA } from '@/components/pdp/StickyCTA'
import { ShareButton } from '@/components/pdp/ShareButton'
import { CategoryNav } from '@/components/category-nav'

async function getProduct(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, category:categories(*)')
      .eq('id', parseInt(id))
      .single()

    if (error || !data) return null
    return data as Product
  } catch { return null }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  // Use the images array if available, fallback to image_url, then placeholder
  const images = (product.images && product.images.length > 0)
    ? product.images
    : (product.image_url ? [product.image_url] : ['/placeholder-product.jpg'])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <RecentlyViewedTracker productId={product.id} />

      {/* Spacer for Absolute Header */}
      <div className="h-24 sm:h-28" />

      {/* Dynamic Categories Bar */}
      <CategoryNav />

      <main className="flex-1 w-full max-w-[1248px] mx-auto px-4 sm:px-6 py-2">
        {/* Breadcrumbs - Flipkart Style */}
        <nav className="flex items-center gap-1.5 py-3 text-xs font-semibold text-[#878787]">
          <Link href="/" className="hover:text-[#2874f0] transition-colors">Home</Link>
          <ChevronRight className="w-2.5 h-2.5" />
          <Link href="/products" className="hover:text-[#2874f0] transition-colors">Catalog</Link>
          <ChevronRight className="w-2.5 h-2.5" />
          <span className="truncate max-w-[300px] text-[#878787] font-medium">{product.name}</span>
          <ShareButton name={product.name} />
        </nav>

        {/* Primary Product Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 mt-2 bg-white p-2">

          {/* Left Panel: Visuals & Gallery */}
          <div className="w-full">
            <ImageGallery images={images} name={product.name} />
          </div>

          {/* Right Panel: Logic & Details */}
          <div className="w-full">
            <ProductInfo product={product} />
          </div>
        </div>



        {/* Recently Viewed / Recommendations */}
        <RecentlyViewed currentId={product.id} />
      </main>

      {/* Sticky Bottom Actions */}
      <StickyCTA product={product} />

      {/* Standard Footer or Padding */}

    </div>
  )
}

