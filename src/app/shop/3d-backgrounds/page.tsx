// src/app/shop/3d-backgrounds/page.tsx

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, Wrench, Shield, Zap } from "lucide-react";
import { api, HydrateClient } from "~/trpc/server";
import { CategorySlider } from "~/components/shop/category/CategorySlider";
import { WaveDivider } from "~/components/ui/water/wave-divider";

export default async function ThreeDBackgroundsPage() {
	// Load categories for 3D backgrounds
	const categories = await api.product.getCategoriesForProductLine({
		productLineSlug: "3d-backgrounds",
		locale: "en",
	});

	return (
		<HydrateClient>
			<main className="min-h-screen">
				{/* Hero Section */}
				<section className="relative overflow-hidden border-b">
					<div className="relative h-[500px] md:h-[600px]">
						<Image
							src="/media/images/3d-backgrounds_500px.webp"
							alt="3D Aquarium Backgrounds"
							fill
							className="object-cover"
							priority
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

						<div className="absolute inset-0 flex items-end">
							<div className="px-4 pb-16 md:pb-20 max-w-7xl mx-auto w-full">
								<div className="max-w-3xl space-y-6">
									<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
										<Package className="h-4 w-4 text-primary" />
										<span className="text-sm text-primary font-display font-medium">
											Handcrafted Since 2004
										</span>
									</div>
									<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight text-white tracking-tight">
										3D Aquarium Backgrounds
									</h1>
									<p className="text-lg md:text-xl text-white/90 font-display font-light leading-relaxed max-w-2xl">
										Transform your aquarium with custom-made 3D backgrounds so realistic that even experts can't tell the difference from natural rock formations.
									</p>
									<div className="flex flex-wrap gap-3">
										<Link
											href="/calculator"
											className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-display font-medium transition-all hover:scale-105"
										>
											Get Custom Quote
											<ArrowRight className="h-4 w-4" />
										</Link>
										<Link
											href="#categories"
											className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-display font-medium transition-colors border border-white/20"
										>
											Browse Models
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Why Choose Us */}
				<section className="py-16 md:py-24 border-b bg-gradient-to-b from-muted/30 to-transparent">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="text-center mb-12">
							<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
								Why 50,000+ Aquarists Choose Aquadecor
							</h2>
							<p className="text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
								Two decades of perfecting the craft of realistic aquarium backgrounds
							</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
							<div className="text-center space-y-4">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
									<Wrench className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-display font-normal">Fully Custom Fit</h3>
								<p className="text-sm text-muted-foreground font-display font-light">
									Built to your exact aquarium dimensions, accounting for bracing systems and overflow boxes
								</p>
							</div>

							<div className="text-center space-y-4">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
									<Shield className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-display font-normal">Lifetime Warranty</h3>
								<p className="text-sm text-muted-foreground font-display font-light">
									Chemical-resistant, heat-proof material that never leaches or affects water chemistry
								</p>
							</div>

							<div className="text-center space-y-4">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
									<Package className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-display font-normal">Modular Sections</h3>
								<p className="text-sm text-muted-foreground font-display font-light">
									Numbered pieces for easy assembly, perfect for tanks with center braces
								</p>
							</div>

							<div className="text-center space-y-4">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
									<Zap className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-display font-normal">Hidden Equipment</h3>
								<p className="text-sm text-muted-foreground font-display font-light">
									Hollow-back design conceals heaters, pipes, and filtration without restricting flow
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Categories Slider */}
				<section id="categories" className="py-16 md:py-24">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="mb-12">
							<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
								Choose Your Style
							</h2>
							<p className="text-lg text-muted-foreground font-display font-light">
								From classic rocky terrains to slim profiles for rimless tanks
							</p>
						</div>

						<CategorySlider
							categories={categories}
							productLineSlug="3d-backgrounds"
						/>
					</div>
				</section>

				{/* Material Specs CTA */}
				<section className="py-16 md:py-20 bg-muted/30 border-t">
					<WaveDivider position="top" color="currentColor" className="text-background" />
					<div className="px-4 max-w-7xl mx-auto">
						<div className="grid md:grid-cols-2 gap-12 items-center">
							<div className="space-y-6">
								<h2 className="text-3xl md:text-4xl font-display font-light">
									Built to Last Forever
								</h2>
								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<span className="text-primary text-lg">✓</span>
										<div>
											<p className="font-display font-medium">Hydrochloric Acid Resistant</p>
											<p className="text-sm text-muted-foreground font-display font-light">
												Zero limestone content - won't affect pH or hardness
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<span className="text-primary text-lg">✓</span>
										<div>
											<p className="font-display font-medium">Heat & Flame Proof</p>
											<p className="text-sm text-muted-foreground font-display font-light">
												Safe to disinfect with boiling water
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<span className="text-primary text-lg">✓</span>
										<div>
											<p className="font-display font-medium">Extreme Load Bearing</p>
											<p className="text-sm text-muted-foreground font-display font-light">
												Tested by driving a 1500kg car over it without damage
											</p>
										</div>
									</div>
								</div>
								<Link
									href="/blog/material-testing"
									className="inline-flex items-center gap-2 text-primary hover:underline font-display font-medium"
								>
									Read our material testing blog post
									<ArrowRight className="h-4 w-4" />
								</Link>
							</div>
							<div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-border">
								<Image
									src="/media/images/3d-backgrounds_500px.webp"
									alt="Material Testing"
									fill
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Trust Bar */}
				<section className="py-12 md:py-16 border-t">
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
								<span>50,000+ Products Shipped</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>Made in Serbia</span>
							</div>
						</div>
					</div>
				</section>
			</main>
		</HydrateClient>
	);
}