// src/app/[locale]/shop/[productLine]/[categorySlug]/[productSlug]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { api, HydrateClient } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { Package, Shield, Zap, CheckCircle2 } from "lucide-react";
import { db } from '~/server/db';
import { products, categories } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
// components
import { CustomOnlyBadge } from "~/components/shop/product/CustomOnlyBadge";
import { PricingCard } from "~/components/shop/checkout/PricingCard";
import { LongDescriptionSection } from "~/components/shop/product/LongDescriptionSection";
import { ImageSliderWithModal } from "~/components/shop/product/ImageSliderWithModal";
import { ProductGrid } from "~/components/shop/product/ProductGrid";
import { getTranslations } from "next-intl/server";
// seo
import { generateSEOMetadata } from "~/i18n/seo/hreflang";
import { generateProductSchema, generateBreadcrumbSchema } from "~/i18n/seo/json-ld";

// ⚡ ISR: Regenerate pages every hour, but serve stale while revalidating
export const revalidate = 3600; // 1 hour

interface ProductDetailPageProps {
	params: Promise<{
		locale: string;
		productLine: string;
		categorySlug: string;
		productSlug: string;
	}>;
	searchParams: Promise<{
		market?: string;
	}>;
}

// ========================================
// STATIC GENERATION
// ========================================

export async function generateStaticParams() {
	// Fetch all active products with their category info
	const allProducts = await db
		.select({
			productSlug: products.slug,
			categoryId: products.categoryId,
		})
		.from(products)
		.where(eq(products.isActive, true));

	// Fetch all active categories to map IDs to slugs
	const allCategories = await db.query.categories.findMany({
		columns: { id: true, slug: true, productLine: true },
		where: eq(categories.isActive, true)
	});

	// Create a map for quick lookup
	const categoryMap = new Map(
		allCategories.map(cat => [cat.id, { slug: cat.slug, productLine: cat.productLine }])
	);

	// Generate params for each product
	return allProducts
		.map(product => {
			const category = categoryMap.get(product.categoryId);
			if (!category) return null;

			return {
				productLine: category.productLine,
				categorySlug: category.slug,
				productSlug: product.productSlug,
			};
		})
		.filter((p): p is NonNullable<typeof p> => p !== null);
}

// ========================================
// SEO METADATA WITH HREFLANG
// ========================================

export async function generateMetadata({ params }: ProductDetailPageProps) {
	const { locale, productLine, categorySlug, productSlug } = await params;
	const dbLocale = locale === 'us' ? 'en' : locale;

	try {
		const productMeta = await api.product.getProductMetadataBySlug({
			productSlug,
			locale: dbLocale,
		});

		if (!productMeta) return { title: 'Product Not Found' };

		return generateSEOMetadata({
			currentLocale: locale,
			path: `/shop/${productLine}/${categorySlug}/${productSlug}`,
			title: productMeta.metaTitle || productMeta.name || productSlug,
			description: productMeta.metaDescription || productMeta.shortDescription || '',
			image: productMeta.heroImageUrl || undefined,
			type: 'website',
		});
	} catch (error) {
		return { title: "AquaDecor" };
	}
}

// ========================================
// PAGE COMPONENT
// ========================================

export default async function ProductDetailPage({ params, searchParams }: ProductDetailPageProps) {
	const { locale, productLine, categorySlug, productSlug } = await params;
	const { market = "ROW" } = await searchParams;

	setRequestLocale(locale);

	const t = await getTranslations('shop.productDetail');
	const dbLocale = locale === 'us' ? 'en' : locale;

	// Fetch Data in Parallel
	const [product, relatedProductsResult] = await Promise.all([
		api.product.getBySlug({
			slug: productSlug,
			locale: dbLocale,
			userMarket: market,
		}),
		api.product.getByCategory({
			categorySlug,
			locale: dbLocale,
			userMarket: market,
		}),
	]);

	if (!product) {
		notFound();
	}

	const isCustomOnly =
		product.pricing?.pricingType === "configuration" ||
		product.stockStatus === "requires_quote" ||
		!product.pricing;

	const productForButtons = {
		...product,
		categorySlug,
		productLineSlug: productLine,
		name: product.name ?? "Product",
	};

	const relatedProducts =
		"products" in relatedProductsResult
			? relatedProductsResult.products.filter((p) => p.slug !== productSlug).slice(0, 4)
			: [];

	const productsForGrid = relatedProducts.map((p) => ({
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
	}));

	const categoryDisplayName = categorySlug
		.split("-")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");

	// ========================================
	// SEO & STRUCTURED DATA (JSON-LD)
	// ========================================

	const schemaPrice = isCustomOnly
		? null
		: (product.pricing?.salePrice ?? product.pricing?.unitPriceEurCents ?? null);

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aquadecorbackgrounds.com';
	const canonicalUrl = `${baseUrl}/${locale}/shop/${productLine}/${categorySlug}/${productSlug}`;

	const productJsonLd = generateProductSchema({
		name: product.name ?? "Product",
		description: product.shortDescription || product.name || "",
		images: product.images?.map(img => img.storageUrl).filter(Boolean) as string[] || [],
		sku: product.sku || "N/A",
		priceCents: schemaPrice,
		currency: (product.pricing?.currency as "EUR" | "USD") || "EUR",
		availability: product.stockStatus || "in_stock",
		url: canonicalUrl
	});

	const breadcrumbJsonLd = generateBreadcrumbSchema([
		{ name: "Home", url: `${baseUrl}/${locale}` },
		{ name: "Shop", url: `${baseUrl}/${locale}/shop` },
		{ name: categoryDisplayName, url: `${baseUrl}/${locale}/shop/${productLine}/${categorySlug}` },
		{ name: product.name ?? "Product", url: canonicalUrl }
	]);

	return (
		<HydrateClient>
			{/* ✅ Clean JSON-LD injection */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>

			<main className="min-h-screen">
				{/* Hero Section */}
				<section className="relative h-[40vh] md:h-[50vh] border-b bg-black">
					{product.images && product.images[0] ? (
						<Image
							src={product.images[0].storageUrl || "/placeholder.svg"}
							alt={product.images[0].altText ?? product.name ?? "Product"}
							fill
							className="object-cover"
							priority
						/>
					) : (
						<div className="absolute inset-0 bg-muted flex items-center justify-center">
							<Package className="h-20 w-20 text-muted-foreground/20" />
						</div>
					)}

					<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

					<div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
						<div className="max-w-7xl mx-auto space-y-3">
							<div className="flex items-center gap-3 mb-4">
								{product.sku && (
									<Badge variant="secondary" className="font-display text-xs">
										{product.sku}
									</Badge>
								)}
								{product.stockStatus === "in_stock" && (
									<Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 text-xs">
										{t('badges.inStock')}
									</Badge>
								)}
								{product.stockStatus === "made_to_order" && (
									<Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-xs">
										{t('badges.madeToOrder')}
									</Badge>
								)}
								{isCustomOnly && <CustomOnlyBadge variant="inline" />}
							</div>
							<h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-light text-white drop-shadow-lg">
								{product.name ?? "Product"}
							</h1>
							<p className="text-lg text-neutral-400/90 max-w-4xl font-display font-light leading-relaxed">
								{product.shortDescription}
							</p>
						</div>
					</div>
				</section>

				{/* Main Content */}
				<section className="py-12 md:py-16">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
							<div className="lg:col-span-2 space-y-8">
								<ImageSliderWithModal
									images={product.images || []}
									productName={product.name ?? "Product"}
								/>

								<div className="space-y-4">
									<h2 className="text-2xl font-display font-normal">
										{t('sections.productDetails')}
									</h2>
									<LongDescriptionSection longDescription={product.longDescription} />
								</div>

								{product.material && (
									<div className="space-y-4">
										<h2 className="text-2xl font-display font-normal">
											{t('sections.specifications')}
										</h2>
										<div className="grid gap-3">
											{product.material && (
												<div className="flex justify-between py-2 border-b">
													<span className="text-muted-foreground">{t('specs.material')}</span>
													<span className="font-medium">{product.material}</span>
												</div>
											)}
											{product.widthCm && (
												<div className="flex justify-between py-2 border-b">
													<span className="text-muted-foreground">{t('specs.width')}</span>
													<span className="font-medium">{product.widthCm} cm</span>
												</div>
											)}
											{product.heightCm && (
												<div className="flex justify-between py-2 border-b">
													<span className="text-muted-foreground">{t('specs.height')}</span>
													<span className="font-medium">{product.heightCm} cm</span>
												</div>
											)}
											{product.productionTime && (
												<div className="flex justify-between py-2 border-b">
													<span className="text-muted-foreground">{t('specs.productionTime')}</span>
													<span className="font-medium">{product.productionTime}</span>
												</div>
											)}
										</div>
									</div>
								)}

								<div className="space-y-4">
									<h2 className="text-2xl font-display font-normal">
										{t('sections.keyFeatures')}
									</h2>
									<div className="grid gap-4">
										<div className="flex items-start gap-4 p-4 rounded-xl border bg-card">
											<div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
												<Shield className="h-5 w-5 text-primary" />
											</div>
											<div className="space-y-1">
												<h3 className="font-display font-medium">Lifetime Warranty</h3>
												<p className="text-sm text-muted-foreground font-display font-light">
													Chemical-resistant materials that never leach or affect water chemistry
												</p>
											</div>
										</div>

										<div className="flex items-start gap-4 p-4 rounded-xl border bg-card">
											<div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
												<Zap className="h-5 w-5 text-primary" />
											</div>
											<div className="space-y-1">
												<h3 className="font-display font-medium">Easy Installation</h3>
												<p className="text-sm text-muted-foreground font-display font-light">
													Modular design with numbered sections for seamless assembly
												</p>
											</div>
										</div>

										<div className="flex items-start gap-4 p-4 rounded-xl border bg-card">
											<div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
												<CheckCircle2 className="h-5 w-5 text-primary" />
											</div>
											<div className="space-y-1">
												<h3 className="font-display font-medium">Maintenance Free</h3>
												<p className="text-sm text-muted-foreground font-display font-light">
													Scrub-safe surface - algae wipes off easily without damage
												</p>
											</div>
										</div>
									</div>
								</div>

								{product.images && product.images.length > 1 && (
									<div className="space-y-4">
										<h2 className="text-2xl font-display font-normal">
											{t('sections.productGallery')}
										</h2>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
											{product.images.slice(1).map((image, idx) => (
												<div
													key={idx}
													className="relative aspect-square rounded-xl overflow-hidden border-2 border-border cursor-pointer hover:border-primary transition-colors"
												>
													<Image
														src={image.storageUrl || "/placeholder.svg"}
														alt={image.altText || `${product.name} ${idx + 2}`}
														fill
														className="object-cover"
													/>
												</div>
											))}
										</div>
									</div>
								)}
							</div>

							<div className="lg:col-span-1">
								<PricingCard
									productId={product.id}
									product={productForButtons as any}
									isCustomOnly={isCustomOnly}
								/>
							</div>
						</div>
					</div>
				</section>

				{productsForGrid.length > 0 && (
					<section className="py-12 md:py-16 bg-muted/10">
						<div className="px-4 max-w-7xl mx-auto space-y-8">
							<h2 className="text-3xl font-display font-normal text-center">
								{t('sections.moreFrom', { category: categoryDisplayName })}
							</h2>
							<ProductGrid
								products={productsForGrid as any}
								initialColumns="4"
								showControls={false}
							/>
						</div>
					</section>
				)}
			</main>
		</HydrateClient>
	);
}