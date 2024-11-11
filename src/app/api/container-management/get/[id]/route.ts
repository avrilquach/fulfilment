// src/app/api/container-management/getAll/route.ts
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  // Lấy id từ URL params
  const id = parseInt(params.id, 10);

  try {
    const connection = await getConnection();

    // Truy vấn để lấy dữ liệu, bao gồm tên từ các bảng khác
    const query = `
      SELECT cm.*, 
             l.name AS location_name, 
             s.name AS shelve_name, 
             b.name AS bin_name
      FROM container_management cm
      JOIN location l ON cm.location_id = l.id
      JOIN shelve s ON cm.shelve_id = s.id
      JOIN bin b ON cm.bin_id = b.id
      WHERE cm.id = ?;
    `;

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
