import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id') ?? "1");
  let page = parseInt(searchParams.get('page') ?? "1");
  let limit = parseInt(searchParams.get('limit') ?? "15");

  // Ensure non-negative parameters
  if (limit < 1) limit = 1;
  if (page < 1) page = 1;

  try {
    const connection = await getConnection();

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // SQL query with placeholders
    const query = `SELECT
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
                                       items_management AS im ON bsm.tat_sku = im.supplier_sku WHERE s.id = ? ORDER BY b.id asc`;

    // Execute the query with proper parameter binding
    const [rows] = await connection.execute(query, [id]);

    // Return the response with data and total count for pagination
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
