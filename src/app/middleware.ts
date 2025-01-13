import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
 
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Check if accessing dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    try {
      // Check pregnancy profile
      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pregnancy/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!profileResponse.ok) {
        return NextResponse.redirect(new URL('/create-profile', request.url));
      }

      const data = await profileResponse.json();
      if (!data.profile) {
        return NextResponse.redirect(new URL('/create-profile', request.url));
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return NextResponse.redirect(new URL('/create-profile', request.url));
    }
  }
 
  return NextResponse.next();
}
 
export const config = {
  matcher: ['/dashboard/:path*']
}