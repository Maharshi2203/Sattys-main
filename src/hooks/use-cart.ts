'use client'

import { useState, useEffect } from 'react'

export interface CartItem {
  id: number
  name: string
  final_price: number
  image_url: string
  quantity: number
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }

    const handleCartUpdate = () => {
      const updatedCart = localStorage.getItem('cart')
      if (updatedCart) {
        setItems(JSON.parse(updatedCart))
      }
    }

    window.addEventListener('cart-updated', handleCartUpdate)
    return () => window.removeEventListener('cart-updated', handleCartUpdate)
  }, [])

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    const existing = items.find((i) => i.id === item.id)
    let newItems: CartItem[]

    if (existing) {
      newItems = items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      )
    } else {
      newItems = [...items, { ...item, quantity: 1 }]
    }

    localStorage.setItem('cart', JSON.stringify(newItems))
    setItems(newItems)
    window.dispatchEvent(new CustomEvent('cart-updated'))
  }

  const removeFromCart = (id: number) => {
    const newItems = items.filter((i) => i.id !== id)
    localStorage.setItem('cart', JSON.stringify(newItems))
    setItems(newItems)
    window.dispatchEvent(new CustomEvent('cart-updated'))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }
    const newItems = items.map((i) =>
      i.id === id ? { ...i, quantity } : i
    )
    localStorage.setItem('cart', JSON.stringify(newItems))
    setItems(newItems)
    window.dispatchEvent(new CustomEvent('cart-updated'))
  }

  const clearCart = () => {
    localStorage.removeItem('cart')
    setItems([])
    window.dispatchEvent(new CustomEvent('cart-updated'))
  }

  const total = items.reduce((sum, item) => sum + Number(item.final_price) * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return { items, addToCart, removeFromCart, updateQuantity, clearCart, total, count }
}
