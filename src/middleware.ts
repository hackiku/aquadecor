// src/middleware.ts
import { auth } from "~/server/auth";
import createMiddleware from 'next-intl/middleware';
import { routing } from '~/i18n/routing';
import { NextResponse, type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

// Routes that require authentication
const PROTECTED_ROUTES = ['/account'];

// Routes that should redirect to account if already authenticated
const AUTH_ROUTES = ['/login', '/register'];

export default auth(async (req) => {
	const { pathname } = req.nextUrl;

	// Extract locale from path (format: /[locale]/path)
	const localeMatch = pathname.match(/^\/([^/]+)/);
	const potentialLocale = localeMatch?.[1];

	// Check if URL has a valid locale
	const hasValidLocale = potentialLocale && routing.locales.includes(potentialLocale as any);

	// If no valid locale, let next-intl middleware handle the redirect
	if (!hasValidLocale) {
		const intlResponse = intlMiddleware(req);
		if (intlResponse) {
			// Add locale header even for redirects
			const locale = intlResponse.headers.get('x-middleware-rewrite')?.match(/\/([^/]+)/)?.[1] || routing.defaultLocale;
			if (routing.locales.includes(locale as any)) {
				intlResponse.headers.set('x-locale', locale);
			}
			return intlResponse;
		}
	}

	// URL has valid locale - proceed with normal flow
	const locale = potentialLocale || routing.defaultLocale;

	// Let next-intl handle locale routing first
	const intlResponse = intlMiddleware(req);

	// If intlResponse exists, add locale header before returning
	if (intlResponse && routing.locales.includes(locale as any)) {
		intlResponse.headers.set('x-locale', locale);
		return intlResponse;
	}

	// Remove locale prefix for route matching
	const pathWithoutLocale = pathname.replace(/^\/[^/]+/, '') || '/';

	// Check if current route is protected
	const isProtectedRoute = PROTECTED_ROUTES.some(route =>
		pathWithoutLocale.startsWith(route)
	);

	// Check if current route is an auth route (login/register)
	const isAuthRoute = AUTH_ROUTES.some(route =>
		pathWithoutLocale.startsWith(route)
	);

	// Redirect to login if accessing protected route without auth
	if (isProtectedRoute && !req.auth) {
		const signInUrl = new URL(`/${locale}/login`, req.url);
		signInUrl.searchParams.set('callbackUrl', pathname);
		return NextResponse.redirect(signInUrl);
	}

	// Redirect to account if already logged in and trying to access auth pages
	if (isAuthRoute && req.auth) {
		return NextResponse.redirect(new URL(`/${locale}/account`, req.url));
	}

	// Create response with locale header for root layout
	const response = NextResponse.next();
	if (routing.locales.includes(locale as any)) {
		response.headers.set('x-locale', locale);
	}
	return response;
});

export const config = {
	// Match all routes except:
	// - api routes
	// - _next (Next.js internals)
	// - _vercel (Vercel internals)
	// - admin (separate admin auth)
	// - static files (images, fonts, etc.)
	matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)'],
};