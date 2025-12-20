// src/data/shoutouts.ts

export interface QuickReview {
	id: string;
	quote: string;
	author: string;
	location?: string;
	source: string;
	sourceUrl?: string;
	avatar?: string;
}

// Full verified testimonials for English
const EN_REVIEWS: QuickReview[] = [
	{
		id: "1",
		quote: "Every single person that has seen it has thought that it was real wood and rocks that I cut and assembled together",
		author: "Kevin 'fishbubbles'",
		location: "Florida, USA",
		source: "Forum",
		sourceUrl: "https://forum.simplydiscus.com/forum/main-discus-topics/hardware-technical-and-do-it-yourself/tanks-and-equipment/101677-the-costs-of-setting-up-and-maintaining-a-265-gallon-discus-tank",
		avatar: "/assets/avatars/kevin-fishbubbles.jpg",
	},
	{
		id: "2",
		quote: "The hand-painted details really stand out and make this background a work of art",
		author: "Joey Mullen (King of DIY)",
		location: "Canada",
		source: "YouTube",
		sourceUrl: "https://www.youtube.com/watch?v=1vYBlkf1zKo",
		avatar: "/assets/avatars/king-of-diy.png",
	},
	{
		id: "3",
		quote: "The detail is insane. feels like real rock/wood, custom fit, and the painting is spot-on for a natural look",
		author: "Joe (XPriceTagX)",
		location: "Ohio, USA",
		source: "YouTube",
		sourceUrl: "https://www.youtube.com/watch?v=YgHs8n49ZYI",
		avatar: "/assets/avatars/joe-XPriceTagX.webp",
	},
];

// Testimonials for US - verifiable from USA with links
const US_REVIEWS: QuickReview[] = [
	{
		id: "us-1",
		quote: "The detail is insane. feels like real rock/wood, custom fit, and the painting is spot-on for a natural look",
		author: "Joe (XPriceTagX)",
		location: "Ohio, USA",
		source: "YouTube",
		sourceUrl: "https://www.youtube.com/watch?v=YgHs8n49ZYI",
		avatar: "/assets/avatars/joe-XPriceTagX.webp",
	},
	{
		id: "us-2",
		quote: "Every single person that has seen it has thought that it was real wood and rocks that I cut and assembled together",
		author: "Kevin 'fishbubbles'",
		location: "Florida, USA",
		source: "Forum",
		sourceUrl: "https://forum.simplydiscus.com/forum/main-discus-topics/hardware-technical-and-do-it-yourself/tanks-and-equipment/101677-the-costs-of-setting-up-and-maintaining-a-265-gallon-discus-tank",
		avatar: "/assets/avatars/kevin-fishbubbles.jpg",
	},
	{
		id: "us-3",
		quote: "It's lightweight, easy to cut with a box knife, and can't weigh more than 20lbs—super easy to handle solo. The UltraFlex with magnets is a game-changer for install.",
		author: "LLYT (Long Live Your Turtle)",
		location: "USA",
		source: "YouTube",
		sourceUrl: "https://www.youtube.com/watch?v=lWQAZsFWK-4",
		avatar: "/assets/avatars/llyt.png",
	},
	{
		id: "us-4",
		quote: "AquaDecor was fabulous to work with—they provided extra pictures and updated measurements. It was very easy to cut with a simple box knife.",
		author: "u/thePresenceofCheese",
		location: "USA",
		source: "Reddit",
		sourceUrl: "https://www.reddit.com/r/Aquariums/comments/1ikcgd1/aquadecor_background_initial_review/",
		avatar: "/media/avatars/placeholder-us-1.jpg",
	},
];

// Real testimonials for German locale from research
const DE_REVIEWS: QuickReview[] = [
	{
		id: "de-1",
		quote: "Die Puzzle Rückwand ist absolut top im Preis, seit 4 Jahren drin und keine Probleme",
		author: "Franky (Tanganjika Forum)",
		location: "Bietigheim-Bissingen",
		source: "Forum",
		sourceUrl: "https://tanganjika-cichliden-forum.de/index.php?thread/5639-eure-erfahrungen-mit-r%C3%BCckw%C3%A4nden-von-aquadecor/",
		avatar: "/media/avatars/placeholder-de-1.jpg",
	},
	{
		id: "de-2",
		quote: "Ein Bekannter ist absolut begeistert, Optik sehr natürlicher als ARStone und günstiger",
		author: "Anonymous (Tanganjika Forum)",
		location: "Deutschland",
		source: "Forum",
		sourceUrl: "https://tanganjika-cichliden-forum.de/index.php?thread/5639-eure-erfahrungen-mit-r%C3%BCckw%C3%A4nden-von-aquadecor/",
		avatar: "/media/avatars/placeholder-de-2.jpg",
	},
	{
		id: "de-3",
		quote: "Die Steine sehen verflucht gut aus",
		author: "Anonymous (Aquarium Forum)",
		location: "Schweizer Westen",
		source: "Forum",
		sourceUrl: "https://www.aquariumforum.de/t/felsen-und-steine-aus-kunststoff.1504271/",
		avatar: "/media/avatars/placeholder-de-3.jpg",
	},
	{
		id: "de-4",
		quote: "Vor 9 Jahren eine installiert, gute Inspiration für selbstgemachte",
		author: "Anonymous (Aquarium Forum)",
		location: "Deutschland",
		source: "Forum",
		sourceUrl: "https://www.aquariumforum.de/t/empfehlung-fuer-3d-rueckwand.1577104/",
		avatar: "/media/avatars/placeholder-de-4.jpg",
	},
];

// Real testimonials for Dutch locale from research
const NL_REVIEWS: QuickReview[] = [
	{
		id: "nl-1",
		quote: "Zeer gecharmeerd van het merk Aquadecor na vergelijking met anderen",
		author: "Anonymous (AquaForum)",
		location: "Nederland",
		source: "Forum",
		sourceUrl: "https://aquaforum.nl/threads/ervaringen-aquadecor-achterwanden.178304/",
		avatar: "/media/avatars/placeholder-nl-1.jpg",
	},
	{
		id: "nl-2",
		quote: "Mooie bak met Aquadecor achterwand, overhangende stenen en veel holen",
		author: "Anonymous (AquaForum)",
		location: "Nederland",
		source: "Forum",
		sourceUrl: "https://aquaforum.nl/threads/welk-malawi-bestand-voor-mijn-juwel-rio-350.178276/",
		avatar: "/media/avatars/placeholder-nl-2.jpg",
	},
	{
		id: "nl-3",
		quote: "Wat een mooie bak! Erg leuk met die overhangende stenen en schuilmogelijkheden",
		author: "Anonymous (AquaForum)",
		location: "Nederland",
		source: "Forum",
		sourceUrl: "https://aquaforum.nl/threads/welk-malawi-bestand-voor-mijn-juwel-rio-350.178276/",
		avatar: "/media/avatars/placeholder-nl-3.jpg",
	},
];

// Draft placeholders for Italian locale - no real ones found in research
const IT_REVIEWS: QuickReview[] = [
	{
		id: "1",
		// quote: "Sfondo e rocce medio grandi sono finte, dell'Aquadecor. Molto realistiche.",
		quote: "Prova anche con Aquadecor. Fanno sfondi e rocce con polistirolo duro, poi le verniciano. Io li tengo in 2 grandi vasche da oltre 5 anni. Perfette!",
		author: "Roberto Zampa",
		location: "Roma",
		source: "Forum",
		sourceUrl: "http://www.ciclidi.net/threads/rocce-sintetiche.11440/#:~:text=duro%2C%20poi%20le%20verniciano,ugualmente%20belle%2C%20abbastanza%20leggere%20e",
		avatar: "/media/avatars/placeholder-it-1.jpg",
	},
	{
		id: "2",
		quote: "Le rocce sintetiche sono molto belle. Non è facile capire quali siano quelle vere e quelle finte.",
		author: "Misidori",
		location: "Corridonia, MC",
		source: "Forum",
		sourceUrl: "https://www.ciclidi.net/threads/come-salvare-avannotti-in-vasca-di-comunit%C3%A0.10642/",
		avatar: "/media/avatars/misidori.jpg",
	},
	{
		id: "3",
		quote: "Dettagli incredibili e vestibilità perfetta",
		author: "Marco L.",
		location: "Napoli, Italia",
		source: "Forum",
		avatar: "/media/avatars/placeholder-it-3.jpg",
	},
];

// Testimonials organized by locale
export const REVIEWS_BY_LOCALE: Record<string, QuickReview[]> = {
	en: EN_REVIEWS,
	us: US_REVIEWS,
	nl: NL_REVIEWS,
	de: DE_REVIEWS,
	it: IT_REVIEWS,
	// Canadian English uses same as English
	ca: EN_REVIEWS,
};