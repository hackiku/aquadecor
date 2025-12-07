// src/app/shop/[category]/[slug]/page.tsx
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

	// Fetch products for this category
	const result = await api.product.getByCategory({
		categorySlug: slug,
		locale: "en",
	});

	if (!result || !("products" in result)) {
		notFound();
	}

	const { products, categorySlug, productLineSlug } = result;

	// Fetch category details for the header info
	const categories = await api.product.getCategoriesForProductLine({
		productLineSlug: productLineSlug ?? "aquarium-decorations",
		locale: "en",
	});

	const currentCategory = categories.find(c => c.slug === categorySlug);

	// Fallback title formatting
	const productLineName = category === "3d-backgrounds" ? "3D Backgrounds" : "Aquarium Decorations";
	const categoryName = currentCategory?.name ?? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

	// Transform data to match ProductGrid interface strictly
	const productsForGrid = products.map(product => ({
		id: product.id,
		slug: product.slug,
		name: product.name ?? "Untitled Product",
		sku: product.sku ?? null,
		shortDescription: product.shortDescription ?? null,
		basePriceEurCents: product.basePriceEurCents ?? null,
		priceNote: product.priceNote ?? null,
		stockStatus: product.stockStatus,
		// Ensure we use the new schema field
		heroImageUrl: product.heroImageUrl ?? null,
		heroImageAlt: product.heroImageAlt ?? null,
		categorySlug: categorySlug,
		// Ensure string type (fallback if DB returns null, though schema says required)
		productLineSlug: productLineSlug ?? category,
	}));

	return (
		<main className="min-h-screen">
			{/* Header Section */}
			<section className="py-16 md:py-20 bg-gradient-to-b from-muted/30 to-transparent">
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
			<section className="py-12 md:py-16">
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
	);
}