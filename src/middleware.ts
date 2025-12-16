// src/middleware.ts
import { auth } from "~/server/auth";
import createMiddleware from 'next-intl/middleware';
import { routing } from '~/i18n/routing';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default auth(async (req) => {
	// Let next-intl handle locale first
	const intlResponse = intlMiddleware(req);
	if (intlResponse) return intlResponse;

	// Then check auth for protected routes
	const { pathname } = req.nextUrl;
	const isAccountRoute = pathname.match(/^\/[^/]+\/account/);
	const isLoginRoute = pathname.match(/^\/[^/]+\/login/);

	// Redirect to login if accessing account without auth
	if (isAccountRoute && !req.auth) {
		const locale = pathname.split('/')[1] || 'en';
		const signInUrl = new URL(`/${locale}/login`, req.url);
		signInUrl.searchParams.set('callbackUrl', pathname);
		return NextResponse.redirect(signInUrl);
	}

	// Redirect to account if already logged in and visiting login
	if (isLoginRoute && req.auth) {
		const locale = pathname.split('/')[1] || 'en';
		return NextResponse.redirect(new URL(`/${locale}/account`, req.url));
	}

	return NextResponse.next();
});

export const config = {
	matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)'],
};