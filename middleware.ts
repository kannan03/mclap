import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { dashboardConfig } from "@/config/dashboard"
import { getToken } from 'next-auth/jwt';
import { access } from 'fs';

const skipPagesForAuth = [
  "/forgot",
  "/reset-password"
]

// This function can be marked `async` if using `await` inside
export default async function middleware(request: NextRequest) {
  // const user = await getCurrentUser()
  const session = await getToken({ req: request, secret: "SUPER_SECRET_JWT_SECRET" });
  const currentUserRoles  = session?.roles || [];
  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);

  if(skipPagesForAuth?.includes(request.nextUrl.pathname)){
    return NextResponse.next({headers})
  }

  let accessControl = dashboardConfig?.accessControl[request.nextUrl.pathname]
  let hasAccess = accessControl?.filter(role => currentUserRoles?.includes(role))
  if(!hasAccess || hasAccess?.length <= 0 ){
    return NextResponse.rewrite(new URL('/noaccess', request.url))
  }
  if( String(request.url).includes('professional') && currentUserRoles.includes('PAYER') ) {
    return NextResponse.rewrite(new URL('/noaccess', request.url))
  }

  return NextResponse.next({headers})
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
    '/((?!api|_next/static|_next/image|mclap.ico|sw|login|profile).*)',
  ]
}
