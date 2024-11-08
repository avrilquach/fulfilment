import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  const connection = await getConnection();
  try {
    // Execute the SQL query
    const [rows] = await connection.execute(`
      SELECT 
        location_data.location_name,
        COUNT(DISTINCT CASE WHEN cm.status = 'Empty' AND bsm.container_rfid IS NOT NULL THEN cm.container_id END) AS empty_count,
        COUNT(DISTINCT CASE WHEN cm.status = 'Full' AND bsm.container_rfid IS NOT NULL THEN cm.container_id END) AS full_count,
        COUNT(DISTINCT CASE WHEN cm.status IN ('Empty', 'Full') AND bsm.container_rfid IS NOT NULL THEN cm.container_id END) AS total_empty_full_count,
        location_data.total_container_count,
        location_data.shelve_count
      FROM (
          SELECT 
            l.name AS location_name,
            COUNT(DISTINCT cm.container_id) AS total_container_count,
            l.id AS location_id,
            COUNT(DISTINCT s.id) AS shelve_count
          FROM location l
          LEFT JOIN container_management cm ON cm.location_id = l.id
          LEFT JOIN shelve s ON s.zone_id = l.id -- Join với bảng shelve thông qua location_id
          GROUP BY l.id
      ) AS location_data
      LEFT JOIN container_management cm ON cm.location_id = location_data.location_id
      LEFT JOIN bin_stock_management bsm ON bsm.container_rfid = cm.container_id
      WHERE cm.status IN ('Empty', 'Full')
      GROUP BY location_data.location_name, location_data.total_container_count;
    `);

    // Return the rows in JSON response
    return NextResponse.json({ message: 'Message successful', rows }, { status: 200 });
  } catch (error : any) {
    console.error(error);  // Log error for debugging purposes
    return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
  } finally {
    connection.end();  // Ensure the connection is closed
  }
}
