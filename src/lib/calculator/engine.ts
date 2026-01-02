// src/lib/calculator/engine.ts

// These match your C# ShippingHelpers.cs logic
// TODO: Move these to a database table "shipping_rates" eventually
export const REGION_SHIPPING_DEFAULTS = {
	RS: 45,   // Serbia
	EU: 110,  // Europe
	US: 130,  // USA/Canada
	ROW: 160, // Rest of World
};

export interface PricingInput {
	// Dimensions (Normalized to CM)
	widthCm: number;
	heightCm: number;

	// Base Rate (from DB)
	baseRatePerM2Cents: number;

	// Context (for shipping)
	countryCode: string;

	// Strategy Flags (Mapped from Category/Product slugs)
	isPremiumModel: boolean;     // Old: ExpensiveShipping (1.5x)
	isLargeTankPenalty: boolean; // Old: ExpensiveSquareMeter (>2m² penalty)

	// User Selections
	isFlexible: boolean;
	hasFiltration: boolean;
	sidePanelsCount: 0 | 1 | 2;
	sidePanelWidthCm: number;
}

export interface PricingResult {
	surfaceAreaM2: number;
	basePriceCents: number;
	flexibilitySurchargeCents: number;
	sidePanelsCents: number;
	filtrationCents: number;
	shippingCents: number;
	totalCents: number;
}

export function calculateQuote(input: PricingInput): PricingResult {
	// 1. Surface Area
	const surfaceAreaM2 = (input.widthCm * input.heightCm) / 10000;

	// 2. Rate Determination (The "Strategy" Logic)
	let multiplier = 1.0;
	if (input.isPremiumModel) multiplier = 1.5;
	else if (input.isLargeTankPenalty && surfaceAreaM2 >= 2.0) multiplier = 1.5;

	const effectiveRate = input.baseRatePerM2Cents * multiplier;

	// 3. Base Price
	const basePriceCents = Math.round(surfaceAreaM2 * effectiveRate);

	// 4. Flexibility (20%)
	const flexCents = input.isFlexible ? Math.round(basePriceCents * 0.20) : 0;

	// 5. Side Panels
	let sidePanelsCents = 0;
	if (input.sidePanelsCount > 0 && input.sidePanelWidthCm > 0) {
		const panelArea = (input.sidePanelWidthCm * input.heightCm) / 10000;
		// Side panels usually don't get the "Large Tank" penalty, but do get "Premium" markup
		// For simplicity, we use the effectiveRate here. 
		sidePanelsCents = Math.round(panelArea * effectiveRate * input.sidePanelsCount);
	}

	// 6. Filtration
	const filtrationCents = input.hasFiltration ? 5000 : 0;

	// 7. Shipping (The "Step Function")
	// Map country code to base rate
	let baseShippingEur = REGION_SHIPPING_DEFAULTS.ROW;
	if (input.countryCode === "RS") baseShippingEur = REGION_SHIPPING_DEFAULTS.RS;
	else if (input.countryCode === "US" || input.countryCode === "CA") baseShippingEur = REGION_SHIPPING_DEFAULTS.US;
	// Simple EU check (expand this list as needed)
	else if (["DE", "FR", "IT", "ES", "NL", "BE", "AT", "PL"].includes(input.countryCode)) {
		baseShippingEur = REGION_SHIPPING_DEFAULTS.EU;
	}

	let shippingCents = baseShippingEur * 100;

	// Shipping Surcharge logic: +50% of base for every 0.5m² over 1m²
	if (surfaceAreaM2 > 1.0) {
		const areaGroup = Math.ceil(surfaceAreaM2 * 2);
		const steps = areaGroup - 2;
		if (steps > 0) {
			shippingCents += steps * (shippingCents / 2);
		}
	}

	return {
		surfaceAreaM2: Number(surfaceAreaM2.toFixed(2)),
		basePriceCents,
		flexibilitySurchargeCents: flexCents,
		sidePanelsCents,
		filtrationCents,
		shippingCents: Math.round(shippingCents),
		totalCents: Math.round(basePriceCents + flexCents + sidePanelsCents + filtrationCents + shippingCents)
	};
}