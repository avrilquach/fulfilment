import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const {
    cm_part_id,
    zone_id,
    shelve_id,
    bin_id,
    container_rfid,
  } = await req.json();

  // Kiểm tra xem tất cả các trường đã được cung cấp
  if (!cm_part_id || !zone_id || !shelve_id || !bin_id || !container_rfid ) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  try {
    const connection = await getConnection();

    const zoneQuery = 'SELECT name FROM zone WHERE id = ?';
    const [zoneRows] = await connection.execute(zoneQuery, [zone_id]);

    if (zoneRows.length === 0) {
      return NextResponse.json({ message: 'Zone ID not found' }, { status: 404 });
    }

    const binQuery = 'SELECT name FROM bin WHERE id = ?';
    const [binRows] = await connection.execute(zoneQuery, [bin_id]);

    if (binRows.length === 0) {
      return NextResponse.json({ message: 'Bin ID not found' }, { status: 404 });
    }

		// SQL query to update the existing record
    const query = `
      UPDATE parts_list
      SET
        zone = ?,
        shelve_id = ?,
        bin = ?,
        container_rfid = ?
      WHERE cm_part_id = ?
    `;

    // Execute the query with the provided values
    const [result] = await connection.execute(query, [zoneRows[0].name, shelve_id, binRows[0].name, container_rfid, cm_part_id]);

    // Check if the update was successful
    if (result.affectedRows > 0) {
      return NextResponse.json({ message: 'Data updated successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No data found or failed to update' }, { status: 404 });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
