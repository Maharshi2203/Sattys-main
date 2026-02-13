import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [
      { count: totalProducts },
      { count: inStockProducts },
      { count: outOfStockProducts },
      { count: categoriesCount },
      { data: recentProducts },
      { count: unreadMessages }
    ] = await Promise.all([
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('stock_status', 'IN'),
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('stock_status', 'OUT'),
      supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }).limit(5),
      supabaseAdmin.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false)
    ])

    return NextResponse.json({
      totalProducts: totalProducts || 0,
      inStockProducts: inStockProducts || 0,
      outOfStockProducts: outOfStockProducts || 0,
      categoriesCount: categoriesCount || 0,
      recentProducts: recentProducts || [],
      unreadMessages: unreadMessages || 0
    })
  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json({ error: 'Server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
