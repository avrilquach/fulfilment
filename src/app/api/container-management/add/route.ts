import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();

    // Truy vấn để lấy toàn bộ dữ liệu từ container_management
    const query = 'SELECT * FROM container_management';
    const [rows] = await connection.execute(query);

    // Trả về dữ liệu
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
