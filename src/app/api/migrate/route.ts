import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// This endpoint adds the images column to the products table
export async function POST(req: NextRequest) {
    try {
        // Add images column if it doesn't exist
        const { error } = await supabaseAdmin.rpc('exec_sql', {
            sql: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS images text[];'
        })

        if (error) {
            // If RPC doesn't exist, try direct query (this may not work depending on permissions)
            console.error('RPC error:', error)
            return NextResponse.json({
                error: 'Could not add images column automatically. Please run this SQL in your Supabase dashboard: ALTER TABLE products ADD COLUMN images text[];',
                manual_sql: 'ALTER TABLE products ADD COLUMN images text[];'
            }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: 'Images column added successfully' })
    } catch (err) {
        console.error('Migration error:', err)
        return NextResponse.json({
            error: 'Migration failed. Please run this SQL in your Supabase dashboard: ALTER TABLE products ADD COLUMN images text[];',
            manual_sql: 'ALTER TABLE products ADD COLUMN images text[];'
        }, { status: 500 })
    }
}
