// src/data/about.ts

export interface SalesStep {
	step: number;
	title: string;
	description: string;
}

export interface CompanyStat {
	label: string;
	value: string;
}

export const companyInfo = {
	name: "Aquadecor Aquarium Backgrounds",
	founder: "Florian Kovac",
	foundedLocation: "Serbia",
	currentMarket: "International (95% exports)",
	origins: "Started as a hobby in a bedroom, moved to a 9sqm shed, and grew into a global manufacturing facility.",
	mission: "To create aquarium habitats that mimic nature so closely that they reduce fish stress while serving as a centerpiece for modern interiors.",
};

export const salesProcess: SalesStep[] = [
	{
		step: 1,
		title: "Inquiry & Calculation",
		description: "Customers use the price calculator for an instant estimate or contact support for custom sizing.",
	},
	{
		step: 2,
		title: "Consultation",
		description: "Within 24 hours, the support team discusses specific technical details: filtration, gear hiding spots, and exact tank bracing dimensions.",
	},
	{
		step: 3,
		title: "Payment & Sketch",
		description: "After payment (PayPal/Bank Transfer), a unique sketch is created based on the customer's specific tank layout.",
	},
	{
		step: 4,
		title: "Hand-Crafted Production",
		description: "The background is built by hand. Quality checks are performed from the styrofoam carving stage to the final painting.",
	},
	{
		step: 5,
		title: "Photo Confirmation",
		description: "Before shipping, high-res photos of the finished product are sent to the customer for final approval.",
	},
	{
		step: 6,
		title: "Shipping & Tracking",
		description: "The product is packaged, sent to customs within 24 hours, and a tracking number is provided.",
	},
];

export const customerLoyaltyInfo = {
	returningCustomerDiscount: "10-20%",
	programDescription: "A significant portion of sales comes from returning customers loyal to the brand.",
};

export const futurePlans = [
	"Expansion into Sea-Water/Marine specific backgrounds",
	"Opening physical showrooms in EU countries",
];