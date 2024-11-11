// src/app/api/container-management/edit/[id]/route.ts

import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { ResultSetHeader } from 'mysql2/promise';

export async function PUT(req: Request) {
  // Extract the ID from the request URL
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop(); // Assuming the last part of the URL is the ID

  const { container_id, status } = await req.json();

  try {
    const connection = await getConnection();

    const query = `
      UPDATE container_management
      SET container_id = ?, status = ?
      WHERE id = ?
    `;

    // Ensure parameters are not undefined
    const values = [
      container_id,
      status,
      id, // Use the extracted ID here
    ];

    const [result] = await connection.execute<ResultSetHeader>(query, values);

    if (result.affectedRows > 0) {
      return NextResponse.json({ message: 'Data updated successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No data found to update' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
