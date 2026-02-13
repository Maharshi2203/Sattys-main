import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Ensure alias works or use relative path
import { products } from '@/db/schema';
import { eq, ilike, gte, lte, and, sql, desc, or } from 'drizzle-orm';
import { boolean } from 'drizzle-orm/pg-core';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Construct filters
    const filters = [];
    if (search) {
      filters.push(or(
        ilike(products.name, `%${search}%`),
        ilike(products.description, `%${search}%`)
      ));
    }
    if (category) {
      filters.push(eq(products.category_id, parseInt(category)));
    }
    if (minPrice) {
      filters.push(gte(products.final_price, minPrice)); // Decimal comparison works with string
    }
    if (maxPrice) {
      filters.push(lte(products.final_price, maxPrice));
    }

    // Execute query with pagination
    const data = await db.select()
      .from(products)
      .where(and(...filters))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(products.createdAt));

    // Get total count for pagination metadata
    const totalResult = await db.select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...filters));

    const total = Number(totalResult[0]?.count || 0);

    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
