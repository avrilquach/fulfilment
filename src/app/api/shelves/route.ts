import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import {RowDataPacket} from "mysql2/promise";


// API để lấy danh sách SKU có Active = 1
export async function GET() {
  const connection = await getConnection();
  try {
    const [rows]: [RowDataPacket[], any] = await connection.execute('SELECT * FROM shelve WHERE active = 1 AND used_bins < total_bins ORDER BY id asc LIMIT 1');
    if (Array.isArray(rows) && rows.length === 0) {
      return NextResponse.json({ message: 'No shelve found' }, { status: 404 });
    }
    const response = NextResponse.json({ message: 'Message successful' ,rows}, { status: 200 });
    return response;
  } catch (error) {
    console.error('Error fetching shelve:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { shelve_id } = await req.json();

  // Kiểm tra xem danh sách RFID và ID kệ có được cung cấp hay không
  if (!shelve_id) {
    return NextResponse.json({ message: 'RFID list cannot be empty and shelve_id is required!' }, { status: 400 });
  }

  try {
    const connection = await getConnection();

    // Tăng `used_bins` cho kệ tương ứng
    await connection.execute(
      'UPDATE shelve SET used_bins = used_bins + 1 WHERE id = ?',
      [shelve_id] // Tăng theo số lượng RFID
    );

    // Phản hồi thành công
    return NextResponse.json({ message: 'Used bins updated successfully!' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
