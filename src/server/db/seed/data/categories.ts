
// src/server/db/seed/data/categories.ts

export const categoryData = [
	// === PRODUCT LINE 1: 3D Backgrounds ===
	{
		id: "3d-backgrounds",
		slug: "3d-backgrounds",
		parentId: null,
		sortOrder: 1,
		translations: {
			en: {
				name: "3D Backgrounds",
				description: "Natural look with our 3D aquarium backgrounds. Handcrafted backgrounds so realistic, even nature takes notes.",
			},
			de: {
				name: "3D-Hintergründe",
				description: "Natürlicher Look mit unseren 3D-Aquarienhintergründen",
			},
		},
	},
	{
		id: "3d-backgrounds-a-models",
		slug: "a-models",
		parentId: "3d-backgrounds",
		sortOrder: 1,
		translations: {
			en: {
				name: "A Models - Classic Rocky Backgrounds",
				description: "Realistic 3D aquarium stone decor (24 products)",
			},
			de: {
				name: "A-Modelle - Klassische Felsenhintergründe",
				description: "Realistische 3D-Aquariumstein-Dekoration",
			},
		},
	},
	{
		id: "3d-backgrounds-slim",
		slug: "slim-models",
		parentId: "3d-backgrounds",
		sortOrder: 2,
		translations: {
			en: {
				name: "A Slim Models - Thin Rocky Backgrounds",
				description: "Realistic 3D slim aquarium stone decor (11 products)",
			},
			de: {
				name: "A Slim-Modelle - Dünne Felsenhintergründe",
				description: "Realistische 3D-schlanke Aquariumstein-Dekoration",
			},
		},
	},
	{
		id: "3d-backgrounds-b-models",
		slug: "b-models",
		parentId: "3d-backgrounds",
		sortOrder: 3,
		translations: {
			en: {
				name: "B Models - Amazonian Tree Trunks",
				description: "Natural Amazon tree underwater habitat (7 products)",
			},
			de: {
				name: "B-Modelle - Amazonas-Baumstämme",
				description: "Natürlicher Amazonas-Baum-Unterwasser-Lebensraum",
			},
		},
	},

	// === PRODUCT LINE 2: Aquarium Decorations ===
	{
		id: "aquarium-decorations",
		slug: "aquarium-decorations",
		parentId: null,
		sortOrder: 2,
		translations: {
			en: {
				name: "Aquarium decorations",
				description: "Natural effect with aquarium decorations",
			},
			de: {
				name: "Aquarium-Dekorationen",
				description: "Natürlicher Effekt mit Aquarium-Dekorationen",
			},
		},
	},
	{
		id: "decorations-plants",
		slug: "aquarium-plants",
		parentId: "aquarium-decorations",
		sortOrder: 1,
		translations: {
			en: {
				name: "Aquarium Plants",
				description: "The material they are made from provides 100% neutrality, a natural look, and an unlimited lifespan. Even if you keep cichlids and fish that naturally feed on plants, they simply cannot be damaged.",
			},
			de: {
				name: "Aquariumpflanzen",
				description: "Realistische Aquariumpflanzen",
			},
		},
	},
	{
		id: "decorations-rocks",
		slug: "aquarium-rocks",
		parentId: "aquarium-decorations",
		sortOrder: 2,
		translations: {
			en: {
				name: "Aquarium Rocks",
				description: "Unique handmade rocks, ready to use (no special prep needed)",
			},
			de: {
				name: "Aquariumsteine",
				description: "Natürliche Felsformationen",
			},
		},
	},
	{
		id: "decorations-d-models",
		slug: "d-models",
		parentId: "aquarium-decorations",
		sortOrder: 3,
		translations: {
			en: {
				name: "D Models - Logs, Leaves, Driftwood, Rocks and Roots",
				description: "Introducing our highly sought-after sets of logs, leaves, roots, and bottom rocks, now part of the A...",
			},
			de: {
				name: "D-Modelle - Stämme, Blätter, Treibholz, Steine und Wurzeln",
				description: "Natürliche Treibholz- und Wurzeldekorationen",
			},
		},
	},
	{
		id: "decorations-h-models",
		slug: "h-models",
		parentId: "aquarium-decorations",
		sortOrder: 4,
		translations: {
			en: {
				name: "H Models – Artificial Reefs",
				description: "About Aquadecor \"H\" Models: Non-floating and ready to use, these backgrounds are designed to provide...",
			},
			de: {
				name: "H-Modelle – Künstliche Riffe",
				description: "Realistische Korallenriffstrukturen",
			},
		},
	},
	{
		id: "decorations-j-models",
		slug: "j-models",
		parentId: "aquarium-decorations",
		sortOrder: 5,
		translations: {
			en: {
				name: "J Models - Protective Rubber Mats for Cichlid Aquariums",
				description: "If you choose to decorate your aquarium with genuine stones and massive rocks, you are probably aware of the risk of glass breakage.",
			},
		},
	},
	{
		id: "decorations-m-models",
		slug: "m-models",
		parentId: "aquarium-decorations",
		sortOrder: 6,
		translations: {
			en: {
				name: "M Models - Magnetic Rocks",
				description: "Create your own unique setup with our newest product—magnetic rocks. These innovative rocks offer unlimited customization possibilities.",
			},
		},
	},
	{
		id: "decorations-s-models",
		slug: "s-models",
		parentId: "aquarium-decorations",
		sortOrder: 7,
		translations: {
			en: {
				name: "S Models - Back Panel Roots",
				description: "Back Panel Roots represent a groundbreaking innovation in aquaristics, designed to effortlessly infuse your aquarium with the essence of nature.",
			},
		},
	},
	{
		id: "decorations-starter-sets",
		slug: "starter-sets",
		parentId: "aquarium-decorations",
		sortOrder: 8,
		translations: {
			en: {
				name: "Starter Sets",
				description: "We proudly present our best-selling aquarium sets, carefully designed to replicate natural environments.",
			},
		},
	},
	{
		id: "decorations-v-models",
		slug: "v-models",
		parentId: "aquarium-decorations",
		sortOrder: 9,
		translations: {
			en: {
				name: "V Models - Centerpiece Decorations",
				description: "Transform your aquarium into a breathtaking underwater world with our Realistic 3D Centerpiece Aquarium Decorations.",
			},
		},
	},
];