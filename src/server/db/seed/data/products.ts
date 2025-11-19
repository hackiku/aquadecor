// src/server/db/seed/data/products.ts
// CONSOLIDATED FILE: Contains 12 featured products from the different product lines,
// mapped to the OLD category IDs for immediate database compatibility.

export const productData = [
	// =========================================================
	// 3D BACKGROUNDS (Category: 3d-backgrounds-a-models)
	// =========================================================
	{
		id: "f1-3d-background",
		categoryId: "3d-backgrounds-a-models",
		slug: "f1-3d-background",
		sku: "F1",
		basePriceEurCents: null,
		priceNote: "Custom made - Production takes 10-12 business days",
		specifications: {
			productionTime: "10-12 business days",
			material: "High-quality resin with natural stone appearance",
			featuredImage: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/f1-3d-background.webp", // Placeholder image link
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: true,
		sortOrder: 1,
		translations: {
			en: {
				name: "F1 - 3D Background in Stone",
				shortDescription: "3D Rocky aquarium background with natural stone appearance",
				fullDescription: "3D Rocky aquarium background with stone appearance. Top-notch, free shipping. Production takes 10-12 business days, and delivery takes 5-6 business days. The design imitates a rocky riverbed with stones in a singular tone.",
			},
		},
	},
	{
		id: "f2-3d-background",
		categoryId: "3d-backgrounds-a-models",
		slug: "f2-3d-background",
		sku: "F2",
		basePriceEurCents: null,
		priceNote: "Custom made - From €199",
		specifications: {
			productionTime: "10-12 business days",
			featuredImage: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/f2-3d-background.webp", // Placeholder image link
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: false,
		sortOrder: 2,
		translations: {
			en: {
				name: "F2 - Rocky Wood Background",
				shortDescription: "3D Rocky aquarium background with petrified wood appearance",
				fullDescription: "3D Rocky Wood Aquarium Background with petrified wood appearance in shades of white, gray, yellow, and brown.",
			},
		},
	},

	// =========================================================
	// PLANTS & MOSS (Category: decorations-plants)
	// =========================================================
	{
		id: "z1-aquarium-plant",
		categoryId: "decorations-plants",
		slug: "z1-aquarium-plant",
		sku: "Z1",
		basePriceEurCents: 4900, // €49
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { widthCm: 4, heightCm: 18, depthCm: 10 },
			featuredImage: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/z-1-model-aquarium-plant.webp",
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: true,
		sortOrder: 3,
		translations: {
			en: {
				name: "Z 1 Model - Aquarium Plant",
				shortDescription: "Realistic 3D aquarium plant decoration (4x10x18cm)",
				fullDescription: "The material they are made from provides 100% neutrality, a natural look, and an unlimited lifespan. Even if you keep cichlids and fish that naturally feed on plants, they simply cannot be damaged.",
			},
		},
	},
	{
		id: "z10-aquarium-moss",
		categoryId: "decorations-plants",
		slug: "z10-model-aquarium-moss",
		sku: "Z10",
		basePriceEurCents: 4900,
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { widthCm: 12, heightCm: 10, depthCm: 15 },
			featuredImage: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/z-10-model-aquarium-moss/aqrificial-moss.png",
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 4,
		translations: {
			en: {
				name: "Z 10 Model - Aquarium Moss",
				shortDescription: "Artificial moss for decorating driftwood and rocks",
				fullDescription: "Artificial moss is a novelty in the field of aquariums, and its applications are virtually unlimited. Comes with special underwater adhesive for easy attachment to existing decorations.",
			},
		},
	},
	{
		id: "z15-aquarium-plant",
		categoryId: "decorations-plants",
		slug: "z15-model-aquarium-plant",
		sku: "Z15",
		basePriceEurCents: 4900,
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { heightCm: 70 },
			featuredImage: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/z-15-model-aquarium-plant/eucalyptus-aquarium-plant.png",
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 5,
		translations: {
			en: {
				name: "Z 15 Model - Eucalyptus Plant",
				shortDescription: "Ultra-realistic Eucalyptus Aquarium Plant (20cm to 70cm height)",
				fullDescription: "Bring the beauty of nature into your aquarium with our ultra-realistic Eucalyptus Aquarium Plant. Ideal for tanks of all sizes, from nano setups to large display aquariums. The soft, flowing leaves provide a sense of movement and create cozy hiding spots.",
			},
		},
	},
	{
		id: "z19-aquarium-plant",
		categoryId: "decorations-plants",
		slug: "z19-model-aquarium-plant",
		sku: "Z19",
		basePriceEurCents: 4900,
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { heightCm: 30 },
			featuredImage: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/z-19-model-aquarium-plant/cabomba-aquarium-plant.png",
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 6,
		translations: {
			en: {
				name: "Z 19 Model - Cabomba Plant",
				shortDescription: "Artificial Cabomba Aquarium Plant (20-30cm height)",
				fullDescription: "Bring soft texture and rich detail to your aquascape with our Artificial Cabomba Aquarium Plant. Designed to replicate the fine, fan-like leaves of the real Cabomba, this plant adds a gentle, flowing presence to any aquarium.",
			},
		},
	},

	// =========================================================
	// D MODELS - LOGS & ROOTS (Category: decorations-d-models)
	// =========================================================
	{
		id: "d1-standing-roots-base",
		categoryId: "decorations-d-models", // Mapped from driftwood-logs-roots
		slug: "d-1-standing-roots",
		sku: "D1",
		basePriceEurCents: 8900,
		priceNote: "Custom made set - Production takes 10-12 business days",
		specifications: {
			featuredImage: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/d-1-standing-roots.webp",
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: true,
		sortOrder: 7,
		translations: {
			en: {
				name: "D 1 - Standing Roots",
				shortDescription: "Non-floating standing roots for Amazonian setups (Max 70cm)",
				fullDescription: "These non-floating standing roots are an ideal addition to Amazonian-themed aquarium setups. Designed for convenience, they don’t need to be soaked or glued before use. They provide excellent hiding spots for fish. Customizable design and colors.",
			},
		},
	},
	{
		id: "d10-slim-standing-logs-base",
		categoryId: "decorations-d-models", // Mapped from driftwood-logs-roots
		slug: "d-10-slim-standing-logs",
		sku: "D10",
		basePriceEurCents: 8900,
		priceNote: "Custom made set - Production takes 10-12 business days",
		specifications: {
			featuredImage: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/d-10-slim-standing-logs.webp",
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: false,
		sortOrder: 8,
		translations: {
			en: {
				name: "D 10 - Slim Standing Logs (Magnetic)",
				shortDescription: "Silver Birch logs with magnet base for easy, no-silicone install",
				fullDescription: "These non-floating, natural-looking Silver Birch logs come with pre-installed magnets at the base, allowing you to install them effortlessly without the need for silicone. Max height is 70 cm (28″).",
			},
		},
	},
	{
		id: "d50-artificial-vines-base",
		categoryId: "decorations-d-models", // Mapped from driftwood-logs-roots
		slug: "d-50-artificial-vines",
		sku: "D50",
		basePriceEurCents: 8900,
		priceNote: "Custom made set - Production takes 10-12 business days",
		specifications: {
			featuredImage: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/d-50-artificial-vines.webp",
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: true,
		sortOrder: 9,
		translations: {
			en: {
				name: "D 50 - Artificial Vines",
				shortDescription: "Flexible lianas for draping and integrating into hardscape",
				fullDescription: "This is by far the most revolutionary product in our extensive range of aquarium decorations. These flexible lianas open up endless possibilities—you can truly do just about anything with them. They look 100% realistic and can be repainted in any color of your choice.",
			},
		},
	},

	// =========================================================
	// LOOSE ROCKS (Category: decorations-rocks)
	// NOTE: Products are reused D-models, mapping to the 'rocks' category
	// =========================================================
	{
		id: "d5-loose-rocks-model",
		categoryId: "decorations-rocks", // Mapped from loose-aquarium-rocks
		slug: "d-5-model",
		sku: "D5",
		basePriceEurCents: 8900,
		priceNote: "Custom made set - Production takes 10-12 business days",
		specifications: {
			featuredImage: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/d-5-model/d-5-rocks.webp",
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: false,
		sortOrder: 10,
		translations: {
			en: {
				name: "D 5 Model - Sinking Rocks",
				shortDescription: "Ultra realistic sinking rocks, no gluing needed, easy to reposition.",
				fullDescription: "Ultra realistic sinking rocks, no gluing needed. Simple to reposition and adapt while keeping your aquarium natural.",
			},
		},
	},
	{
		id: "d27-loose-rocks-model",
		categoryId: "decorations-rocks", // Mapped from loose-aquarium-rocks
		slug: "d-27-model",
		sku: "D27",
		basePriceEurCents: 8900,
		priceNote: "Custom made set - Production takes 10-12 business days",
		specifications: {
			featuredImage: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/d-27-model/d-27-rocks.webp",
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: true,
		sortOrder: 11,
		translations: {
			en: {
				name: "D 27 Model - Malawi/Tanganyika Rocks",
				shortDescription: "Rounded bottom rocks perfect for cichlid setups, ready to use (no silicone).",
				fullDescription: "Rounded bottom rocks recreate a realistic natural habitat, perfect for Malawi and Tanganyika setups. With built-in hiding spots for cichlids, they promote natural behavior. Non-floating and ready to use without siliconing or rinsing.",
			},
		},
	},
	{
		id: "d48-loose-rocks-model",
		categoryId: "decorations-rocks", // Mapped from loose-aquarium-rocks
		slug: "d-48-model",
		sku: "D48",
		basePriceEurCents: 8900,
		priceNote: "Custom made set - Production takes 10-12 business days",
		specifications: {
			featuredImage: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/d-48-model/d-48-rocks.webp",
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: false,
		sortOrder: 12,
		translations: {
			en: {
				name: "D 48 Model - Cichlid Spawning Rocks",
				shortDescription: "Rocks designed for Malawi/Tanganyika with optional spawning holes.",
				fullDescription: "Create an authentic atmosphere for your Malawi and Tanganyika cichlids with rocks modeled after the original stone formations of these lakes. Available with or without holes, they replicate the natural breeding grounds where cichlids thrive. You can choose whether the holes are visible to the observer or positioned discreetly toward the back glass.",
			},
		},
	},
];