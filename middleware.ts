import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Define route access rules based on your backend structure
const routeRules = {
  // Public routes (no authentication needed)
  public: [
    '/',
    '/about',
    '/posts',
    '/posts/[slug]',
    '/events',
    '/services',
    '/umkm',
    '/auth/login',
    '/auth/register'
  ],
  
  // Protected routes require authentication (any role)
  protected: [
    '/profile'
  ],
  
  // Admin panel routes with role-based access
  admin: [
    '/admin',
    '/admin/dashboard',
    '/admin/events',
    '/admin/posts', 
    '/admin/services',
    '/admin/umkm'
  ],
  
  // Editor and above can manage content
  editor: [
    '/admin/posts',
    '/admin/events'
  ],
  
  // Operator and above can manage services
  operator: [
    '/admin/services'
  ]
};

// Role hierarchy based on your Prisma schema
const roleHierarchy = {
  'OPERATOR': 1,  // Default role from backend
  'EDITOR': 2,    // Can manage content
  'ADMIN': 3      // Full access
} as const;

// Interface matching your backend JwtPayload
interface DecodedToken {
  sub: string;
  email: string;
  username: string;
  role: string; // This comes as string from your backend
  iat?: number;
  exp?: number;
}

function isPublicRoute(pathname: string): boolean {
  return routeRules.public.some(route => {
    // Handle dynamic routes like [slug]
    if (route.includes('[')) {
      const pattern = route.replace(/\[.*?\]/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(pathname);
    }
    return pathname === route || pathname.startsWith(route + '/');
  });
}

function getRequiredRole(pathname: string): keyof typeof roleHierarchy | null {
  // Check admin routes first
  if (routeRules.admin.some(route => pathname.startsWith(route))) {
    // Check specific role requirements for sub-routes
    if (routeRules.editor.some(route => pathname.startsWith(route))) {
      return 'EDITOR';
    }
    // Admin routes require at least OPERATOR (since it's the default role)
    return 'OPERATOR';
  }
  
  // Protected routes require authentication (any valid role)
  if (routeRules.protected.some(route => pathname.startsWith(route))) {
    return 'OPERATOR'; // Minimum role for authenticated users
  }
  
  return null;
}

function hasRequiredRole(userRole: string, requiredRole: keyof typeof roleHierarchy): boolean {
  // Convert string role to hierarchy key if it exists
  const userRoleKey = userRole as keyof typeof roleHierarchy;
  if (!roleHierarchy[userRoleKey]) {
    return false; // Unknown role
  }
  return roleHierarchy[userRoleKey] >= roleHierarchy[requiredRole];
}

async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    const { payload } = await jwtVerify(token, secret);
    
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      username: payload.username as string,
      role: payload.role as keyof typeof roleHierarchy,
      iat: payload.iat,
      exp: payload.exp
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get token from cookies or headers
  let token = request.cookies.get('token')?.value;
  
  // Fallback to Authorization header
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  // No token found
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const decoded = await verifyToken(token);
  
  if (!decoded) {
    // Invalid token - redirect to login
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    
    // Clear invalid token cookie
    response.cookies.delete('token');
    return response;
  }

  // Check if user has required role for this route
  const requiredRole = getRequiredRole(pathname);
  
  if (requiredRole && !hasRequiredRole(decoded.role, requiredRole)) {
    // Insufficient permissions - redirect to appropriate page based on user role
    if (decoded.role === 'OPERATOR' && pathname.startsWith('/admin')) {
      // Redirect operators to services management
      const redirectUrl = new URL('/admin/services', request.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    // For other insufficient permissions, show unauthorized page
    const unauthorizedUrl = new URL('/auth/unauthorized', request.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  // Add user info to headers for client-side components
  const response = NextResponse.next();
  response.headers.set('x-user-id', decoded.sub);
  response.headers.set('x-user-role', decoded.role);
  response.headers.set('x-user-email', decoded.email);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};