// src/i18n/LanguageSwitcher.tsx
'use client';

import { useLocale } from 'next-intl';
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

// Map locales to flag emojis
const localeEmojis: Record<Locale, string> = {
	en: '🇬🇧',
	de: '🇩🇪',
	nl: '🇳🇱',
	it: '🇮🇹',
	us: '🇺🇸',
};

// Short codes for compact display
const localeCodes: Record<Locale, string> = {
	en: 'EN',
	de: 'DE',
	nl: 'NL',
	it: 'IT',
	us: 'US',
};

export function LanguageSwitcher() {
	const locale = useLocale();
	const pathname = usePathname();
	const router = useRouter();
	const params = useParams();

	const switchLocale = (newLocale: Locale) => {
		const options = { locale: newLocale };
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { locale: _, ...routeParams } = (params || {}) as Record<string, string | string[]>;

		router.replace(
			// @ts-expect-error -- Generic switcher cannot satisfy strict route union types
			{ pathname, params: routeParams },
			options
		);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="gap-1.5 text-white hover:bg-white/10 hover:text-white"
				>
					<span className="text-base leading-none">{localeEmojis[locale as Locale]}</span>
					<span className="hidden sm:inline text-white">{localeCodes[locale as Locale]}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 dark:bg-zinc-900">
				{Object.entries(localeNames).map(([loc, name]) => (
					<DropdownMenuItem
						key={loc}
						onClick={() => switchLocale(loc as Locale)}
						className={`gap-2 !text-white hover:!bg-zinc-700/50 focus:!bg-zinc-700/50 dark:hover:!bg-white/10 dark:focus:!bg-white/10 hover:!text-white focus:!text-white cursor-pointer ${locale === loc ? '!bg-white/5' : ''
							}`}
					>
						<span className="text-base leading-none">{localeEmojis[loc as Locale]}</span>
						<span className="!text-white">{name}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}