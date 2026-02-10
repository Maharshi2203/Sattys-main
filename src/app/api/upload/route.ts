import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        // 1. Authentication
        const token = req.cookies.get('admin_token')?.value
        const verifiedUser = token ? await verifyToken(token) : null

        if (!verifiedUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // 2. File Validation
        // Validate File Type (Allow only images)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.' }, { status: 400 })
        }

        // Validate File Size (Max 5MB)
        const MAX_SIZE = 5 * 1024 * 1024 // 5MB
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: 'File size too large. Max 5MB allowed.' }, { status: 400 })
        }

        // 3. Secure Filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`

        // Upload to 'product-images' bucket
        const { data, error } = await supabaseAdmin.storage
            .from('product-images')
            .upload(fileName, file, {
                contentType: file.type,
                upsert: false
            })

        if (error) {
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
