// src/components/navigation/Breadcrumbs.tsx
"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';
import { Link } from '~/i18n/navigation';
import { ChevronRight, Home } from "lucide-react";
import { cn } from "~/lib/utils";

interface BreadcrumbItem {
	label: string;
	href: string;
	isTranslatable?: boolean;
}

export function Breadcrumbs() {
	const pathname = usePathname();
	const t = useTranslations('common.nav');

	// Remove locale from pathname (e.g., /en/shop/... -> /shop/...)
	const pathWithoutLocale = pathname.replace(/^\/(en|de|nl|it|us)/, '');
	const segments = pathWithoutLocale.split("/").filter(Boolean);

	// Build breadcrumb items
	const items: BreadcrumbItem[] = [];
	let currentPath = "";

	segments.forEach((segment, index) => {
		currentPath += `/${segment}`;

		// Check if this is a translatable segment
		const isTranslatable = index === 0 && segment === 'shop'; // Only 'shop' root is translatable for now

		// Format the label - convert slugs to readable text
		let label = segment
			.split("-")
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

		// Translate if it's a known segment
		if (isTranslatable && segment === 'shop') {
			label = t('shop');
		}

		// TODO: Future - Transform product IDs to product names
		// if (isProductId(segment)) {
		//   label = await getProductName(segment);
		// }

		items.push({
			label,
			href: currentPath,
			isTranslatable,
		});
	});

	return (
		<nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
			{/* Home Icon + Shop combined */}
			<Link
				href="/shop"
				className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors font-display font-light"
				aria-label="Shop Home"
			>
				<Home className="h-4 w-4" />
				<span>{t('shop')}</span>
			</Link>

			{/* Only show segments after 'shop' */}
			{items.slice(1).map((item, index) => {
				const isLast = index === items.length - 2; // -2 because we sliced off first item

				return (
					<div key={item.href} className="flex items-center gap-2">
						<ChevronRight className="h-4 w-4 text-white/40" />
						{isLast ? (
							<span className="font-display font-medium text-white">
								{item.label}
							</span>
						) : (
							<Link
								href={item.href as any}
								className="font-display font-light text-white/70 hover:text-white transition-colors"
							>
								{item.label}
							</Link>
						)}
					</div>
				);
			})}
		</nav>
	);
}

// TODO: Helper functions for future product name transformation
// async function getProductName(productSlug: string): Promise<string> {
//   // Query database for product name by slug
//   // const product = await db.query.products.findFirst({
//   //   where: eq(products.slug, productSlug)
//   // });
//   // return product?.name || formatSlug(productSlug);
//   return formatSlug(productSlug);
// }
//
// function isProductId(segment: string): boolean {
//   // Check if segment matches product slug pattern
//   // e.g., starts with model number like "d-6-gray-cracked..."
//   return /^[a-z]-\d+-/.test(segment);
// }
//
// function formatSlug(slug: string): string {
//   return slug
//     .split("-")
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// }