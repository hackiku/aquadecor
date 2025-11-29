// src/server/db/seed/data/seed-sales.ts

export const salesSeedData = [
	{
		name: "Black Friday 2025",
		slug: "black-friday-2025",
		discountPercent: 25,
		discountCode: "BLACKFRIDAY25",
		startsAt: new Date("2025-11-28T00:00:00Z"),
		endsAt: new Date("2025-11-30T23:59:59Z"),
		bannerType: "CountdownBanner",
		bannerConfig: {
			backgroundColor: "#000000",
			textColor: "#ffffff",
			showCountdown: true,
			customMessage: "Black Friday 2025",
			ctaText: "Shop Now",
		},
		visibleOn: ["/", "/shop", "/shop/*"],
		usageCount: 0,
		totalRevenue: 0,
		isActive: true,
		createdAt: new Date("2025-11-01T00:00:00Z"),
	},
	{
		name: "Summer Sale 2024",
		slug: "summer-sale-2024",
		discountPercent: 20,
		discountCode: "SUMMER20",
		startsAt: new Date("2024-06-01T00:00:00Z"),
		endsAt: new Date("2024-08-31T23:59:59Z"),
		bannerType: "SaleBanner",
		bannerConfig: {
			backgroundColor: "#3b82f6",
			textColor: "#ffffff",
			showCountdown: false,
			customMessage: "Summer Sale - All Backgrounds 20% Off",
		},
		visibleOn: ["/", "/shop"],
		usageCount: 67,
		totalRevenue: 1340000, // €13,400 in cents
		isActive: false, // Expired
		createdAt: new Date("2024-05-15T00:00:00Z"),
	},
	{
		name: "New Year Sale 2025",
		slug: "new-year-2025",
		discountPercent: 25,
		discountCode: "NEWYEAR25",
		startsAt: new Date("2025-01-01T00:00:00Z"),
		endsAt: new Date("2025-01-15T23:59:59Z"),
		bannerType: "FlashSaleBanner",
		bannerConfig: {
			backgroundColor: "#8b5cf6",
			textColor: "#ffffff",
			showCountdown: true,
			customMessage: "New Year, New Aquarium - 25% Off Everything!",
		},
		visibleOn: ["/", "/shop", "/shop/*"],
		usageCount: 23,
		totalRevenue: 575000, // €5,750 in cents
		isActive: false, // Expired
		createdAt: new Date("2024-12-20T00:00:00Z"),
	},
	{
		name: "Weekend Flash Sale",
		slug: "weekend-flash-aug-2024",
		discountPercent: 20,
		discountCode: "WEEKEND20",
		startsAt: new Date("2024-08-09T00:00:00Z"),
		endsAt: new Date("2024-08-10T23:59:59Z"),
		bannerType: "FlashSaleBanner",
		bannerConfig: {
			backgroundColor: "#ef4444",
			textColor: "#ffffff",
			showCountdown: true,
			customMessage: "⚡ Weekend Flash Sale - 48 Hours Only!",
		},
		visibleOn: ["/", "/shop"],
		usageCount: 0,
		totalRevenue: 0,
		isActive: false, // Expired
		createdAt: new Date("2024-08-08T00:00:00Z"),
	},
];