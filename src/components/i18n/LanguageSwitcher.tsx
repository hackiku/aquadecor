// src/components/i18n/LanguageSwitcher.tsx
'use client';

import { useLocale } from '~/lib/i18n/hooks';
import { locales, localeNames, type Locale } from '~/i18n.config';
import { usePathname, useRouter } from 'next/navigation';
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

	const switchLocale = (newLocale: Locale) => {
		// Remove current locale from pathname
		const pathWithoutLocale = pathname.replace(`/${locale}`, '');
		// Add new locale
		const newPath = `/${newLocale}${pathWithoutLocale}`;
		router.push(newPath);
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
				{locales.map((loc) => (
					<DropdownMenuItem
						key={loc}
						onClick={() => switchLocale(loc)}
						className={locale === loc ? 'bg-accent' : ''}
					>
						{localeNames[loc]}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}