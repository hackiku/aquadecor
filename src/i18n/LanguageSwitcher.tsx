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
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
	const locale = useLocale();
	const pathname = usePathname();
	const router = useRouter();
	const params = useParams();

	const switchLocale = (newLocale: Locale) => {
		// Construct the options object for next-intl router
		const options = { locale: newLocale };

		// Filter out 'locale' from params since next-intl handles that via the options object
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { locale: _, ...routeParams } = (params || {}) as Record<string, string | string[]>;

		// For dynamic routes, we need to pass the params.
		// next-intl's typed router expects specific keys for 'pathname' and matching 'params'.
		// Since this component is generic, we can't satisfy the strict discrimination of the union type.
		// We cast to `any` to allow passing the current pathname (which acts as the key in strict mode type definitions)
		// and the current params.

		router.replace(
			// @ts-expect-error -- Generic switcher cannot satisfy strict route union types
			{ pathname, params: routeParams },
			options
		);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className="gap-2">
					<Globe className="h-4 w-4" />
					<span className="hidden sm:inline">{localeNames[locale as Locale]}</span>
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