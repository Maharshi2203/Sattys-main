'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, CheckCircle, XCircle, FolderTree, MessageSquare, TrendingUp, ArrowUpRight, ArrowRight } from 'lucide-react'
import type { DashboardStats, Product } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard')
      if (!res.ok) throw new Error('Failed to fetch stats')
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
      // Optional: set empty stats or handle error state
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const statCards = [
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'bg-primary', trend: '+12%' },
    { title: 'In Stock', value: stats?.inStockProducts || 0, icon: CheckCircle, color: 'bg-emerald-500', trend: '+5%' },
    { title: 'Out of Stock', value: stats?.outOfStockProducts || 0, icon: XCircle, color: 'bg-destructive', trend: '-2%' },
    { title: 'Categories', value: stats?.categoriesCount || 0, icon: FolderTree, color: 'bg-indigo-500', trend: '+1' },
    { title: 'New Messages', value: stats?.unreadMessages || 0, icon: MessageSquare, color: 'bg-amber-500', trend: '+3' },
  ]

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">Command Center</h1>
          <p className="text-muted-foreground mt-2 text-lg">Your store is performing at peak efficiency today.</p>
        </div>
        <div className="flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-2xl shadow-sm">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-foreground uppercase tracking-wider">Live Store Status</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border border-border shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all group overflow-hidden rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-display font-bold text-foreground">{stat.value.toLocaleString()}</div>
                <p className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-widest">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 border border-border shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-6">
            <div>
              <CardTitle className="text-2xl font-display font-bold">Recent Arrivals</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Latest products added to your collection</p>
            </div>
            <Link href="/admin/products">
              <Button variant="ghost" className="text-primary font-bold gap-2">
                View Catalog <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {stats?.recentProducts && stats.recentProducts.length > 0 ? (
              <div className="divide-y divide-border/50">
                {stats.recentProducts.map((product: Product) => (
                  <div key={product.id} className="flex items-center gap-6 p-6 hover:bg-muted/50 transition-colors group">
                    <div className="w-16 h-16 rounded-2xl bg-muted border border-border overflow-hidden flex-shrink-0 relative group-hover:scale-105 transition-transform">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{product.brand_name || 'Generic'}</span>
                        <span className="w-1 h-1 bg-border rounded-full" />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{product.product_code || 'No Code'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-display font-bold text-primary">₹ {Number(product.final_price).toLocaleString('en-IN')}</p>
                      <Badge className={`mt-1 ${product.stock_status === 'IN' ? 'bg-emerald-500' : 'bg-destructive'} text-[10px] font-bold uppercase tracking-wider`}>
                        {product.stock_status === 'IN' ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground">No Products Yet</h3>
                <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Start building your empire by adding your first masterpiece.</p>
                <Link href="/admin/products">
                  <Button className="mt-8 bg-primary rounded-xl px-8 font-bold">Add Product</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border border-border shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="border-b border-border/50 pb-6">
              <CardTitle className="text-xl font-display font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Live Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {stats?.unreadMessages && stats.unreadMessages > 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-amber-500" />
                  </div>
                  <h4 className="text-lg font-bold">{stats.unreadMessages} New Messages</h4>
                  <p className="text-sm text-muted-foreground mt-2">You have unanswered customer inquiries waiting for you.</p>
                  <Link href="/admin/contacts">
                    <Button className="mt-6 w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold">Respond Now</Button>
                  </Link>
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-sm font-medium">No pending inquiries. All customers are satisfied!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary text-white border-0 shadow-2xl shadow-primary/20 rounded-[2.5rem] p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative z-10">
              <h3 className="text-2xl font-display font-bold mb-4">Grow Your Shop</h3>
              <p className="text-white/80 leading-relaxed mb-8">Want to reach more customers? Explore our premium marketing tools and analytics.</p>
              <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-xl font-bold gap-2 group">
                Explore Analytics <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
