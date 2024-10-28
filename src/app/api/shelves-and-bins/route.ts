import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') ?? "1");
  const limit = parseInt(searchParams.get('limit') ?? "25");

  // Get filter parameters
  const zoneId = searchParams.get('zoneId');
  const shelveId = searchParams.get('shelveId');
  const status = searchParams.get('status');

  try {
    const connection = await getConnection();

    // Tính toán offset
    const offset = (page - 1) * limit;

    // Truy vấn để lấy dữ liệu phân trang
    let query = `SELECT z.id AS zone_id, z.name AS zone_name, s.id AS shelve_id, s.name AS shelve_name, b.id AS bin_id, b.name AS bin_name, b.status FROM zone z LEFT JOIN shelve s ON z.id = s.zone_id LEFT JOIN bin b ON s.id = b.shelve_id WHERE 1=1`;

    if (zoneId) {
      query += ` AND z.id = ${zoneId}`;
    }
    if (shelveId) {
      query += ` AND s.id = ${shelveId}`;
    }
    if (status) {
      query += ` AND b.status = ${status}`;
    }

    query += ` ORDER BY z.id, s.id, b.id LIMIT ${limit} OFFSET ${offset}`;
    const [rows] = await connection.execute(query);

    // Truy vấn để lấy dữ liệu phân trang
    let query2 = `SELECT COUNT(*) as count FROM bin b LEFT JOIN shelve s ON b.shelve_id = s.id LEFT JOIN zone z ON s.zone_id = z.id WHERE 1=1`;

    if (zoneId) {
      query2 += ` AND z.id = ${zoneId}`;
    }
    if (shelveId) {
      query2 += ` AND s.id = ${shelveId}`;
    }
    if (status) {
      query2 += ` AND b.status = ${status}`;
    }

    const [rows2] = await connection.execute(query2);

    // Gửi phản hồi với danh sách các phần
    return NextResponse.json({ data: rows, total: rows2 }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

