// src/app/admin/_data/admin-pages.ts

import {
	LayoutDashboard,
	ShoppingBag,
	ShoppingCart,
	Calculator,
	Percent,
	Users,
	Image,
	HelpCircle,
	Globe,
	Heart,
	Settings,
	type LucideIcon,
} from "lucide-react";

export interface AdminPage {
	title: string;
	href: string;
	icon: LucideIcon;
	description?: string;
	badge?: string; // For notification counts
	children?: AdminPage[];
}

export const adminPages: AdminPage[] = [
	{
		title: "Dashboard",
		href: "/admin",
		icon: LayoutDashboard,
		description: "Overview and analytics",
	},
	{
		title: "Catalog",
		href: "/admin/catalog",
		icon: ShoppingBag,
		description: "Products and categories",
		children: [
			{
				title: "Products",
				href: "/admin/catalog/products",
				icon: ShoppingBag,
			},
			{
				title: "Categories",
				href: "/admin/catalog/categories",
				icon: ShoppingBag,
			},
		],
	},
	{
		title: "Orders",
		href: "/admin/orders",
		icon: ShoppingCart,
		description: "Customer orders",
		badge: "12", // TODO: Fetch from tRPC
	},
	{
		title: "Price Calculator",
		href: "/admin/calculator",
		icon: Calculator,
		description: "Pricing rules and formulas",
	},
	{
		title: "Discounts",
		href: "/admin/discounts",
		icon: Percent,
		description: "Coupons and sales",
	},
	{
		title: "Promoters",
		href: "/admin/promoters",
		icon: Users,
		description: "Affiliate program",
	},
	{
		title: "Gallery",
		href: "/admin/gallery",
		icon: Image,
		description: "Image management",
	},
	{
		title: "Wishlist",
		href: "/admin/wishlist",
		icon: Heart,
		description: "Popular products",
	},
	{
		title: "FAQs",
		href: "/admin/faqs",
		icon: HelpCircle,
		description: "Customer questions",
	},
	{
		title: "Countries",
		href: "/admin/countries",
		icon: Globe,
		description: "Supported regions",
	},
	{
		title: "Settings",
		href: "/admin/settings",
		icon: Settings,
		description: "Site configuration",
	},
];

// Helper to get current page data
export function getAdminPage(pathname: string): AdminPage | undefined {
	for (const page of adminPages) {
		if (page.href === pathname) return page;
		if (page.children) {
			const child = page.children.find((c) => c.href === pathname);
			if (child) return child;
		}
	}
	return undefined;
}

// Helper to check if page is active
export function isPageActive(page: AdminPage, pathname: string): boolean {
	if (page.href === pathname) return true;
	if (page.children) {
		return page.children.some((child) => pathname.startsWith(child.href));
	}
	return false;
}