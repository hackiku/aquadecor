// src/app/admin/countries/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Search, Plus, MapPin, Globe, TrendingUp, AlertTriangle } from "lucide-react";
import { api } from "~/trpc/react";
import { CountriesMap } from "./_components/CountriesMap";
import { CountryCard } from "./_components/CountryCard";
import { StatCard } from "../_components/primitives/StatCard";

export default function CountriesPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedRegion, setSelectedRegion] = useState<string>("all");

	// Fetch all countries
	const { data: countries = [], isLoading } = api.admin.country.getAll.useQuery({
		sortBy: "name",
		sortOrder: "asc",
	});

	// Fetch stats
	const { data: stats } = api.admin.country.getStats.useQuery();

	// Fetch zones
	const { data: zones = [] } = api.admin.country.getZones.useQuery();

	// Fetch demand analysis
	const { data: demandData } = api.admin.country.getShippingAttempts.useQuery({
		limit: 10,
	});

	// Group countries by zone
	const countriesByZone = useMemo(() => {
		const grouped = new Map<string, typeof countries>();

		countries.forEach((country) => {
			const zoneName = country.zone?.name || "Unassigned";
			if (!grouped.has(zoneName)) {
				grouped.set(zoneName, []);
			}
			grouped.get(zoneName)?.push(country);
		});

		return grouped;
	}, [countries]);

	// Filter countries based on search
	const filteredCountries = useMemo(() => {
		return countries.filter((country) => {
			const matchesSearch =
				country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				country.iso2.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesRegion =
				selectedRegion === "all" || country.zone?.code === selectedRegion;

			return matchesSearch && matchesRegion;
		});
	}, [countries, searchQuery, selectedRegion]);

	// Get enabled/suspended country codes for map
	const enabledCountryCodes = countries
		.filter((c) => c.isShippingEnabled && !c.isSuspended)
		.map((c) => c.iso2);

	const suspendedCountryCodes = countries
		.filter((c) => c.isSuspended)
		.map((c) => c.iso2);

	if (isLoading) {
		return (
			<div className="flex h-96 items-center justify-center">
				<div className="text-muted-foreground">Loading countries...</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Supported Countries</h1>
					<p className="text-muted-foreground">
						Manage shipping destinations and regional settings
					</p>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Add Country
				</Button>
			</div>

			{/* Stats Overview */}
			<div className="grid gap-4 md:grid-cols-4">
				<StatCard
					title="Total Countries"
					value={stats?.totalCountries?.toString() || "0"}
					icon={Globe}
					description="Registered destinations"
				/>
				<StatCard
					title="Shipping Enabled"
					value={stats?.enabledCountries?.toString() || "0"}
					icon={MapPin}
					trend="up"
					description={`${zones.length} shipping zones`}
				/>
				<StatCard
					title="Total Orders"
					value={stats?.totalOrders?.toString() || "0"}
					icon={TrendingUp}
					description="From all countries"
				/>
				<StatCard
					title="Suspended"
					value={stats?.suspendedCountries?.toString() || "0"}
					icon={AlertTriangle}
					description="Temporarily disabled"
					variant="destructive"
				/>
			</div>

			{/* Map Visualization */}
			<Card>
				<CardHeader>
					<CardTitle>Global Coverage</CardTitle>
					<CardDescription>
						Interactive map showing supported shipping destinations
					</CardDescription>
				</CardHeader>
				<CardContent>
					<CountriesMap
						enabledCountries={enabledCountryCodes}
						suspendedCountries={suspendedCountryCodes}
						onCountryClick={(code) => {
							console.log("Clicked country:", code);
							// TODO: Open country detail modal
						}}
					/>
				</CardContent>
			</Card>

			{/* Demand Analysis */}
			{demandData && demandData.topUnsupported.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Expansion Opportunities</CardTitle>
						<CardDescription>
							Countries with checkout attempts but no shipping support
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{demandData.topUnsupported.slice(0, 5).map((item) => (
								<div
									key={item.countryIso2}
									className="flex items-center justify-between rounded-lg border p-3"
								>
									<div>
										<span className="font-medium">{item.countryName}</span>
										<span className="ml-2 text-xs text-muted-foreground">
											{item.countryIso2}
										</span>
									</div>
									<div className="flex items-center gap-4 text-sm">
										<div>
											<Badge variant="outline">{item.attemptCount} attempts</Badge>
										</div>
										<div className="text-muted-foreground">
											€{((item.totalValueCents || 0) / 100).toFixed(0)} potential
										</div>
										<Button size="sm" variant="outline">
											Enable
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Search & Filter */}
			<div className="flex items-center gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search countries by name or code..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>
				<select
					className="rounded-md border px-3 py-2"
					value={selectedRegion}
					onChange={(e) => setSelectedRegion(e.target.value)}
				>
					<option value="all">All Regions</option>
					{zones.map((zone) => (
						<option key={zone.code} value={zone.code}>
							{zone.name}
						</option>
					))}
				</select>
			</div>

			{/* Countries by Region */}
			<Tabs value={selectedRegion} onValueChange={setSelectedRegion}>
				<TabsList>
					<TabsTrigger value="all">All Countries ({countries.length})</TabsTrigger>
					{Array.from(countriesByZone.entries()).map(([zoneName, zoneCountries]) => (
						<TabsTrigger key={zoneName} value={zoneName}>
							{zoneName} ({zoneCountries.length})
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="all" className="space-y-2">
					{filteredCountries.length === 0 ? (
						<Card className="p-8 text-center">
							<p className="text-muted-foreground">
								No countries found matching your search.
							</p>
						</Card>
					) : (
						filteredCountries.map((country) => (
							<CountryCard key={country.id} country={country} />
						))
					)}
				</TabsContent>

				{Array.from(countriesByZone.entries()).map(([zoneName, zoneCountries]) => (
					<TabsContent key={zoneName} value={zoneName} className="space-y-2">
						{zoneCountries
							.filter(
								(country) =>
									country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
									country.iso2.toLowerCase().includes(searchQuery.toLowerCase()),
							)
							.map((country) => (
								<CountryCard key={country.id} country={country} />
							))}
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}