// src/app/api/rfid-management/add/route.ts
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export async function POST(req: Request) {
  const { location, shelve, bin, container_id, status } = await req.json();

  if (!location || !shelve || !bin || !container_id || !status) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  try {
    const connection = await getConnection();

    const query = `
      INSERT INTO container_management (location, shelve, bin, container_id, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    // Use type assertion on result to explicitly tell TypeScript it's a ResultSetHeader
    const [result] = await connection.execute<ResultSetHeader>(query, [
      location, shelve, bin, container_id, status,
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
