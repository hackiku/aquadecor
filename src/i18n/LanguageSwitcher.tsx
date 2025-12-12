// src/components/i18n/LanguageSwitcher.tsx
'use client';

import { useLocale } from '~/i18n/hooks';
import { localeNames, type Locale } from '~/i18n/routing';
import { useRouter, usePathname } from '~/i18n/navigation';
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
		// The router from next-intl/navigation handles pathname translation automatically
		router.replace(pathname, { locale: newLocale });
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