import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id') ?? "1");
  let page = parseInt(searchParams.get('page') ?? "1");
  let limit = parseInt(searchParams.get('limit') ?? "15");

  // Get filter parameters
  const status = searchParams.get('status');

  // Ensure non-negative parameters
  if (limit < 1) limit = 1;
  if (page < 1) page = 1;

  try {
    const connection = await getConnection();

    // Calculate offset for pagination
    const offset = (page - 1) * limit;



    // SQL query with placeholders
    let query = `SELECT
                                          bsm.*,
                                          cm.*,
                                          im.*,
                                          l.name AS location_name,
                                          b.name AS bin_name,
                                          s.name AS shelve_name,
                                          s.id AS shelve_id
                                      FROM
                                          container_management cm
                                      LEFT JOIN
                                          bin_stock_management bsm ON bsm.container_rfid = cm.container_id
                                      LEFT JOIN
                                          location l ON cm.location_id = l.id
                                      LEFT JOIN
                                          bin b ON cm.bin_id = b.id
                                      LEFT JOIN
                                          shelve s ON cm.shelve_id = s.id
                                      LEFT JOIN
                                       items_management AS im ON bsm.tat_sku = im.supplier_sku`;

    let query2 = `SELECT
                                          COUNT(*) as count
                                      FROM
                                          container_management cm
                                      LEFT JOIN
                                          bin_stock_management bsm ON bsm.container_rfid = cm.container_id
                                      LEFT JOIN
                                          location l ON cm.location_id = l.id
                                      LEFT JOIN
                                          bin b ON cm.bin_id = b.id
                                      LEFT JOIN
                                          shelve s ON cm.shelve_id = s.id
                                      LEFT JOIN
                                       items_management AS im ON bsm.tat_sku = im.supplier_sku`;

    // Execute the query with proper parameter binding


    // Conditions array to hold dynamic filters
    const conditions: string[] = [];

    // Apply filters if provided
    if (status) {
      conditions.push(`cm.status = '${status}'`);
    }

    // Add conditions to query if any filters exist
    if (conditions.length > 0) {
      query += ` WHERE s.id = ? AND ${conditions.join(' AND ')}`;
      query2 += ` WHERE s.id = ? AND ${conditions.join(' AND ')}`;
    }

    // Apply pagination and ordering by time
    query += ` ORDER BY b.id ASC LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await connection.execute(query, [id]);

    // Execute count query
    const [rows2] = await connection.execute(query2, [id]);

    // Return the response with data and total count for pagination
    return NextResponse.json({ data: rows,total: rows2 }, { status: 200 });
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
