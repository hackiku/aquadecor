// src/components/i18n/LanguageSwitcher.tsx

"use client";

import { Globe } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";

const languages = [
	{ code: "en", name: "English", flag: "🇺🇸" },
	{ code: "de", name: "Deutsch", flag: "🇩🇪" },
	{ code: "nl", name: "Nederlands", flag: "🇳🇱" },
];

export function LanguageSwitcher() {
	const currentLanguage = languages[0]; // TODO: Get from context/cookie

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
						onClick={() => {
							// TODO: Implement language switching
							console.log(`Switch to ${lang.code}`);
						}}
					>
						<span className="mr-2">{lang.flag}</span>
						{lang.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}