// @ts-nocheck
// src/components/i18n/LanguageSwitcher.tsx

"use client"

import { usePathname, useRouter } from "next/navigation"
import { Globe } from "lucide-react"
import { Button } from "~/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"

const languages = [
	{ code: "us", name: "English", flag: "🇺🇸" },
	{ code: "de", name: "Deutsch", flag: "🇩🇪" },
	{ code: "nl", name: "Nederlands", flag: "🇳🇱" },
]

export function LanguageSwitcher() {
	const pathname = usePathname()
	const router = useRouter()

	const segments = pathname.split("/").filter(Boolean)
	const currentLocale = segments[0] || "us"
	const currentLanguage = languages.find((l) => l.code === currentLocale) || languages[0]

	const pathWithoutLocale = "/" + segments.slice(1).join("/")

	const switchLanguage = (locale: string) => {
		const newPath = `/${locale}${pathWithoutLocale}`
		router.push(newPath)
	}

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
					<DropdownMenuItem key={lang.code} className="cursor-pointer" onClick={() => switchLanguage(lang.code)}>
						<span className="mr-2">{lang.flag}</span>
						{lang.name}
						{currentLanguage.code === lang.code && <span className="ml-auto text-primary">✓</span>}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
