// src/i18n/hooks.ts
'use client';

import { useTranslations as useNextIntlTranslations, useLocale as useNextIntlLocale } from 'next-intl';
// import { type Locale, isUSMarket } from '~/i18n.config';
import { type Locale, isUSMarket } from './config';
import { type TranslationNamespace } from './utils';

/**
 * Type-safe translation hook
 * Usage: const t = useTranslations('common');
 */
export function useTranslations<T extends TranslationNamespace>(namespace?: T) {
	return useNextIntlTranslations(namespace);
}

/**
 * Get current locale in client components
 */
export function useLocale(): Locale {
	return useNextIntlLocale() as Locale;
}

/**
 * Check if current market is US
 */
export function useIsUSMarket(): boolean {
	const locale = useLocale();
	return isUSMarket(locale);
}

/**
 * Get market-specific configuration
 */
export function useMarketConfig() {
	const locale = useLocale();
	const isUS = isUSMarket(locale);

	return {
		locale,
		isUS,
		showTariffNotice: isUS,
	};
}