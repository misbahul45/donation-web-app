import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
	const session = getSessionCookie(request);

	const { pathname } = request.nextUrl;

	if (!session) {
		if (pathname.startsWith("/app") || pathname.startsWith("/admin")) {
			return NextResponse.redirect(new URL("/sign-in", request.url));
		}
	} else {

		if (pathname === "/sign-in" || pathname === "/sign-up") {
			return NextResponse.redirect(new URL("/app", request.url));
		}

		if (pathname.startsWith("/admin")) {
			return NextResponse.redirect(new URL("/app", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: "/((?!api|_next/static|favicon.ico).*)",
};
