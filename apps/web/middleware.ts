import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Extract subdomain from hostname
  // Example: client1.yourdomain.com -> client1
  // Example: localhost:3000 -> null (development)
  const subdomain = extractSubdomain(hostname);
  
  // If we have a subdomain, add it to the request headers
  // This will be available in server components via headers()
  if (subdomain) {
    // Add tenantId to the request headers for server components
    request.headers.set('x-tenant-id', subdomain);
    
    // Also add it to the URL search params for client components
    url.searchParams.set('tenantId', subdomain);
  }
  
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

function extractSubdomain(hostname: string): string | null {
  // Remove port if present (e.g., localhost:3000 -> localhost)
  const host = hostname.split(':')[0];
  
  // Skip if it's localhost or IP address
  if (host === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    return null;
  }
  
  // Skip if it's the main domain (no subdomain)
  // Example: yourdomain.com -> null
  const parts = host.split('.');
  
  // If we have more than 2 parts, there's a subdomain
  // Example: client1.yourdomain.com -> ['client1', 'yourdomain', 'com']
  if (parts.length > 2) {
    // Return the first part as subdomain
    return parts[0];
  }
  
  // Check if it's a known subdomain that should be ignored
  // For example: 'www', 'api', 'admin' could be special cases
  const firstPart = parts[0];
  if (firstPart === 'www' || firstPart === 'api' || firstPart === 'admin') {
    return null;
  }
  
  return null;
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

