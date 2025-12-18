// src/i18n/utils.ts
import { headers } from 'next/headers';
import { type Locale, isUSMarket } from './routing';

/**
 * Get the current locale from headers (set by middleware)
 * Use this in Server Components when you need locale outside of params
 */
// export async function getLocale(): Promise<Locale> {
// 	const headersList = await headers();
// 	const locale = headersList.get('x-locale') || 'en';
// 	return locale as Locale;
// }

/**
 * Check if current market is US
 */
// export async function isUSMarketRequest(): Promise<boolean> {
// 	const locale = await getLocale();
// 	return isUSMarket(locale);
// }

/**
 * Get market-specific settings
 */
// export async function getMarketConfig() {
// 	const locale = await getLocale();
// 	const isUS = isUSMarket(locale);

// 	return {
// 		locale,
// 		isUS,
// 		showTariffNotice: isUS,
// 		// Add more market-specific config as needed
// 	};
// }

/**
 * Type-safe namespace helper
 * Use this to ensure your translation keys are valid
 */
export type TranslationNamespace =
	| 'common'
	| 'metadata'
	| 'home'
	| 'setup'
	| 'shop'
	| 'product'
	| 'cart'
	| 'checkout'
	| 'account'
	| 'about'
	| 'calculator'
	| 'faq'
	| 'gallery'
	| 'reviews'
	| 'blog'
	| 'legal'
	| 'register';