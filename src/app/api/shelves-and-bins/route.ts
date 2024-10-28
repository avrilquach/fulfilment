import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let page = parseInt(searchParams.get('page')) || 1; // Lấy số trang từ tham số truy vấn
  let limit = parseInt(searchParams.get('limit')) || 25; // Số lượng mục trên mỗi trang

  // Đảm bảo các tham số không âm
  if (limit < 1) limit = 1;
  if (page < 1) page = 1;

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

    // Truy vấn để lấy tổng số mục
    let countQuery = `
      SELECT COUNT(*) as count 
      FROM bin b 
      LEFT JOIN shelve s ON b.shelve_id = s.id 
      LEFT JOIN zone z ON s.zone_id = z.id 
      WHERE 1=1`;

    if (zoneId) {
      countQuery += ` AND z.id = ${zoneId}`;
    }
    if (shelveId) {
      countQuery += ` AND s.id = ${shelveId}`;
    }
    if (status) {
      countQuery += ` AND b.status = ${status}`;
    }

    const [totalRows] = await connection.execute(countQuery);
    const totalCount = totalRows[0].count;

    // Gửi phản hồi với danh sách các phần
    return NextResponse.json({ totalCount, data: rows }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

