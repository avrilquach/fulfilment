// src/app/api/items-management/add/route.ts
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export async function POST(req: Request) {
  const { cm_part_id, cm_part_description, unit, stock, min_stock, max_stock, supplier_sku, product_link } = await req.json();

  // Ensure all required fields are provided
  if (!cm_part_id || !cm_part_description || !unit || !stock || !min_stock || !max_stock || !supplier_sku || !product_link) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 401 });
  }

  // Additional input validation
  if (isNaN(stock) || isNaN(min_stock) || isNaN(max_stock)) {
    return NextResponse.json({ message: 'Stock values must be numbers' }, { status: 402 });
  }

  if (isNaN(min_stock) > isNaN(max_stock)) {
    return NextResponse.json({ message: 'Min stock cannot be greater than max stock' }, { status: 403 });
  }

  // Validate product_link (e.g., check if it's a valid URL)
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  if (!urlPattern.test(product_link)) {
    return NextResponse.json({ message: 'Invalid product link' }, { status: 404 });
  }

  try {
    const connection = await getConnection();

    // Insert data into the items_management table
    const query = `
      INSERT INTO items_management (cm_part_id, cm_part_description, unit, stock, min_stock, max_stock, supplier_sku, product_link)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Use type assertion on result to explicitly tell TypeScript it's a ResultSetHeader
    const [result] = await connection.execute<ResultSetHeader>(query, [
      cm_part_id, cm_part_description, unit, stock, min_stock, max_stock, supplier_sku, product_link,
    ]);

    if (result.insertId) {
      return NextResponse.json({ message: 'Item added successfully', id: result.insertId }, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Failed to add item' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error while adding item:', error);

    // Returning specific error messages based on error type
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
