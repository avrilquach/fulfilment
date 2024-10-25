import { NextResponse } from 'next/server';

export async function POST() {
  // Create a response object
  const res = NextResponse.json({ message: 'Successfully logged out' });

  // Clear the token from the cookie
  res.cookies.set('token', '', { maxAge: -1 }); // Expire the token cookie immediately

  return res;
}
