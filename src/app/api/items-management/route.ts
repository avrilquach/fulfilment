// src/app/api/container-management/route.ts
import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let page = parseInt(searchParams.get('page') ?? "1");
  let limit = parseInt(searchParams.get('limit') ?? "15");

  // Ensure non-negative parameters
  if (limit < 1) limit = 1;
  if (page < 1) page = 1;

  try {
    const connection = await getConnection();

    // Calculate offset
    const offset = (page - 1) * limit;

    // Base query
    let query = `SELECT * FROM items_management`;
    const query2 = `SELECT COUNT(*) as count FROM items_management`;

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    // Execute data query
    const [rows] = await connection.execute(query);

    // Execute count query
    const [rows2] = await connection.execute(query2);

    // Return the response
    return NextResponse.json({ data: rows, total: rows2 }, { status: 200 });
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
