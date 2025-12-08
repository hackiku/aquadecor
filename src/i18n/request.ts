// src/i18n/request.ts


// atomizing json message files
// https://github.com/amannn/next-intl/discussions/357

import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
	// In Next.js 15, use requestLocale instead of locale
	const locale = await requestLocale;

	// Validate
	if (!locale || !locales.includes(locale as any)) {
		notFound();
	}

	return {
		locale,
		messages: (await import(`../messages/${locale}.json`)).default,
	};
});