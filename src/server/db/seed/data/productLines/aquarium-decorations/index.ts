
// src/server/db/seed/data/productLine/aquarium-decorations/index.ts

import { categories } from './categories';
import { categoryTranslations } from './category-translations';

import { products as p_magical_items } from './magical-items/products'; // testing
import { products as p_magnetic_rocks } from './magnetic-rocks/products';
import { products as p_aquarium_plants } from './aquarium-plants/products';
import { products as p_centerpiece_decorations } from './centerpiece-decorations/products';
import { products as p_aquarium_rocks } from './aquarium-rocks/products';
import { products as p_aquascaping_starter_sets } from './aquascaping-starter-sets/products';
import { products as p_protective_rubber_mats } from './protective-rubber-mats/products';
import { products as p_logs_leaves_driftwood_rocks } from './logs-leaves-driftwood-rocks/products';
import { products as p_back_panel_roots } from './back-panel-roots/products';
import { products as p_artificial_reefs } from './artificial-reefs/products';
import { media as m_magical_items } from './magical-items/media'; // test
import { media as m_magnetic_rocks } from './magnetic-rocks/media';
import { media as m_aquarium_plants } from './aquarium-plants/media';
import { media as m_centerpiece_decorations } from './centerpiece-decorations/media';
import { media as m_aquarium_rocks } from './aquarium-rocks/media';
import { media as m_aquascaping_starter_sets } from './aquascaping-starter-sets/media';
import { media as m_protective_rubber_mats } from './protective-rubber-mats/media';
import { media as m_logs_leaves_driftwood_rocks } from './logs-leaves-driftwood-rocks/media';
import { media as m_back_panel_roots } from './back-panel-roots/media';
import { media as m_artificial_reefs } from './artificial-reefs/media';
import { translations as t_magical_items } from './magical-items/translations'; // test
import { translations as t_magnetic_rocks } from './magnetic-rocks/translations';
import { translations as t_aquarium_plants } from './aquarium-plants/translations';
import { translations as t_centerpiece_decorations } from './centerpiece-decorations/translations';
import { translations as t_aquarium_rocks } from './aquarium-rocks/translations';
import { translations as t_aquascaping_starter_sets } from './aquascaping-starter-sets/translations';
import { translations as t_protective_rubber_mats } from './protective-rubber-mats/translations';
import { translations as t_logs_leaves_driftwood_rocks } from './logs-leaves-driftwood-rocks/translations';
import { translations as t_back_panel_roots } from './back-panel-roots/translations';
import { translations as t_artificial_reefs } from './artificial-reefs/translations';

export const productLine = {
	categories,
	categoryTranslations,
	products: [
		...p_magical_items, // test
		...p_magnetic_rocks,
		...p_aquarium_plants,
		...p_centerpiece_decorations,
		...p_aquarium_rocks,
		...p_aquascaping_starter_sets,
		...p_protective_rubber_mats,
		...p_logs_leaves_driftwood_rocks,
		...p_back_panel_roots,
		...p_artificial_reefs
	],
	media: [
		...m_magical_items, // test
		...m_magnetic_rocks,
		...m_aquarium_plants,
		...m_centerpiece_decorations,
		...m_aquarium_rocks,
		...m_aquascaping_starter_sets,
		...m_protective_rubber_mats,
		...m_logs_leaves_driftwood_rocks,
		...m_back_panel_roots,
		...m_artificial_reefs
	],
	translations: {
		...t_magical_items, // test
		...t_magnetic_rocks,
		...t_aquarium_plants,
		...t_centerpiece_decorations,
		...t_aquarium_rocks,
		...t_aquascaping_starter_sets,
		...t_protective_rubber_mats,
		...t_logs_leaves_driftwood_rocks,
		...t_back_panel_roots,
		...t_artificial_reefs
	}
};
