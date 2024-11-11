// src/app/api/spend-tracker/route.ts
import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Get pagination parameters
  let page = parseInt(searchParams.get('page') ?? "1");
  let limit = parseInt(searchParams.get('limit') ?? "10");

  // Get filter parameters for time and sku
  const sku = searchParams.get('sku');
  const time = searchParams.get('time');

  // Ensure non-negative pagination parameters
  if (limit < 1) limit = 1;
  if (page < 1) page = 1;

  const connection = await getConnection();

  try {
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Base query for fetching data from spend_tracker table
    let query = `
      SELECT * FROM spend_tracker
    `;
    let query2 = `
      SELECT COUNT(*) as count FROM spend_tracker
    `;

    // Conditions array to hold dynamic filters
    const conditions: string[] = [];

    // Apply filters if provided
    if (sku) {
      conditions.push(`sku LIKE '%${sku}%'`);
    }
    if (time) {
      conditions.push(`DATE(time) = '${time}'`);
    }

    // Add conditions to query if any filters exist
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
      query2 += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Apply pagination and ordering by time
    query += ` ORDER BY time ASC LIMIT ${limit} OFFSET ${offset}`;

    // Execute the data query
    const [rows] = await connection.execute(query);

    // Execute the count query
    const [rows2] = await connection.execute(query2);

    // Return the response with the data and total count
    return NextResponse.json({ data: rows, total: rows2 }, { status: 200 });
  } catch (error) {
    console.error('Error fetching spend tracker data:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  } finally {
    // Close the connection after the request
    connection.end();
  }
}
