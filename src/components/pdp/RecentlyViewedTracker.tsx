'use client'

import { useEffect } from 'react'
import { useRecentlyViewed } from '@/hooks/use-recently-viewed'

interface RecentlyViewedTrackerProps {
  productId: number
}

export function RecentlyViewedTracker({ productId }: RecentlyViewedTrackerProps) {
  const { addProduct } = useRecentlyViewed()

  useEffect(() => {
    if (productId) {
      addProduct(productId)
    }
  }, [productId, addProduct])

  return null
}
