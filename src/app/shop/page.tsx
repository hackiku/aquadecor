// src/app/shop/page.tsx

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { api, HydrateClient } from "~/trpc/server";
import { ReviewCard } from "~/components/proof/ReviewCard";
import { ArrowRight } from "lucide-react";

export default async function ShopPage() {
	// Load product lines and reviews in parallel
	const [productLines, featuredReviews] = await Promise.all([
		api.product.getProductLines({ locale: "en" }),
		api.product.getFeaturedReviews({ limit: 3 }),
	]);

	return (
		<HydrateClient>
			<main className="min-h-screen">
				{/* Hero Section */}
				<section className="bg-linear-to-b from-muted via-muted/30 to-transparent">
					<div className="container px-4 py-16 md:py-36 text-center">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-light tracking-tight">
							Shop Aquadecor
						</h1>
						<p className="mt-4 text-lg md:text-xl text-muted-foreground font-display font-light">
							Choose your product line to explore our handcrafted aquarium solutions
						</p>

					</div>
				</section>

				{/* Product Lines - Main Selection */}
				<section className="py-16 md:py-20">
					<div className="container px-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
							{productLines.map((line) => (
								<Link key={line.id} href={`/shop/${line.slug}`}>
									<Card className="h-full transition-all hover:shadow-xl hover:border-primary/50 cursor-pointer group border-2">
										<CardHeader className="space-y-4">
											<div className="flex items-start justify-between">
												<CardTitle className="text-3xl font-display font-light group-hover:text-primary transition-colors">
													{line.name}
												</CardTitle>
												<ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
											</div>
											<CardDescription className="text-base font-display font-light leading-relaxed">
												{line.description}
											</CardDescription>
										</CardHeader>
										<CardContent>
											<span className="text-sm text-primary font-display font-medium">
												Explore products →
											</span>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					</div>
				</section>

				{/* Why Choose Aquadecor */}
				<section className="py-16 md:py-20 bg-accent/5 border-y">
					<div className="container px-4">
						<div className="max-w-4xl mx-auto text-center space-y-6">
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light">
								Why Choose Aquadecor?
							</h2>
							<p className="text-lg md:text-xl text-muted-foreground font-display font-light leading-relaxed">
								Since 2003, we've designed over 1,000 unique models and shipped 50,000+ products worldwide.
								Our handcrafted backgrounds transform ordinary aquariums into natural masterpieces that
								even experts struggle to distinguish from the real thing.
							</p>
						</div>

						{/* Stats Grid */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mt-12">
							<div className="text-center space-y-2">
								<p className="text-4xl md:text-5xl font-display font-light text-primary">20+</p>
								<p className="text-sm md:text-base text-muted-foreground font-display">Years in business</p>
							</div>
							<div className="text-center space-y-2">
								<p className="text-4xl md:text-5xl font-display font-light text-primary">50K+</p>
								<p className="text-sm md:text-base text-muted-foreground font-display">Products shipped</p>
							</div>
							<div className="text-center space-y-2">
								<p className="text-4xl md:text-5xl font-display font-light text-primary">1000+</p>
								<p className="text-sm md:text-base text-muted-foreground font-display">Unique designs</p>
							</div>
							<div className="text-center space-y-2">
								<p className="text-4xl md:text-5xl font-display font-light text-primary">50+</p>
								<p className="text-sm md:text-base text-muted-foreground font-display">Countries served</p>
							</div>
						</div>
					</div>
				</section>

				{/* Social Proof - Featured Reviews */}
				<section className="py-16 md:py-20">
					<div className="container px-4">
						<div className="text-center mb-12">
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light">
								Trusted by 50,000+ aquarium enthusiasts
							</h2>
							<p className="mt-4 text-lg text-muted-foreground font-display font-light">
								See what our customers are saying
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
							{featuredReviews.map((review) => (
								<ReviewCard key={review.id} review={review} />
							))}
						</div>
					</div>
				</section>

				{/* Final CTA */}
				<section className="py-16 md:py-20 bg-muted/30 border-t">
					<div className="container px-4">
						<div className="max-w-3xl mx-auto text-center space-y-6">
							<h2 className="text-3xl md:text-4xl font-display font-light">
								Ready to transform your aquarium?
							</h2>
							<p className="text-lg text-muted-foreground font-display font-light">
								Start by selecting a product line above, or reach out if you need help choosing
							</p>
						</div>
					</div>
				</section>
			</main>
		</HydrateClient>
	);
}