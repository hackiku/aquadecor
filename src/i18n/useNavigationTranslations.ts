// src/i18n/useNavigationTranslations.ts
'use client';

import { useTranslations } from 'next-intl';
import type { NavLink, ResourceLink } from '~/data/navigation';

/**
 * Hook to translate navigation items
 * Usage in client components:
 * const { translateNavLink } = useNavigationTranslations();
 * const label = translateNavLink(link);
 */
export function useNavigationTranslations() {
	// Use the common.nav namespace
	const t = useTranslations('common.nav');

	const translateNavLink = (link: NavLink) => ({
		...link,
		label: t(link.labelKey),
		description: link.descriptionKey ? t(link.descriptionKey) : undefined,
	});

	const translateResourceLink = (link: ResourceLink) => ({
		...link,
		label: t(link.labelKey),
		description: t(link.descriptionKey),
	});

	return {
		translateNavLink,
		translateResourceLink,
	};
}