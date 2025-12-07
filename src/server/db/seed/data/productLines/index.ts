
// src/server/db/seed/data/productLine/index.ts

import { productLine as pl_3d_backgrounds } from './3d-backgrounds';
import { productLine as pl_aquarium_decorations } from './aquarium-decorations';

export const seedData = {
	categories: [
		...pl_3d_backgrounds.categories,
		...pl_aquarium_decorations.categories
	],
	categoryTranslations: {
		...pl_3d_backgrounds.categoryTranslations,
		...pl_aquarium_decorations.categoryTranslations
	},
	products: [
		...pl_3d_backgrounds.products,
		...pl_aquarium_decorations.products
	],
	media: [
		...pl_3d_backgrounds.media,
		...pl_aquarium_decorations.media
	],
	productTranslations: {
		...pl_3d_backgrounds.translations,
		...pl_aquarium_decorations.translations
	}
};
