// src/i18n/request.ts

// atomizing json message files
// https://github.com/amannn/next-intl/discussions/357

import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

const NAMESPACES = [
	'common',
	'home',
	'shop',
	'product',
	'calculator',
	'gallery',
	'cart',
	'checkout',
	'setup',
	'about',
	'blog',
	'legal',
	'account',
	'faq',
	'contact',
	'distributors',
] as const;

export type Namespace = (typeof NAMESPACES)[number];

export default getRequestConfig(async ({ requestLocale }) => {
	// This typically corresponds to the `[locale]` segment
	let locale = await requestLocale;

	// Ensure that a valid locale is used
	if (!locale || !routing.locales.includes(locale as any)) {
		locale = routing.defaultLocale;
	}

	// Load all namespaces in parallel
	const messagePromises = NAMESPACES.map(async (namespace) => {
		try {
			const module = await import(`../messages/${locale}/${namespace}.json`);
			return [namespace, module.default[namespace]];
		} catch (error) {
			console.warn(`Missing: ${locale}/${namespace}.json`);
			return [namespace, {}];
		}
	});

	const messageEntries = await Promise.all(messagePromises);
	const messages = Object.fromEntries(messageEntries);

	return {
		locale,
		messages,
	};
});