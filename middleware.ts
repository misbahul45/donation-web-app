import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
	const session = getSessionCookie(request);
	const { pathname } = request.nextUrl;

	// Belum login
	if (!session) {
		// Harus login untuk akses ke /app dan /admin
		if (pathname.startsWith("/app") || pathname.startsWith("/admin")) {
			return NextResponse.redirect(new URL("/sign-in", request.url));
		}
	} else {
		// Sudah login: cegah akses ke sign-in dan sign-up
		if (pathname === "/sign-in" || pathname === "/sign-up") {
			return NextResponse.redirect(new URL("/app", request.url));
		}

		// Akses ke /admin hanya untuk admin
		if (pathname.startsWith("/admin")) {
			return NextResponse.redirect(new URL("/app", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	// Match semua route kecuali _next/* dan file statis (misal .png, .js)
	matcher: "/((?!_next|.*\\..*).*)",
};
