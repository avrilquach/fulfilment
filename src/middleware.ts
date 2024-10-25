import { NextResponse,NextRequest  } from 'next/server';
import {verifyToken} from "./utils/jwt";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token'); // Lấy token từ cookie
  const result = await verifyToken(token ? token.value : '');

  // Bỏ qua các yêu cầu đến file tĩnh và API
  const isStaticFile = req.nextUrl.pathname.startsWith('/_next/') || req.nextUrl.pathname.startsWith('/static/') || req.nextUrl.pathname.endsWith('.css') || req.nextUrl.pathname.endsWith('.js');
  const isApiRoute = req.nextUrl.pathname.startsWith('/authenticate/'); // Nếu bạn có các API route

  if (isStaticFile || isApiRoute) {
    return NextResponse.next(); // Tiếp tục cho các file tĩnh và API
  }


  // Kiểm tra nếu đang ở trang login hoặc register, không chuyển hướng
  const isLoginPage = req.nextUrl.pathname === '/login';
  const isRegisterPage = req.nextUrl.pathname === '/register';

  // Nếu không có token và không ở trang login hoặc register
  if (!result.valid && result.valid === false && !isLoginPage && !isRegisterPage) {
    return NextResponse.redirect(new URL('/login', req.url)); // Chuyển hướng đến trang đăng nhập
  }

  // Nếu có token, kiểm tra tính hợp lệ
  if (result.valid === true) {
    // Xác thực token
    try {
      // Nếu token hợp lệ và đang ở trang login, chuyển hướng đến trang chính
      if (isLoginPage) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    } catch (error:any) {
      return NextResponse.json({ message: 'Token verification failed', error: error.message }, { status: 401 });
      if (!isLoginPage && !isRegisterPage) {
        return NextResponse.redirect(new URL('/login', req.url)); // Chuyển hướng nếu token không hợp lệ
      }
    }
  }
  return NextResponse.next(); // Tiếp tục cho các route khác
}
