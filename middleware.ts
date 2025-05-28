import { NextResponse, type NextRequest } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';
import Config from '@/config'; // Assuming your Config path

const privy = new PrivyClient(Config.privy.appId, Config.privy.appSecret);

export async function middleware(request: NextRequest) {
  // Skip middleware for non-API routes or specific paths if needed
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow specific routes to bypass auth if necessary (e.g., a public health check)
  if (request.nextUrl.pathname === '/api/health') {
    return NextResponse.next();
  }

  const idToken = request.cookies.get('privy-id-token')?.value;

  if (!idToken) {
    console.log('Middleware: No privy-id-token cookie found');
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const user = await privy.getUser({ idToken });

    if (!user) {
      console.log('Middleware: Invalid token or user not found by Privy');
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Add user information to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    if (user.linkedAccounts) {
        // Filter out any non-serializable parts or just stringify known good structures
        const serializableAccounts = user.linkedAccounts.map(acc => ({ 
            type: acc.type, 
            address: (acc as any).address, // Example, adjust based on actual structure
            email: (acc as any).email, 
            phoneNumber: (acc as any).phoneNumber,
            subject: (acc as any).subject,
            username: (acc as any).username
            // Add other relevant, serializable fields
        }));
        requestHeaders.set('x-user-linked-accounts', JSON.stringify(serializableAccounts));
    }
    // Add other user details as needed, ensuring they are strings
    // requestHeaders.set('x-user-email', user.email?.address || ''); // Example

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Middleware: Error verifying identity token:', error);
    return NextResponse.json({ message: 'Token verification failed' }, { status: 401 });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Match all API routes:
     * - /api/:path*
     */
    '/((?!_next/static|_next/image|favicon.ico).*)(/api/:path*)?',
    '/api/:path*', // Explicitly match API routes
  ],
};
