import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcrypt';
import {RowDataPacket} from "mysql2/promise";
import { createToken } from '@/utils/jwt';

interface User {
  id: number;
  email: string;
  password:string;
  company_name?: string; // Thêm các thuộc tính khác nếu có
}

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  const connection = await getConnection();

  try {

    // Thực hiện truy vấn và xác định kiểu trả về
    const [rows]: [RowDataPacket[], any] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

    // Kiểm tra nếu người dùng đã tồn tại
    if (Array.isArray(rows) && rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = rows[0] as User;
    // So sánh mật khẩu băm với mật khẩu người dùng đã nhập
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // Tạo token JWT
    const token = await createToken({ email: user.email, id: user.id });

    // Tạo phản hồi với cookie chứa token
    const response = NextResponse.json({ message: 'Login successful' ,user: {
        id: user.id,
        email: user.email,
        company_name: user.company_name, // Thêm thông tin công ty nếu có
      },}, { status: 200 });

    // Lưu token vào cookie (với HttpOnly để bảo mật)
    response.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 3600 });

    return response;

  } catch (error: any) {
    return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}
