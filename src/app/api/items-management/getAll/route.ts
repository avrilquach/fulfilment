import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM items_management');
    const response = NextResponse.json({ message: 'Message successful' ,rows}, { status: 200 });
    return response;
  } catch (error) {
    console.error('Error fetching SKU:', error);
    return NextResponse.json({ error: 'Failed to fetch SKU' }, { status: 500 });
  }
}
