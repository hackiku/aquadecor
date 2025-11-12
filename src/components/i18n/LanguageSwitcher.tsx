// src/components/i18n/LanguageSwitcher.tsx

"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";

const languages = [
	{ code: "en", name: "English", flag: "🇺🇸", domain: "/us" },
	{ code: "de", name: "Deutsch", flag: "🇩🇪", domain: "/de" },
	{ code: "nl", name: "Nederlands", flag: "🇳🇱", domain: "/nl" },
];

export function LanguageSwitcher() {
	const pathname = usePathname();
	const router = useRouter();

	// Extract current locale from pathname (e.g., /de/shop → "de")
	const currentLocale = pathname.split("/")[1] || "us";
	const currentLanguage = languages.find((l) => l.domain.includes(currentLocale)) || languages[0];

	const switchLanguage = (locale: string) => {
		// Get path after locale (e.g., /de/shop → /shop)
		const pathWithoutLocale = pathname.replace(/^\/(us|de|nl)/, "") || "/";

		// Construct new path with new locale
		const newPath = locale === "us" ? pathWithoutLocale : `/${locale}${pathWithoutLocale}`;

		router.push(newPath);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="h-9 w-9">
					<Globe className="h-4 w-4" />
					<span className="sr-only">Switch language</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{languages.map((lang) => (
					<DropdownMenuItem
						key={lang.code}
						className="cursor-pointer"
						onClick={() => switchLanguage(lang.code)}
					>
						<span className="mr-2">{lang.flag}</span>
						{lang.name}
						{currentLanguage.code === lang.code && (
							<span className="ml-auto text-primary">✓</span>
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}