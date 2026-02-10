import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, category:categories(*)')
      .eq('id', parseInt(id))
      .single()

    if (error) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get('admin_token')?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    // Extract images array
    const { images, ...productData } = body

    const finalPrice = productData.base_price * (1 + (productData.gst_percentage || 0) / 100)

    // Use first image from images array as image_url if available
    const imageUrl = images && images.length > 0 ? images[0] : productData.image_url

    // Build update object with core fields only (no images column to avoid errors if it doesn't exist)
    const updateData: Record<string, any> = {
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
      is_featured: productData.is_featured,
      updated_at: new Date().toISOString()
    }

    // Try to include images if the array exists
    if (images && Array.isArray(images)) {
      updateData.images = images
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', parseInt(id))
      .select('*, category:categories(*)')
      .single()

    if (error) {
      console.error('Supabase update error:', error)

      // If error is about images column not existing, retry without it
      if (error.message.includes('images')) {
        delete updateData.images
        const { data: retryData, error: retryError } = await supabaseAdmin
          .from('products')
          .update(updateData)
          .eq('id', parseInt(id))
          .select('*, category:categories(*)')
          .single()

        if (retryError) {
          return NextResponse.json({ error: retryError.message }, { status: 500 })
        }
        return NextResponse.json(retryData)
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get('admin_token')?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', parseInt(id))

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
