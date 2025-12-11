// src/server/db/seed/data/seed-faqs.ts

import type { FaqTranslation } from "../../schema";

type FaqContent = Pick<FaqTranslation, "question" | "answer">;

type FaqItem = {
	region: "ROW" | "US";
	sortOrder: number;
	translations: {
		en: FaqContent;      // English is required
		de?: FaqContent;     // German
		nl?: FaqContent;     // Dutch
		it?: FaqContent;     // Italian
	};
};

type FaqCategory = {
	slug: string;
	icon: string;
	sortOrder: number;
	translations: {
		en: { name: string };
		de?: { name: string };
		nl?: { name: string };
		it?: { name: string };
	};
	items: FaqItem[];
};

export const faqsSeedData: FaqCategory[] = [
	{
		slug: "ordering-payment",
		icon: "credit-card",
		sortOrder: 1,
		translations: {
			en: { name: "Ordering & Payment" },
			de: { name: "Bestellung & Zahlung" },
			nl: { name: "Bestellen & Betalen" },
			it: { name: "Ordini & Pagamenti" },
		},
		items: [
			// --- ROW ITEMS ---
			{
				region: "ROW",
				sortOrder: 1,
				translations: {
					en: {
						question: "How can I order a background?",
						answer: "We offer backgrounds in standard and custom sizes. At the moment, only E and G models come in standard sizes, but they can also be ordered in custom sizes. The first step is measuring the aquarium and making sure you have the correct inside measurements.",
					},
					de: {
						question: "Wie bestelle ich einen Hintergrund?",
						answer: "Wir bieten Hintergründe in Standard- und Sondergrößen an. Derzeit sind nur die E- und G-Modelle in Standardgrößen erhältlich, können aber auch nach Maß bestellt werden. Der erste Schritt ist das Ausmessen des Aquariums, um die korrekten Innenmaße zu ermitteln.",
					},
					nl: {
						question: "Hoe kan ik een achterwand bestellen?",
						answer: "Wij bieden achterwanden in standaard- en maatwerkformaten. Momenteel zijn alleen E- en G-modellen in standaardmaten verkrijgbaar, maar deze kunnen ook op maat besteld worden. De eerste stap is het opmeten van het aquarium om zeker te zijn van de juiste binnenmaten.",
					},
					it: {
						question: "Come posso ordinare uno sfondo?",
						answer: "Offriamo sfondi in dimensioni standard e personalizzate. Al momento, solo i modelli E e G sono disponibili in dimensioni standard, ma possono essere ordinati anche su misura. Il primo passo è misurare l'acquario e assicurarsi di avere le misure interne corrette.",
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
						question: "Welche Zahlungsmethoden akzeptieren Sie?",
						answer: "Wir akzeptieren PayPal, Kreditkarten und Banküberweisungen.",
					},
					nl: {
						question: "Welke betaalmethoden accepteren jullie?",
						answer: "Wij accepteren PayPal, creditcards en bankoverschrijvingen.",
					},
					it: {
						question: "Quali metodi di pagamento accettate?",
						answer: "Accettiamo PayPal, carte di credito e bonifici bancari.",
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
						question: "Kann ich zwei Rabattcodes verwenden?",
						answer: "Nein, es kann nur ein Rabattcode pro Bestellung verwendet werden.",
					},
					nl: {
						question: "Ik heb twee kortingscodes, kan ik ze allebei gebruiken?",
						answer: "Nee, er kan slechts één kortingscode worden gebruikt tijdens het afrekenen.",
					},
					it: {
						question: "Ho due codici sconto, posso usarli entrambi?",
						answer: "No, è possibile utilizzare un solo codice sconto durante il checkout.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 4,
				translations: {
					en: {
						question: "Why doesn't my discount code work?",
						answer: "Check if the discount code is expired. Discount codes work only on products that can be purchased on the website- backgrounds in standard sizes, additional items, Starter sets, magnetic rocks, S panels and other. Discount codes do not work on backgrounds in custom sizes.",
					},
					de: {
						question: "Warum funktioniert mein Rabattcode nicht?",
						answer: "Überprüfen Sie, ob der Rabattcode abgelaufen ist. Codes gelten nur für Produkte, die direkt auf der Website gekauft werden können (Standardgrößen, Zubehör, Starter-Sets). Rabattcodes gelten nicht für Hintergründe in Sondergrößen.",
					},
					nl: {
						question: "Waarom werkt mijn kortingscode niet?",
						answer: "Controleer of de code verlopen is. Kortingscodes werken alleen op producten die direct op de website gekocht kunnen worden (standaardmaten, extra items, startersets). Ze werken niet op achterwanden met afwijkende maten.",
					},
					it: {
						question: "Perché il mio codice sconto non funziona?",
						answer: "Controlla se il codice è scaduto. I codici sconto funzionano solo sui prodotti acquistabili direttamente sul sito (misure standard, articoli aggiuntivi, set iniziali). Non funzionano sugli sfondi su misura.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 5,
				translations: {
					en: {
						question: "I'm a returning customer, do I get a discount?",
						answer: "We offer a 10% discount to all returning customers. If you send us pictures of your first order, and we repost them on our social media accounts, you will get an additional 10% off. In order for this to be approved, make sure to have a screenshot of the repost ready before you order.",
					},
					de: {
						question: "Ich bin ein wiederkehrender Kunde, bekomme ich einen Rabatt?",
						answer: "Wir bieten 10% Rabatt für alle wiederkehrenden Kunden. Wenn Sie uns Fotos Ihrer ersten Bestellung senden und wir diese auf Social Media teilen, erhalten Sie weitere 10%.",
					},
					nl: {
						question: "Ik ben een terugkerende klant, krijg ik korting?",
						answer: "Wij bieden 10% korting aan alle terugkerende klanten. Als je ons foto's van je eerste bestelling stuurt en wij deze reposten op onze social media, krijg je nog eens 10% extra korting.",
					},
					it: {
						question: "Sono un cliente abituale, ho diritto a uno sconto?",
						answer: "Offriamo uno sconto del 10% a tutti i clienti che ritornano. Se ci invii foto del tuo primo ordine e le ripubblichiamo sui nostri social, otterrai un ulteriore 10% di sconto.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 6,
				translations: {
					en: {
						question: "Do you do refunds/returns?",
						answer: "Due to the nature of our products, we are unable to take returns. If you want to cancel your order before it's shipped out, we will charge you a 40% cancellation fee.",
					},
					de: {
						question: "Bieten Sie Rückerstattungen oder Rücksendungen an?",
						answer: "Aufgrund der Beschaffenheit unserer Produkte können wir keine Rücksendungen annehmen. Bei Stornierung vor Versand fällt eine Gebühr von 40% an.",
					},
					nl: {
						question: "Doen jullie aan terugbetalingen of retourneringen?",
						answer: "Vanwege de aard van onze producten kunnen wij geen retouren accepteren. Als je je bestelling wilt annuleren voordat deze is verzonden, brengen wij 40% annuleringskosten in rekening.",
					},
					it: {
						question: "Effettuate rimborsi o resi?",
						answer: "Data la natura dei nostri prodotti, non possiamo accettare resi. Se desideri annullare l'ordine prima della spedizione, verrà addebitata una penale del 40%.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 7,
				translations: {
					en: {
						question: "I sent an email but didn't get a response?",
						answer: "We always respond within 24 hours on working days. If you email us during the weekend, you will receive a response on Monday. If you don't get a response, make sure to check your spam folder.",
					},
					de: {
						question: "Ich habe eine E-Mail gesendet, aber keine Antwort erhalten?",
						answer: "Wir antworten an Werktagen immer innerhalb von 24 Stunden. E-Mails vom Wochenende werden am Montag beantwortet. Bitte prüfen Sie auch Ihren Spam-Ordner.",
					},
					nl: {
						question: "Ik heb een e-mail gestuurd maar geen reactie ontvangen?",
						answer: "Wij reageren op werkdagen altijd binnen 24 uur. Als je in het weekend mailt, krijg je maandag antwoord. Controleer ook je spamfolder.",
					},
					it: {
						question: "Ho inviato un'email ma non ho ricevuto risposta?",
						answer: "Rispondiamo sempre entro 24 ore nei giorni lavorativi. Se ci scrivi durante il weekend, riceverai risposta lunedì. Controlla anche la cartella spam.",
					},
				},
			},

			// --- US ITEMS ---
			{
				region: "US",
				sortOrder: 1,
				translations: {
					en: {
						question: "How do I place an order?",
						answer: "First make sure to take the accurate measurements of your aquarium; then choose your favorite model in the appropriate size.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 2,
				translations: {
					en: {
						question: "What payment methods do you take?",
						answer: "We take PayPal and Credit Cards.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 3,
				translations: {
					en: {
						question: "I have two discount codes, can I use them both?",
						answer: "No, you can only use one discount code at a time.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 4,
				translations: {
					en: {
						question: "I'm a returning customer, do I get a discount?",
						answer: "We offer a 10% discount to our returning customers, so make sure to email us for a discount code before you place your order.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 5,
				translations: {
					en: {
						question: "Do you do refunds/returns?",
						answer: "Due to the nature of our products, we are unable to take returns. If you want to cancel your order before it's shipped out, you will be charged a 40% cancellation fee.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 6,
				translations: {
					en: {
						question: "When can I expect a response to my email?",
						answer: "We always respond within 24 hours on working days. If you don't receive a response from us, please check your spam folder.",
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
			nl: { name: "Verzending & Levering" },
			it: { name: "Spedizione & Consegna" },
		},
		items: [
			// --- ROW ITEMS ---
			{
				region: "ROW",
				sortOrder: 1,
				translations: {
					en: {
						question: "Do you ship to my country?",
						answer: "Check out our Shipping Policy to see a list of countries we ship to.",
					},
					de: {
						question: "Versenden Sie in mein Land?",
						answer: "Überprüfen Sie unsere Versandrichtlinien für eine Liste der Länder, in die wir liefern.",
					},
					nl: {
						question: "Verzenden jullie naar mijn land?",
						answer: "Bekijk ons verzendbeleid voor een lijst met landen waar wij naar verzenden.",
					},
					it: {
						question: "Spedite nel mio paese?",
						answer: "Controlla la nostra politica di spedizione per vedere l'elenco dei paesi verso cui spediamo.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 2,
				translations: {
					en: {
						question: "How long does shipping take?",
						answer: "Check out our Shipping Policy for more information about shipping.",
					},
					de: {
						question: "Wie lange dauert der Versand?",
						answer: "Weitere Informationen finden Sie in unseren Versandrichtlinien.",
					},
					nl: {
						question: "Hoe lang duurt de verzending?",
						answer: "Bekijk ons verzendbeleid voor meer informatie over verzending.",
					},
					it: {
						question: "Quanto tempo richiede la spedizione?",
						answer: "Consulta la nostra politica di spedizione per maggiori informazioni.",
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
						question: "Wird meine Bestellung verfolgt?",
						answer: "Alle Pakete werden mit einer Sendungsverfolgungsnummer versendet. Sie erhalten diese einige Tage nach dem Versand.",
					},
					nl: {
						question: "Wordt mijn bestelling getraceerd?",
						answer: "Alle pakketten worden verzonden met een trackingnummer. Je ontvangt dit nummer enkele dagen nadat je bestelling is verzonden.",
					},
					it: {
						question: "Il mio ordine sarà tracciabile?",
						answer: "Tutti i pacchi sono spediti con un numero di tracciamento. Riceverai il numero alcuni giorni dopo la spedizione dell'ordine.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 4,
				translations: {
					en: {
						question: "My background arrived damaged, what can I do?",
						answer: "If your background arrives damaged, make sure to report the damage to the post office/courier within 24 hours. Also, make sure to contact us within 48 hours after receiving the product. If the damage is minor, we will instruct you how to fix it. If it's a major damage, we will make a replacement background for you.",
					},
					de: {
						question: "Mein Hintergrund ist beschädigt angekommen, was kann ich tun?",
						answer: "Melden Sie den Schaden innerhalb von 24 Stunden bei der Post/dem Kurier und kontaktieren Sie uns innerhalb von 48 Stunden. Bei kleineren Schäden geben wir Reparaturanweisungen. Bei größeren Schäden fertigen wir Ersatz an.",
					},
					nl: {
						question: "Mijn achterwand is beschadigd aangekomen, wat kan ik doen?",
						answer: "Meld de schade binnen 24 uur bij het postkantoor/de koerier en neem binnen 48 uur contact met ons op. Bij kleine schade leggen we uit hoe je het kunt herstellen. Bij grote schade maken we een vervangende achterwand.",
					},
					it: {
						question: "Il mio sfondo è arrivato danneggiato, cosa posso fare?",
						answer: "Se lo sfondo arriva danneggiato, segnala il danno all'ufficio postale/corriere entro 24 ore e contattaci entro 48 ore. Per danni minori ti diremo come ripararlo. Per danni gravi, ne realizzeremo uno sostitutivo.",
					},
				},
			},

			// --- US ITEMS ---
			{
				region: "US",
				sortOrder: 1,
				translations: {
					en: {
						question: "How much is shipping?",
						answer: "All products on our website have shipping included in the price or come with free shipping.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 2,
				translations: {
					en: {
						question: "Are import taxes (tariffs) included in the price?",
						answer: "All pricing on our website includes the tariffs so you won't be charged anything extra when you receive your order.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 3,
				translations: {
					en: {
						question: "How long does shipping take?",
						answer: "We ship with DHL and shipping usually takes 3-5 business days.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 4,
				translations: {
					en: {
						question: "Will my order be tracked?",
						answer: "All parcels are shipped with DHL and are tracked.",
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
			nl: { name: "Installatie & Techniek" },
			it: { name: "Installazione & Tecnica" },
		},
		items: [
			// --- ROW ITEMS ---
			{
				region: "ROW",
				sortOrder: 1,
				translations: {
					en: {
						question: "I have an established tank, can I still order a background?",
						answer: "Yes, you can order models that can be installed with magnets or vacuum cups, which are E and G models.",
					},
					de: {
						question: "Ich habe ein eingerichtetes Aquarium, kann ich trotzdem bestellen?",
						answer: "Ja, Sie können Modelle bestellen (Modelle E und G), die mit Magneten oder Saugnäpfen installiert werden können.",
					},
					nl: {
						question: "Ik heb al een ingericht aquarium, kan ik toch een achterwand bestellen?",
						answer: "Ja, je kunt modellen bestellen die met magneten of zuignappen bevestigd kunnen worden. Dit zijn de E- en G-modellen.",
					},
					it: {
						question: "Ho un acquario già avviato, posso ordinare uno sfondo?",
						answer: "Sì, puoi ordinare modelli che possono essere installati con magneti o ventose, ovvero i modelli E e G.",
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
						question: "Muss ich den Hintergrund mit Silikon befestigen?",
						answer: "Alle Hintergrundmodelle müssen mit Silikon befestigt werden (außer E- und G-Modelle mit Magneten/Saugnäpfen).",
					},
					nl: {
						question: "Moet ik de achterwand vastkitten met siliconen?",
						answer: "Alle achterwandmodellen (behalve E- en G-modellen met magneten/zuignappen) moeten met siliconen worden bevestigd.",
					},
					it: {
						question: "Devo fissare lo sfondo con il silicone?",
						answer: "Tutti i modelli di sfondo (tranne i modelli E e G con magneti/ventose) devono essere siliconati.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 3,
				translations: {
					en: {
						question: "I have an overflow filter/external filter, can I order a background?",
						answer: "All backgrounds work with both options. If you have an overflow filter, make sure to have the measurements ready when you order.",
					},
					de: {
						question: "Ich habe einen Überlauffilter/Außenfilter, kann ich bestellen?",
						answer: "Alle Hintergründe funktionieren mit beiden Optionen. Wenn Sie einen Überlauffilter haben, halten Sie bitte die Maße bereit, wenn Sie bestellen.",
					},
					nl: {
						question: "Ik heb een overloopfilter/buitenfilter, kan ik een achterwand bestellen?",
						answer: "Alle achterwanden werken met beide opties. Als je een overloopfilter hebt, zorg dan dat je de afmetingen bij de hand hebt wanneer je bestelt.",
					},
					it: {
						question: "Ho un filtro a tracimazione/filtro esterno, posso ordinare uno sfondo?",
						answer: "Tutti gli sfondi funzionano con entrambe le opzioni. Se hai un filtro a tracimazione, assicurati di avere le misure pronte quando ordini.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 4,
				translations: {
					en: {
						question: "I have a HOB filter, what background models can I order?",
						answer: "Models that work with HOB filters are E and G models Ultra Flex.",
					},
					de: {
						question: "Ich habe einen HOB-Filter (Rucksackfilter), welche Modelle passen?",
						answer: "Modelle, die mit HOB-Filtern funktionieren, sind die Ultra Flex Modelle E und G.",
					},
					nl: {
						question: "Ik heb een hang-on-back (HOB) filter, welke modellen kan ik bestellen?",
						answer: "Modellen die werken met HOB-filters zijn de Ultra Flex E- en G-modellen.",
					},
					it: {
						question: "Ho un filtro a zainetto (HOB), quali modelli posso ordinare?",
						answer: "I modelli che funzionano con i filtri HOB sono i modelli Ultra Flex E e G.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 5,
				translations: {
					en: {
						question: "I have a 55/75/90/125/180 gallon tank, how can I order?",
						answer: "If you want to order an E or a G model, we offer them in standard sizes. However, it is crucial to measure your tank and make sure that the measurements match the ones displayed on the website. For other models, you can order them in the price calculator.",
					},
					de: {
						question: "Ich habe ein 55/75/90/125/180 Gallonen Aquarium, wie kann ich bestellen?",
						answer: "E- und G-Modelle bieten wir in Standardgrößen an. Es ist jedoch wichtig, dass Sie Ihr Aquarium messen und sicherstellen, dass die Maße mit denen auf der Website übereinstimmen. Andere Modelle können über den Preiskalkulator bestellt werden.",
					},
					nl: {
						question: "Ik heb een standaard aquarium (55/75/90/125/180 gallon), hoe kan ik bestellen?",
						answer: "Als je een E- of G-model wilt, bieden we deze aan in standaardmaten. Het is echter cruciaal om je aquarium op te meten en te controleren of de maten overeenkomen met de website. Voor andere modellen kun je de prijscalculator gebruiken.",
					},
					it: {
						question: "Ho un acquario standard (55/75/90/125/180 galloni), come posso ordinare?",
						answer: "Se vuoi ordinare un modello E o G, li offriamo in dimensioni standard. Tuttavia, è fondamentale misurare l'acquario e assicurarsi che le misure corrispondano a quelle sul sito. Per altri modelli, puoi usare il calcolatore di prezzi.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 6,
				translations: {
					en: {
						question: "My tank has top supports/bracing, will the background fit?",
						answer: "Some models are made in parts, and if you are ordering such a model, make sure to have the size of the largest top opening (A x B) readily available before you order.",
					},
					de: {
						question: "Mein Aquarium hat Querstreben, passt der Hintergrund?",
						answer: "Einige Modelle werden in Teilen gefertigt. Wenn Sie ein solches Modell bestellen, halten Sie bitte die Größe der größten oberen Öffnung (A x B) bereit.",
					},
					nl: {
						question: "Mijn aquarium heeft stabilisatiestrips, past de achterwand?",
						answer: "Sommige modellen worden in delen gemaakt. Als je zo'n model bestelt, zorg dan dat je de afmeting van de grootste opening aan de bovenkant (A x B) bij de hand hebt.",
					},
					it: {
						question: "Il mio acquario ha tiranti superiori, lo sfondo entrerà?",
						answer: "Alcuni modelli sono realizzati in parti; se ordini uno di questi, assicurati di avere a portata di mano le dimensioni della massima apertura superiore (A x B).",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 7,
				translations: {
					en: {
						question: "I have a Juwel aquarium with its original filter. How can I order a background?",
						answer: "All background models can be made for any Juwel aquarium with its original filter. There is no need to measure it, we already have all measurements. We only need the exact model name of the aquarium, and, of course, the background model you would like.",
					},
					de: {
						question: "Ich habe ein Juwel-Aquarium mit Originalfilter. Wie bestelle ich?",
						answer: "Alle Hintergründe können für Juwel-Aquarien mit Originalfilter angefertigt werden. Wir haben bereits alle Maße. Wir benötigen nur den genauen Modellnamen des Aquariums und das gewünschte Hintergrundmodell.",
					},
					nl: {
						question: "Ik heb een Juwel aquarium met het originele filter. Hoe kan ik bestellen?",
						answer: "Alle achterwanden kunnen worden gemaakt voor elk Juwel aquarium met origineel filter. Meten is niet nodig, wij hebben alle maten al. We hebben alleen de exacte modelnaam en het gewenste achterwandmodel nodig.",
					},
					it: {
						question: "Ho un acquario Juwel con filtro originale. Come posso ordinare?",
						answer: "Tutti i modelli possono essere realizzati per acquari Juwel con filtro originale. Non c'è bisogno di misurare, abbiamo già tutte le misure. Ci serve solo il nome esatto del modello dell'acquario e lo sfondo che desideri.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 8,
				translations: {
					en: {
						question: "I want to order a background model, but my tank is shorter than 31\"/59\", how can I order it?",
						answer: "Unfortunately, if the price calculator doesn't allow you to order a certain model due to the size of the tank, you won't be able to order it. All backgrounds have their minimum length/height.",
					},
					de: {
						question: "Ich möchte bestellen, aber mein Aquarium ist kürzer als 80cm/150cm?",
						answer: "Wenn der Preiskalkulator ein Modell aufgrund der Aquariengröße nicht zulässt, kann es leider nicht bestellt werden. Alle Hintergründe haben eine Mindestlänge/-höhe.",
					},
					nl: {
						question: "Ik wil een achterwand bestellen, maar mijn tank is korter dan 80cm/150cm?",
						answer: "Helaas, als de prijscalculator je niet toestaat een bepaald model te bestellen vanwege de grootte, is dit niet mogelijk. Alle achterwanden hebben een minimale lengte/hoogte.",
					},
					it: {
						question: "Voglio ordinare uno sfondo, ma il mio acquario è più corto di 80cm/150cm?",
						answer: "Purtroppo, se il calcolatore non permette di ordinare un certo modello a causa delle dimensioni, non sarà possibile ordinarlo. Tutti gli sfondi hanno una lunghezza/altezza minima.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 9,
				translations: {
					en: {
						question: "How can I clean my 3D background?",
						answer: "Any Aquadecor background can be cleaned with a toothbrush or a regular brush (such as the ones used on nails in nail salons). Do not use a knife, scalpel or a brush with metal bristles, and similar sharp objects. If you're having trouble with algae, we suggest addressing the cause of the algae growth in the tank.",
					},
					de: {
						question: "Wie reinige ich meinen 3D-Hintergrund?",
						answer: "Jeder Aquadecor-Hintergrund kann mit einer Zahnbürste oder einer normalen Bürste gereinigt werden. Verwenden Sie keine Messer, Skalpelle oder Drahtbürsten. Bei Algenproblemen empfehlen wir, die Ursache des Algenwachstums zu bekämpfen.",
					},
					nl: {
						question: "Hoe reinig ik mijn 3D-achterwand?",
						answer: "Elke Aquadecor-achterwand kan worden gereinigd met een tandenborstel of nagelborstel. Gebruik geen mes, scalpel of staalborstel. Als je last hebt van algen, raden we aan de oorzaak van de algengroei in het aquarium aan te pakken.",
					},
					it: {
						question: "Come posso pulire il mio sfondo 3D?",
						answer: "Ogni sfondo Aquadecor può essere pulito con uno spazzolino da denti o una spazzola normale. Non usare coltelli, bisturi o spazzole metalliche. Se hai problemi con le alghe, suggeriamo di affrontarne la causa.",
					},
				},
			},

			// --- US ITEMS ---
			{
				region: "US",
				sortOrder: 1,
				translations: {
					en: {
						question: "How do I install a background?",
						answer: "Our Ultra Flex backgrounds come with vacuum cups and can be installed in a full tank. Just place the background in the tank, attach the vacuum cups and that's it.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 2,
				translations: {
					en: {
						question: "Do products need to be rinsed?",
						answer: "If you are placing the decoration in a full tank, make sure to rinse the background and the additional items under warm water for a couple of minutes before you place them in the tank. Apart from that, no special prep is needed.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 3,
				translations: {
					en: {
						question: "Can your products be installed in an established tank?",
						answer: "Yes, all products on our website can be installed in an established tank, there is no need to drain it for this purpose.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 4,
				translations: {
					en: {
						question: "What filters work with your backgrounds?",
						answer: "All filters are suitable to be used with our Ultra Flex backgrounds- there is space behind each background where you can place your intakes, hob filters, heaters and other equipment.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 5,
				translations: {
					en: {
						question: "How can I install standing logs?",
						answer: "Standing logs can be installed in a few different ways- you can silicone them to the bottom of the tank; you can silicone them onto small ceramic or glass tiles and then place them in the tank; you can put several stones in them to keep them in place.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 6,
				translations: {
					en: {
						question: "How can I clean my 3D Background?",
						answer: "Any Aquadecor background can be cleaned with a toothbrush or a regular brush (such as the ones used on nails in nail salons). Do not use a knife, scalpel or a brush with metal bristles, and similar sharp objects. If you're having trouble with algae, we suggest addressing the cause of the algae growth in the tank.",
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
			nl: { name: "Productinformatie" },
			it: { name: "Informazioni sul prodotto" },
		},
		items: [
			// --- ROW ITEMS ---
			{
				region: "ROW",
				sortOrder: 1,
				translations: {
					en: {
						question: "What are your products made of?",
						answer: "We have developed a special, extremely durable and natural-looking material, suitable for all environments. All backgrounds are covered with protective layers and are completely neutral in water. The exact formulation of the materials is a trade secret.",
					},
					de: {
						question: "Woraus bestehen Ihre Produkte?",
						answer: "Wir haben ein spezielles, extrem langlebiges Material entwickelt, das für alle Umgebungen geeignet ist. Alle Hintergründe sind mit Schutzschichten überzogen und wasserneutral. Die genaue Rezeptur ist ein Betriebsgeheimnis.",
					},
					nl: {
						question: "Waar zijn jullie producten van gemaakt?",
						answer: "We hebben een speciaal, extreem duurzaam en natuurlijk ogend materiaal ontwikkeld. Alle achterwanden zijn bedekt met beschermende lagen en zijn volledig neutraal in water. De exacte samenstelling is geheim.",
					},
					it: {
						question: "Di cosa sono fatti i vostri prodotti?",
						answer: "Abbiamo sviluppato un materiale speciale, estremamente resistente e dall'aspetto naturale. Tutti gli sfondi sono coperti da strati protettivi e sono completamente neutri in acqua. La formula esatta è un segreto commerciale.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 2,
				translations: {
					en: {
						question: "Can I use an Aquadecor background in a marine setup or a terrarium?",
						answer: "All Aquadecor backgrounds can be safely used in marine setups, terrariums, paludariums and similar. If you have species with sharper teeth or claws, make sure to let us know in advance. Backgrounds for marine tanks, terrariums and other require a different type of coating, so make sure to note the purpose of your background before you order.",
					},
					de: {
						question: "Kann ich einen Aquadecor-Hintergrund im Meerwasser oder Terrarium verwenden?",
						answer: "Alle Hintergründe können sicher in Meerwasseraquarien, Terrarien und Paludarien verwendet werden. Bei Tieren mit scharfen Zähnen/Krallen geben Sie uns bitte Bescheid. Diese Hintergründe benötigen eine spezielle Beschichtung, bitte geben Sie den Verwendungszweck bei der Bestellung an.",
					},
					nl: {
						question: "Kan ik een Aquadecor-achterwand gebruiken in een zoutwateraquarium of terrarium?",
						answer: "Alle achterwanden zijn veilig voor zoutwater, terraria en paludaria. Laat het ons weten als je dieren hebt met scherpe tanden of klauwen. Achterwanden voor deze toepassingen vereisen een andere coating, dus vermeld dit bij je bestelling.",
					},
					it: {
						question: "Posso usare uno sfondo Aquadecor in un acquario marino o terrario?",
						answer: "Tutti gli sfondi possono essere usati in sicurezza in acquari marini, terrari e paludari. Se hai specie con denti o artigli affilati, faccelo sapere. Questi sfondi richiedono un rivestimento diverso, quindi indica lo scopo prima di ordinare.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 3,
				translations: {
					en: {
						question: "How long does it take to make a background or additional items?",
						answer: "Production of standard sized products takes around 10-12 business days. For larger orders or custom projects, it may take longer.",
					},
					de: {
						question: "Wie lange dauert die Herstellung?",
						answer: "Die Herstellung von Produkten in Standardgrößen dauert ca. 10-12 Werktage. Bei größeren Bestellungen oder Sonderanfertigungen kann es länger dauern.",
					},
					nl: {
						question: "Hoe lang duurt het om een achterwand of extra items te maken?",
						answer: "De productie van producten in standaardmaten duurt ongeveer 10-12 werkdagen. Voor grotere bestellingen of maatwerk kan dit langer duren.",
					},
					it: {
						question: "Quanto tempo ci vuole per realizzare uno sfondo o articoli aggiuntivi?",
						answer: "La produzione di prodotti di dimensioni standard richiede circa 10-12 giorni lavorativi. Per ordini più grandi o progetti personalizzati, potrebbe volerci più tempo.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 4,
				translations: {
					en: {
						question: "Do I have to order a full set of rocks/logs/leaves/other items?",
						answer: "You are not required to order a full set, but by ordering a full set you get free shipping and a discount (already included in the price shown on the website).",
					},
					de: {
						question: "Muss ich ein komplettes Set (Steine/Wurzeln) bestellen?",
						answer: "Sie müssen kein komplettes Set bestellen, aber bei Bestellung eines kompletten Sets erhalten Sie kostenlosen Versand und einen Rabatt (bereits im Preis enthalten).",
					},
					nl: {
						question: "Moet ik een volledige set stenen/hout/bladeren bestellen?",
						answer: "Je bent niet verplicht een volledige set te bestellen, maar bij een volledige set krijg je gratis verzending en korting (al in de prijs verwerkt).",
					},
					it: {
						question: "Devo ordinare un set completo di rocce/legni/foglie?",
						answer: "Non sei obbligato a ordinare un set completo, ma facendolo otterrai la spedizione gratuita e uno sconto (già incluso nel prezzo).",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 5,
				translations: {
					en: {
						question: "How big are the additional rocks?",
						answer: "The standard sizes of rocks are around 15-25 cm, if you order them in a set. If you want custom sizes, feel free to contact us for a quote.",
					},
					de: {
						question: "Wie groß sind die zusätzlichen Steine?",
						answer: "Die Standardgröße der Steine im Set beträgt ca. 15-25 cm. Für Sondergrößen kontaktieren Sie uns bitte für ein Angebot.",
					},
					nl: {
						question: "Hoe groot zijn de extra stenen?",
						answer: "De standaardafmetingen van stenen zijn ongeveer 15-25 cm als je ze in een set bestelt. Neem voor afwijkende maten contact met ons op.",
					},
					it: {
						question: "Quanto sono grandi le rocce aggiuntive?",
						answer: "Le dimensioni standard delle rocce nel set sono circa 15-25 cm. Se desideri dimensioni personalizzate, contattaci per un preventivo.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 6,
				translations: {
					en: {
						question: "How tall/long are the logs?",
						answer: "The maximum height/length of the logs in sets is 70 cm (28\"). If you want them shorter, make sure to enter the height in the required field. If you want them taller/longer, feel free to contact us for a quote.",
					},
					de: {
						question: "Wie groß/lang sind die Wurzeln?",
						answer: "Die maximale Höhe/Länge der Wurzeln in Sets beträgt 70 cm. Wenn Sie sie kürzer wünschen, geben Sie dies bitte an. Für längere Wurzeln kontaktieren Sie uns bitte.",
					},
					nl: {
						question: "Hoe hoog/lang zijn de houtblokken (logs)?",
						answer: "De maximale hoogte/lengte in sets is 70 cm. Als je ze korter wilt, vul dan de hoogte in bij het verplichte veld. Neem voor langere stukken contact op.",
					},
					it: {
						question: "Quanto sono alti/lunghi i legni?",
						answer: "L'altezza/lunghezza massima dei legni nei set è 70 cm. Se li vuoi più corti, inserisci l'altezza nel campo richiesto. Per misure maggiori, contattaci.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 7,
				translations: {
					en: {
						question: "How massive are your backgrounds?",
						answer: "Background categories that contain models with the same width (such as A models) have their width displayed in the product description. For others, if you have a question about the width of a specific model, make sure to contact us. The width of some models (such as B, E and G models) depends on the size of the background.",
					},
					de: {
						question: "Wie massiv/tief sind Ihre Hintergründe?",
						answer: "Bei Kategorien mit einheitlicher Tiefe (z.B. A-Modelle) steht dies in der Beschreibung. Bei anderen Modellen (wie B, E und G) hängt die Tiefe von der Größe des Hintergrunds ab. Kontaktieren Sie uns bei Fragen.",
					},
					nl: {
						question: "Hoe dik zijn de achterwanden?",
						answer: "Bij categorieën met gelijke diepte (zoals A-modellen) staat dit in de beschrijving. Bij andere modellen (zoals B, E en G) hangt de diepte af van de grootte van de achterwand. Neem bij vragen contact op.",
					},
					it: {
						question: "Quanto sono spessi gli sfondi?",
						answer: "Le categorie con profondità uniforme (come i modelli A) lo indicano nella descrizione. Per altri (come B, E e G), la profondità dipende dalla dimensione dello sfondo. Contattaci per domande.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 8,
				translations: {
					en: {
						question: "Why is my background shiny?",
						answer: "Some background models/products require a shiny protective coating that will turn matte once it's underwater.",
					},
					de: {
						question: "Warum glänzt mein Hintergrund?",
						answer: "Einige Modelle benötigen eine glänzende Schutzschicht, die unter Wasser matt wird.",
					},
					nl: {
						question: "Waarom glanst mijn achterwand?",
						answer: "Sommige modellen hebben een glanzende beschermlaag nodig die onder water mat wordt.",
					},
					it: {
						question: "Perché il mio sfondo è lucido?",
						answer: "Alcuni modelli richiedono un rivestimento protettivo lucido che diventerà opaco una volta sott'acqua.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 9,
				translations: {
					en: {
						question: "Will I get the same product that is shown on the website?",
						answer: "Since all products are handmade and unique, your background or additional items are not going to be identical to what is shown on the website. For that reason, we send pictures of the products for your review, before we ship it out.",
					},
					de: {
						question: "Erhalte ich das gleiche Produkt wie auf der Website?",
						answer: "Da alle Produkte handgefertigte Unikate sind, wird Ihr Hintergrund nicht identisch sein. Wir senden Ihnen vor dem Versand Fotos zur Überprüfung.",
					},
					nl: {
						question: "Krijg ik precies hetzelfde product als op de website?",
						answer: "Omdat alle producten handgemaakt en uniek zijn, zal je achterwand niet identiek zijn aan de foto's. Daarom sturen we je foto's ter beoordeling voordat we verzenden.",
					},
					it: {
						question: "Riceverò lo stesso prodotto mostrato sul sito?",
						answer: "Poiché tutti i prodotti sono fatti a mano e unici, il tuo sfondo non sarà identico. Per questo motivo, inviamo foto dei prodotti per la tua approvazione prima della spedizione.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 10,
				translations: {
					en: {
						question: "If I order during the sale (such as Black Friday), will the production time be longer?",
						answer: "Yes, if you order during a larger sale, the production will take longer than usual.",
					},
					de: {
						question: "Dauert die Produktion während eines Sales (z.B. Black Friday) länger?",
						answer: "Ja, bei Bestellungen während großer Verkaufsaktionen dauert die Produktion länger als üblich.",
					},
					nl: {
						question: "Duurt de productie langer tijdens een uitverkoop (zoals Black Friday)?",
						answer: "Ja, als je bestelt tijdens een grote uitverkoop, duurt de productie langer dan gebruikelijk.",
					},
					it: {
						question: "Se ordino durante i saldi (come il Black Friday), la produzione richiederà più tempo?",
						answer: "Sì, se ordini durante i grandi saldi, la produzione richiederà più tempo del solito.",
					},
				},
			},
			{
				region: "ROW",
				sortOrder: 11,
				translations: {
					en: {
						question: "Do some background models come with side panels/bottom rocks?",
						answer: "No, if you don't order side panels/additional items in the price calculator, the background will not be made with those additions. Some models (such as C models) are displayed with side panels and bottom rocks, but they have to be ordered additionally.",
					},
					de: {
						question: "Werden manche Hintergründe mit Seitenwänden/Bodensteinen geliefert?",
						answer: "Nein, wenn Sie diese nicht im Preiskalkulator bestellen, werden sie nicht angefertigt. Einige Modelle (z.B. C-Modelle) werden damit abgebildet, müssen aber extra bestellt werden.",
					},
					nl: {
						question: "Worden sommige modellen geleverd met zijpanelen/bodemstenen?",
						answer: "Nee, als je geen zijpanelen of extra items bestelt in de calculator, worden deze niet gemaakt. Sommige modellen (zoals C-modellen) worden ermee afgebeeld, maar moeten apart besteld worden.",
					},
					it: {
						question: "Alcuni modelli includono pannelli laterali/rocce di fondo?",
						answer: "No, se non ordini pannelli laterali/articoli aggiuntivi nel calcolatore, non verranno realizzati. Alcuni modelli (come i modelli C) sono mostrati con essi, ma vanno ordinati a parte.",
					},
				},
			},

			// --- US ITEMS ---
			{
				region: "US",
				sortOrder: 1,
				translations: {
					en: {
						question: "How long does production take?",
						answer: "Production usually takes 10-12 business days; if you are ordering during a sale, it may take a few extra days to complete your order.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 2,
				translations: {
					en: {
						question: "Are Aquadecor Backgrounds safe for Marine tanks?",
						answer: "You can safely use our products in saltwater/marine tanks.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 3,
				translations: {
					en: {
						question: "Why is my background shiny?",
						answer: "Some background models/products require a shiny protective coating that will turn matte once it's underwater.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 4,
				translations: {
					en: {
						question: "Will my products look identical to what is displayed on the website?",
						answer: "Since all products are handmade and unique, your background or additional items are not going to be identical to what is shown on the website. For that reason, we send pictures of the products for your review, before your products are shipped out.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 5,
				translations: {
					en: {
						question: "What is the width of 3D backgrounds?",
						answer: "The width of a 3D background depends on the model and size. If you have a specific question regarding a 3D background, feel free to contact us.",
					},
				},
			},
			{
				region: "US",
				sortOrder: 6,
				translations: {
					en: {
						question: "I want to order a background but I don't see the size I need on the website.",
						answer: "If you are looking for a custom model and size, please contact us through the Contact Page on our website.",
					},
				},
			},
		],
	},
];