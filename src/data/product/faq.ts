// src/data/faq.ts
// gemini from blog

export interface FAQItem {
	question: string;
	answer: string;
	category: "Maintenance" | "Installation" | "Safety";
}

export const faqs: FAQItem[] = [
	{
		question: "Will the background affect my water pH?",
		answer: "No. Unlike natural limestone rocks which raise pH/hardness, Aquadecor backgrounds are chemically inert and tested with hydrochloric acid to ensure zero limestone content.",
		category: "Safety",
	},
	{
		question: "How do I clean the background?",
		answer: "You can scrub the background with a standard plastic aquarium brush. For deep cleaning during a tank reset, the materials are resistant enough to handle boiling water or stronger aquarium-safe cleaners.",
		category: "Maintenance",
	},
	{
		question: "Does the background take up a lot of water volume?",
		answer: "No. Most models, especially the Wood/Root and Slim series, are hollow-backed or thin. They displace very little water compared to real rocks.",
		category: "Installation",
	},
	{
		question: "Can I hide my heater and filter inlet behind it?",
		answer: "Yes. We recommend installing the background a few inches off the back glass or using our specific hollow models (like Model A or Wood) to create a hidden compartment for gear, improving the tank's aesthetics.",
		category: "Installation",
	},
];