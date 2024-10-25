// types.d.ts (hoặc next-env.d.ts)
import { NextRequest } from 'next/server';

declare module 'next/server' {
  interface NextRequest {
    cookies: {
      get(name: string): string | undefined; // hoặc string | null nếu bạn cần
      set(name: string, value: string, options?: { maxAge?: number; httpOnly?: boolean; path?: string }): void;
      delete(name: string): void;
    };
  }
}
