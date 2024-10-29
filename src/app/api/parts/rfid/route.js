import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const {
    firstRfid,
  } = await req.json();

  try {
    const connection = await getConnection();

    const [rows] = await connection.execute('SELECT * FROM parts_list WHERE container_rfid NOT IN (?)',[firstRfid]);
    const response = NextResponse.json({ message: 'Message successful' ,rows}, { status: 200 });
    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
