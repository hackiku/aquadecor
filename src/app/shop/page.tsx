// src/app/shop/page.tsx

import Link from "next/link";
import { api, HydrateClient } from "~/trpc/server";
import { ReviewCard } from "~/components/proof/ReviewCard";
import { ArrowRight } from "lucide-react";
import { CategorySlider } from "./_components/CategorySlider";
import { ProductLineCard } from "./_components/product/ProductLineCard";

export default async function ShopPage() {
	// Load product lines, their categories, and reviews
	const [productLines, featuredReviews, backgroundCategories, decorationCategories] = await Promise.all([
		api.product.getProductLines({ locale: "en" }),
		api.product.getFeaturedReviews({ limit: 6 }),
		api.product.getCategoriesForProductLine({ productLineSlug: "3d-backgrounds", locale: "en" }),
		api.product.getCategoriesForProductLine({ productLineSlug: "aquarium-decorations", locale: "en" }),
	]);

	// Separate the two product lines
	const backgroundsLine = productLines.find(line => line.slug === "3d-backgrounds");
	const decorationsLine = productLines.find(line => line.slug === "aquarium-decorations");

	return (
		<HydrateClient>
			<main className="min-h-screen">
				{/* Hero Section */}
				<section className="relative bg-linear-to-b from-muted via-muted/30 to-transparent overflow-hidden">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(55,129,194,0.1),transparent_50%)]" />
					<div className="container relative px-4 py-20 md:py-32 text-center">
						<h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extralight tracking-tight">
							Transform Your Aquarium
						</h1>
						<p className="mt-6 text-xl md:text-2xl text-muted-foreground font-display font-light max-w-3xl mx-auto">
							Handcrafted 3D backgrounds and decorations trusted by 50,000+ aquarium enthusiasts worldwide
						</p>
						
						{/* Trust Bar */}
						<div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-10 text-sm md:text-base font-display font-light">
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>20+ Years</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>Free Shipping</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>50K+ Shipped</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>1000+ Designs</span>
							</div>
						</div>
					</div>
				</section>

				{/* Interactive Product Line Cards - Sticky Scroll Effect */}
				<section className="relative">
					<div className="container px-4">
						<div className="max-w-7xl mx-auto">
							{/* 3D Backgrounds */}
							{backgroundsLine && (
								<div id="3d-backgrounds" className="scroll-mt-20 pb-16 md:pb-24">
									<ProductLineCard
										slug={backgroundsLine.slug}
										name={backgroundsLine.name}
										description="Natural look with our 3D aquarium backgrounds. Handcrafted backgrounds so realistic, even nature takes notes."
										image="/media/images/3d-backgrounds_500px.webp"
										label="Product Line 01"
										position="left"
										categoryCount={backgroundCategories.length}
									/>

									{/* Category Slider */}
									<div className="mt-12">
										<div className="mb-8">
											<h3 className="text-2xl md:text-3xl font-display font-light mb-3">
												Browse 3D Background Categories
											</h3>
											<p className="text-muted-foreground font-display font-light text-lg">
												From classic rocky designs to Amazonian tree trunks
											</p>
										</div>
										<CategorySlider 
											categories={backgroundCategories}
											productLineSlug="3d-backgrounds"
										/>
									</div>
								</div>
							)}

							{/* Aquarium Decorations */}
							{decorationsLine && (
								<div id="aquarium-decorations" className="scroll-mt-20 pb-16 md:pb-24">
									<ProductLineCard
										slug={decorationsLine.slug}
										name={decorationsLine.name}
										description="Natural effect with aquarium decorations. Plants, rocks, and complete sets for your perfect aquascape."
										image="/media/images/additional-items_500px.webp"
										label="Product Line 02"
										position="right"
										categoryCount={decorationCategories.length}
									/>

									{/* Category Slider */}
									<div className="mt-12">
										<div className="mb-8">
											<h3 className="text-2xl md:text-3xl font-display font-light mb-3">
												Browse Decoration Categories
											</h3>
											<p className="text-muted-foreground font-display font-light text-lg">
												Plants, rocks, driftwood, and complete starter sets
											</p>
										</div>
										<CategorySlider 
											categories={decorationCategories}
											productLineSlug="aquarium-decorations"
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				</section>

				{/* Social Proof - Featured Reviews */}
				<section className="py-20 md:py-32">
					<div className="container px-4">
						<div className="text-center mb-16">
							<h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight mb-6">
								Trusted Worldwide
							</h2>
							<p className="text-xl text-muted-foreground font-display font-light max-w-2xl mx-auto">
								See what aquarium enthusiasts are saying about Aquadecor
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
							{featuredReviews.map((review) => (
								<ReviewCard key={review.id} review={review} />
							))}
						</div>

						<div className="text-center mt-12">
							<Link 
								href="/shop/reviews"
								className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-display font-medium text-lg transition-colors group"
							>
								View all reviews
								<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
							</Link>
						</div>
					</div>
				</section>

				{/* Why Choose Aquadecor */}
				<section className="py-20 md:py-32 border-y bg-gradient-to-b from-accent/5 to-transparent">
					<div className="container px-4">
						<div className="max-w-4xl mx-auto text-center space-y-8">
							<h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight">
								20+ Years of Excellence
							</h2>
							<p className="text-xl md:text-2xl text-muted-foreground font-display font-light leading-relaxed">
								Since 2003, we've designed over 1,000 unique models and shipped 50,000+ products worldwide.
								Our handcrafted backgrounds transform ordinary aquariums into natural masterpieces that
								even experts struggle to distinguish from the real thing.
							</p>
						</div>

						{/* Stats Grid */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto mt-16">
							<div className="text-center space-y-3">
								<p className="text-5xl md:text-6xl font-display font-extralight text-primary">20+</p>
								<p className="text-base md:text-lg text-muted-foreground font-display font-light">
									Years in business
								</p>
							</div>
							<div className="text-center space-y-3">
								<p className="text-5xl md:text-6xl font-display font-extralight text-primary">50K+</p>
								<p className="text-base md:text-lg text-muted-foreground font-display font-light">
									Products shipped
								</p>
							</div>
							<div className="text-center space-y-3">
								<p className="text-5xl md:text-6xl font-display font-extralight text-primary">1000+</p>
								<p className="text-base md:text-lg text-muted-foreground font-display font-light">
									Unique designs
								</p>
							</div>
							<div className="text-center space-y-3">
								<p className="text-5xl md:text-6xl font-display font-extralight text-primary">50+</p>
								<p className="text-base md:text-lg text-muted-foreground font-display font-light">
									Countries served
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Final CTA */}
				<section className="py-20 md:py-32">
					<div className="container px-4">
						<div className="max-w-3xl mx-auto text-center space-y-8">
							<h2 className="text-4xl md:text-5xl font-display font-extralight">
								Need Help Choosing?
							</h2>
							<p className="text-xl text-muted-foreground font-display font-light">
								Not sure which product line is right for your aquarium? We're here to help.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
								<Link
									href="#3d-backgrounds"
									className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-display font-medium hover:bg-primary/90 transition-all hover:scale-105"
								>
									Browse 3D Backgrounds
									<ArrowRight className="h-4 w-4" />
								</Link>
								<Link
									href="#aquarium-decorations"
									className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-border rounded-full font-display font-medium hover:border-primary/50 hover:bg-accent/30 transition-all"
								>
									Browse Decorations
									<ArrowRight className="h-4 w-4" />
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>
		</HydrateClient>
	);
}