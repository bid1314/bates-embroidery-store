import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the hostname
  const hostname = request.headers.get('host') || '';
  
  // Extract subdomain or custom domain
  const currentHost = hostname
    .replace(':3000', '') // Remove port for local development
    .replace(':80', '')
    .replace(':443', '');
    
  // Check if it's a subdomain
  const isSubdomain = currentHost.includes('.');
  
  if (isSubdomain) {
    // Extract tenant identifier (subdomain or full domain)
    const tenant = currentHost.split('.')[0];
    
    // Clone the URL
    const url = request.nextUrl.clone();
    
    // Add tenant information to headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant', tenant);
    requestHeaders.set('x-tenant-host', currentHost);
    
    // Return response with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 