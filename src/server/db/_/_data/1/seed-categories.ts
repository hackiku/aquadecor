// src/server/db/seed/data/seed-categories.ts

export const categoryStructure = [
	// ===== 3D BACKGROUNDS =====
	{
		slug: "classic-rocky-backgrounds",
		productLine: "3d-backgrounds",
		modelCode: "A",
		sortOrder: 10,
		isActive: true,
		contentBlocks: {
			icon: "mountain",
			emoji: "🏔️",
			highlights: [
				{
					title: "Custom Built to Size",
					description: "Made to your exact aquarium dimensions",
					icon: "ruler",
				},
			],
			features: ["Chemical-resistant", "Heat-proof", "Lifetime warranty"],
		},
	},
	{
		slug: "amazonian-tree-trunks",
		productLine: "3d-backgrounds",
		modelCode: "B",
		sortOrder: 20,
		isActive: true,
		contentBlocks: { icon: "trees", emoji: "🌳" },
	},
	{
		slug: "slim-backgrounds",
		productLine: "3d-backgrounds",
		modelCode: "E",
		sortOrder: 30,
		isActive: true,
		contentBlocks: { icon: "panel-top", emoji: "📐" },
	},

	// ===== DECORATIONS =====
	{
		slug: "aquarium-plants",
		productLine: "aquarium-decorations",
		modelCode: "Z",
		sortOrder: 100,
		isActive: true,
		contentBlocks: {
			icon: "leaf",
			emoji: "🌿",
			highlights: [
				{
					title: "100% Indestructible",
					description: "Even cichlids cannot damage them",
					icon: "shield-check",
				},
			],
		},
	},
	{
		slug: "logs-and-driftwood",
		productLine: "aquarium-decorations",
		modelCode: "D",
		sortOrder: 110,
		isActive: true,
		contentBlocks: { icon: "tree-deciduous", emoji: "🪵" },
	},
	{
		slug: "aquarium-rocks",
		productLine: "aquarium-decorations",
		modelCode: "Q",
		sortOrder: 120,
		isActive: true,
		contentBlocks: { icon: "mountain", emoji: "🪨" },
	},
	{
		slug: "starter-sets",
		productLine: "aquarium-decorations",
		modelCode: "SET",
		sortOrder: 200,
		isActive: true,
		contentBlocks: { icon: "package-open", emoji: "📦" },
	},
];