import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')
    const sortBy = searchParams.get('sortBy') || 'helpful'

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    let query = supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true)

    if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false })
    } else if (sortBy === 'highest') {
      query = query.order('rating', { ascending: false }).order('created_at', { ascending: false })
    } else {
      query = query.order('helpful_count', { ascending: false }).order('created_at', { ascending: false })
    }

    const { data: reviews, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const stats = calculateStats(reviews || [])

    return NextResponse.json({ reviews, stats })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { product_id, user_name, user_email, rating, title, comment } = body

    if (!product_id || !user_name || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    if (user_email) {
      const { data: existing } = await supabaseAdmin
        .from('reviews')
        .select('id')
        .eq('product_id', product_id)
        .eq('user_email', user_email)
        .single()

      if (existing) {
        return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 })
      }
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        product_id,
        user_name,
        user_email,
        rating,
        title,
        comment,
        is_verified_purchase: false,
        is_approved: true,
        helpful_count: 0
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

function calculateStats(reviews: any[]) {
  if (reviews.length === 0) {
    return {
      average: 0,
      total: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  let sum = 0

  reviews.forEach(review => {
    sum += review.rating
    distribution[review.rating as keyof typeof distribution]++
  })

  return {
    average: Math.round((sum / reviews.length) * 10) / 10,
    total: reviews.length,
    distribution
  }
}
