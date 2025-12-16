// src/middleware.ts
import { auth } from "~/server/auth";
import createMiddleware from 'next-intl/middleware';
import { routing } from '~/i18n/routing';
import { NextResponse } from 'next/server';

// Create the i18n middleware
const intlMiddleware = createMiddleware(routing);

export default auth(async (req) => {
	// FIRST: Let next-intl handle locale detection/redirects
	const intlResponse = intlMiddleware(req);

	// If next-intl wants to redirect (e.g., /account -> /en/account), let it
	if (intlResponse) {
		return intlResponse;
	}

	// SECOND: After locale is resolved, check auth
	const { pathname } = req.nextUrl;

	// Protected paths (WITHOUT locale prefix - intl already handled it)
	const isProtectedRoute = pathname.match(/^\/[^/]+\/(account|admin)/);

	if (isProtectedRoute && !req.auth) {
		// Extract locale from pathname
		const locale = pathname.split('/')[1] || 'en';
		const signInUrl = new URL(`/${locale}/login`, req.url);
		signInUrl.searchParams.set('callbackUrl', pathname);
		return NextResponse.redirect(signInUrl);
	}

	// All good, continue
	return NextResponse.next();
});

export const config = {
	matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)'],
};