import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let page = parseInt(searchParams.get('page') ?? "1");
  let limit = parseInt(searchParams.get('limit') ?? "15");

  // Get filter parameters
  const status = searchParams.get('status');

  // Đảm bảo các tham số không âm
  if (limit < 1) limit = 1;
  if (page < 1) page = 1;

  try {
    const connection = await getConnection();

    // Tính toán offset
    const offset = (page - 1) * limit;

    // Truy vấn để lấy dữ liệu phân trang
    let query = `SELECT * FROM container_management`;

    if (status) {
      query += ` WHERE status = '${status}'`;
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`;
    const [rows] = await connection.execute(query);

    // Truy vấn để lấy tổng số mục
    let query2 = `SELECT COUNT(*) as count  FROM container_management`;

    if (status) {
      query2 += ` WHERE status = '${status}'`;
    }

    const [rows2] = await connection.execute(query2);

    // Gửi phản hồi với danh sách các phần
    return NextResponse.json({ data: rows, total: rows2}, { status: 200 });
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
