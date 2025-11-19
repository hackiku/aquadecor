// src/app/shop/[category]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "~/components/navigation/Breadcrumbs";
import { api, HydrateClient } from "~/trpc/server";
import { ArrowRight, Package } from "lucide-react";

interface CategoryPageProps {
	params: Promise<{
		category: string;
	}>;
}

export default async function ProductLinePage({ params }: CategoryPageProps) {
	// Await params for Next.js 15
	const { category } = await params;

	// Try to load as product line first
	const categories = await api.product.getCategoriesForProductLine({
		productLineSlug: category,
		locale: "en",
	});

	// If no categories found, might be a direct category - redirect to products
	if (!categories || categories.length === 0) {
		notFound();
	}

	// Get the product line name and details
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
				{/* Breadcrumbs */}
				<div className="border-b bg-muted/30">
					<div className="container px-4 py-4">
						<Breadcrumbs
							items={[
								{ label: "Home", href: "/" },
								{ label: "Shop", href: "/shop" },
								{ label: productLine.name, href: `/shop/${category}` },
							]}
						/>
					</div>
				</div>

				{/* Hero Section with Background Image */}
				<section className="relative overflow-hidden border-b">
					<div className="relative h-[400px] md:h-[500px]">
						{/* Background Image */}
						<Image
							src={productLine.image}
							alt={productLine.name}
							fill
							className="object-cover"
							priority
						/>

						{/* Gradient Overlay */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

						{/* Content */}
						<div className="absolute inset-0 flex items-end">
							<div className="container px-4 pb-12 md:pb-16">
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

				{/* Categories Grid */}
				<section className="py-16 md:py-24">
					<div className="container px-4">
						<div className="mb-12">
							<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
								Browse Categories
							</h2>
							<p className="text-lg text-muted-foreground font-display font-light">
								Select a category to view available products
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
							{categories.map((cat) => (
								<Link
									key={cat.id}
									href={`/shop/${category}/${cat.slug}`}
									className="group"
								>
									<div className="h-full border-2 border-border rounded-2xl p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:scale-[1.02] bg-card/50 backdrop-blur-sm">
										<div className="space-y-4">
											{/* Header with Arrow */}
											<div className="flex items-start justify-between gap-3">
												<h3 className="text-xl md:text-2xl font-display font-light leading-tight group-hover:text-primary transition-colors">
													{cat.name}
												</h3>
												<ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
											</div>

											{/* Description */}
											{cat.description && (
												<p className="text-sm md:text-base text-muted-foreground font-display font-light leading-relaxed">
													{cat.description}
												</p>
											)}

											{/* CTA */}
											<div className="pt-4 border-t border-border/50">
												<span className="text-sm text-primary font-display font-medium inline-flex items-center gap-1.5">
													View products
													<ArrowRight className="h-3.5 w-3.5" />
												</span>
											</div>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>

				{/* Trust Bar */}
				<section className="py-12 md:py-16 border-t bg-accent/5">
					<div className="container px-4">
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