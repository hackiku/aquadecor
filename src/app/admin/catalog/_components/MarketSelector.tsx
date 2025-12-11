// src/app/admin/catalog/_components/MarketSelector.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Globe, Flag } from "lucide-react";

interface MarketSelectorProps {
	currentMarket?: 'US' | 'ROW';
}

export function MarketSelector({ currentMarket = 'ROW' }: MarketSelectorProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const handleMarketChange = (market: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('market', market);
		router.push(`${pathname}?${params.toString()}`);

		// Store preference in localStorage
		if (typeof window !== 'undefined') {
			localStorage.setItem('admin-market-preference', market);
		}
	};

	return (
		<Tabs value={currentMarket} onValueChange={handleMarketChange}>
			<TabsList className="grid w-full max-w-md grid-cols-2">
				<TabsTrigger value="ROW" className="flex items-center gap-2">
					<Globe className="h-4 w-4" />
					<span className="font-display font-light">Rest of World</span>
				</TabsTrigger>
				<TabsTrigger value="US" className="flex items-center gap-2">
					<Flag className="h-4 w-4" />
					<span className="font-display font-light">United States</span>
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}

// Helper to get market from URL or localStorage
export function useMarketPreference(): 'US' | 'ROW' {
	const searchParams = useSearchParams();
	const urlMarket = searchParams.get('market') as 'US' | 'ROW' | null;

	// Check URL first
	if (urlMarket === 'US' || urlMarket === 'ROW') {
		return urlMarket;
	}

	// Fallback to localStorage
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem('admin-market-preference') as 'US' | 'ROW' | null;
		if (stored === 'US' || stored === 'ROW') {
			return stored;
		}
	}

	// Default to ROW
	return 'ROW';
}