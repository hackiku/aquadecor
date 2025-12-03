// src/components/i18n/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import countryFlagEmojis from "country-flag-emoji-json";

const languages = [
	{ code: "en", name: "International", countryCode: "GB" }, // UK flag for English
	{ code: "de", name: "Deutsch", countryCode: "DE" },
	{ code: "nl", name: "Nederlands", countryCode: "NL" },
	{ code: "it", name: "Italiano", countryCode: "IT" },
];

// Helper to get flag emoji by country code
const getFlag = (countryCode: string) => {
	const country = countryFlagEmojis.find(
		(c) => c.code === countryCode
	);
	return country?.emoji || "🌐";
};

export function LanguageSwitcher() {
	const pathname = usePathname();
	const router = useRouter();

	const segments = pathname.split("/").filter(Boolean);
	const currentLocale = segments[0] || "en";
	const currentLanguage =
		languages.find((l) => l.code === currentLocale) || languages[0];

	const pathWithoutLocale = "/" + segments.slice(1).join("/");

	const switchLanguage = (locale: string) => {
		const newPath = `/${locale}${pathWithoutLocale}`;
		router.push(newPath);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-9 w-9 text-white hover:text-primary hover:bg-white/10"
				>
					<span className="text-lg" role="img" aria-label={currentLanguage?.name}>
						{getFlag(currentLanguage?.countryCode || "GB")}
					</span>
					<span className="sr-only">Switch language</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="bg-neutral-950 border-neutral-800"
			>
				{languages.map((lang) => (
					<DropdownMenuItem
						key={lang.code}
						className="cursor-pointer text-white hover:text-primary hover:bg-white/10 focus:text-primary focus:bg-white/10"
						onClick={() => switchLanguage(lang.code)}
					>
						<span className="mr-2 text-lg">{getFlag(lang.countryCode)}</span>
						<span className="font-display font-light">{lang.name}</span>
						{currentLanguage?.code === lang.code && (
							<span className="ml-auto text-primary">✓</span>
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}