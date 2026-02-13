import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('shop_info')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || {})
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    const { data: existing } = await supabaseAdmin
      .from('shop_info')
      .select('id')
      .single()

    let data, error

    if (existing) {
      const result = await supabaseAdmin
        .from('shop_info')
        .update({
          ...body,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single()
      data = result.data
      error = result.error
    } else {
      const result = await supabaseAdmin
        .from('shop_info')
        .insert(body)
        .select()
        .single()
      data = result.data
      error = result.error
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
