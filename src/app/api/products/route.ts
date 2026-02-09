import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const stock = searchParams.get('stock')
    const brand = searchParams.get('brand')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    let query = supabaseAdmin
      .from('products')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category_id', parseInt(category))
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,brand_name.ilike.%${search}%,product_code.ilike.%${search}%`)
    }
    if (stock) {
      query = query.eq('stock_status', stock)
    }
    if (brand) {
      query = query.ilike('brand_name', `%${brand}%`)
    }
    if (minPrice) {
      query = query.gte('final_price', parseFloat(minPrice))
    }
    if (maxPrice) {
      query = query.lte('final_price', parseFloat(maxPrice))
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Extract images array
    const { images, ...productData } = body

    const finalPrice = productData.base_price * (1 + (productData.gst_percentage || 0) / 100)

    // Use first image from images array as image_url if available
    const imageUrl = images && images.length > 0 ? images[0] : productData.image_url

    // Build insert object with core fields
    const insertData: Record<string, any> = {
      product_code: productData.product_code,
      name: productData.name,
      brand_name: productData.brand_name,
      company_name: productData.company_name,
      category_id: productData.category_id,
      case_size: productData.case_size,
      pack_size: productData.pack_size,
      shelf_life: productData.shelf_life,
      base_price: productData.base_price,
      gst_percentage: productData.gst_percentage,
      final_price: finalPrice,
      description: productData.description,
      image_url: imageUrl,
      stock_status: productData.stock_status,
      is_featured: productData.is_featured
    }

    // Try to include images if the array exists
    if (images && Array.isArray(images)) {
      insertData.images = images
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(insertData)
      .select('*, category:categories(*)')
      .single()

    if (error) {
      console.error('Supabase insert error:', error)

      // If error is about images column not existing, retry without it
      if (error.message.includes('images')) {
        delete insertData.images
        const { data: retryData, error: retryError } = await supabaseAdmin
          .from('products')
          .insert(insertData)
          .select('*, category:categories(*)')
          .single()

        if (retryError) {
          return NextResponse.json({ error: retryError.message }, { status: 500 })
        }
        return NextResponse.json(retryData, { status: 201 })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
