import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const {
    id,
    container_rfid,
  } = await req.json();

  // Kiểm tra xem tất cả các trường đã được cung cấp
  if (!id ) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  try {
    const connection = await getConnection();

 		// SQL query to update the existing record
    const query = `
      UPDATE parts_list
      SET
        container_rfid = ?
      WHERE id = ?
    `;

    // Execute the query with the provided values
    const [result] = await connection.execute(query,[container_rfid, id]);

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
