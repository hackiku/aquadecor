// src/data/fish-compatibility.ts

export type BackgroundModelType = "A-Model" | "C-Model" | "Wood/Root" | "Slim";

export interface FishProfile {
	species: string;
	idealHabitat: string;
	recommendedModels: BackgroundModelType[];
	notes: string;
}

export const fishCompatibility: FishProfile[] = [
	{
		species: "Frontosa Cichlid (Humphead)",
		idealHabitat: "Deep water, rocky caves, low light, dark environment.",
		recommendedModels: ["A-Model", "C-Model"],
		notes: "Requires massive caves for hiding. 'A' models (Classic Rock) or 'C' models (Massive Rock for 150cm+ tanks) are best.",
	},
	{
		species: "Malawi Cichlids (Mbuna)",
		idealHabitat: "Rocky landscape, hiding spots, algae-rich surfaces.",
		recommendedModels: ["A-Model"],
		notes: "They are 'stone fish' and need crevices to mark territory. Classic rock backgrounds mimic Lake Malawi.",
	},
	{
		species: "Discus & Angelfish",
		idealHabitat: "Amazon basin, tree roots, muddy river banks.",
		recommendedModels: ["Wood/Root"],
		notes: "Requires vertical structures like roots and branches. Hollow-back wood models allow for filtration hiding.",
	},
	{
		species: "Betta Fish",
		idealHabitat: "Shallow water, plants, resting spots.",
		recommendedModels: ["Slim"],
		notes: "Q-models (small rock formations) work well to hide filters in Nano tanks without taking up swim space.",
	},
];