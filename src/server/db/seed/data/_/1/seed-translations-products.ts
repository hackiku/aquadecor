// src/server/db/seed/data/translations/seed-translations-products.ts
// UPDATED with specOverrides examples

export const productTranslations = {
	// ===== 3D BACKGROUNDS =====
	"a-1-stone-riverbed-background": {
		en: {
			name: "A 1 - Stone Riverbed Background",
			shortDescription: "Custom-made 3D aquarium background with natural riverbed stone formations. Built to your exact tank dimensions.",
			fullDescription: "The A 1 Stone Riverbed Background brings the beauty of a natural riverbed into your aquarium. Each background is custom-made to your exact tank dimensions, featuring realistic stone formations with natural texture and depth. Made from chemical-resistant resin that's safe for all fish species. Production time: 10-12 business days.",
			specOverrides: {
				productionTime: "10-12 business days",
				material: "High-quality resin with natural stone appearance",
			},
		},
		de: {
			name: "A 1 - Steinfluss-Hintergrund",
			shortDescription: "Maßgefertigter 3D-Aquarienhintergrund mit natürlichen Steinflussbett-Formationen.",
			fullDescription: "Der A 1 Steinfluss-Hintergrund bringt die Schönheit eines natürlichen Flussbetts in Ihr Aquarium. Jeder Hintergrund wird nach Ihren genauen Tankmaßen gefertigt. Produktionszeit: 10-12 Werktage.",
			specOverrides: {
				productionTime: "10-12 Werktage",
				material: "Hochwertiges Harz mit natürlichem Steinaussehen",
			},
		},
	},
	"a-2-classic-rocky-background": {
		en: {
			name: "A 2 - Classic Rocky Background",
			shortDescription: "Timeless rocky aquarium background with deep crevices. Custom-made to fit your tank perfectly.",
			fullDescription: "The A 2 Classic Rocky Background is our most popular 3D background design. Features deep crevices, natural stone texture, and realistic shadows. Starting from €199 depending on size.",
			specOverrides: {
				productionTime: "10-12 business days",
				material: "High-quality resin",
			},
		},
		de: {
			name: "A 2 - Klassischer Felsen-Hintergrund",
			shortDescription: "Zeitloser felsiger Aquarienhintergrund mit tiefen Spalten.",
			fullDescription: "Der A 2 Klassische Felsen-Hintergrund ist unser beliebtestes Design. Mit tiefen Spalten und natürlicher Steintextur. Ab €199 je nach Größe.",
			specOverrides: {
				productionTime: "10-12 Werktage",
				material: "Hochwertiges Harz",
			},
		},
	},
	"b-4-wide-amazonian-trunk": {
		en: {
			name: "B 4 - Wide Amazonian Trunk",
			shortDescription: "Massive Amazon tree trunk background perfect for large cichlid and discus tanks.",
			fullDescription: "The B 4 Wide Amazonian Trunk recreates fallen Amazon rainforest trees. Perfect for large South American cichlid setups and discus tanks. Production time: 10-12 business days.",
			specOverrides: {
				productionTime: "10-12 business days",
				material: "Amazonian wood texture resin",
			},
		},
		de: {
			name: "B 4 - Breiter Amazonas-Stamm",
			shortDescription: "Massiver Amazonas-Baumstamm-Hintergrund perfekt für große Buntbarsch-Becken.",
			fullDescription: "Der B 4 Breite Amazonas-Stamm schafft die Präsenz gefallener Amazonas-Bäume nach. Produktionszeit: 10-12 Werktage.",
			specOverrides: {
				productionTime: "10-12 Werktage",
				material: "Amazonas-Holztextur Harz",
			},
		},
	},

	// ===== PLANTS =====
	"z-1-aquarium-plant": {
		en: {
			// name: "Z 1 - Artificial Aquarium Plant",
			name: "Artificial Aquarium Plant",
			shortDescription: "Ultra-realistic artificial plant. 100% indestructible by cichlids, no maintenance required.",
			fullDescription: "The Z 1 Artificial Aquarium Plant provides the beauty of live plants without any maintenance. Even aggressive cichlids cannot damage these plants. Dimensions: 18cm height. In stock and ready to ship.",
			specOverrides: {
				material: "Non-toxic, fish-safe synthetic",
			},
		},
		de: {
			name: "Z 1 - Künstliche Aquariumpflanze",
			shortDescription: "Ultrarealistische künstliche Pflanze. 100% unzerstörbar, keine Wartung erforderlich.",
			fullDescription: "Die Z 1 Künstliche Aquariumpflanze bietet die Schönheit echter Pflanzen ohne Wartung. Maße: 18cm Höhe. Sofort lieferbar.",
			specOverrides: {
				material: "Ungiftig, fischsicher synthetisch",
			},
		},
		us: {
			name: "Z 1 - Artificial Aquarium Plant",
			shortDescription: "Premium European artificial plant. Limited US availability - contact us for current stock.",
			fullDescription: "The Z 1 Artificial Plant is handcrafted in our European workshop. Due to current import regulations, US availability is limited. Contact us to check stock and get an accurate shipping quote.",
			specOverrides: {
				material: "Non-toxic, fish-safe synthetic",
			},
		},
	},
	"z-17-boston-fern-plant": {
		en: {
			// name: "Z 17 - Boston Fern Plant",
			name: "Boston Fern Plant",
			shortDescription: "Lush Boston fern replica. Indestructible by fish, creates perfect hiding spots.",
			fullDescription: "The Z 17 Boston Fern brings dense, lush appearance to your aquarium. Perfect for creating hiding spots. Height: 15cm. In stock and ready to ship worldwide.",
			specOverrides: {
				material: "Ultra-realistic synthetic",
				plantType: "Fern",
			},
		},
		de: {
			name: "Z 17 - Bostonfarn Pflanze",
			shortDescription: "Üppige Bostonfarn-Nachbildung. Unzerstörbar, schafft perfekte Verstecke.",
			fullDescription: "Der Z 17 Bostonfarn bringt üppiges Aussehen in Ihr Aquarium. Höhe: 15cm. Sofort lieferbar weltweit.",
			specOverrides: {
				material: "Ultrarealistisch synthetisch",
				plantType: "Farn",
			},
		},
		us: {
			name: "Z 17 - Boston Fern Plant",
			shortDescription: "Premium European fern - Available for US shipping! Get yours while supplies last.",
			fullDescription: "Good news for US customers - the Z 17 Boston Fern is available for direct US shipping! Handcrafted in Europe with 20 years of trusted quality. Order now while supplies last.",
			specOverrides: {
				material: "Ultra-realistic synthetic",
				plantType: "Fern",
			},
		},
	},

	// ===== LOGS & DRIFTWOOD =====
	"d-1-amazonian-standing-roots": {
		en: {
			name: "D 1 - Amazonian Standing Roots",
			shortDescription: "Custom-made set of standing Amazon roots. Non-floating, perfect for cichlid tanks.",
			fullDescription: "The D 1 Amazonian Standing Roots Set recreates tangled root systems along Amazon riverbanks. Custom-made to order with customizable colors. Non-floating, no soaking required. Production time: 10-12 business days.",
			specOverrides: {
				material: "Non-floating resin composite",
				woodType: "Amazonian Roots",
				productionTime: "10-12 business days",
			},
		},
		de: {
			name: "D 1 - Amazonas-Stehwurzeln",
			shortDescription: "Maßgefertigtes Set stehender Amazonas-Wurzeln. Nicht schwimmend.",
			fullDescription: "Das D 1 Amazonas-Stehwurzeln Set bildet Wurzelsysteme nach. Maßgefertigt mit anpassbaren Farben. Produktionszeit: 10-12 Werktage.",
			specOverrides: {
				material: "Nicht schwimmend Harzverbundstoff",
				woodType: "Amazonas-Wurzeln",
				productionTime: "10-12 Werktage",
			},
		},
	},
	"d-7-bamboo-standing-logs": {
		en: {
			name: "D 7 - Bamboo Standing Logs",
			shortDescription: "Asian-inspired bamboo logs. Custom-made, non-floating, perfect for Asian biotopes.",
			fullDescription: "The D 7 Bamboo Standing Logs bring Asian aesthetic to your aquarium. Custom-made with realistic bamboo texture. Production time: 10-12 business days.",
			specOverrides: {
				material: "Bamboo appearance resin",
				woodType: "Bamboo",
				productionTime: "10-12 business days",
			},
		},
		de: {
			name: "D 7 - Bambus-Stehstämme",
			shortDescription: "Asiatisch inspirierte Bambusstämme. Maßgefertigt, nicht schwimmend.",
			fullDescription: "Die D 7 Bambus-Stehstämme bringen asiatische Ästhetik in Ihr Aquarium. Produktionszeit: 10-12 Werktage.",
			specOverrides: {
				material: "Bambusaussehen Harz",
				woodType: "Bambus",
				productionTime: "10-12 Werktage",
			},
		},
	},
	"d-10-slim-standing-logs": {
		en: {
			name: "D 10 - Slim Standing Logs",
			shortDescription: "Elegant silver birch logs with magnetic bases for easy positioning.",
			fullDescription: "The D 10 Slim Standing Logs feature silver birch appearance with magnetic bases for secure positioning. Perfect for modern aquascapes. Production time: 10-12 business days.",
			specOverrides: {
				material: "Silver birch with magnetic base",
				woodType: "Silver Birch",
				productionTime: "10-12 business days",
			},
		},
		de: {
			name: "D 10 - Schlanke Stehstämme",
			shortDescription: "Elegante Silberbirken-Stämme mit magnetischen Basen.",
			fullDescription: "Die D 10 Schlanke Stehstämme verfügen über Silberbirken-Aussehen mit magnetischen Basen. Produktionszeit: 10-12 Werktage.",
			specOverrides: {
				material: "Silberbirke mit magnetischem Sockel",
				woodType: "Silberbirke",
				productionTime: "10-12 Werktage",
			},
		},
	},

	// ===== ROCKS =====
	"d-27-tanganyika-rocks": {
		en: {
			name: "D 27 - Tanganyika Lake Rocks",
			shortDescription: "Custom rock set perfect for African cichlid tanks. Features hiding caves and spawning spots.",
			fullDescription: "The D 27 Tanganyika Lake Rocks recreate rocky biotopes of Lake Tanganyika and Lake Malawi. Features rounded bottoms and natural hiding caves. Production time: 10-12 business days.",
			specOverrides: {
				material: "Rounded bottom rocks with hiding spots",
				rockFormation: "Tanganyika Style",
				productionTime: "10-12 business days",
			},
		},
		de: {
			name: "D 27 - Tanganjikasee-Steine",
			shortDescription: "Maßgefertigtes Steinset perfekt für Afrikanische Buntbarsch-Becken.",
			fullDescription: "Das D 27 Tanganjikasee-Steine Set bildet felsige Biotope nach. Mit abgerundeten Böden und Versteckhöhlen. Produktionszeit: 10-12 Werktage.",
			specOverrides: {
				material: "Abgerundete Bodensteine mit Verstecken",
				rockFormation: "Tanganjika-Stil",
				productionTime: "10-12 Werktage",
			},
		},
	},

	// ===== STARTER SETS =====
	"set-2-rocks-hollow-log": {
		en: {
			name: "Starter Set 2 - Rocks & Hollow Log",
			shortDescription: "Complete aquascaping set: 5 bottom rocks + 1 hollow log. Perfect for South American tanks.",
			fullDescription: "Starter Set 2 provides everything for a natural Amazon-style aquascape. Includes 5 non-floating rocks and 1 hollow log. Custom colors available. Production time: 10-12 business days.",
			specOverrides: {
				material: "Non-floating resin composite",
				productionTime: "10-12 business days",
			},
		},
		de: {
			name: "Starter Set 2 - Steine & Hohler Stamm",
			shortDescription: "Komplettes Set: 5 Bodensteine + 1 hohler Stamm. Perfekt für Südamerika-Becken.",
			fullDescription: "Starter Set 2 bietet alles für ein Amazonas-Aquascape. Enthält 5 Bodensteine und 1 hohlen Stamm. Produktionszeit: 10-12 Werktage.",
			specOverrides: {
				material: "Nicht schwimmend Harzverbundstoff",
				productionTime: "10-12 Werktage",
			},
		},
	},
};