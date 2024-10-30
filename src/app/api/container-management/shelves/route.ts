import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import {RowDataPacket} from "mysql2/promise";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zoneId = searchParams.get('zoneId'); // Use `zoneId` parameter

  // Validate zoneId
  if (!zoneId) {
    return NextResponse.json({ error: 'zoneId is required' }, { status: 400 });
  }

  try {
    const connection = await getConnection();
    const [rows]: [RowDataPacket[], any] =  await connection.execute('SELECT * FROM shelve WHERE zone_id = ?', [zoneId]);

    // Check if any shelves were found
    if (Array.isArray(rows) && rows.length === 0) {
      return  NextResponse.json({ error: 'No shelves found for this zone' }, { status: 400 });
    }

    const response = NextResponse.json({ message: 'Message successful' ,rows}, { status: 200 });
    return response;
  } catch (error) {
    console.error('Error fetching Shelves:', error);
    return NextResponse.json({ error: 'Failed to fetch Shelves' }, { status: 500 });
  }
}
