// src/server/db/seed/data/seed-faqs.ts

// import type { FaqItem } from "../../schema";
// import type { FaqCategory } from "../../schema";
import type { FaqTranslation } from "../../schema";

type FaqContent = Pick<FaqTranslation, "question" | "answer">;


type FaqItem = {
	region: "ROW" | "US";
	sortOrder: number;
	translations: {
		en: FaqContent;      // English is required
		de?: FaqContent;     // <--- The "?" makes German optional
	};
};

type FaqCategory = {
	slug: string;
	icon: string;
	sortOrder: number;
	translations: {
		en: { name: string };
		de?: { name: string };
	};
	items: FaqItem[];
};


// type FaqItem = {
// 	region: "ROW" | "US";
// 	sortOrder: number;
// 	translations: {
// 		en: FaqTranslation;
// 		de: FaqTranslation | undefined; // Placeholder German
// 	};
// };

// type FaqCategory = {
// 	slug: string;
// 	icon: string; // Lucide icon name
// 	sortOrder: number;
// 	translations: {
// 		en: { name: string };
// 		de: { name: string };
// 	};
// 	items: FaqItem[];
// };

// src/server/db/seed/data/seed-faqs.ts


export const faqsSeedData: FaqCategory[] = [
	{
		slug: "ordering-payment",
		icon: "credit-card",
		sortOrder: 1,
		translations: {
			en: { name: "Ordering & Payment" },
			de: { name: "Bestellung & Zahlung" },
		},
		items: [
			{
				region: "ROW",
				sortOrder: 1,
				translations: {
					en: {
						question: "How can I order a background?",
						answer: "We offer backgrounds in standard and custom sizes. The first step is measuring the aquarium and making sure you have the correct inside measurements.",
					},
					de: {
						question: "[DE] Wie bestelle ich einen Hintergrund?",
						answer: "[DE] Wir bieten Hintergründe in Standard- und Sondergrößen an. Der erste Schritt ist das Ausmessen des Aquariums.",
					},
				},
			},
			{
				region: "US", // US Item -> English Only
				sortOrder: 1,
				translations: {
					en: {
						question: "How do I place an order?",
						answer: "First make sure to take accurate measurements of your aquarium; then choose your favorite model in the appropriate size.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 2,
				translations: {
					en: {
						question: "What payment method do you take?",
						answer: "We take PayPal, Credit Cards, and Bank Transfers.",
					},
					de: {
						question: "[DE] Welche Zahlungsmethoden akzeptieren Sie?",
						answer: "[DE] Wir akzeptieren PayPal, Kreditkarten und Banküberweisungen.",
					},
				},
			},
			{
				region: "US", // US Item -> English Only
				sortOrder: 2,
				translations: {
					en: {
						question: "What payment methods do you take?",
						answer: "We take PayPal and Credit Cards.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 3,
				translations: {
					en: {
						question: "I have two discount codes, can I use them both?",
						answer: "No, only one discount code can be used during checkout.",
					},
					de: {
						question: "[DE] Kann ich zwei Rabattcodes verwenden?",
						answer: "[DE] Nein, es kann nur ein Rabattcode pro Bestellung verwendet werden.",
					},
				},
			},
		],
	},
	{
		slug: "shipping-delivery",
		icon: "truck",
		sortOrder: 2,
		translations: {
			en: { name: "Shipping & Delivery" },
			de: { name: "Versand & Lieferung" },
		},
		items: [
			{
				region: "ROW",
				sortOrder: 1,
				translations: {
					en: {
						question: "Do you ship to my country?",
						answer: "Check out our Shipping Policy to see a list of countries we ship to.",
					},
					de: {
						question: "[DE] Versenden Sie in mein Land?",
						answer: "[DE] Überprüfen Sie unsere Versandrichtlinien für eine Liste der Länder.",
					},
				},
			},
			{
				region: "US", // US Item -> English Only
				sortOrder: 1,
				translations: {
					en: {
						question: "How much is shipping?",
						answer: "All products on our website have shipping included in the price or come with free shipping.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 2,
				translations: {
					en: {
						question: "How long does shipping take?",
						answer: "Check out our Shipping Policy for more information about shipping times.",
					},
					de: {
						question: "[DE] Wie lange dauert der Versand?",
						answer: "[DE] Überprüfen Sie unsere Versandrichtlinien für weitere Informationen.",
					},
				},
			},
			{
				region: "US", // US Item -> English Only
				sortOrder: 2,
				translations: {
					en: {
						question: "How long does shipping take?",
						answer: "We ship with DHL and shipping usually takes 3-5 business days.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 3,
				translations: {
					en: {
						question: "Will my order be tracked?",
						answer: "All parcels are shipped with a tracking number. You will receive your tracking number a few days after your order is shipped.",
					},
					de: {
						question: "[DE] Wird meine Bestellung verfolgt?",
						answer: "[DE] Alle Pakete werden mit einer Sendungsverfolgungsnummer versendet.",
					},
				},
			},
		],
	},
	{
		slug: "installation-technical",
		icon: "wrench",
		sortOrder: 3,
		translations: {
			en: { name: "Installation & Technical" },
			de: { name: "Installation & Technik" },
		},
		items: [
			{
				region: "ROW",
				sortOrder: 1,
				translations: {
					en: {
						question: "I have an established tank, can I still order a background?",
						answer: "Yes, you can order models that can be installed with magnets or vacuum cups, which are E and G models.",
					},
					de: {
						question: "[DE] Ich habe ein eingerichtetes Aquarium, kann ich trotzdem bestellen?",
						answer: "[DE] Ja, Sie können Modelle bestellen, die mit Magneten oder Saugnäpfen installiert werden.",
					},
				},
			},
			{
				region: "US", // US Item -> English Only
				sortOrder: 1,
				translations: {
					en: {
						question: "How do I install a background?",
						answer: "Our Ultra Flex backgrounds come with vacuum cups and can be installed in a full tank. Just place the background in the tank, attach the vacuum cups and that's it.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 2,
				translations: {
					en: {
						question: "Do I have to silicone the background?",
						answer: "All background models (except E and G models with magnets/vacuum cups) need to be siliconed.",
					},
					de: {
						question: "[DE] Muss ich den Hintergrund mit Silikon befestigen?",
						answer: "[DE] Alle Hintergrundmodelle müssen mit Silikon befestigt werden (außer E und G Modelle).",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 3,
				translations: {
					en: {
						question: "How can I clean my 3D background?",
						answer: "Any Aquadecor background can be cleaned with a toothbrush or a regular brush. Do not use sharp objects.",
					},
					de: {
						question: "[DE] Wie reinige ich meinen 3D-Hintergrund?",
						answer: "[DE] Jeder Aquadecor-Hintergrund kann mit einer Zahnbürste gereinigt werden.",
					},
				},
			},
		],
	},
	{
		slug: "product-info",
		icon: "info",
		sortOrder: 4,
		translations: {
			en: { name: "Product Information" },
			de: { name: "Produktinformationen" },
		},
		items: [
			{
				region: "ROW",
				sortOrder: 1,
				translations: {
					en: {
						question: "What are your products made of?",
						answer: "We have developed a special, extremely durable and natural-looking material, suitable for all environments.",
					},
					de: {
						question: "[DE] Woraus bestehen Ihre Produkte?",
						answer: "[DE] Wir haben ein spezielles, extrem langlebiges Material entwickelt.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 2,
				translations: {
					en: {
						question: "Can I use an Aquadecor background in a marine setup?",
						answer: "All Aquadecor backgrounds can be safely used in marine setups, terrariums, paludariums and similar.",
					},
					de: {
						question: "[DE] Kann ich einen Aquadecor-Hintergrund im Meerwasser verwenden?",
						answer: "[DE] Alle Aquadecor-Hintergründe können sicher in Meerwasseraquarien verwendet werden.",
					},
				},
			},
			{
				region: "US", // US Item -> English Only
				sortOrder: 2,
				translations: {
					en: {
						question: "Are Aquadecor Backgrounds safe for Marine tanks?",
						answer: "You can safely use our products in saltwater/marine tanks.",
					},
				},
			},
		],
	},
];