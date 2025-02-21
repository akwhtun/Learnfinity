import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

    // Get the current URL path
    const { pathname } = request.nextUrl;

    // Check if the path starts with "/admin"
    const isAdminRoute = pathname.startsWith("/admin");

    // Redirect unauthenticated users trying to access admin routes
    if (isAdminRoute && !token) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    // Redirect non-admin users trying to access admin routes
    if (isAdminRoute && token && !token.isAdmin) {
        return NextResponse.redirect(new URL("/403", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"], // This applies middleware to all /admin routes
};
