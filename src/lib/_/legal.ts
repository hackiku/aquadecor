// src/lib/i18n/legal.ts

export type LegalDictionary = typeof legalTranslations.us;

export const legalTranslations = {
	us: {
		meta: {
			terms: { title: "Terms of Service | AquaDecor", desc: "User agreements and conditions of sale." },
			privacy: { title: "Privacy Policy | AquaDecor", desc: "How we handle and protect your data." },
			shipping: { title: "Shipping Policy | AquaDecor", desc: "Delivery times, carriers, and customs info." },
			refund: { title: "Refund Policy | AquaDecor", desc: "Returns, cancellations, and warranty details." },
		},
		shipping: {
			title: "Shipping Policy",
			intro: "Aquadecor ships worldwide from our manufacturing facility in Serbia. Because our products are handcrafted to order, specialized shipping procedures apply.",
			production: {
				title: "1. Production Time",
				content: "All Aquadecor backgrounds are made-to-order. Production typically takes 10-12 business days. During high-volume periods, this may extend slightly. You will receive a notification and photos when your item is ready.",
			},
			methods: {
				title: "2. Shipping Methods",
				us_content: "All orders are shipped via DHL Express Worldwide. This ensures the fastest possible delivery (3-5 days) and secure handling of large crates.",
				row_content: "We utilize premium couriers (FedEx, TNT, DHL) depending on your region to ensure the safety of our structural products.",
			},
			customs: {
				title: "3. Customs & Duties",
				us: {
					badge: "US Customers",
					headline: "All Duties Included",
					text: "Great news: All prices displayed on our website are final. They include product cost, packaging, shipping, and all U.S. import taxes/tariffs. You will not be charged any surprise fees upon delivery.",
				},
				intl: {
					badge: "International Customers",
					headline: "Duty Unpaid (DDU)",
					text: "We ship from Serbia. Prices include product and shipping only. Your local government may charge import VAT or customs duties upon arrival. These fees are the responsibility of the recipient.",
				},
			},
			damage: {
				title: "4. Damages & Insurance",
				content: "Every shipment is fully insured. If your item arrives damaged, you must contact us within 48 hours of delivery with photos. We will manufacture a free replacement immediately.",
			},
		},
		refund: {
			title: "Refund & Cancellation",
			intro: "We stand behind our craftsmanship. However, due to the custom nature of our business, specific return conditions apply.",
			cancellation: {
				title: "1. Order Cancellation",
				fee_notice: "Cancellation Fee: 40%",
				content: "If you wish to cancel your order after production has started but before it ships, a 40% fee applies to cover materials and labor already invested.",
			},
			returns: {
				title: "2. Returns",
				custom_bold: "Custom-dimension items are non-refundable.",
				custom_text: "Because these items are cut to your specific tank dimensions, they cannot be resold. We provide photos for approval before shipping to ensure satisfaction.",
				standard_text: "Standard items may be returned within 14 days if unused. Return shipping costs to Serbia are the responsibility of the buyer.",
			},
		},
		terms: {
			title: "Terms of Service",
			intro: "Please read these terms carefully before placing your order.",
			measurements: {
				title: "1. Measurements",
				content: "You are responsible for providing exact internal measurements. We do not accept returns for items that do not fit due to incorrect customer measurements.",
			},
			warranty: {
				title: "2. Warranty",
				content: "Our products come with a 20-year or lifetime warranty against degradation. This warranty is void if the product is modified, cut, or cleaned with harsh chemicals.",
			},
		},
		privacy: {
			title: "Privacy Policy",
			intro: "We value your privacy and only collect data necessary for fulfillment.",
			data: {
				title: "Data Collection",
				content: "We collect name, address, and contact info for shipping purposes. We do not store credit card details; all payments are processed via Stripe/PayPal.",
			},
		},
	},
	de: {
		meta: {
			terms: { title: "AGB | AquaDecor", desc: "Nutzungsbedingungen und Verkaufsbedingungen." },
			privacy: { title: "Datenschutzerklärung | AquaDecor", desc: "Wie wir Ihre Daten schützen." },
			shipping: { title: "Versandbedingungen | AquaDecor", desc: "Lieferzeiten und Zollinformationen." },
			refund: { title: "Widerrufsrecht | AquaDecor", desc: "Rücksendungen und Stornierungen." },
		},
		shipping: {
			title: "Versandbedingungen",
			intro: "Aquadecor liefert weltweit aus unserer Manufaktur in Serbien. Da unsere Produkte handgefertigt sind, gelten besondere Versandbedingungen.",
			production: {
				title: "1. Produktionszeit",
				content: "Alle Hintergründe werden auf Bestellung gefertigt. Die Produktion dauert in der Regel 10-12 Werktage.",
			},
			methods: {
				title: "2. Versandarten",
				us_content: "DHL Express Worldwide.",
				row_content: "Wir nutzen Premium-Kurierdienste (FedEx, TNT, DHL) für den sicheren Transport nach Europa.",
			},
			customs: {
				title: "3. Zoll & Steuern",
				us: { badge: "US Kunden", headline: "Alles Inklusive", text: "Alle Gebühren sind im Preis enthalten." },
				intl: {
					badge: "Internationale Kunden",
					headline: "Zölle nicht enthalten",
					text: "Wir versenden aus Serbien (Nicht-EU). Einfuhrumsatzsteuer oder Zölle können von Ihrem lokalen Zollamt erhoben werden und sind vom Empfänger zu tragen.",
				},
			},
			damage: {
				title: "4. Schäden & Versicherung",
				content: "Jede Sendung ist versichert. Bei Transportschäden kontaktieren Sie uns bitte innerhalb von 48 Stunden mit Fotos. Wir fertigen sofort kostenlosen Ersatz.",
			},
		},
		refund: {
			title: "Widerrufsrecht",
			intro: "Aufgrund der Maßanfertigung gelten besondere Rückgabebedingungen.",
			cancellation: {
				title: "1. Stornierung",
				fee_notice: "Stornogebühr: 40%",
				content: "Bei Stornierung nach Produktionsbeginn fällt eine Gebühr von 40% für bereits verbrauchtes Material und Arbeitszeit an.",
			},
			returns: {
				title: "2. Rücksendungen",
				custom_bold: "Maßanfertigungen sind vom Umtausch ausgeschlossen.",
				custom_text: "Da diese Artikel speziell für Ihr Aquarium zugeschnitten werden, können sie nicht zurückgegeben werden.",
				standard_text: "Standardartikel können innerhalb von 14 Tagen unbenutzt zurückgegeben werden. Rücksendekosten trägt der Käufer.",
			},
		},
		terms: {
			title: "Allgemeine Geschäftsbedingungen",
			intro: "Bitte lesen Sie diese Bedingungen sorgfältig durch.",
			measurements: {
				title: "1. Abmessungen",
				content: "Sie sind für die genauen Innenmaße verantwortlich. Wir akzeptieren keine Rücksendungen aufgrund falscher Maßangaben des Kunden.",
			},
			warranty: {
				title: "2. Garantie",
				content: "Wir bieten 20 Jahre oder lebenslange Garantie. Diese erlischt bei Modifikationen oder falscher Reinigung.",
			},
		},
		privacy: {
			title: "Datenschutzerklärung",
			intro: "Wir sammeln nur für die Bestellung notwendige Daten.",
			data: {
				title: "Datenerfassung",
				content: "Name, Adresse für den Versand. Keine Speicherung von Kreditkartendaten.",
			},
		},
	},
	nl: {
		meta: {
			terms: { title: "Algemene Voorwaarden | AquaDecor", desc: "Gebruikersovereenkomsten." },
			privacy: { title: "Privacybeleid | AquaDecor", desc: "Gegevensbescherming." },
			shipping: { title: "Verzendbeleid | AquaDecor", desc: "Levertijden en douane." },
			refund: { title: "Restitutiebeleid | AquaDecor", desc: "Retourneren en annuleren." },
		},
		shipping: {
			title: "Verzendbeleid",
			intro: "Aquadecor verzendt wereldwijd vanuit Servië. Producten worden met de hand gemaakt op bestelling.",
			production: {
				title: "1. Productietijd",
				content: "Productie duurt doorgaans 10-12 werkdagen. U ontvangt foto's wanneer uw item klaar is.",
			},
			methods: {
				title: "2. Verzendmethoden",
				us_content: "DHL Express Worldwide.",
				row_content: "Wij gebruiken premium koeriers (FedEx, TNT, DHL) voor veilige levering in Europa.",
			},
			customs: {
				title: "3. Douane & Belastingen",
				us: { badge: "VS Klanten", headline: "Alles Inclusief", text: "Geen extra kosten bij levering." },
				intl: {
					badge: "Internationale Klanten",
					headline: "Exclusief Invoerrechten",
					text: "Wij verzenden vanuit Servië. Lokale BTW of invoerrechten kunnen van toepassing zijn en zijn voor rekening van de ontvanger.",
				},
			},
			damage: {
				title: "4. Schade & Verzekering",
				content: "Volledig verzekerd. Meld schade binnen 48 uur met foto's voor een gratis vervanging.",
			},
		},
		refund: {
			title: "Restitutiebeleid",
			intro: "Speciale voorwaarden voor maatwerk.",
			cancellation: {
				title: "1. Annulering",
				fee_notice: "Annuleringskosten: 40%",
				content: "Bij annulering na start productie wordt 40% in rekening gebracht.",
			},
			returns: {
				title: "2. Retourneren",
				custom_bold: "Maatwerk kan niet worden geretourneerd.",
				custom_text: "Specifiek op maat gemaakte items zijn uitgesloten van herroepingsrecht.",
				standard_text: "Standaard items kunnen binnen 14 dagen worden geretourneerd. Retourkosten zijn voor de koper.",
			},
		},
		terms: {
			title: "Algemene Voorwaarden",
			intro: "Lees deze voorwaarden zorgvuldig.",
			measurements: {
				title: "1. Afmetingen",
				content: "U bent verantwoordelijk voor de juiste binnenmaten. Geen retour bij meetfouten.",
			},
			warranty: {
				title: "2. Garantie",
				content: "20 jaar of levenslange garantie op degradatie. Vervalt bij aanpassingen.",
			},
		},
		privacy: {
			title: "Privacybeleid",
			intro: "Wij respecteren uw privacy.",
			data: {
				title: "Gegevensverzameling",
				content: "Alleen noodzakelijke gegevens voor verzending en betaling.",
			},
		},
	},
	it: {
		meta: {
			terms: { title: "Termini e Condizioni | AquaDecor", desc: "Condizioni di vendita." },
			privacy: { title: "Privacy Policy | AquaDecor", desc: "Gestione dei dati." },
			shipping: { title: "Spedizioni | AquaDecor", desc: "Tempi e dogana." },
			refund: { title: "Rimborsi | AquaDecor", desc: "Resi e cancellazioni." },
		},
		shipping: {
			title: "Politica di Spedizione",
			intro: "Aquadecor spedisce in tutto il mondo dalla Serbia. I prodotti sono realizzati a mano su ordinazione.",
			production: {
				title: "1. Tempi di Produzione",
				content: "La produzione richiede solitamente 10-12 giorni lavorativi. Riceverai foto per approvazione prima della spedizione.",
			},
			methods: {
				title: "2. Metodi di Spedizione",
				us_content: "DHL Express Worldwide.",
				row_content: "Utilizziamo corrieri premium (FedEx, TNT, DHL) per garantire la sicurezza in Europa.",
			},
			customs: {
				title: "3. Dogana e Tasse",
				us: { badge: "Clienti USA", headline: "Tutto Incluso", text: "Nessuna tassa doganale aggiuntiva." },
				intl: {
					badge: "Clienti Internazionali",
					headline: "Dazi Esclusi",
					text: "Spediamo dalla Serbia (Extra-UE). L'IVA o i dazi doganali possono essere applicati dal governo locale e sono a carico del destinatario.",
				},
			},
			damage: {
				title: "4. Danni e Assicurazione",
				content: "Ogni spedizione è assicurata. Contattaci entro 48 ore dalla consegna con foto del danno per una sostituzione gratuita.",
			},
		},
		refund: {
			title: "Rimborsi e Cancellazioni",
			intro: "Condizioni specifiche per prodotti su misura.",
			cancellation: {
				title: "1. Cancellazione Ordine",
				fee_notice: "Penale Cancellazione: 40%",
				content: "Se cancelli l'ordine dopo l'inizio della produzione, verrà applicata una penale del 40% per coprire materiali e lavoro.",
			},
			returns: {
				title: "2. Resi",
				custom_bold: "I prodotti su misura non sono rimborsabili.",
				custom_text: "Essendo tagliati sulle tue misure specifiche, non possono essere rivenduti.",
				standard_text: "I prodotti standard possono essere restituiti entro 14 giorni. Le spese di spedizione sono a carico dell'acquirente.",
			},
		},
		terms: {
			title: "Termini di Servizio",
			intro: "Leggi attentamente prima di ordinare.",
			measurements: {
				title: "1. Misure",
				content: "Sei responsabile delle misure interne esatte. Non accettiamo resi per errori di misurazione del cliente.",
			},
			warranty: {
				title: "2. Garanzia",
				content: "Garanzia di 20 anni o a vita. La garanzia decade se il prodotto viene modificato o pulito con chimici aggressivi.",
			},
		},
		privacy: {
			title: "Privacy Policy",
			intro: "Raccogliamo solo i dati necessari.",
			data: {
				title: "Raccolta Dati",
				content: "Nome, indirizzo per la spedizione. Non memorizziamo dati delle carte di credito.",
			},
		},
	},
};