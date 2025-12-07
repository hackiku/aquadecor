// @ts-nocheck

// src/server/db/seed/data/aquarium-decorations/aquarium-plants.ts

import type { Product } from '~/server/db/schema'; // Assume type import is needed for large arrays

export const productData = [
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
	{
		id: "z1-aquarium-plant",
		categoryId: "decorations-plants",
		slug: "z1-aquarium-plant",
		sku: "Z1",
		basePriceEurCents: 4900, // €49
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { widthCm: 4, heightCm: 18, depthCm: 10 }
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: true,
		sortOrder: 1,
		translations: {
			en: {
				name: "Z 1 Model - Aquarium Plant",
				shortDescription: "Realistic 3D aquarium plant decoration (4x10x18cm)",
				fullDescription: "Plastic plants, Carpet grass, and moss are alongside our Cattapa leaves as the latest addition to our offer. The size of the product is approximately 4x10x18cm. You can order plants in a combination set of 3, 6, 10, 15, and 20. The set doesn’t have to be with the same type of plant, you can combine them and make your own. These plants are made from plastic, modeled after existing aquarium plants such as Vallisneria Americana, Anubias Nana, Cabomba Caroliniana, etc. The material they are made from provides 100% neutrality, a natural look, and an unlimited lifespan. Even if you keep cichlids and fish that naturally feed on plants, they simply cannot be damaged.",
			},
		},
	},
	{
		id: "z2-aquarium-plant",
		categoryId: "decorations-plants",
		slug: "z2-model-aquarium-plant",
		sku: "Z2",
		basePriceEurCents: 4900,
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { widthCm: 5, heightCm: 12, depthCm: 4 }
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 2,
		translations: {
			en: {
				name: "Z 2 Model - Aquarium Plant",
				shortDescription: "Realistic 3D aquarium plant decoration (5x4x12cm)",
				fullDescription: "Plastic plants, Carpet grass, and moss are alongside our Cattapa leaves as the latest addition to our offer. The size of the product is 5x4x12cm. You can order plants in a combination set of 3, 6, 10, 15, and 20. The set don’t have to be with the same type of plant, you can combine them and make your own. These plants are made from plastic, modeled after existing aquarium plants such as Vallisneria Americana, Anubias Nana, Cabomba Caroliniana, etc. The material they are made from provides 100% neutrality, a natural look, and an unlimited lifespan. Even if you keep cichlids and fish that naturally feed on plants, they simply cannot be damaged.",
			},
		},
	},
	{
		id: "z4-aquarium-plant",
		categoryId: "decorations-plants",
		slug: "z4-model-aquarium-plant",
		sku: "Z4",
		basePriceEurCents: 4900,
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { widthCm: 3, heightCm: 8, depthCm: 4 }
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 3,
		translations: {
			en: {
				name: "Z 4 Model - Aquarium Plant",
				shortDescription: "Realistic 3D aquarium plant decoration (3x4x8cm)",
				fullDescription: "Plastic plants, Carpet grass, and moss are alongside our Cattapa leaves as the latest addition to our offer. The size of the product is 3x4x8cm. You can order plants in a combination set of 3, 6, 10, 15, and 20. The set don’t have to be with the same type of plant, you can combine them and make your own. These plants are made from plastic, modeled after existing aquarium plants such as Vallisneria Americana, Anubias Nana, Cabomba Caroliniana, etc. The material they are made from provides 100% neutrality, a natural look, and an unlimited lifespan. Even if you keep cichlids and fish that naturally feed on plants, they simply cannot be damaged.",
			},
		},
	},
	{
		id: "z5-aquarium-plant",
		categoryId: "decorations-plants",
		slug: "z5-model-aquarium-plant",
		sku: "Z5",
		basePriceEurCents: 4900,
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { widthCm: 7, heightCm: 10, depthCm: 5 }
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 4,
		translations: {
			en: {
				name: "Z 5 Model - Aquarium Plant",
				shortDescription: "Realistic 3D aquarium plant decoration (7x5x10cm)",
				fullDescription: "Plastic plants, Carpet grass, and moss are alongside our Cattapa leaves as the latest addition to our offer. The size of the product is 7x5x10cm. You can order plants in a combination set of 3, 6, 10, 15, and 20. The set don’t have to be with the same type of plant, you can combine them and make your own. These plants are made from plastic, modeled after existing aquarium plants such as Vallisneria Americana, Anubias Nana, Cabomba Caroliniana, etc. The material they are made from provides 100% neutrality, a natural look, and an unlimited lifespan. Even if you keep cichlids and fish that naturally feed on plants, they simply cannot be damaged.",
			},
		},
	},
	{
		id: "z8-aquarium-plant",
		categoryId: "decorations-plants",
		slug: "z8-model-aquarium-plant",
		sku: "Z8",
		basePriceEurCents: 4900,
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { widthCm: 4, heightCm: 13, depthCm: 4 }
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 5,
		translations: {
			en: {
				name: "Z 8 Model - Aquarium Plant",
				shortDescription: "Realistic 3D aquarium plant decoration (4x4x13cm)",
				fullDescription: "Plastic plants, Carpet grass, and moss are alongside our Cattapa leaves as the latest addition to our offer. The size of the product is 4x4x13cm. You can order plants in a combination set of 3, 5, 10, 15, and 20. The set don t have to be with the sametype of plant, you can combine them and make your own. These plants are made from plastic, modeled after existing aquarium plants such as Vallisneria Americana, Anubias Nana, Cabomba Caroliniana, etc. The material they are made from provides 100% neutrality, a natural look, and an unlimited lifespan. Even if you keep cichlids and fish that naturally feed on plants, they simply cannot be damaged.",
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
			dimensions: { widthCm: 12, heightCm: 10, depthCm: 15 }
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 6,
		translations: {
			en: {
				name: "Z 10 Model - Aquarium Moss",
				shortDescription: "Artificial moss for decorating driftwood and rocks (12x15x10cm)",
				fullDescription: "Artificial moss is a novelty in the field of aquariums, and its applications are virtually unlimited. The size of the product is approximately 12x15x10cm. You can place moss from the bottom all the way to the surface of the aquarium, but its primary purpose has been to decorate and enhance Additional items such as branches, trees, driftwood, etc. Recently, it has become increasingly popular even on backgrounds already present in the aquarium. If you already have any of the mentioned Aquadecor products, you can easily integrate them into established aquarium setups because they come with a special underwater adhesive for easy attachment.",
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
			material: "High-quality, fish-safe materials",
			dimensions: { heightCm: 70 }
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 7,
		translations: {
			en: {
				name: "Z 15 Model - Aquarium Plant",
				shortDescription: "Ultra-realistic Eucalyptus Aquarium Plant (20cm to 70cm height)",
				fullDescription: "Bring the beauty of nature into your aquarium with our ultra-realistic Eucalyptus Aquarium Plant. Carefully crafted to mimic the elegant shape and muted green tones of real eucalyptus leaves, this artificial plant adds a touch of natural sophistication to any aquatic environment, without the need for maintenance. Made from high-quality, fish-safe materials, this plant is perfect for freshwater and saltwater aquariums. Its flexible design allows for easy placement, whether you want to use it as a centerpiece or to soften the edges of your aquascape. Available in heights ranging from 20 cm to 70 cm, it's ideal for tanks of all sizes, from nano setups to large display aquariums. The soft, flowing leaves provide a sense of movement and create cozy hiding spots that your fish will love.",
			},
		},
	},
	{
		id: "z16-aquarium-plant",
		categoryId: "decorations-plants",
		slug: "z16-model-aquarium-plant",
		sku: "Z16",
		basePriceEurCents: 4900,
		priceNote: "In stock - Ready to ship",
		specifications: {
			material: "Durable, non-toxic materials"
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 8,
		translations: {
			en: {
				name: "Z 16 Model - Aquarium Plant",
				shortDescription: "Artificial Bacucine Aquarium Plant (Small size for foreground)",
				fullDescription: "Add a touch of natural beauty to your aquarium with our Artificial Bacucine Aquarium Plant. Small in size but big on detail, this lifelike plant perfectly mimics the look and movement of real aquatic foliage, making it a great choice for nano tanks, shrimp habitats, or as a foreground accent in larger aquariums. Crafted from durable, non-toxic materials that are safe for all fish species, the Bacucine plant offers a maintenance-free solution for aquascaping. Its soft leaves provide gentle shelter for small fish and invertebrates, helping create a more natural and calming environment.",
			},
		},
	},
	{
		id: "z17-aquarium-plant",
		categoryId: "decorations-plants",
		slug: "z17-model-aquarium-plant",
		sku: "Z17",
		basePriceEurCents: 4900,
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { heightCm: 15 },
			material: "High-quality, non-toxic materials"
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 9,
		translations: {
			en: {
				name: "Z 17 Model - Aquarium Plant",
				shortDescription: "Artificial Boston Fern Aquarium Plant (15cm height)",
				fullDescription: "Add a touch of lush greenery to your aquarium with our Artificial Boston Fern Aquarium Plant. With its soft, feathery fronds and realistic detail, this 15 cm plant brings natural charm and gentle movement to any aquatic environment, without the need for trimming or special care. Made from high-quality, non-toxic materials, it's safe for all types of aquariums and aquatic life. The compact size makes it perfect for foreground placement in larger tanks or as a centerpiece in smaller setups. Its full shape also provides ideal shelter for fish and shrimp, creating a more comfortable and natural habitat.",
			},
		},
	},
	{
		id: "z18-aquarium-plant",
		categoryId: "decorations-plants",
		slug: "z18-model-aquarium-plant",
		sku: "Z18",
		basePriceEurCents: 4900,
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { heightCm: 60 },
			material: "Flexible, fish-safe materials"
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 10,
		translations: {
			en: {
				name: "Z 18 Model - Aquarium Plant",
				shortDescription: "Artificial Bamboo Leaves Aquarium Plant (60cm height)",
				fullDescription: "Bring elegance and height to your aquascape with our Artificial Bamboo Leaves Aquarium Plant. Standing tall at 60 cm, this striking plant features slender, flowing leaves inspired by real bamboo, adding a sense of calm, balance, and vertical movement to any aquarium setup. Expertly crafted from flexible, fish-safe materials, the bamboo leaves sway naturally with the water current, creating a peaceful and dynamic effect. Ideal for background placement, this tall plant offers excellent coverage, making it perfect for larger tanks or for creating a sense of depth in your layout.",
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
			material: "High-quality, fish-safe materials"
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 11,
		translations: {
			en: {
				name: "Z 19 Model - Aquarium Plant",
				shortDescription: "Artificial Cabomba Aquarium Plant (20-30cm height)",
				fullDescription: "Bring soft texture and rich detail to your aquascape with our Artificial Cabomba Aquarium Plant. Designed to replicate the fine, fan-like leaves of the real Cabomba, this plant adds a gentle, flowing presence to any aquarium, perfect for creating a natural underwater atmosphere without the upkeep. With a height of 20–30 cm, it works beautifully as a midground plant in larger tanks or as a focal point in smaller aquariums. The delicate leaves provide shelter for small fish and shrimp while swaying naturally with the current. Made from high-quality, fish-safe materials, it’s ideal for both freshwater and saltwater setups.",
			},
		},
	},
	{
		id: "z20-aquarium-plant",
		categoryId: "decorations-plants",
		slug: "z20-model-aquarium-plant",
		sku: "Z20",
		basePriceEurCents: 4900,
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { heightCm: 20 },
			material: "Premium, non-toxic materials"
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 12,
		translations: {
			en: {
				name: "Z 20 Model - Aquarium Plant",
				shortDescription: "Artificial Fern Bush Aquarium Plant (20cm height)",
				fullDescription: "Add lush greenery and rich texture to your aquarium with our Artificial Fern Bush Aquarium Plant. This compact yet full-bodied plant is designed to mimic the natural spread and fine detail of real aquatic ferns, creating a vibrant and realistic focal point in your tank. At 20 cm in height, it’s perfect for midground placement or for adding volume to the corners of smaller aquariums. The dense fronds offer shelter and hiding spaces for fish and shrimp, while the lifelike movement brings a sense of energy and natural flow to your aquascape. Made from premium, non-toxic materials, the Fern Bush is safe for all fish and requires no trimming, CO₂, or lighting—just place it and enjoy.",
			},
		},
	},
	{
		id: "z21-aquarium-plant",
		categoryId: "decorations-plants",
		slug: "z21-model-aquarium-plant",
		sku: "Z21",
		basePriceEurCents: 4900,
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { heightCm: 20 },
			material: "High-quality, fish-safe materials"
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 13,
		translations: {
			en: {
				name: "Z 21 Model - Aquarium Plant",
				shortDescription: "Artificial Ludwigia Aquarium Plant (20cm height)",
				fullDescription: "Add a splash of vibrant color and natural texture to your aquarium with our Artificial Ludwigia Aquarium Plant. Known for its signature leaf shape and warm tones, this 20 cm plant brings visual interest and contrast to any aquascape, without the demands of live plant care. Crafted from high-quality, fish-safe materials, the Ludwigia plant is ideal for freshwater and saltwater setups. Its detailed leaves and rich color create a realistic appearance, while offering hiding spaces and comfort for your aquatic pets. With a compact 20 cm height, it’s perfect for midground placement or as a colorful accent in both small and large tanks.",
			},
		},
	},
];