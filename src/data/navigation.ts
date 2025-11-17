// src/data/navigation.ts

export interface NavLink {
	label: string;
	href: string;
	enabled: boolean;
	description?: string;
}

export const mainNavLinks: NavLink[] = [
	{
		label: "Shop",
		href: "/shop",
		enabled: true,
		description: "Browse our products",
	},
	{
		label: "Calculator",
		href: "/calculator",
		enabled: true,
		description: "Calculate custom dimensions",
	},
	{
		label: "Reviews",
		href: "/shop/reviews",
		enabled: true,
		description: "Customer testimonials",
	},
	{
		label: "About",
		href: "/about",
		enabled: false,
		description: "Our story",
	},
	{
		label: "Blog",
		href: "/blog",
		enabled: false,
		description: "Latest news",
	},
	{
		label: "Lang",
		href: "/en/lang",
		enabled: false, // Dev only
		description: "Language test page",
	},
	{
		label: "Admin",
		href: "/admin",
		enabled: false, // Dev only
		description: "Admin dashboard",
	},
	{
		label: "Sanctions",
		href: "/sanctions",
		enabled: false, // Dev only
		description: "Sanctions info",
	},
];

// Filter to only enabled links
export const enabledNavLinks = mainNavLinks.filter(link => link.enabled);