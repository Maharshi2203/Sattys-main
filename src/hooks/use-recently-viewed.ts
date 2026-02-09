'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Product } from '@/lib/types'

const STORAGE_KEY = 'sattys_recently_viewed'
const MAX_ITEMS = 8

interface RecentlyViewedItem {
  id: number
  viewedAt: number
}

export function useRecentlyViewed() {
  const [viewedIds, setViewedIds] = useState<number[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const items: RecentlyViewedItem[] = JSON.parse(stored)
        const sortedIds = items
          .sort((a, b) => b.viewedAt - a.viewedAt)
          .map(item => item.id)
          .slice(0, MAX_ITEMS)
        setViewedIds(sortedIds)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoaded(true)
  }, [])

  const addProduct = useCallback((productId: number) => {
    setViewedIds(prev => {
      const filtered = prev.filter(id => id !== productId)
      const updated = [productId, ...filtered].slice(0, MAX_ITEMS)
      
      const items: RecentlyViewedItem[] = updated.map((id, index) => ({
        id,
        viewedAt: Date.now() - index
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setViewedIds([])
  }, [])

  const getViewedIdsExcluding = useCallback((excludeId: number) => {
    return viewedIds.filter(id => id !== excludeId)
  }, [viewedIds])

  return {
    viewedIds,
    isLoaded,
    addProduct,
    clearHistory,
    getViewedIdsExcluding
  }
}
