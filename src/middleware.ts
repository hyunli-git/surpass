import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Get locale from cookie or default to 'en'
  const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en';
  
  // Set locale cookie if not present
  if (!request.cookies.get('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      sameSite: 'lax'
    });
  }
  
  // Add CORS headers for VPN compatibility
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', '*');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }
  
  return response;
}
 
export const config = {
  // Match all pathnames except for api routes and static files
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'
  ]
};