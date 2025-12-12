// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from '~/i18n/routing';

export default createMiddleware(routing);

export const config = {
	// Match all pathnames except for
	// - API routes
	// - Admin routes
	// - Next.js internal routes
	// - Static files (those containing a dot)
	matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)'],
};