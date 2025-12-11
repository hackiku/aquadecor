// src/i18n/request.ts

// atomizing json message files
// https://github.com/amannn/next-intl/discussions/357

import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from './config';

const NAMESPACES = [
	'common',
	'home',
	'shop',
	'product',
	'cart',
	'checkout',
	'setup',
	'calculator',
	'about',
	'blog',
	'legal',
	'register',
	'faq',
] as const;

export type Namespace = (typeof NAMESPACES)[number];

export default getRequestConfig(async ({ requestLocale }) => {
	const locale = await requestLocale;

	if (!locale || !locales.includes(locale as any)) {
		notFound();
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