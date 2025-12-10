// src/app/[locale]/shop/[productLine]/[categorySlug]/page.tsx
import { notFound } from "next/navigation";
import { ProductGrid } from "~/components/shop/product/ProductGrid";
import { api, HydrateClient } from "~/trpc/server";

interface PageProps {
	params: Promise<{
		productLine: string;
		categorySlug: string;
	}>;
}



export default async function CategoryProductsPage({ params }: PageProps) {
	const { productLine, categorySlug } = await params;

	// Fetch products using the category slug
	const result = await api.product.getByCategory({
		categorySlug: categorySlug,
		locale: "en",
	});

	if (!result || !("products" in result)) {
		notFound();
	}

	const { products } = result;

	// Fetch full category list to get metadata (name, description, etc)
	const categories = await api.product.getCategoriesForProductLine({
		productLineSlug: productLine,
		locale: "en",
	});

	const currentCategory = categories.find(c => c.slug === categorySlug);

	// Text formatting
	const productLineName = productLine === "3d-backgrounds" ? "3D Backgrounds" : "Aquarium Decorations";
	const categoryName = currentCategory?.name ?? categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

	// Transform data for the grid
	const productsForGrid = products.map(product => ({
		id: product.id,
		slug: product.slug,
		name: product.name ?? "Untitled Product",
		sku: product.sku ?? null,
		shortDescription: product.shortDescription ?? null,

		// FIX: Map unitPriceEurCents from tRPC response to the expected basePriceEurCents
		basePriceEurCents: product.unitPriceEurCents ?? null,

		// FIX: Explicitly assign missing fields to satisfy ProductForCard/Grid
		priceNote: null,
		variantOptions: null,
		addonOptions: null,

		stockStatus: product.stockStatus,

		heroImageUrl: product.heroImageUrl ?? null,
		heroImageAlt: product.heroImageAlt ?? null,
		categorySlug: categorySlug,
		productLineSlug: productLine,
		// The component also relies on variantOptions/addonOptions for the button logic, 
		// which your tRPC query must also provide, but for now we'll rely on the simple price check.
	}));


	return (
		<HydrateClient>
			<main className="min-h-screen">
				{/* Header Section */}
				<section className="py-16 md:py-20 bg-linear-to-b from-muted/30 to-transparent">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="max-w-4xl mx-auto text-center space-y-6">
							<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
								<span className="text-sm text-primary font-display font-medium">
									{productLineName}
								</span>
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

						{/* Category Features (if available) */}
						{currentCategory?.contentBlocks?.features && (
							<div className="mt-8 flex flex-wrap justify-center gap-3">
								{currentCategory.contentBlocks.features.map((feature, idx) => (
									<div key={idx} className="inline-flex items-center gap-2 px-3 py-1 bg-background border rounded-full text-xs text-muted-foreground">
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
						<ProductGrid
							products={productsForGrid}
							initialColumns="4"
							showControls={true}
						/>
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