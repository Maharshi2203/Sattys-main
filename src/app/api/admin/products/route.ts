import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get('content-type') || '';

        let formData: any = {};

        if (contentType.includes('multipart/form-data')) {
            const data = await req.formData();
            // Only handle basic fields if using multipart form-data directly (less common with sophisticated frontend)
            // Frontend uses JSON mostly.
            // But preserving direct Multipart support for API clients (Postman/cURL)
            formData.name = data.get('name');
            formData.base_price = data.get('base_price') || data.get('price');
            // ... minimal support or full ...
            // Let's assume JSON is primary for complex object.
            return NextResponse.json({ error: 'Please use JSON format for full product create' }, { status: 400 });
        } else {
            formData = await req.json();
        }

        // Extract fields
        const {
            name,
            description,
            product_code,
            brand_name,
            company_name,
            category_id,
            case_size,
            pack_size,
            shelf_life,
            base_price,
            gst_percentage,
            final_price,
            image_url,
            images,
            stock_status,
            is_featured
        } = formData;

        if (!name || base_price === undefined) {
            return NextResponse.json({ error: 'Name and Base Price are required' }, { status: 400 });
        }

        const newProduct = {
            name,
            description,
            product_code,
            brand_name,
            company_name,
            category_id: category_id ? parseInt(category_id) : null,
            case_size,
            pack_size,
            shelf_life,
            base_price: String(base_price),
            gst_percentage: String(gst_percentage || 0),
            final_price: String(final_price || base_price), // Calculation should ideally happen here too for safety
            image_url: image_url || (images && images.length > 0 ? images[0] : ''),
            images: images || [],
            stock_status: stock_status || 'IN',
            is_featured: is_featured || false,
            isActive: true, // Default
        };

        const result = await db.insert(products).values(newProduct).returning();

        return NextResponse.json(result[0], { status: 201 });

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
