// magical-items/pricing.ts
// ALL pricing, bundles, addons, and customization options
// Organized by product for easy maintenance

// ============================================================================
// PRODUCT PRICING (one per product)
// ============================================================================
export const pricing = [
	{
		productSlug: "enchanted-pebble",
		slug: "enchanted-pebble-pricing", // Unique identifier for this pricing config
		pricingType: "simple" as const,
		unitPriceEurCents: 999, // €9.99
		allowQuantity: true,
		maxQuantity: 50,
	},
	{
		productSlug: "fairy-dust-bundle",
		slug: "fairy-dust-pricing",
		pricingType: "quantity_bundle" as const,
	},
	{
		productSlug: "wizard-wand-set",
		slug: "wizard-wand-pricing",
		pricingType: "quantity_bundle" as const,
	},
	{
		productSlug: "custom-potion-kit",
		slug: "custom-potion-pricing",
		pricingType: "quantity_bundle" as const,
	},
];

// ============================================================================
// PRICING BUNDLES (for quantity_bundle type products)
// ============================================================================
export const bundles = [
	// Fairy Dust bundles
	{
		pricingSlug: "fairy-dust-pricing",
		quantity: 3,
		totalPriceEurCents: 1499,
		label: "Starter Pack",
		isDefault: true,
	},
	{
		pricingSlug: "fairy-dust-pricing",
		quantity: 5,
		totalPriceEurCents: 2299,
		label: "Value Pack (Save 15%)",
		isDefault: false,
	},
	{
		pricingSlug: "fairy-dust-pricing",
		quantity: 10,
		totalPriceEurCents: 3999,
		label: "Mega Pack (Save 25%)",
		isDefault: false,
	},

	// Wizard Wand bundles
	{
		pricingSlug: "wizard-wand-pricing",
		quantity: 1,
		totalPriceEurCents: 2999,
		label: "Single Wand",
		isDefault: true,
	},
	{
		pricingSlug: "wizard-wand-pricing",
		quantity: 3,
		totalPriceEurCents: 7999,
		label: "Trio Set (Save 10%)",
		isDefault: false,
	},

	// Custom Potion Kit bundles
	{
		pricingSlug: "custom-potion-pricing",
		quantity: 5,
		totalPriceEurCents: 1999,
		label: "5 Bottles",
		isDefault: true,
	},
	{
		pricingSlug: "custom-potion-pricing",
		quantity: 10,
		totalPriceEurCents: 3499,
		label: "10 Bottles (Save 15%)",
		isDefault: false,
	},
	{
		pricingSlug: "custom-potion-pricing",
		quantity: 20,
		totalPriceEurCents: 5999,
		label: "20 Bottles (Best Value)",
		isDefault: false,
	},
];

// ============================================================================
// PRODUCT ADDONS (checkbox add-ons)
// ============================================================================
export const addons = [
	// Wizard Wand addons
	{
		productSlug: "wizard-wand-set",
		addonId: "enchantment",
		name: "Extra Enchantment",
		description: "Add sparkle effect for 24 hours",
		priceEurCents: 1000,
		isDefault: false,
	},
	{
		productSlug: "wizard-wand-set",
		addonId: "gift_wrap",
		name: "Gift Wrapping",
		description: "Wrapped in dragon silk",
		priceEurCents: 500,
		isDefault: false,
	},

	// Custom Potion Kit addons
	{
		productSlug: "custom-potion-kit",
		addonId: "cork_upgrade",
		name: "Premium Cork Stoppers",
		description: "Hand-carved from ancient oak",
		priceEurCents: 800,
		isDefault: false,
	},
];

// ============================================================================
// CUSTOMIZATION OPTIONS (inputs/selects for made-to-order)
// ============================================================================
export const customizationOptions = [
	// Custom Potion Kit - Height input
	{
		productSlug: "custom-potion-kit",
		slug: "bottle-height-input",
		type: "input" as const, // 'input' | 'select' | 'textarea'
		inputType: "number" as const, // Only when type='input'
		label: "Custom Bottle Height (cm)",
		placeholder: "Enter height between 10-30",
		required: true,
		minValue: 10,
		maxValue: 30,
		sortOrder: 1,
	},
	// Custom Potion Kit - Inscription text
	{
		productSlug: "custom-potion-kit",
		slug: "inscription-input",
		type: "input" as const,
		inputType: "text" as const,
		label: "Inscription Text (Optional)",
		placeholder: "Max 50 characters",
		required: false,
		maxLength: 50,
		sortOrder: 2,
	},
	// Custom Potion Kit - Special notes
	{
		productSlug: "custom-potion-kit",
		slug: "special-notes-input",
		type: "textarea" as const,
		inputType: null, // Not used for textarea
		label: "Special Instructions",
		placeholder: "Any special brewing instructions...",
		required: false,
		sortOrder: 3,
	},
	// Custom Potion Kit - Potion color select
	{
		productSlug: "custom-potion-kit",
		slug: "potion-color-select",
		type: "select" as const,
		inputType: null, // Not used for select
		label: "Potion Color",
		placeholder: null,
		required: true,
		sortOrder: 4,
	},
];

// ============================================================================
// SELECT OPTIONS (dropdown choices for select-type customization options)
// ============================================================================
export const selectOptions = [
	// Potion color options
	{
		customizationOptionSlug: "potion-color-select",
		value: "emerald",
		label: "Emerald Green",
		priceEurCents: 0,
		isDefault: true,
		sortOrder: 1,
	},
	{
		customizationOptionSlug: "potion-color-select",
		value: "sapphire",
		label: "Sapphire Blue",
		priceEurCents: 300,
		isDefault: false,
		sortOrder: 2,
	},
	{
		customizationOptionSlug: "potion-color-select",
		value: "ruby",
		label: "Ruby Red (Premium)",
		priceEurCents: 600,
		isDefault: false,
		sortOrder: 3,
	},
	{
		customizationOptionSlug: "potion-color-select",
		value: "gold",
		label: "Liquid Gold",
		priceEurCents: 1000,
		isDefault: false,
		sortOrder: 4,
	},
];

// ============================================================================
// MARKET EXCLUSIONS (which products can't be sold where)
// ============================================================================
export const marketExclusions = [
	{
		productSlug: "enchanted-pebble",
		market: "US" as const,
	},
];