import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import {RowDataPacket} from "mysql2/promise";


// API để lấy danh sách SKU có Active = 1
export async function GET() {
  const connection = await getConnection();
  try {
    const [rows]: [RowDataPacket[], any] = await connection.execute('SELECT * FROM product_skus WHERE active = 1');
    const response = NextResponse.json({ message: 'Message successful' ,rows}, { status: 200 });
    return response;
  } catch (error) {
    console.error('Error fetching SKU:', error);
    return NextResponse.json({ error: 'Failed to fetch SKU' }, { status: 500 });
  }
}
