// src/app/api/location/add/route.ts
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { ResultSetHeader } from 'mysql2/promise';

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    // Kiểm tra các trường đầu vào
    if (!name ) {
      return NextResponse.json({ message: 'Name required' }, { status: 400 });
    }

    const connection = await getConnection();

    try {
      const query = `
        INSERT INTO location (name)
        VALUES (?)
      `;

      // Thực hiện truy vấn chèn dữ liệu
      const [result] = await connection.execute<ResultSetHeader>(query, [
        name
      ]);

      // Trả về phản hồi dựa trên kết quả chèn
      if (result.insertId) {
        return NextResponse.json({ message: 'Location added successfully', id: result.insertId }, { status: 201 });
      } else {
        return NextResponse.json({ message: 'Failed to add location' }, { status: 500 });
      }
    } finally {
      // Đảm bảo đóng kết nối
      connection.end();
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
