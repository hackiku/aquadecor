// src/app/shop/[category]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "~/components/navigation/Breadcrumbs";
import { CategorySlider } from "~/components/shop/category/CategorySlider";
import { api, HydrateClient } from "~/trpc/server";
import { Package } from "lucide-react";

interface CategoryPageProps {
	params: Promise<{
		category: string;
	}>;
}

export default async function ProductLinePage({ params }: CategoryPageProps) {
	const { category } = await params;

	// Load categories for this product line
	const categories = await api.product.getCategoriesForProductLine({
		productLineSlug: category,
		locale: "en",
	});

	if (!categories || categories.length === 0) {
		notFound();
	}

	// Product line data (static for now - only 2 product lines)
	const productLineData: Record<string, { name: string; description: string; image: string }> = {
		"3d-backgrounds": {
			name: "3D Backgrounds",
			description: "Transform your aquarium with handcrafted 3D backgrounds. Custom-made to fit any size, designed to look so natural that even experts can't tell the difference.",
			image: "/media/images/3d-backgrounds_500px.webp"
		},
		"aquarium-decorations": {
			name: "Aquarium Decorations",
			description: "Complete your aquascape with our range of realistic plants, rocks, driftwood, and accessories. Made from neutral materials for unlimited lifespan.",
			image: "/media/images/additional-items_500px.webp"
		}
	};

	const productLine = productLineData[category];
	if (!productLine) notFound();

	return (
		<HydrateClient>
			<main className="min-h-screen">
				{/* Breadcrumbs - Sticky with Nav awareness */}
				<div className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur">
					<div className="px-4 py-4 max-w-7xl mx-auto">
						<Breadcrumbs
							items={[
								{ label: "Shop", href: "/shop" },
								{ label: productLine.name, href: `/shop/${category}` },
							]}
						/>
					</div>
				</div>

				{/* Hero Section with Background Image */}
				<section className="relative overflow-hidden border-b">
					<div className="relative h-[400px] md:h-[500px]">
						<Image
							src={productLine.image}
							alt={productLine.name}
							fill
							className="object-cover"
							priority
						/>

						<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

						<div className="absolute inset-0 flex items-end">
							<div className="px-4 pb-12 md:pb-16 max-w-7xl mx-auto w-full">
								<div className="max-w-3xl space-y-6">
									<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
										<Package className="h-4 w-4 text-primary" />
										<span className="text-sm text-primary font-display font-medium">
											{categories.length} Categories Available
										</span>
									</div>
									<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight text-white tracking-tight">
										{productLine.name}
									</h1>
									<p className="text-lg md:text-xl text-white/90 font-display font-light leading-relaxed">
										{productLine.description}
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Categories Slider */}
				<section className="py-16 md:py-24">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="mb-12">
							<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
								Browse Categories
							</h2>
							<p className="text-lg text-muted-foreground font-display font-light">
								Select a category to view available products
							</p>
						</div>

						<CategorySlider
							categories={categories}
							productLineSlug={category}
						/>
					</div>
				</section>

				{/* Trust Bar */}
				<section className="py-12 md:py-16 border-t bg-accent/5">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="flex flex-wrap items-center justify-center gap-8 text-sm font-display font-light">
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>Free Worldwide Shipping</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>10-12 Day Production</span>
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