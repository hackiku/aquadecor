// src/app/admin/_components/CountriesMap.tsx
"use client";

import React from "react";
import {
	ComposableMap,
	Geographies,
	Geography,
	ZoomableGroup,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface CountriesMapProps {
	enabledCountries: string[]; // Array of ISO2 codes
	suspendedCountries?: string[]; // Array of ISO2 codes
	onCountryClick?: (countryCode: string) => void;
}

export function CountriesMap({
	enabledCountries,
	suspendedCountries = [],
	onCountryClick,
}: CountriesMapProps) {
	const getCountryColor = (geoId: string) => {
		if (suspendedCountries.includes(geoId)) {
			return "hsl(var(--destructive))"; // Red for suspended
		}
		if (enabledCountries.includes(geoId)) {
			return "hsl(var(--primary))"; // Primary color for enabled
		}
		return "hsl(var(--muted))"; // Muted for disabled/unsupported
	};

	return (
		<div className="rounded-lg border bg-card p-4">
			<ComposableMap
				projection="geoMercator"
				projectionConfig={{
					scale: 120,
					center: [15, 50], // Center on Europe (Serbia market focus)
				}}
			>
				<ZoomableGroup>
					<Geographies geography={geoUrl}>
						{({ geographies }) =>
							geographies.map((geo) => {
								const countryCode = geo.id; // This should be ISO2 code
								const isEnabled = enabledCountries.includes(countryCode);
								const isSuspended = suspendedCountries.includes(countryCode);

								return (
									<Geography
										key={geo.rsmKey}
										geography={geo}
										fill={getCountryColor(countryCode)}
										stroke="hsl(var(--border))"
										strokeWidth={0.5}
										style={{
											default: {
												outline: "none",
											},
											hover: {
												fill: isEnabled
													? "hsl(var(--primary) / 0.8)"
													: "hsl(var(--muted-foreground))",
												outline: "none",
												cursor: onCountryClick ? "pointer" : "default",
											},
											pressed: {
												fill: "hsl(var(--primary) / 0.6)",
												outline: "none",
											},
										}}
										onClick={() => {
											if (onCountryClick && (isEnabled || isSuspended)) {
												onCountryClick(countryCode);
											}
										}}
									/>
								);
							})
						}
					</Geographies>
				</ZoomableGroup>
			</ComposableMap>

			{/* Legend */}
			<div className="mt-4 flex items-center gap-6 text-sm">
				<div className="flex items-center gap-2">
					<div className="h-3 w-3 rounded-sm bg-primary" />
					<span>Shipping Enabled ({enabledCountries.length})</span>
				</div>
				{suspendedCountries.length > 0 && (
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-sm bg-destructive" />
						<span>Suspended ({suspendedCountries.length})</span>
					</div>
				)}
				<div className="flex items-center gap-2">
					<div className="h-3 w-3 rounded-sm bg-muted" />
					<span>Not Supported</span>
				</div>
			</div>
		</div>
	);
}