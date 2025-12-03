// src/data/navigation.ts

export interface NavLink {
	label: string;
	href: string;
	enabled: boolean;
	showInNav?: boolean;
	showInFooter?: boolean;
	description?: string;
	badge?: string;
	category?: "shop" | "custom" | "help" | "contact" | "legal";
}

export interface ResourceLink {
	label: string;
	href: string;
	description: string;
	icon?: string;
}

// Main navigation links organized by category
export const mainNavLinks: NavLink[] = [
	// Shop
	{
		label: "Shop",
		href: "/shop",
		enabled: true,
		showInNav: true,
		showInFooter: false,
		description: "Browse our 3D backgrounds and decorations",
	},
	{
		label: "3D Backgrounds",
		href: "/shop/3d-backgrounds",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "shop",
	},
	{
		label: "Aquarium Decorations",
		href: "/shop/aquarium-decorations",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "shop",
	},
	{
		label: "Reviews",
		href: "/shop/reviews",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "shop",
	},
	{
		label: "Gallery",
		href: "/gallery",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "shop",
	},

	// Custom
	{
		label: "Calculator",
		href: "/calculator",
		enabled: true,
		showInNav: true,
		showInFooter: true,
		category: "custom",
		badge: "Custom",
		description: "Design your custom background",
	},

	// Help
	{
		label: "FAQ",
		href: "/faq",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "help",
	},
	{
		label: "Setting Up",
		href: "/setup",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "help",
	},

	// Contact
	{
		label: "About Us",
		href: "/about",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "contact",
	},
	{
		label: "Contact",
		href: "/contact",
		enabled: false,
		showInNav: false,
		showInFooter: true,
		category: "contact",
	},
	{
		label: "Distributors",
		href: "/distributors",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "contact",
	},
	{
		label: "Blog",
		href: "/blog",
		enabled: true,
		showInNav: true,
		showInFooter: false,
		category: "contact",
	},

	// Legal
	{
		label: "Terms and Conditions",
		href: "/en/terms",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "legal",
	},
	{
		label: "Privacy Policy",
		href: "/en/privacy",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "legal",
	},
	{
		label: "Shipping Policy",
		href: "/en/shipping",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "legal",
	},
	{
		label: "Refund Policy",
		href: "/en/refund",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "legal",
	},
];

// Resources dropdown items
export const resourceLinks: ResourceLink[] = [
	{
		label: "Setup Guide",
		href: "/setup",
		description: "10 installation configurations",
		icon: "wrench",
	},
	{
		label: "Customer Support",
		href: "/support",
		description: "Get help with your order",
		icon: "headphones",
	},
	{
		label: "FAQ",
		href: "/faq",
		description: "Common questions answered",
		icon: "circle-help",
	},
	{
		label: "Shipping & Returns",
		href: "/shipping",
		description: "Delivery and return policies",
		icon: "truck",
	},
];

// Filters
export const enabledNavLinks = mainNavLinks.filter(
	(link) => link.enabled && link.showInNav
);

export const footerLinks = mainNavLinks.filter(
	(link) => link.enabled && link.showInFooter
);

export const footerLinksByCategory = {
	shop: footerLinks.filter((l) => l.category === "shop"),
	custom: footerLinks.filter((l) => l.category === "custom"),
	help: footerLinks.filter((l) => l.category === "help"),
	contact: footerLinks.filter((l) => l.category === "contact"),
	legal: footerLinks.filter((l) => l.category === "legal"),
};

export const allEnabledLinks = mainNavLinks.filter((link) => link.enabled);