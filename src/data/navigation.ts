// src/data/navigation.ts

export interface NavLink {
	label: string;
	href: string;
	enabled: boolean;
	showInNav?: boolean; // Show in main navigation
	showInFooter?: boolean; // Show in footer
	description?: string;
	badge?: string; // Optional badge like "New", "Beta"
}

export interface ResourceLink {
	label: string;
	href: string;
	description: string;
	icon?: string; // Optional icon name
}

// Main navigation links
export const mainNavLinks: NavLink[] = [
	{
		label: "Shop",
		href: "/shop",
		enabled: true,
		showInNav: true,
		showInFooter: true,
		description: "Browse our 3D backgrounds and decorations",
	},
	{
		label: "Calculator",
		href: "/calculator",
		enabled: true,
		showInNav: true,
		showInFooter: true,
		description: "Design your custom background",
		badge: "Custom",
	},
	{
		label: "Reviews",
		href: "/shop/reviews",
		enabled: true,
		showInNav: false, // In footer only
		showInFooter: true,
		description: "What our customers say",
	},
	{
		label: "About",
		href: "/about",
		enabled: false,
		showInNav: true,
		showInFooter: true,
		description: "20+ years of excellence",
	},
	{
		label: "Blog",
		href: "/blog",
		enabled: false,
		showInNav: true,
		showInFooter: true,
		description: "Aquarium tips and news",
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

// Dev/admin links (never show in prod nav/footer)
export const devLinks: NavLink[] = [
	{
		label: "Lang Test",
		href: "/en/lang",
		enabled: false,
		description: "i18n testing",
	},
	{
		label: "Admin",
		href: "/admin",
		enabled: false,
		description: "Dashboard",
	},
	{
		label: "Sanctions",
		href: "/sanctions",
		enabled: false,
		description: "Sanctions info",
	},
];

// Filters
export const enabledNavLinks = mainNavLinks.filter(
	(link) => link.enabled && link.showInNav
);

export const footerLinks = mainNavLinks.filter(
	(link) => link.enabled && link.showInFooter
);

export const allEnabledLinks = mainNavLinks.filter((link) => link.enabled);