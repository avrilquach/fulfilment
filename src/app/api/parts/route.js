import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  let page = parseInt(searchParams.get('page')) || 1; // Lấy số trang từ tham số truy vấn
  let limit = parseInt(searchParams.get('limit')) || 10; // Số lượng mục trên mỗi trang

  // Đảm bảo các tham số không âm
  if (limit < 1) limit = 1;
  if (page < 1) page = 1;

  try {
    const connection = await getConnection();

    // Tính toán offset
    const offset = (page - 1) * limit;

    // Truy vấn để lấy dữ liệu phân trang
    const query = `SELECT pl.*, z.name AS zone_name, b.name AS bin_name FROM parts_list pl LEFT JOIN zone z ON pl.zone_id = z.id LEFT JOIN bin b ON pl.bin_id = b.id LIMIT ${limit} OFFSET ${offset}`;
    const [rows] = await connection.execute(query);

    // Truy vấn để lấy tổng số mục
    const [totalRows] = await connection.execute('SELECT COUNT(*) AS count FROM parts_list pl LEFT JOIN zone z ON pl.zone_id = z.id LEFT JOIN bin b ON pl.bin_id = b.id');
    const totalCount = totalRows[0].count;

    // Gửi phản hồi với danh sách các phần
    return NextResponse.json({ totalCount, data: rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(req) {
  const {
    cm_part_id,
    name,
    qty_container,
    unit,
    status,
    fill_date,
    bu,
    tat_sku,
    container_rfid,
    created_at,
  } = await req.json();

  // Kiểm tra xem tất cả các trường đã được cung cấp
  if (!name || !qty_container || !unit || !status || !bu || !tat_sku || !container_rfid || !created_at) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  try {
    const connection = await getConnection();

    // Kiểm tra xem container_rfid có tồn tại không
    const [existingContainer] = await connection.execute(
      'SELECT * FROM parts_list WHERE container_rfid = ?',
      [container_rfid]
    );

    if (existingContainer.length > 0) {
        return NextResponse.json({ message: `Container RFID ${container_rfid} already exists` }, { status: 409 });
    }

    // Thực hiện truy vấn để chèn dữ liệu vào bảng parts_list
    const [result] = await connection.execute(
      'INSERT INTO parts_list (cm_part_id, name, qty_container, unit, status, fill_date, bu, zone_id, shelve_id, bin_id, tat_sku, container_rfid,created_at,updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [cm_part_id,name, qty_container, unit, status, fill_date, bu, '', '', '', tat_sku, container_rfid,created_at,'']
    );

    // Gửi phản hồi
    return NextResponse.json({ message: 'Part saved successfully', id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
