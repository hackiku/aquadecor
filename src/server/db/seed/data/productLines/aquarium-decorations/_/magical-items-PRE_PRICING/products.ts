// TEST CATEGORY: Magical Aquarium Items
// Testing all pricing/customization patterns

import type { ProductSeed } from "../../../../../schema";

export const products: ProductSeed[] = [
	// ============================================================================
	// TEST 1: SIMPLE BUY NOW (No options, direct add-to-cart)
	// ============================================================================
	{
		categorySlug: "magical-items",
		slug: "enchanted-pebble",
		sku: "MAGIC-01",
		productType: "catalog",
		stockStatus: "in_stock",

		pricing: {
			type: "simple",
			unitPriceEurCents: 999, // €9.99
			allowQuantity: true,
			maxQuantity: 50,
		},

		customization: null,

		specifications: {
			material: "Mystical stone",
			productionTime: "Ready to ship",
		},

		customizationOptions: { allowsCustomDimensions: false },
		excludedMarkets: ["US"],
		isActive: true,
		isFeatured: true,
		sortOrder: 1,

		// Stripe
		stripeProductId: null,
		stripePriceId: null,
		stripePrices: null,

		// Legacy (keep null)
		basePriceEurCents: null,
		priceNote: null,
		variantType: null,
		variantOptions: null,
		addonOptions: null,
	},

	// ============================================================================
	// TEST 2: QUANTITY BUNDLES ONLY (3, 5, 10 pieces)
	// ============================================================================
	{
		categorySlug: "magical-items",
		slug: "fairy-dust-bundle",
		sku: "MAGIC-02",
		productType: "catalog",
		stockStatus: "in_stock",

		pricing: {
			type: "quantity_bundle",
			bundles: [
				{ quantity: 3, totalPriceEurCents: 1499, label: "Starter Pack", isDefault: true },
				{ quantity: 5, totalPriceEurCents: 2299, label: "Value Pack (Save 15%)" },
				{ quantity: 10, totalPriceEurCents: 3999, label: "Mega Pack (Save 25%)" },
			],
		},

		customization: null,

		specifications: {
			material: "Crystallized moonlight",
			productionTime: "2-3 days",
		},

		customizationOptions: { allowsCustomDimensions: false },
		excludedMarkets: [],
		isActive: true,
		isFeatured: false,
		sortOrder: 2,

		stripeProductId: null,
		stripePriceId: null,
		stripePrices: null,

		basePriceEurCents: null,
		priceNote: null,
		variantType: null,
		variantOptions: null,
		addonOptions: null,
	},

	// ============================================================================
	// TEST 3: BUNDLE + CHECKBOX ADDON (Moss equivalent)
	// ============================================================================
	{
		categorySlug: "magical-items",
		slug: "wizard-wand-set",
		sku: "MAGIC-03",
		productType: "catalog",
		stockStatus: "in_stock",

		pricing: {
			type: "quantity_bundle",
			bundles: [
				{ quantity: 1, totalPriceEurCents: 2999, label: "Single Wand", isDefault: true },
				{ quantity: 3, totalPriceEurCents: 7999, label: "Trio Set (Save 10%)" },
			],
		},

		customization: {
			addons: [
				{
					id: "enchantment",
					name: "Extra Enchantment",
					description: "Add sparkle effect for 24 hours",
					priceEurCents: 1000, // +€10
					type: "checkbox",
					default: false,
				},
				{
					id: "gift_wrap",
					name: "Gift Wrapping",
					description: "Wrapped in dragon silk",
					priceEurCents: 500, // +€5
					type: "checkbox",
					default: false,
				},
			],
		},

		specifications: {
			material: "Elder wood with phoenix feather core",
			productionTime: "1 week",
		},

		customizationOptions: { allowsCustomDimensions: false },
		excludedMarkets: [],
		isActive: true,
		isFeatured: true,
		sortOrder: 3,

		stripeProductId: null,
		stripePriceId: null,
		stripePrices: null,

		basePriceEurCents: null,
		priceNote: null,
		variantType: null,
		variantOptions: null,
		addonOptions: null,
	},

	// ============================================================================
	// TEST 4: FULL MONTY (Bundles + Addons + Inputs + Selects)
	// ============================================================================
	{
		categorySlug: "magical-items",
		slug: "custom-potion-kit",
		sku: "MAGIC-04",
		productType: "catalog",
		stockStatus: "made_to_order",

		pricing: {
			type: "quantity_bundle",
			bundles: [
				{ quantity: 5, totalPriceEurCents: 1999, label: "5 Bottles", isDefault: true },
				{ quantity: 10, totalPriceEurCents: 3499, label: "10 Bottles (Save 15%)" },
				{ quantity: 20, totalPriceEurCents: 5999, label: "20 Bottles (Best Value)" },
			],
		},

		customization: {
			addons: [
				{
					id: "cork_upgrade",
					name: "Premium Cork Stoppers",
					description: "Hand-carved from ancient oak",
					priceEurCents: 800,
					type: "checkbox",
					default: false,
				},
			],
			inputs: [
				{
					id: "bottle_height",
					label: "Custom Bottle Height (cm)",
					type: "number",
					required: true,
					placeholder: "Enter height between 10-30",
					validation: {
						min: 10,
						max: 30,
					},
				},
				{
					id: "inscription",
					label: "Inscription Text (Optional)",
					type: "text",
					required: false,
					placeholder: "Max 50 characters",
					validation: {
						maxLength: 50,
					},
				},
				{
					id: "special_notes",
					label: "Special Instructions",
					type: "textarea",
					required: false,
					placeholder: "Any special brewing instructions...",
				},
			],
			selects: [
				{
					id: "potion_color",
					label: "Potion Color",
					required: true,
					options: [
						{ value: "emerald", label: "Emerald Green", isDefault: true },
						{ value: "sapphire", label: "Sapphire Blue", priceEurCents: 300 },
						{ value: "ruby", label: "Ruby Red (Premium)", priceEurCents: 600 },
						{ value: "gold", label: "Liquid Gold", priceEurCents: 1000 },
					],
				},
			],
		},

		specifications: {
			material: "Enchanted glass and alchemical ingredients",
			productionTime: "7-10 business days",
		},

		customizationOptions: { allowsCustomDimensions: true },
		excludedMarkets: [],
		isActive: true,
		isFeatured: true,
		sortOrder: 4,

		stripeProductId: null,
		stripePriceId: null,
		stripePrices: null,

		basePriceEurCents: null,
		priceNote: null,
		variantType: null,
		variantOptions: null,
		addonOptions: null,
	},
];