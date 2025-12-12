// src/i18n/LanguageSwitcher.tsx
'use client';

import { useLocale } from '~/i18n/hooks';
import { localeNames, type Locale } from '~/i18n/routing';
import { useRouter, usePathname } from '~/i18n/navigation';
import { useParams } from 'next/navigation';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
	const locale = useLocale();
	const pathname = usePathname();
	const router = useRouter();
	const params = useParams();

	const switchLocale = (newLocale: Locale) => {
		try {
			// For dynamic routes, we need to pass the params
			// next-intl will use them to reconstruct the URL
			if (params && Object.keys(params).length > 0) {
				// Filter out 'locale' from params since next-intl handles that
				const { locale: _, ...routeParams } = params as Record<string, string>;
				router.replace(
					// @ts-expect-error - next-intl typing is complex with dynamic routes
					{ pathname, params: routeParams },
					{ locale: newLocale }
				);
			} else {
				// Static route - simple replace
				router.replace(pathname, { locale: newLocale });
			}
		} catch (error) {
			// Fallback: hard navigation if next-intl routing fails
			console.warn('Language switch failed, using hard navigation:', error);
			const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
			window.location.href = `/${newLocale}${newPath}`;
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className="gap-2">
					<Globe className="h-4 w-4" />
					<span className="hidden sm:inline">{localeNames[locale]}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{Object.entries(localeNames).map(([loc, name]) => (
					<DropdownMenuItem
						key={loc}
						onClick={() => switchLocale(loc as Locale)}
						className={locale === loc ? 'bg-accent' : ''}
					>
						{name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}