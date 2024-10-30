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
    let query = `SELECT cm.*, l.name as name_location, s.name as name_shelve, b.name as name_bin FROM container_management cm JOIN location l ON cm.location_id = l.id JOIN shelve s ON cm.shelve_id = s.id JOIN bin b ON cm.bin_id = b.id`;
    let query2 = `SELECT COUNT(*) as count FROM container_management cm JOIN location l ON cm.location_id = l.id JOIN shelve s ON cm.shelve_id = s.id JOIN bin b ON cm.bin_id = b.id`;

    // Handle filters
    const conditions: string[] = [];

    if (location) {
      conditions.push(`cm.location_id = '${location}'`);
    }
    if (shelve) {
      conditions.push(`cm.shelve_id = '${shelve}'`);
    }
    if (status) {
      conditions.push(`cm.status = '${status}'`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
      query2 += ` WHERE ${conditions.join(' AND ')}`;
    }

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
