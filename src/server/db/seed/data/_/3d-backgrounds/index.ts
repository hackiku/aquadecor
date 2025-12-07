
// src/server/db/seed/data/productLine/3d-backgrounds/index.ts

import { categories } from './categories';
import { categoryTranslations } from './category-translations';

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
		...p_room_divider_backgrounds
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
		...m_room_divider_backgrounds
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
		...t_room_divider_backgrounds
	}
};
