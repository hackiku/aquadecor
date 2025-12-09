// src/server/db/seed/data/productLines/3d-backgrounds/index.ts

import { categories } from './categories';
import { categoryTranslations } from './category-translations';

// Products
import { products as p_slim_amazonian_backgrounds } from './slim-amazonian-backgrounds/products';
import { products as p_massive_rocky_backgrounds } from './massive-rocky-backgrounds/products';
import { products as p_juwel_aquarium_backgrounds } from './juwel-aquarium-backgrounds/products';
import { products as p_saltwater_marine_backgrounds } from './saltwater-marine-backgrounds/products';
import { products as p_classic_rocky_backgrounds } from './classic-rocky-backgrounds/products';
import { products as p_massive_slim_backgrounds } from './massive-slim-backgrounds/products';
import { products as p_slim_stone_backgrounds } from './slim-stone-backgrounds/products';
import { products as p_amazonian_tree_trunks } from './amazonian-tree-trunks/products';
import { products as p_slim_rocky_backgrounds } from './slim-rocky-backgrounds/products';
import { products as p_room_divider_backgrounds } from './room-divider-backgrounds/products';

// Pricing
import { pricing as pr_slim_amazonian_backgrounds, bundles as b_slim_amazonian_backgrounds, addons as a_slim_amazonian_backgrounds, marketExclusions as me_slim_amazonian_backgrounds } from './slim-amazonian-backgrounds/pricing';
import { pricing as pr_massive_rocky_backgrounds, bundles as b_massive_rocky_backgrounds, addons as a_massive_rocky_backgrounds, marketExclusions as me_massive_rocky_backgrounds } from './massive-rocky-backgrounds/pricing';
import { pricing as pr_juwel_aquarium_backgrounds, bundles as b_juwel_aquarium_backgrounds, addons as a_juwel_aquarium_backgrounds, marketExclusions as me_juwel_aquarium_backgrounds } from './juwel-aquarium-backgrounds/pricing';
import { pricing as pr_saltwater_marine_backgrounds, bundles as b_saltwater_marine_backgrounds, addons as a_saltwater_marine_backgrounds, marketExclusions as me_saltwater_marine_backgrounds } from './saltwater-marine-backgrounds/pricing';
import { pricing as pr_classic_rocky_backgrounds, bundles as b_classic_rocky_backgrounds, addons as a_classic_rocky_backgrounds, marketExclusions as me_classic_rocky_backgrounds } from './classic-rocky-backgrounds/pricing';
import { pricing as pr_massive_slim_backgrounds, bundles as b_massive_slim_backgrounds, addons as a_massive_slim_backgrounds, marketExclusions as me_massive_slim_backgrounds } from './massive-slim-backgrounds/pricing';
import { pricing as pr_slim_stone_backgrounds, bundles as b_slim_stone_backgrounds, addons as a_slim_stone_backgrounds, marketExclusions as me_slim_stone_backgrounds } from './slim-stone-backgrounds/pricing';
import { pricing as pr_amazonian_tree_trunks, bundles as b_amazonian_tree_trunks, addons as a_amazonian_tree_trunks, marketExclusions as me_amazonian_tree_trunks } from './amazonian-tree-trunks/pricing';
import { pricing as pr_slim_rocky_backgrounds, bundles as b_slim_rocky_backgrounds, addons as a_slim_rocky_backgrounds, marketExclusions as me_slim_rocky_backgrounds } from './slim-rocky-backgrounds/pricing';
import { pricing as pr_room_divider_backgrounds, bundles as b_room_divider_backgrounds, addons as a_room_divider_backgrounds, marketExclusions as me_room_divider_backgrounds } from './room-divider-backgrounds/pricing';

// Media
import { media as m_slim_amazonian_backgrounds } from './slim-amazonian-backgrounds/media';
import { media as m_massive_rocky_backgrounds } from './massive-rocky-backgrounds/media';
import { media as m_juwel_aquarium_backgrounds } from './juwel-aquarium-backgrounds/media';
import { media as m_saltwater_marine_backgrounds } from './saltwater-marine-backgrounds/media';
import { media as m_classic_rocky_backgrounds } from './classic-rocky-backgrounds/media';
import { media as m_massive_slim_backgrounds } from './massive-slim-backgrounds/media';
import { media as m_slim_stone_backgrounds } from './slim-stone-backgrounds/media';
import { media as m_amazonian_tree_trunks } from './amazonian-tree-trunks/media';
import { media as m_slim_rocky_backgrounds } from './slim-rocky-backgrounds/media';
import { media as m_room_divider_backgrounds } from './room-divider-backgrounds/media';

// Translations
import { translations as t_slim_amazonian_backgrounds } from './slim-amazonian-backgrounds/translations';
import { translations as t_massive_rocky_backgrounds } from './massive-rocky-backgrounds/translations';
import { translations as t_juwel_aquarium_backgrounds } from './juwel-aquarium-backgrounds/translations';
import { translations as t_saltwater_marine_backgrounds } from './saltwater-marine-backgrounds/translations';
import { translations as t_classic_rocky_backgrounds } from './classic-rocky-backgrounds/translations';
import { translations as t_massive_slim_backgrounds } from './massive-slim-backgrounds/translations';
import { translations as t_slim_stone_backgrounds } from './slim-stone-backgrounds/translations';
import { translations as t_amazonian_tree_trunks } from './amazonian-tree-trunks/translations';
import { translations as t_slim_rocky_backgrounds } from './slim-rocky-backgrounds/translations';
import { translations as t_room_divider_backgrounds } from './room-divider-backgrounds/translations';

export const productLine = {
	categories,
	categoryTranslations,

	products: [
		...p_slim_amazonian_backgrounds,
		...p_massive_rocky_backgrounds,
		...p_juwel_aquarium_backgrounds,
		...p_saltwater_marine_backgrounds,
		...p_classic_rocky_backgrounds,
		...p_massive_slim_backgrounds,
		...p_slim_stone_backgrounds,
		...p_amazonian_tree_trunks,
		...p_slim_rocky_backgrounds,
		...p_room_divider_backgrounds,
	],

	pricing: [
		...pr_slim_amazonian_backgrounds,
		...pr_massive_rocky_backgrounds,
		...pr_juwel_aquarium_backgrounds,
		...pr_saltwater_marine_backgrounds,
		...pr_classic_rocky_backgrounds,
		...pr_massive_slim_backgrounds,
		...pr_slim_stone_backgrounds,
		...pr_amazonian_tree_trunks,
		...pr_slim_rocky_backgrounds,
		...pr_room_divider_backgrounds,
	],

	bundles: [
		...b_slim_amazonian_backgrounds,
		...b_massive_rocky_backgrounds,
		...b_juwel_aquarium_backgrounds,
		...b_saltwater_marine_backgrounds,
		...b_classic_rocky_backgrounds,
		...b_massive_slim_backgrounds,
		...b_slim_stone_backgrounds,
		...b_amazonian_tree_trunks,
		...b_slim_rocky_backgrounds,
		...b_room_divider_backgrounds,
	],

	addons: [
		...a_slim_amazonian_backgrounds,
		...a_massive_rocky_backgrounds,
		...a_juwel_aquarium_backgrounds,
		...a_saltwater_marine_backgrounds,
		...a_classic_rocky_backgrounds,
		...a_massive_slim_backgrounds,
		...a_slim_stone_backgrounds,
		...a_amazonian_tree_trunks,
		...a_slim_rocky_backgrounds,
		...a_room_divider_backgrounds,
	],

	marketExclusions: [
		...me_slim_amazonian_backgrounds,
		...me_massive_rocky_backgrounds,
		...me_juwel_aquarium_backgrounds,
		...me_saltwater_marine_backgrounds,
		...me_classic_rocky_backgrounds,
		...me_massive_slim_backgrounds,
		...me_slim_stone_backgrounds,
		...me_amazonian_tree_trunks,
		...me_slim_rocky_backgrounds,
		...me_room_divider_backgrounds,
	],

	media: [
		...m_slim_amazonian_backgrounds,
		...m_massive_rocky_backgrounds,
		...m_juwel_aquarium_backgrounds,
		...m_saltwater_marine_backgrounds,
		...m_classic_rocky_backgrounds,
		...m_massive_slim_backgrounds,
		...m_slim_stone_backgrounds,
		...m_amazonian_tree_trunks,
		...m_slim_rocky_backgrounds,
		...m_room_divider_backgrounds,
	],

	translations: {
		...t_slim_amazonian_backgrounds,
		...t_massive_rocky_backgrounds,
		...t_juwel_aquarium_backgrounds,
		...t_saltwater_marine_backgrounds,
		...t_classic_rocky_backgrounds,
		...t_massive_slim_backgrounds,
		...t_slim_stone_backgrounds,
		...t_amazonian_tree_trunks,
		...t_slim_rocky_backgrounds,
		...t_room_divider_backgrounds,
	},
};