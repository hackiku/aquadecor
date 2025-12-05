// src/app/admin/_data/admin-pages.ts

import {
	LayoutDashboard,
	ShoppingBag,
	ShoppingCart,
	Calculator,
	Percent,
	Pin,
	Users,
	Image,
	HelpCircle,
	Globe,
	Heart,
	Settings,
	Package,
	Layers,
	Tag,
	FileText,
	Home,
	CircleDollarSign,
	type LucideIcon,
} from "lucide-react";

export interface AdminPage {
	title: string;
	href: string;
	icon: LucideIcon;
	description?: string;
	badge?: string; // For notification counts
	inactive?: boolean; // Page not built yet
	children?: AdminPage[];
}

export const adminPages: AdminPage[] = [
	{
		title: "Dashboard",
		href: "/admin",
		icon: LayoutDashboard,
	},
	{
		title: "Orders",
		href: "/admin/orders",
		icon: Package,
	},
	{
		title: "Catalog",
		href: "/admin/catalog",
		icon: Package,
		children: [
			{
				title: "Catalog",
				href: "/admin/catalog/",
				icon: Home,
			},
			{
				title: "Products",
				href: "/admin/catalog/products",
				icon: ShoppingBag,
			},
			{
				title: "Categories",
				href: "/admin/catalog/categories",
				icon: Layers,
			},
			{
				title: "Featured",
				href: "/admin/catalog/featured",
				icon: Pin,
			},
		],
	},
	{
		title: "Content",
		href: "/admin/content",
		icon: FileText,
		children: [
			{
				title: "Content",
				href: "/admin/content",
				icon: Home,
			},
			{
				title: "Gallery",
				href: "/admin/content/gallery",
				icon: Image,
			},
			{
				title: "FAQ",
				href: "/admin/content/faq",
				icon: FileText,
			},
		],
	},
	{
		title: "Promo",
		href: "/admin/promo",
		icon: Tag,
		children: [
			{
				title: "Promo",
				href: "/admin/promo",
				icon: Home,
			},
			{
				title: "Sales",
				href: "/admin/promo/sales",
				icon: CircleDollarSign,
			},
			{
				title: "Promoters",
				href: "/admin/promo/promoters",
				icon: Users,
			},
			{
				title: "Discounts",
				href: "/admin/promo/discounts",
				icon: Tag,
			},
		],
	},
	{
		title: "Price Calculator",
		href: "/admin/calculator",
		icon: Calculator,
		description: "Pricing rules and formulas",
		inactive: true,
	},
	{
		title: "Wishlist",
		href: "/admin/wishlist",
		icon: Heart,
		description: "Popular products",
		inactive: true,
	},
	{
		title: "Countries",
		href: "/admin/countries",
		icon: Globe,
		description: "Supported regions",
		inactive: false,
	},
	// {
	// 	title: "Settings",
	// 	href: "/admin/settings",
	// 	icon: Settings,
	// 	description: "Site configuration",
	// 	inactive: true,
	// },
	{
		title: "Test Storage",
		href: "/admin/test-storage",
		icon: HelpCircle,
		description: "Supabase storage test",
		inactive: false,
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