// src/app/[locale]/shop/[productLine]/[categorySlug]/[productSlug]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { api, HydrateClient } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { Package, Shield, Zap, CheckCircle2 } from "lucide-react";
import { CustomOnlyBadge } from "~/components/shop/product/CustomOnlyBadge";
import { SpecificationsGrid } from "~/components/shop/product/SpecificationsGrid";
import { PricingCard } from "~/components/shop/checkout/PricingCard";
import { LongDescriptionSection } from "~/components/shop/product/LongDescriptionSection";
import { ImageSliderWithModal } from "~/components/shop/product/ImageSliderWithModal";
import { ProductGrid } from "~/components/shop/product/ProductGrid";

interface ProductDetailPageProps {
	params: Promise<{
		productLine: string;
		categorySlug: string;
		productSlug: string;
	}>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
	// 1. Await params properly for Next.js 15
	const { productLine, categorySlug, productSlug } = await params;
	const locale = "en"; // Hardcoded for now

	// 2. Fetch product using just the slug (Awaited with trpc.server)
	const productPromise = api.product.getBySlug({ slug: productSlug, locale });

	// 3. Fetch related products in the same category (Awaited with trpc.server)
	const relatedProductsPromise = api.product.getByCategory({ categorySlug, locale });

	const [product, relatedProductsResult] = await Promise.all([
		productPromise,
		relatedProductsPromise,
	]);

	if (!product) {
		notFound();
	}

	// ✅ FIXED: Properly determine if product requires custom quote
	const isCustomOnly =
		product.pricing?.type === 'configuration' ||
		product.stockStatus === "requires_quote" ||
		// Legacy fallback: no pricing data at all
		(!product.pricing && !product.basePriceEurCents && !product.variantOptions);

	// Debug logging (remove after testing)
	console.log('[Product Page] isCustomOnly check:', {
		slug: productSlug,
		isCustomOnly,
		pricingType: product.pricing?.type,
		stockStatus: product.stockStatus,
		hasPricing: !!product.pricing,
		hasBasePriceEurCents: !!product.basePriceEurCents,
		hasVariantOptions: !!product.variantOptions,
	});

	// 4. Inject route params into the product object so buttons/links work
	const productForButtons = {
		...product,
		categorySlug,
		productLineSlug: productLine,
		name: product.name ?? "Product", // Ensure name exists
	};

	// 5. Prepare related products (filter out the current product)
	const relatedProducts = "products" in relatedProductsResult
		? relatedProductsResult.products.filter(p => p.slug !== productSlug).slice(0, 4) // Limit to 4
		: [];

	const productsForGrid = relatedProducts.map(p => ({
		id: p.id,
		slug: p.slug,
		name: p.name ?? "Untitled Product",
		sku: p.sku ?? null,
		shortDescription: p.shortDescription ?? null,
		basePriceEurCents: p.basePriceEurCents ?? null,
		priceNote: p.priceNote ?? null,
		stockStatus: p.stockStatus,
		heroImageUrl: p.heroImageUrl ?? null,
		heroImageAlt: p.heroImageAlt ?? null,
		categorySlug: categorySlug,
		productLineSlug: productLine,
		variantOptions: p.variantOptions,
		addonOptions: p.addonOptions,
		pricing: p.pricing,
		customization: p.customization,
	}));


	return (
		<HydrateClient>
			<main className="min-h-screen">
				{/* Hero Section - Full Width Image */}
				<section className="relative h-[40vh] md:h-[50vh] border-b bg-black">
					{product.images && product.images[0] ? (
						<Image
							src={product.images[0].storageUrl}
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

					{/* Gradient overlay */}
					<div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

					{/* Quick info overlay */}
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
										In Stock
									</Badge>
								)}
								{product.stockStatus === "made_to_order" && (
									<Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-xs">
										Made to Order
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

				{/* Main Content - Two Column */}
				<section className="py-12 md:py-16">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

							{/* Left Column - Info */}
							<div className="lg:col-span-2 space-y-8">

								<ImageSliderWithModal
									images={product.images || []}
									productName={product.name ?? "Product"}
								/>

								{/* Short Description */}
								<div className="space-y-4">
									<h2 className="text-2xl font-display font-normal">Product Details</h2>
									{/* Long Description with Read More */}
									<LongDescriptionSection longDescription={product.fullDescription} />
								</div>

								{/* Specifications */}
								<SpecificationsGrid
									specifications={product.specifications || {}}
									specOverrides={product.specOverrides}
								/>



								{/* Key Features */}
								<div className="space-y-4">
									<h2 className="text-2xl font-display font-normal">Key Features</h2>
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

								{/* Image Gallery */}
								{product.images && product.images.length > 1 && (
									<div className="space-y-4">
										<h2 className="text-2xl font-display font-normal">Product Gallery</h2>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
											{product.images.slice(1).map((image, idx) => (
												<div
													key={idx}
													className="relative aspect-square rounded-xl overflow-hidden border-2 border-border cursor-pointer hover:border-primary transition-colors"
												>
													<Image
														src={image.storageUrl}
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

							{/* Right Column - Sticky Pricing Card */}
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

				{/* Related Products Section */}
				{productsForGrid.length > 0 && (
					<section className="py-12 md:py-16 bg-muted/10">
						<div className="px-4 max-w-7xl mx-auto space-y-8">
							<h2 className="text-3xl font-display font-normal text-center">
								More from {categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
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