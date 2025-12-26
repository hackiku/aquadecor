// src/app/[locale]/shop/[productLine]/[categorySlug]/page.tsx

import { notFound } from "next/navigation";
import { ArrowRight, Package, AlertCircle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { api, HydrateClient } from "~/trpc/server";
import { ProductGrid } from "~/components/shop/product/ProductGrid";
import { generateSEOMetadata } from "~/i18n/seo/hreflang";
import { db } from '~/server/db';
import { categories, categoryTranslations } from '~/server/db/schema';
import { eq, and } from 'drizzle-orm';

// ⚡ ISR: Regenerate every hour
export const revalidate = 3600;

type Props = {
	params: Promise<{
		locale: string;
		productLine: string;
		categorySlug: string;
	}>;
};

// ========================================
// STATIC GENERATION
// ========================================

export async function generateStaticParams() {
	const allCategories = await db
		.select({
			productLine: categories.productLine,
			slug: categories.slug,
		})
		.from(categories)
		.where(eq(categories.isActive, true));

	return allCategories.map(cat => ({
		productLine: cat.productLine,
		categorySlug: cat.slug,
	}));
}

// ========================================
// METADATA
// ========================================

export async function generateMetadata({ params }: Props) {
	const { locale, productLine, categorySlug } = await params;
	const dbLocale = locale === 'us' ? 'en' : locale;

	try {
		// Fetch category with translations directly
		const [category] = await db
			.select({
				name: categoryTranslations.name,
				description: categoryTranslations.description,
			})
			.from(categories)
			.leftJoin(
				categoryTranslations,
				and(
					eq(categoryTranslations.categoryId, categories.id),
					eq(categoryTranslations.locale, dbLocale)
				)
			)
			.where(
				and(
					eq(categories.slug, categorySlug),
					eq(categories.isActive, true)
				)
			)
			.limit(1);

		if (!category) return { title: 'Category Not Found' };

		const categoryName = category.name || categorySlug
			.split("-")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(" ");

		return generateSEOMetadata({
			currentLocale: locale,
			path: `/shop/${productLine}/${categorySlug}`,
			title: categoryName,
			description: category.description || `Browse ${categoryName}`,
			type: 'website',
		});
	} catch (error) {
		return { title: "Shop" };
	}
}

// ========================================
// PAGE
// ========================================

export default async function CategoryPage({ params }: Props) {
	const { locale, productLine, categorySlug } = await params;
	setRequestLocale(locale);

	const t = await getTranslations('shop');
	const dbLocale = locale === 'us' ? 'en' : locale;

	let categoryName = categorySlug
		.split("-")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
	let categoryDescription: string | null = null;
	let products: Awaited<ReturnType<typeof api.product.getByCategory>> = {
		products: [],
		categorySlug,
		productLineSlug: null
	};
	let error = false;

	try {
		// Fetch category name and description
		const [categoryData] = await db
			.select({
				name: categoryTranslations.name,
				description: categoryTranslations.description,
			})
			.from(categories)
			.leftJoin(
				categoryTranslations,
				and(
					eq(categoryTranslations.categoryId, categories.id),
					eq(categoryTranslations.locale, dbLocale)
				)
			)
			.where(
				and(
					eq(categories.slug, categorySlug),
					eq(categories.isActive, true)
				)
			)
			.limit(1);

		if (categoryData?.name) {
			categoryName = categoryData.name;
			categoryDescription = categoryData.description;
		}

		// Fetch products using existing router method
		products = await api.product.getByCategory({
			categorySlug,
			locale: dbLocale,
			userMarket: "ROW",
		});
	} catch (err) {
		console.error('Failed to load category:', err);
		error = true;
	}

	const productsForGrid = "products" in products
		? products.products.map((p) => ({
			id: p.id,
			slug: p.slug,
			name: p.name ?? "Untitled Product",
			sku: p.sku ?? null,
			shortDescription: p.shortDescription ?? null,
			stockStatus: p.stockStatus,
			heroImageUrl: p.heroImageUrl ?? null,
			heroImageAlt: p.heroImageAlt ?? null,
			categorySlug: categorySlug,
			productLineSlug: productLine,
			basePriceEurCents: p.unitPriceEurCents ?? null,
			priceNote: null,
			variantOptions: null,
			addonOptions: null,
		}))
		: [];

	return (
		<HydrateClient>
			<main className="min-h-screen">
				{/* Hero */}
				<section className="relative py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
					<div className="px-4 max-w-7xl mx-auto text-center space-y-6">
						<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
							<Package className="h-4 w-4 text-primary" />
							<span className="text-sm text-primary font-display font-medium">
								{categoryName}
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
							{categoryName}
						</h1>
						{categoryDescription && (
							<p className="text-xl text-muted-foreground font-display font-light max-w-3xl mx-auto">
								{categoryDescription}
							</p>
						)}
					</div>
				</section>

				{/* Products */}
				<section className="py-12 md:py-16">
					<div className="px-4 max-w-7xl mx-auto">
						{error ? (
							<div className="py-16 text-center space-y-4">
								<AlertCircle className="h-12 w-12 text-muted-foreground/50 mx-auto" />
								<p className="text-lg font-display">{t('error.loadFailed')}</p>
							</div>
						) : productsForGrid.length === 0 ? (
							<div className="py-16 text-center">
								<p className="text-muted-foreground font-display">{t('productGrid.noProducts')}</p>
							</div>
						) : (
							<ProductGrid
								products={productsForGrid as any}
								initialColumns="3"
								showControls={true}
							/>
						)}
					</div>
				</section>
			</main>
		</HydrateClient>
	);
}