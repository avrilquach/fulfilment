import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const connection = await getConnection();

    // Truy vấn để lấy tất cả dữ liệu từ container_management, loại trừ container_id được chỉ định
    const query = 'SELECT * FROM container_management WHERE container_id NOT IN (?)';

    // Chỉ định kiểu trả về là RowDataPacket[]
    const [rows] = await connection.execute<RowDataPacket[]>(query, [id]);

    // Kiểm tra xem có bản ghi nào được tìm thấy không
    if (rows.length === 0) {
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    }

    return NextResponse.json(rows, { status: 200 });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
