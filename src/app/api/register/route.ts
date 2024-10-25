import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const { email, password, company_name } = await req.json();

  if (!email || !password || !company_name) {
    return NextResponse.json({ message: 'Email, password, and company name are required' }, { status: 400 });
  }

  const connection = await getConnection();

  try {
    // Thực hiện truy vấn và xác định kiểu trả về
    const [rows]: [RowDataPacket[], any] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

    // Kiểm tra nếu người dùng đã tồn tại
    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert company_name along with email and hashed password
    await connection.execute('INSERT INTO users (email, password, company_name) VALUES (?, ?, ?)', [email, hashedPassword, company_name]);

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: unknown) {
    console.error(error); // Log error for internal monitoring
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  } finally {
    await connection.end(); // Ensure connection is closed
  }
}
