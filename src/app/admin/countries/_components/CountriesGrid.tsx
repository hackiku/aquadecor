// src/app/admin/_components/CountriesGrid.tsx
"use client";

import { useState, useMemo } from "react";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { CountryCard } from "./CountryCard";

interface Country {
	id: string;
	iso2: string;
	iso3: string;
	name: string;
	localName: string | null;
	flagEmoji: string | null;
	shippingZoneId: string | null;
	isShippingEnabled: boolean;
	isSuspended: boolean;
	suspensionReason: string | null;
	requiresCustoms: boolean | null;
	requiresPhoneNumber: boolean | null;
	postZone: number | null;
	totalOrders: number | null;
	totalRevenueCents: number | null;
	lastOrderAt: Date | null;
	notes: string | null;
	zone: {
		id: string;
		name: string;
		code: string;
	} | null;
}

interface Zone {
	id: string;
	name: string;
	code: string;
}

interface CountriesGridProps {
	countries: Country[];
	zones: Zone[];
	searchQuery: string;
}

export function CountriesGrid({ countries, zones, searchQuery }: CountriesGridProps) {
	const [selectedZone, setSelectedZone] = useState<string>("all");

	// Group countries by zone
	const countriesByZone = useMemo(() => {
		const grouped = new Map<string, Country[]>();

		countries.forEach((country) => {
			const zoneName = country.zone?.name || "Unassigned";
			if (!grouped.has(zoneName)) {
				grouped.set(zoneName, []);
			}
			grouped.get(zoneName)?.push(country);
		});

		return grouped;
	}, [countries]);

	// Filter countries based on search and selected zone
	const filteredCountries = useMemo(() => {
		return countries.filter((country) => {
			const matchesSearch =
				country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				country.iso2.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesZone =
				selectedZone === "all" ||
				country.zone?.name === selectedZone;

			return matchesSearch && matchesZone;
		});
	}, [countries, searchQuery, selectedZone]);

	// Build zone options with counts
	const zoneOptions = useMemo(() => {
		const allOption = {
			name: "All Regions",
			value: "all",
			count: countries.length,
		};

		const zoneOpts = Array.from(countriesByZone.entries()).map(([zoneName, zoneCountries]) => ({
			name: zoneName,
			value: zoneName,
			count: zoneCountries.length,
		}));

		return [allOption, ...zoneOpts];
	}, [countries.length, countriesByZone]);

	return (
		<div className="space-y-6">
			{/* Zone Selector - Wrappable Tags */}
			<div className="flex flex-wrap gap-2">
				{zoneOptions.map((option) => (
					<button
						key={option.value}
						onClick={() => setSelectedZone(option.value)}
						className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${selectedZone === option.value
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground hover:bg-muted/80"
							}`}
					>
						{option.name}
						<Badge
							variant="secondary"
							className={`ml-2 ${selectedZone === option.value
									? "bg-primary-foreground/20 text-primary-foreground"
									: ""
								}`}
						>
							{option.count}
						</Badge>
					</button>
				))}
			</div>

			{/* Countries Grid */}
			{filteredCountries.length === 0 ? (
				<Card className="p-8 text-center">
					<p className="text-muted-foreground">
						No countries found matching your search.
					</p>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2">
					{filteredCountries.map((country) => (
						<CountryCard key={country.id} country={country} />
					))}
				</div>
			)}
		</div>
	);
}