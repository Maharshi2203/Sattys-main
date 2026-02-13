import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { uploadImage } from '@/lib/cloudinary';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Parse JSON or FormData?
        // User might send image update via FormData, or just text update via JSON.
        // Let's assume FormData to support image updates.

        const contentType = req.headers.get('content-type') || '';

        let updateData: any = {};

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            const file = formData.get('image');

            if (file && file instanceof File) {
                // Upload new image
                const imageUrl = await uploadImage(file);
                updateData.imageUrl = imageUrl;
            }

            // Update other fields if present
            const name = formData.get('name'); if (name) updateData.name = name as string;
            const description = formData.get('description'); if (description) updateData.description = description as string;
            const category = formData.get('category'); if (category) updateData.category = category as string;
            const price = formData.get('price'); if (price) updateData.price = parseFloat(price as string);
            const stock = formData.get('stock'); if (stock) updateData.stock = parseInt(stock as string);
            const discount = formData.get('discount'); if (discount) updateData.discount = parseFloat(discount as string);
            const isActive = formData.get('isActive'); if (isActive) updateData.isActive = isActive === 'true';

        } else {
            // JSON payload
            const body = await req.json();
            updateData = { ...body };
            delete updateData.id; // Don't allow ID update
        }

        // Perform update
        const result = await db.update(products)
            .set({ ...updateData, updatedAt: new Date() })
            .where(eq(products.id, parseInt(id)))
            .returning();

        if (result.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(result[0]);

    } catch (error) {
        console.error('Update Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Soft delete if requested (prompt mentioned "Bonus: soft delete instead of hard delete")
        // But for now, hard delete as per "Delete Product DELETE /api/admin/products/:id" standard request unless specified otherwise.
        // Wait, prompt said "Bonus: Add soft delete".
        // I already added `isActive` boolean to schema. I could soft delete by setting isActive=false.
        // Let's do HARD delete for simplicity unless I see strong reason.
        // Actually, "Delete Product" usually means remove.
        // I'll stick to delete() for now, or use update(isActive: false).

        // Let's do DELETE from DB.
        const result = await db.delete(products)
            .where(eq(products.id, parseInt(id)))
            .returning();

        if (result.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product deleted successfully', id });

    } catch (error) {
        console.error('Delete Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
