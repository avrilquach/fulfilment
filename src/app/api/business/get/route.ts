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
    let query = `SELECT l.name AS location, s.id AS shelve_id, s.name AS shelve,COUNT(CASE WHEN cm.status = 'Empty' THEN 1 END) AS empty_count,COUNT(CASE WHEN cm.status = 'Full' THEN 1 END) AS full_count,GROUP_CONCAT(b.name ORDER BY b.name ASC) AS bin_names,im.*,bsm.tat_sku,COUNT(b.name) AS bin_count,bsm.qty_per_container,(bsm.qty_per_container * COUNT(b.name)) AS qty,'' AS fullfilment_triggered FROM bin_stock_management bsm LEFT JOIN container_management cm ON bsm.container_rfid = cm.container_id LEFT JOIN location l ON cm.location_id = l.id LEFT JOIN shelve s ON s.id = cm.shelve_id LEFT JOIN bin b ON b.id = cm.bin_id LEFT JOIN items_management im ON im.supplier_sku = bsm.tat_sku WHERE l.id = ? GROUP BY bsm.tat_sku, l.name, s.name, im.cm_part_id`;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    // Execute the query with proper parameter binding
    const [rows] = await connection.execute(query, [id]);

    // Total count query for pagination
    const countQuery = `
      SELECT COUNT(*) AS count 
      FROM (
        SELECT bsm.tat_sku 
        FROM bin_stock_management bsm
        LEFT JOIN container_management cm ON bsm.container_rfid = cm.container_id
        LEFT JOIN location l ON cm.location_id = l.id
        WHERE l.id = ?
        GROUP BY bsm.tat_sku
      ) AS grouped_data;
    `;

    // Execute count query to get total count
    const [countResult] = await connection.execute(countQuery, [id]);

    // Return the response with data and total count for pagination
    return NextResponse.json({ data: rows, total: countResult }, { status: 200 });
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
