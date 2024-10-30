// src/app/api/rfid-management/edit/[id]/route.ts
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { ResultSetHeader } from 'mysql2/promise';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  // Lấy id từ URL params
  const id = parseInt(params.id, 10);

  // Lấy dữ liệu từ yêu cầu
  const { container_id, status }: { container_id: string; status: string; } = await req.json();

  // Kiểm tra xem các trường cần thiết đã được cung cấp
  if (!id || !status) {
    return NextResponse.json({ message: 'Container ID and status are required' }, { status: 400 });
  }

  try {
    const connection = await getConnection();

    // Truy vấn cập nhật dữ liệu
    const query = `
      UPDATE container_management
      SET container_id = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `;

    // Thực hiện truy vấn cập nhật dữ liệu
    const [result] = await connection.execute<ResultSetHeader>(query, [
      container_id, status, id,
    ]);

    // Kiểm tra xem đã cập nhật thành công hay chưa
    if (result.affectedRows > 0) {
      return NextResponse.json({ message: 'Data updated successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Failed to update data or container not found' }, { status: 404 });
    }

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
