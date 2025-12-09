// src/server/db/seed/data/seed-orders.ts

export const ordersSeedData = [
	// ============================================================================
	// TEST ORDER 1: Simple Product (Enchanted Pebble)
	// ============================================================================
	{
		orderNumber: "ORD-2025-1001",
		email: "test@aquadecor.com",
		firstName: "Test",
		lastName: "Customer",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 999,
		discount: 0,
		shipping: 500,
		tax: 0,
		total: 1499,
		currency: "EUR",
		market: "ROW" as const,
		countryCode: "DE",
		discountCode: null,
		customerNotes: null,
		createdAt: new Date("2024-12-01T10:00:00"),
		paidAt: new Date("2024-12-01T10:05:00"),
		shippedAt: null,
		items: [
			{
				productId: "test-product-id-1", // Will be replaced by actual ID during seed
				productName: "Enchanted Pebble",
				sku: "MAGIC-01",
				productSlug: "enchanted-pebble",
				quantity: 1,
				pricePerUnit: 999,
				subtotal: 999,
				addonsTotal: 0,
				customizationsTotal: 0,
				total: 999,
				isCustom: false,
				productionStatus: null,
				pricingSnapshot: {
					pricingType: "simple",
					market: "ROW",
					currency: "EUR",
					unitPriceEurCents: 999,
					quantity: 1,
				},
			},
		],
	},

	// ============================================================================
	// TEST ORDER 2: Bundle Product (Fairy Dust)
	// ============================================================================
	{
		orderNumber: "ORD-2025-1002",
		email: "bundle@test.com",
		firstName: "Bundle",
		lastName: "Buyer",
		status: "shipped" as const,
		paymentStatus: "paid" as const,
		subtotal: 2299,
		discount: 0,
		shipping: 800,
		tax: 0,
		total: 3099,
		currency: "EUR",
		market: "ROW" as const,
		countryCode: "FR",
		discountCode: null,
		customerNotes: null,
		createdAt: new Date("2024-12-02T14:30:00"),
		paidAt: new Date("2024-12-02T14:35:00"),
		shippedAt: new Date("2024-12-03T09:00:00"),
		items: [
			{
				productId: "test-product-id-2",
				productName: "Fairy Dust Bundle",
				sku: "MAGIC-02",
				productSlug: "fairy-dust-bundle",
				quantity: 1, // 1 bundle of 5 pieces
				pricePerUnit: 2299,
				subtotal: 2299,
				addonsTotal: 0,
				customizationsTotal: 0,
				total: 2299,
				isCustom: false,
				productionStatus: null,
				pricingSnapshot: {
					pricingType: "bundle",
					market: "ROW",
					currency: "EUR",
					bundleQuantity: 5,
					bundleTotalPriceEurCents: 2299,
					bundleLabel: "Value Pack (Save 15%)",
				},
			},
		],
	},

	// ============================================================================
	// TEST ORDER 3: Bundle + Addons (Wizard Wand)
	// ============================================================================
	{
		orderNumber: "ORD-2025-1003",
		email: "wizard@hogwarts.edu",
		firstName: "Harry",
		lastName: "Potter",
		status: "in_production" as const,
		paymentStatus: "paid" as const,
		subtotal: 2999,
		discount: 0,
		shipping: 1200,
		tax: 0,
		total: 5699, // 2999 + 1000 (enchantment) + 500 (gift wrap) + 1200 (shipping)
		currency: "EUR",
		market: "ROW" as const,
		countryCode: "GB",
		discountCode: null,
		customerNotes: null,
		createdAt: new Date("2024-12-05T18:45:00"),
		paidAt: new Date("2024-12-05T18:50:00"),
		shippedAt: null,
		items: [
			{
				productId: "test-product-id-3",
				productName: "Wizard Wand Set",
				sku: "MAGIC-03",
				productSlug: "wizard-wand-set",
				quantity: 1,
				pricePerUnit: 2999,
				subtotal: 2999,
				addonsTotal: 1500, // 1000 + 500
				customizationsTotal: 0,
				total: 4499,
				isCustom: false,
				productionStatus: null,
				pricingSnapshot: {
					pricingType: "bundle",
					market: "ROW",
					currency: "EUR",
					bundleQuantity: 1,
					bundleTotalPriceEurCents: 2999,
					bundleLabel: "Single Wand",
					selectedAddons: [
						{
							addonId: "enchantment",
							name: "Extra Enchantment",
							priceEurCents: 1000,
						},
						{
							addonId: "gift_wrap",
							name: "Gift Wrapping",
							priceEurCents: 500,
						},
					],
				},
			},
		],
	},

	// ============================================================================
	// TEST ORDER 4: Full Customization (Custom Potion Kit)
	// ============================================================================
	{
		orderNumber: "ORD-2025-1004",
		email: "snape@potions.edu",
		firstName: "Severus",
		lastName: "Snape",
		status: "pending" as const,
		paymentStatus: "paid" as const,
		subtotal: 3499,
		discount: 0,
		shipping: 1500,
		tax: 0,
		total: 5899, // 3499 + 800 (cork) + 600 (ruby color) + 1500 (shipping)
		currency: "EUR",
		market: "ROW" as const,
		countryCode: "RS",
		discountCode: null,
		customerNotes: "Please handle with care - volatile ingredients!",
		createdAt: new Date("2024-12-08T08:20:00"),
		paidAt: new Date("2024-12-08T08:25:00"),
		shippedAt: null,
		items: [
			{
				productId: "test-product-id-4",
				productName: "Custom Potion Kit",
				sku: "MAGIC-04",
				productSlug: "custom-potion-kit",
				quantity: 1,
				pricePerUnit: 3499,
				subtotal: 3499,
				addonsTotal: 800,
				customizationsTotal: 600,
				total: 4899,
				isCustom: true,
				productionStatus: "pending" as const,
				pricingSnapshot: {
					pricingType: "configuration",
					market: "ROW",
					currency: "EUR",
					bundleQuantity: 10,
					bundleTotalPriceEurCents: 3499,
					bundleLabel: "10 Bottles (Save 15%)",
					selectedAddons: [
						{
							addonId: "cork_upgrade",
							name: "Premium Cork Stoppers",
							priceEurCents: 800,
						},
					],
					customizations: {
						inputs: {
							bottle_height: "25",
							inscription: "Property of S. Snape",
							special_notes: "Extra thick glass for acidic potions",
						},
						selects: {
							potion_color: {
								value: "ruby",
								label: "Ruby Red (Premium)",
								priceEurCents: 600,
							},
						},
					},
				},
			},
		],
	},

	// ============================================================================
	// TEST ORDER 5: Abandoned Cart
	// ============================================================================
	{
		orderNumber: "ORD-2025-1005",
		email: "abandoned@cart.com",
		firstName: "John",
		lastName: "Doe",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 999,
		discount: 0,
		shipping: 0,
		tax: 0,
		total: 999,
		currency: "EUR",
		market: "ROW" as const,
		countryCode: "IT",
		discountCode: null,
		customerNotes: null,
		createdAt: new Date("2024-12-09T16:00:00"),
		paidAt: null,
		shippedAt: null,
		items: [
			{
				productId: "test-product-id-1",
				productName: "Enchanted Pebble",
				sku: "MAGIC-01",
				productSlug: "enchanted-pebble",
				quantity: 1,
				pricePerUnit: 999,
				subtotal: 999,
				addonsTotal: 0,
				customizationsTotal: 0,
				total: 999,
				isCustom: false,
				productionStatus: null,
				pricingSnapshot: {
					pricingType: "simple",
					market: "ROW",
					currency: "EUR",
					unitPriceEurCents: 999,
					quantity: 1,
				},
			},
		],
	},
];