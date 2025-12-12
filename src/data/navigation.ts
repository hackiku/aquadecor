// src/data/navigation.ts

export interface NavLink {
	labelKey: string; // Translation key (without namespace prefix)
	href: string;
	enabled: boolean;
	showInNav?: boolean;
	showInFooter?: boolean;
	descriptionKey?: string;
	badge?: string;
	category?: "shop" | "resources" | "company" | "legal";
}

export interface ResourceLink {
	labelKey: string;
	href: string;
	descriptionKey: string;
	icon?: string;
}

// Main navigation links organized by category
// Keys should NOT include 'nav.' prefix - the hook handles that
export const mainNavLinks: NavLink[] = [
	// Shop Category
	{
		labelKey: "shop",
		href: "/shop",
		enabled: true,
		showInNav: true,
		showInFooter: true,  // ← Added to footer!
		descriptionKey: "shopDescription",
		category: "shop",
	},
	{
		labelKey: "backgrounds",
		href: "/shop/3d-backgrounds",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "shop",
	},
	{
		labelKey: "decorations",
		href: "/shop/aquarium-decorations",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "shop",
	},
	{
		labelKey: "gallery",
		href: "/gallery",
		enabled: true,
		showInNav: true,
		showInFooter: true,
		category: "shop",
	},
	{
		labelKey: "calculator",
		href: "/calculator",
		enabled: true,
		showInNav: true,
		showInFooter: true,
		category: "shop",
		badge: "Custom",
		descriptionKey: "calculatorDescription",
	},

	// Resources Category (Help)
	{
		labelKey: "faq",
		href: "/faq",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "resources",
	},
	{
		labelKey: "setup",
		href: "/setup",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "resources",
	},
	{
		labelKey: "support",
		href: "/support",
		enabled: false,
		showInNav: false,
		showInFooter: true,
		category: "resources",
	},

	// Company Category
	{
		labelKey: "about",
		href: "/about",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "company",
	},
	{
		labelKey: "blog",
		href: "/blog",
		enabled: true,
		showInNav: true,
		showInFooter: true,
		category: "company",
	},
	{
		labelKey: "reviews",
		href: "/reviews",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "company",
	},
	{
		labelKey: "distributors",
		href: "/distributors",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "company",
	},
	{
		labelKey: "contact",
		href: "/contact",
		enabled: false,
		showInNav: false,
		showInFooter: true,
		category: "company",
	},

	// Legal
	{
		labelKey: "terms",
		href: "/legal/terms",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "legal",
	},
	{
		labelKey: "privacy",
		href: "/legal/privacy",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "legal",
	},
	{
		labelKey: "shipping",
		href: "/legal/shipping",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "legal",
	},
	{
		labelKey: "refund",
		href: "/legal/refund",
		enabled: true,
		showInNav: false,
		showInFooter: true,
		category: "legal",
	},
];

// Resources dropdown items (for mega menu)
// Note: These use different keys because they're nav-specific
export const resourceLinks: ResourceLink[] = [
	{
		labelKey: "setup",
		href: "/setup",
		descriptionKey: "setupDescription",
		icon: "wrench",
	},
	{
		labelKey: "support",
		href: "/support",
		descriptionKey: "supportDescription",
		icon: "headphones",
	},
	{
		labelKey: "faq",
		href: "/faq",
		descriptionKey: "faqDescription",
		icon: "circle-help",
	},
	{
		labelKey: "shippingReturns",  // Different key for nav
		href: "/legal/shipping",
		descriptionKey: "shippingDescription",
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
	resources: footerLinks.filter((l) => l.category === "resources"),
	company: footerLinks.filter((l) => l.category === "company"),
	legal: footerLinks.filter((l) => l.category === "legal"),
};

export const allEnabledLinks = mainNavLinks.filter((link) => link.enabled);