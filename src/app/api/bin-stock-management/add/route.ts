// src/app/api/rfid-management/add/route.ts
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// Define an interface for the expected request body
interface AddBinStockRequest {
  tat_sku: string;
  qty_per_container: number;
  container_rfid: string;
}

export async function POST(req: Request) {
  try {
    // Ensure we parse the JSON body
    const body: AddBinStockRequest = await req.json();

    // Destructure the properties
    const { tat_sku,qty_per_container, container_rfid } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!tat_sku || !qty_per_container || !container_rfid) {
      return NextResponse.json({ message: 'TAT SKU và Container RFID là bắt buộc.' }, { status: 400 });
    }

    const connection = await getConnection();

    // Kiểm tra xem container_rfid có tồn tại không
    const [existingContainer] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM bin_stock_management WHERE container_rfid = ?',
      [container_rfid]
    );

    if (existingContainer.length > 0) {
      return NextResponse.json({ message: `Container RFID ${container_rfid} already exists` }, { status: 409 });
    }

    const query = `
      INSERT INTO bin_stock_management (tat_sku, qty_per_container, container_rfid)
      VALUES (?, ?, ?)
    `;

    // Use type assertion on result to explicitly tell TypeScript it's a ResultSetHeader
    const [result] = await connection.execute<ResultSetHeader>(query, [
      tat_sku, qty_per_container, container_rfid,
    ]);

    if (result.insertId) {
      return NextResponse.json({ message: 'Data added successfully', id: result.insertId }, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Failed to add data' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
