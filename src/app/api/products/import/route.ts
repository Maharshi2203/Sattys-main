import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    let data: any[] = []
    const buffer = await file.arrayBuffer()
    const fileName = file.name.toLowerCase()

    if (fileName.endsWith('.csv')) {
      // Robust CSV parsing with PapaParse
      const text = new TextDecoder().decode(buffer)
      const parseResult = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
      })
      data = parseResult.data
    } else {
      // Excel parsing with XLSX
      const workbook = XLSX.read(buffer, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      data = XLSX.utils.sheet_to_json(worksheet)
    }

    const { data: existingCategories } = await supabaseAdmin.from('categories').select('*')
    const categoryMap = new Map(existingCategories?.map(c => [c.name.toLowerCase(), c.id]) || [])

    const results = { success: 0, failed: 0, errors: [] as string[] }

    for (const row of data as Record<string, unknown>[]) {
      try {
        // Normalize column keys to handle case and spacing variations
        const normalizedRow: Record<string, any> = {}
        Object.keys(row).forEach(key => {
          normalizedRow[key.toLowerCase().trim().replace(/[^a-z0-9]/g, '_')] = row[key]
        })

        let categoryId = null
        const categoryName = String(
          row['Category'] || row['category'] || row['Collection'] ||
          normalizedRow['category'] || normalizedRow['collection'] || ''
        ).trim()

        if (categoryName) {
          const existing = categoryMap.get(categoryName.toLowerCase())
          if (existing) {
            categoryId = existing
          } else {
            const { data: newCat } = await supabaseAdmin
              .from('categories')
              .insert({ name: categoryName })
              .select()
              .single()
            if (newCat) {
              categoryId = newCat.id
              categoryMap.set(categoryName.toLowerCase(), newCat.id)
            }
          }
        }

        // Resilient price parsing function
        const parsePrice = (val: any) => {
          if (val === undefined || val === null) return 0
          const cleaned = String(val).replace(/[₹$,]/g, '').trim()
          return parseFloat(cleaned) || 0
        }

        const basePrice = parsePrice(
          row['Base Price'] || row['base_price'] || row['BasePrice'] ||
          normalizedRow['base_price'] || normalizedRow['price'] || 0
        )
        const gstPercentage = parsePrice(
          row['GST'] || row['gst_percentage'] || row['GST %'] ||
          normalizedRow['gst'] || normalizedRow['gst_percentage'] || 0
        )

        // Use provided final price or calculate it
        let finalPrice = parsePrice(
          row['Final Price'] || row['final_price'] || row['FinalPrice'] || normalizedRow['final_price'] || 0
        )

        if (finalPrice === 0 && basePrice > 0) {
          finalPrice = basePrice * (1 + gstPercentage / 100)
        }

        const product = {
          product_code: String(
            row['Product Code'] || row['product_code'] || row['Code'] || row['SKU'] ||
            normalizedRow['product_code'] || normalizedRow['sku'] || normalizedRow['code'] || ''
          ).trim() || null,
          name: String(
            row['Product Name'] || row['name'] || row['Name'] ||
            normalizedRow['name'] || normalizedRow['product_name'] || ''
          ).trim(),
          brand_name: String(
            row['Brand'] || row['brand_name'] || row['Brand Name'] ||
            normalizedRow['brand'] || normalizedRow['brand_name'] || ''
          ).trim() || 'Generic',
          company_name: String(
            row['Company'] || row['company_name'] || row['Company Name'] ||
            normalizedRow['company'] || normalizedRow['company_name'] || ''
          ).trim() || null,
          category_id: categoryId,
          case_size: String(row['Case Size'] || row['case_size'] || normalizedRow['case_size'] || '').trim() || null,
          pack_size: String(row['Pack Size'] || row['pack_size'] || normalizedRow['pack_size'] || '').trim() || null,
          shelf_life: String(row['Shelf Life'] || row['shelf_life'] || normalizedRow['shelf_life'] || '').trim() || null,
          base_price: basePrice,
          gst_percentage: gstPercentage,
          final_price: finalPrice,
          description: String(row['Description'] || row['description'] || normalizedRow['description'] || '').trim() || null,
          stock_status: String(
            row['Stock'] || row['stock_status'] || row['Stock Status'] || normalizedRow['stock'] || 'IN'
          ).toUpperCase() === 'OUT' ? 'OUT' : 'IN',
          image_url: String(row['Image'] || row['image_url'] || row['Image URL'] || normalizedRow['image'] || '').trim() || null
        }

        if (!product.name) {
          results.failed++
          results.errors.push(`Row missing product name`)
          continue
        }

        const { error } = await supabaseAdmin.from('products').insert(product)

        if (error) {
          results.failed++
          results.errors.push(`${product.name}: ${error.message}`)
        } else {
          results.success++
        }
      } catch (err) {
        results.failed++
        results.errors.push(`Error processing row: ${err}`)
      }
    }

    return NextResponse.json({
      message: `Import completed: ${results.success} products added, ${results.failed} failed`,
      ...results
    })
  } catch (err) {
    return NextResponse.json({ error: `Import failed: ${err}` }, { status: 500 })
  }
}
