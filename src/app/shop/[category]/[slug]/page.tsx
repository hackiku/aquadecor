// src/app/shop/[category]/[slug]/page.tsx
// UPDATED VERSION

import { notFound } from "next/navigation";
import { ProductGrid } from "~/components/shop/product/ProductGrid";
import { api } from "~/trpc/server";

interface PageProps {
	params: Promise<{
		category: string;
		slug: string;
	}>;
}

export default async function CategoryProductsPage({ params }: PageProps) {
	const { category, slug } = await params;

	const result = await api.product.getByCategory({
		categorySlug: slug,
		locale: "en",
	});

	if (!result || !("products" in result)) {
		notFound();
	}

	const { products, categorySlug, productLineSlug } = result;

	if (!products || products.length === 0) {
		notFound();
	}

	// Get full category info with description
	const categories = await api.product.getCategoriesForProductLine({
		productLineSlug: productLineSlug ?? "aquarium-decorations",
		locale: "en",
	});

	const currentCategory = categories.find(c => c.slug === categorySlug);

	const productLineNames: Record<string, string> = {
		"3d-backgrounds": "3D Backgrounds",
		"aquarium-decorations": "Aquarium Decorations",
	};

	const categoryName = currentCategory?.name ?? slug;
	const categoryDescription = currentCategory?.description;
	const productLineName = productLineNames[category] ?? category;

	// Transform data to match ProductGrid interface
	const productsWithSlugs = products.map(product => ({
		id: product.id,
		slug: product.slug,
		name: product.name ?? "Untitled Product",
		sku: product.sku ?? null,
		shortDescription: product.shortDescription ?? null,
		basePriceEurCents: product.basePriceEurCents ?? null,
		priceNote: product.priceNote ?? null,
		stockStatus: product.stockStatus,
		heroImageUrl: product.heroImageUrl ?? null,
		heroImageAlt: product.heroImageAlt ?? null,
		categorySlug: categorySlug,
		productLineSlug: productLineSlug,
	}));

	return (
		<main className="min-h-screen">
			<section className="py-16 md:py-20 bg-linear-to-b from-muted/30 to-transparent">
				<div className="px-4 max-w-7xl mx-auto">
					<div className="max-w-4xl mx-auto text-center space-y-6">
						<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
							<span className="text-sm text-primary font-display font-medium">
								{productLineName}
							</span>
						</div>

						{/* Model Code Badge */}
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

						{/* Category Description */}
						{categoryDescription && (
							<p className="text-lg md:text-xl text-muted-foreground font-display font-light leading-relaxed max-w-2xl mx-auto">
								{categoryDescription}
							</p>
						)}

						<p className="text-base text-muted-foreground/80 font-display font-light">
							{products.length} {products.length === 1 ? "product" : "products"} available
						</p>
					</div>

					{/* Category Features from contentBlocks */}
					{currentCategory?.contentBlocks && (
						<div className="mt-12 max-w-4xl mx-auto">
							{currentCategory.contentBlocks.features && (
								<div className="flex flex-wrap justify-center gap-3">
									{currentCategory.contentBlocks.features.map((feature, idx) => (
										<div key={idx} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full">
											<span className="text-primary text-sm">✓</span>
											<span className="text-sm font-display font-light">{feature}</span>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</section>

			<section className="">
				<div className="px-4 max-w-7xl mx-auto">
					<ProductGrid
						products={productsWithSlugs}
						columns="4"
					/>
				</div>
			</section>

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
	);
}