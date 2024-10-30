// src/app/api/container-management/getAll/route.ts
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();

    // Truy vấn để lấy tất cả dữ liệu
    const query = 'SELECT * FROM container_management';
    const [rows] = await connection.execute(query);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
