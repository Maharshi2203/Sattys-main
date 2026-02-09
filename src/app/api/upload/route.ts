import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        // Upload to 'product-images' bucket
        const { data, error } = await supabaseAdmin.storage
            .from('product-images')
            .upload(fileName, file, {
                contentType: file.type,
                upsert: false
            })

        if (error) {
            // If bucket doesn't exist, try creating it (admin only) or fail gracefully
            console.error('Supabase upload error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('product-images')
            .getPublicUrl(fileName)

        return NextResponse.json({ url: publicUrl })
    } catch (error) {
        console.error('Server upload error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
