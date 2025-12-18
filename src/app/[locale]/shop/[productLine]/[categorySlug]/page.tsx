// src/app/[locale]/shop/[productLine]/[categorySlug]/page.tsx

import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ProductGrid } from "~/components/shop/product/ProductGrid";
import { api, HydrateClient } from "~/trpc/server";
import { generateSEOMetadata } from "~/i18n/seo/hreflang";
import { db } from '~/server/db';
import { categories } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateBreadcrumbSchema } from "~/i18n/seo/json-ld";

// Standardize caching behavior
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

interface PageProps {
	params: Promise<{
		locale: string;
		productLine: string;
		categorySlug: string;
	}>;
	searchParams: Promise<{
		market?: string;
	}>;
}

// ========================================
// STATIC GENERATION
// ========================================

export async function generateStaticParams() {
	const allCategories = await db.query.categories.findMany({
		columns: { slug: true, productLine: true },
		where: eq(categories.isActive, true)
	});

	return allCategories.map(cat => ({
		productLine: cat.productLine,
		categorySlug: cat.slug,
	}));
}

// ========================================
// SEO METADATA
// ========================================

export async function generateMetadata({ params }: PageProps) {
	const { locale, productLine, categorySlug } = await params;
	const dbLocale = locale === 'us' ? 'en' : locale;

	// Fetch category metadata from DB
	const categoryMeta = await api.product.getCategoryMetadataBySlug({
		categorySlug,
		locale: dbLocale,
	});

	if (!categoryMeta) {
		return {
			title: 'Category Not Found',
		};
	}

	const title = categoryMeta.metaTitle || categoryMeta.name || categorySlug;
	const description = categoryMeta.metaDescription || categoryMeta.description || '';

	return generateSEOMetadata({
		currentLocale: locale,
		path: `/shop/${productLine}/${categorySlug}`,
		title,
		description,
		image: categoryMeta.heroImageUrl || undefined,
		type: 'website',
	});
}

// ========================================
// PAGE COMPONENT
// ========================================

export default async function CategoryProductsPage({ params, searchParams }: PageProps) {
	const { locale, productLine, categorySlug } = await params;
	const { market = "ROW" } = await searchParams;

	setRequestLocale(locale);
	const dbLocale = locale === 'us' ? 'en' : locale;

	// 1. Parallel Data Fetching (Optimization)
	const productsPromise = api.product.getByCategory({
		categorySlug: categorySlug,
		locale: dbLocale,
		userMarket: market,
	});

	const categoryListPromise = api.product.getCategoriesForProductLine({
		productLineSlug: productLine,
		locale: dbLocale,
	});

	const [productsResult, categoriesList] = await Promise.all([productsPromise, categoryListPromise]);

	if (!productsResult || !("products" in productsResult)) {
		notFound();
	}

	const { products } = productsResult;
	const currentCategory = categoriesList.find((c) => c.slug === categorySlug);

	// Text formatting
	const productLineName = productLine === "3d-backgrounds" ? "3D Backgrounds" : "Aquarium Decorations";
	const categoryName =
		currentCategory?.name ??
		categorySlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

	// Transform data for the grid
	const productsForGrid = products.map((product) => ({
		id: product.id,
		slug: product.slug,
		name: product.name ?? "Untitled Product",
		sku: product.sku ?? null,
		shortDescription: product.shortDescription ?? null,
		stockStatus: product.stockStatus,
		heroImageUrl: product.heroImageUrl ?? null,
		heroImageAlt: product.heroImageAlt ?? null,
		categorySlug: categorySlug,
		productLineSlug: productLine,
		basePriceEurCents: product.unitPriceEurCents ?? null,
		priceNote: null,
		variantOptions: null,
		addonOptions: null,
	}));

	// ==================================================================
	// 2. JSON-LD (CollectionPage & ItemList)
	// ==================================================================

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aquadecorbackgrounds.com';
	const canonicalUrl = `${baseUrl}/${locale}/shop/${productLine}/${categorySlug}`;

	// Schema: Breadcrumbs
	const breadcrumbJsonLd = generateBreadcrumbSchema([
		{ name: "Home", url: `${baseUrl}/${locale}` },
		{ name: "Shop", url: `${baseUrl}/${locale}/shop` },
		{ name: categoryName, url: canonicalUrl }
	]);

	// Schema: CollectionPage with ItemList
	const collectionJsonLd = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"name": categoryName,
		"description": currentCategory?.description || "",
		"url": canonicalUrl,
		"mainEntity": {
			"@type": "ItemList",
			"itemListElement": products.map((p, index) => ({
				"@type": "ListItem",
				"position": index + 1,
				"url": `${baseUrl}/${locale}/shop/${productLine}/${categorySlug}/${p.slug}`
			}))
		}
	};

	return (
		<HydrateClient>
			{/* Inject Schemas */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
			/>

			<main className="min-h-screen">
				{/* Header Section */}
				<section className="py-16 md:py-20 bg-linear-to-b from-muted/30 to-transparent">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="max-w-4xl mx-auto text-center space-y-6">
							<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
								<span className="text-sm text-primary font-display font-medium">{productLineName}</span>
							</div>

							{currentCategory?.modelCode && (
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full border ml-2">
									<span className="text-xs font-display font-medium text-muted-foreground">
										{currentCategory.modelCode} Series
									</span>
								</div>
							)}

							<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
								{categoryName}
							</h1>

							{currentCategory?.description && (
								<p className="text-lg md:text-xl text-muted-foreground font-display font-light leading-relaxed max-w-2xl mx-auto">
									{currentCategory.description}
								</p>
							)}

							<p className="text-sm text-muted-foreground/80 font-display font-light">
								{products.length} {products.length === 1 ? "product" : "products"} available
							</p>
						</div>

						{/* Category Features */}
						{currentCategory?.contentBlocks?.features && (
							<div className="mt-8 flex flex-wrap justify-center gap-3">
								{currentCategory.contentBlocks.features.map((feature, idx) => (
									<div
										key={idx}
										className="inline-flex items-center gap-2 px-3 py-1 bg-background border rounded-full text-xs text-muted-foreground"
									>
										<span>✓</span>
										<span>{feature}</span>
									</div>
								))}
							</div>
						)}
					</div>
				</section>

				{/* Products Grid */}
				<section className="pb-12 md:pb-16">
					<div className="px-4 max-w-7xl mx-auto">
						<ProductGrid products={productsForGrid} initialColumns="4" showControls={true} />
					</div>
				</section>

				{/* Trust Footer */}
				<section className="py-12 md:py-16 border-t bg-accent/5">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="flex flex-wrap items-center justify-center gap-8 text-sm font-display font-light">
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>Free Worldwide Shipping</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>Made to Order</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>Custom Sizes Available</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>20+ Years Experience</span>
							</div>
						</div>
					</div>
				</section>
			</main>
		</HydrateClient>
	);
}