// src/server/db/seed/data/productLines/aquarium-decorations/index.ts

import { categories } from './categories';
import { categoryTranslations } from './category-translations';

// Products
import { products as p_magical_items } from './magical-items/products';
import { products as p_magnetic_rocks } from './magnetic-rocks/products';
import { products as p_aquarium_plants } from './aquarium-plants/products';
import { products as p_centerpiece_decorations } from './centerpiece-decorations/products';
import { products as p_aquarium_rocks } from './aquarium-rocks/products';
import { products as p_aquascaping_starter_sets } from './aquascaping-starter-sets/products';
import { products as p_protective_rubber_mats } from './protective-rubber-mats/products';
import { products as p_logs_leaves_driftwood_rocks } from './logs-leaves-driftwood-rocks/products';
import { products as p_back_panel_roots } from './back-panel-roots/products';
import { products as p_artificial_reefs } from './artificial-reefs/products';

// Pricing
import { pricing as pr_magical_items, bundles as b_magical_items, addons as a_magical_items, customizationOptions as co_magical_items, selectOptions as so_magical_items, marketExclusions as me_magical_items } from './magical-items/pricing';
import { pricing as pr_magnetic_rocks, bundles as b_magnetic_rocks, addons as a_magnetic_rocks, marketExclusions as me_magnetic_rocks } from './magnetic-rocks/pricing';
import { pricing as pr_aquarium_plants, bundles as b_aquarium_plants, addons as a_aquarium_plants, marketExclusions as me_aquarium_plants } from './aquarium-plants/pricing';
import { pricing as pr_centerpiece_decorations, bundles as b_centerpiece_decorations, addons as a_centerpiece_decorations, marketExclusions as me_centerpiece_decorations } from './centerpiece-decorations/pricing';
import { pricing as pr_aquarium_rocks, bundles as b_aquarium_rocks, addons as a_aquarium_rocks, marketExclusions as me_aquarium_rocks } from './aquarium-rocks/pricing';
import { pricing as pr_aquascaping_starter_sets, bundles as b_aquascaping_starter_sets, addons as a_aquascaping_starter_sets, marketExclusions as me_aquascaping_starter_sets } from './aquascaping-starter-sets/pricing';
import { pricing as pr_protective_rubber_mats, bundles as b_protective_rubber_mats, addons as a_protective_rubber_mats, marketExclusions as me_protective_rubber_mats } from './protective-rubber-mats/pricing';
import { pricing as pr_logs_leaves_driftwood_rocks, bundles as b_logs_leaves_driftwood_rocks, addons as a_logs_leaves_driftwood_rocks, marketExclusions as me_logs_leaves_driftwood_rocks } from './logs-leaves-driftwood-rocks/pricing';
import { pricing as pr_back_panel_roots, bundles as b_back_panel_roots, addons as a_back_panel_roots, marketExclusions as me_back_panel_roots } from './back-panel-roots/pricing';
import { pricing as pr_artificial_reefs, bundles as b_artificial_reefs, addons as a_artificial_reefs, marketExclusions as me_artificial_reefs } from './artificial-reefs/pricing';

// Media
import { media as m_magical_items } from './magical-items/media';
import { media as m_magnetic_rocks } from './magnetic-rocks/media';
import { media as m_aquarium_plants } from './aquarium-plants/media';
import { media as m_centerpiece_decorations } from './centerpiece-decorations/media';
import { media as m_aquarium_rocks } from './aquarium-rocks/media';
import { media as m_aquascaping_starter_sets } from './aquascaping-starter-sets/media';
import { media as m_protective_rubber_mats } from './protective-rubber-mats/media';
import { media as m_logs_leaves_driftwood_rocks } from './logs-leaves-driftwood-rocks/media';
import { media as m_back_panel_roots } from './back-panel-roots/media';
import { media as m_artificial_reefs } from './artificial-reefs/media';

// Translations
import { translations as t_magical_items } from './magical-items/translations';
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
		...p_magical_items,
		...p_magnetic_rocks,
		...p_aquarium_plants,
		...p_centerpiece_decorations,
		...p_aquarium_rocks,
		...p_aquascaping_starter_sets,
		...p_protective_rubber_mats,
		...p_logs_leaves_driftwood_rocks,
		...p_back_panel_roots,
		...p_artificial_reefs,
	],

	pricing: [
		...pr_magical_items,
		...pr_magnetic_rocks,
		...pr_aquarium_plants,
		...pr_centerpiece_decorations,
		...pr_aquarium_rocks,
		...pr_aquascaping_starter_sets,
		...pr_protective_rubber_mats,
		...pr_logs_leaves_driftwood_rocks,
		...pr_back_panel_roots,
		...pr_artificial_reefs,
	],

	bundles: [
		...b_magical_items,
		...b_magnetic_rocks,
		...b_aquarium_plants,
		...b_centerpiece_decorations,
		...b_aquarium_rocks,
		...b_aquascaping_starter_sets,
		...b_protective_rubber_mats,
		...b_logs_leaves_driftwood_rocks,
		...b_back_panel_roots,
		...b_artificial_reefs,
	],

	addons: [
		...a_magical_items,
		...a_magnetic_rocks,
		...a_aquarium_plants,
		...a_centerpiece_decorations,
		...a_aquarium_rocks,
		...a_aquascaping_starter_sets,
		...a_protective_rubber_mats,
		...a_logs_leaves_driftwood_rocks,
		...a_back_panel_roots,
		...a_artificial_reefs,
	],

	customizationOptions: [
		...co_magical_items,
		// Other categories don't have customization options yet
	],

	selectOptions: [
		...so_magical_items,
		// Other categories don't have select options yet
	],

	marketExclusions: [
		...me_magical_items,
		...me_magnetic_rocks,
		...me_aquarium_plants,
		...me_centerpiece_decorations,
		...me_aquarium_rocks,
		...me_aquascaping_starter_sets,
		...me_protective_rubber_mats,
		...me_logs_leaves_driftwood_rocks,
		...me_back_panel_roots,
		...me_artificial_reefs,
	],

	media: [
		...m_magical_items,
		...m_magnetic_rocks,
		...m_aquarium_plants,
		...m_centerpiece_decorations,
		...m_aquarium_rocks,
		...m_aquascaping_starter_sets,
		...m_protective_rubber_mats,
		...m_logs_leaves_driftwood_rocks,
		...m_back_panel_roots,
		...m_artificial_reefs,
	],

	translations: {
		...t_magical_items,
		...t_magnetic_rocks,
		...t_aquarium_plants,
		...t_centerpiece_decorations,
		...t_aquarium_rocks,
		...t_aquascaping_starter_sets,
		...t_protective_rubber_mats,
		...t_logs_leaves_driftwood_rocks,
		...t_back_panel_roots,
		...t_artificial_reefs,
	},
};