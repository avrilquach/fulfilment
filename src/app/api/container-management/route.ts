// src/app/api/container-management/route.ts
import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let page = parseInt(searchParams.get('page') ?? "1");
  let limit = parseInt(searchParams.get('limit') ?? "15");

  // Get filter parameters
  const location = searchParams.get('location');
  const shelve = searchParams.get('shelve');
  const status = searchParams.get('status');

  // Ensure non-negative parameters
  if (limit < 1) limit = 1;
  if (page < 1) page = 1;

  try {
    const connection = await getConnection();

    // Calculate offset
    const offset = (page - 1) * limit;

    // Base query
    let query = `SELECT * FROM container_management`;
    let query2 = `SELECT COUNT(*) as count FROM container_management`;

    // Handle filters
    const conditions: string[] = [];

    if (location) {
      conditions.push(`location = '${location}'`);
    }
    if (shelve) {
      conditions.push(`shelve = '${shelve}'`);
    }
    if (status) {
      conditions.push(`status = '${status}'`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
      query2 += ` WHERE ${conditions.join(' AND ')}`;
    }

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
