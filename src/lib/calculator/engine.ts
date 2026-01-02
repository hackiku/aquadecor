// src/lib/calculator/engine.ts

// Hardcoded base shipping from PriceCalculatorService.cs
// In the future, move this to a `shipping_rates` table in your DB
const REGION_BASE_SHIPPING = {
	"RS": 45,   // Serbia
	"EU": 110,  // Europe
	"US": 130,  // USA
	"CA": 130,  // Canada
	"ROW": 160, // Rest of World
};

export interface PricingInput {
	widthCm: number;
	heightCm: number;
	baseRatePerM2Cents: number; // e.g., 25000 for €250
	countryCode: string; // "US", "DE", "FR", etc.

	// Logic Flags (Derived from Category/Product)
	isPremiumModel?: boolean;     // Old: "ExpensiveShipping..." (1.5x multiplier)
	isLargeTankPenalty?: boolean; // Old: "ExpensiveSquareMeter..." (>2m² penalty)

	// User Options
	isFlexible?: boolean;
	hasFiltration?: boolean;
	sidePanelsCount?: 0 | 1 | 2; // 0=None, 1=Left/Right, 2=Both
	sidePanelWidthCm?: number;
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
	// 1. Calculate Main Surface Area (m²)
	const surfaceAreaM2 = (input.widthCm * input.heightCm) / 10000;

	// 2. Determine Rate Multiplier (The "Strategy" Logic)
	let rateMultiplier = 1.0;

	if (input.isPremiumModel) {
		rateMultiplier = 1.5;
	} else if (input.isLargeTankPenalty && surfaceAreaM2 >= 2.0) {
		// The "Big Tank Tax": If > 2m², price increases by 50%
		rateMultiplier = 1.5;
	}

	const effectiveRate = input.baseRatePerM2Cents * rateMultiplier;

	// 3. Base Product Price
	const basePriceCents = Math.round(surfaceAreaM2 * effectiveRate);

	// 4. Flexibility Surcharge (20% of base)
	const flexibilitySurchargeCents = input.isFlexible
		? Math.round(basePriceCents * 0.20)
		: 0;

	// 5. Side Panels
	let sidePanelsCents = 0;
	if (input.sidePanelsCount && input.sidePanelsCount > 0 && input.sidePanelWidthCm) {
		const singlePanelArea = (input.sidePanelWidthCm * input.heightCm) / 10000;
		const singlePanelCost = singlePanelArea * effectiveRate; // Uses same rate/markup as main
		sidePanelsCents = Math.round(singlePanelCost * input.sidePanelsCount);
	}

	// 6. Filtration (Fixed Fee)
	const filtrationCents = input.hasFiltration ? 5000 : 0; // €50.00

	// 7. THE SECRET SHIPPING FORMULA (From ShippingHelpers.cs)
	// Determine base region rate
	let baseShippingEur = REGION_BASE_SHIPPING.ROW;
	if (input.countryCode === "RS") baseShippingEur = REGION_BASE_SHIPPING.RS;
	else if (input.countryCode === "US") baseShippingEur = REGION_BASE_SHIPPING.US;
	else if (input.countryCode === "CA") baseShippingEur = REGION_BASE_SHIPPING.CA;
	// Simple check for EU (In reality, check a list of EU country codes)
	else if (["DE", "FR", "IT", "ES", "NL", "BE", "AT"].includes(input.countryCode)) {
		baseShippingEur = REGION_BASE_SHIPPING.EU;
	}

	let finalShippingCents = baseShippingEur * 100;
	const totalAreaForShipping = surfaceAreaM2; // C# calculated shipping only on back wall, not sides

	if (totalAreaForShipping > 1.0) {
		// Logic: "int areaGroup = (int)Math.Ceiling(amount * 2);"
		// Logic: "shippingPrice += (areaGroup - 2) * (shippingPrice / 2);"
		const areaGroup = Math.ceil(totalAreaForShipping * 2);
		const stepsAboveOne = areaGroup - 2;
		if (stepsAboveOne > 0) {
			finalShippingCents += stepsAboveOne * (finalShippingCents / 2);
		}
	}

	// 8. Total
	const totalCents = basePriceCents
		+ flexibilitySurchargeCents
		+ sidePanelsCents
		+ filtrationCents
		+ finalShippingCents;

	return {
		surfaceAreaM2: Number(surfaceAreaM2.toFixed(2)),
		basePriceCents,
		flexibilitySurchargeCents,
		sidePanelsCents,
		filtrationCents,
		shippingCents: Math.round(finalShippingCents),
		totalCents: Math.round(totalCents)
	};
}