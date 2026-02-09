import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    if (body.helpful_increment) {
      const { data, error } = await supabaseAdmin.rpc('increment_helpful', { review_id: parseInt(id) })
      
      if (error) {
        const { data: review } = await supabaseAdmin
          .from('reviews')
          .select('helpful_count')
          .eq('id', id)
          .single()
        
        const { data: updated, error: updateError } = await supabaseAdmin
          .from('reviews')
          .update({ helpful_count: (review?.helpful_count || 0) + 1 })
          .eq('id', id)
          .select()
          .single()

        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 500 })
        }
        return NextResponse.json(updated)
      }
      return NextResponse.json(data)
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabaseAdmin
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
