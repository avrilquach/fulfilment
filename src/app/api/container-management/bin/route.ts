import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import {RowDataPacket} from "mysql2/promise";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shelveId = searchParams.get('shelveId'); // Use `zoneId` parameter

  // Validate shelveId
  if (!shelveId) {
    return NextResponse.json({ error: 'shelveId is required' }, { status: 400 });
  }

  try {
    const connection = await getConnection();
    const [rows]: [RowDataPacket[], any] =  await connection.execute('SELECT * FROM bin WHERE shelve_id = ? and status = 0', [shelveId]);

    // Check if any shelves were found
    if (Array.isArray(rows) && rows.length === 0) {
      return  NextResponse.json({ error: 'No bin found for this shelves' }, { status: 400 });
    }

    const response = NextResponse.json({ message: 'Message successful' ,rows}, { status: 200 });
    return response;
  } catch (error) {
    console.error('Error fetching Shelves:', error);
    return NextResponse.json({ error: 'Failed to fetch bin' }, { status: 500 });
  }
}
