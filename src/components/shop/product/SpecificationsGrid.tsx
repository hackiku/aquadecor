// src/components/shop/product/SpecificationsGrid.tsx

interface SpecificationsGridProps {
	specifications: Record<string, any>;
	specOverrides?: Record<string, string>;
}

export function SpecificationsGrid({ specifications, specOverrides }: SpecificationsGridProps) {
	if (!specifications || typeof specifications !== 'object' || Object.keys(specifications).length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-display font-normal">Specifications</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-muted/30 rounded-xl border">
				{Object.entries(specifications).map(([key, value]) => {
					// Skip rendering nested objects (like dimensions)
					if (typeof value === 'object' && value !== null) {
						// Handle dimensions object specially
						if (key === 'dimensions') {
							const dims = value as any;
							return (
								<div key={key} className="space-y-1 sm:col-span-2">
									<dt className="text-xs text-muted-foreground font-display uppercase tracking-wide">
										Dimensions
									</dt>
									<dd className="text-base font-display font-medium">
										{dims.widthCm && `${dims.widthCm}cm W`}
										{dims.heightCm && ` × ${dims.heightCm}cm H`}
										{dims.depthCm && ` × ${dims.depthCm}cm D`}
									</dd>
								</div>
							);
						}
						return null; // Skip other objects
					}

					// Format label
					const formattedKey = key
						.replace(/([A-Z])/g, " $1")
						.replace(/Cm$/, "")
						.trim()
						.split(" ")
						.map(word => word.charAt(0).toUpperCase() + word.slice(1))
						.join(" ");

					// Check for specOverride first
					let formattedValue: string;

					if (specOverrides && specOverrides[key]) {
						// Use translated override if available
						formattedValue = specOverrides[key]!;
					} else if (typeof value === 'boolean') {
						formattedValue = value ? "Yes" : "No";
					} else if (key === 'productionTime') {
						formattedValue = String(value);
					} else if (key === 'plantType' || key === 'woodType' || key === 'rockFormation') {
						// Format IDs to readable text
						formattedValue = String(value)
							.split('-')
							.map(word => word.charAt(0).toUpperCase() + word.slice(1))
							.join(' ');
					} else {
						formattedValue = String(value);
					}

					return (
						<div key={key} className="space-y-1">
							<dt className="text-xs text-muted-foreground font-display uppercase tracking-wide">
								{formattedKey}
							</dt>
							<dd className="text-base font-display font-medium">
								{formattedValue}
							</dd>
						</div>
					);
				})}
			</div>
		</div>
	);
}