// src/app/(website)/page.tsx

import { ProductSlider } from "~/components/shop/ProductSlider";
// sections
import { HeroSection } from "./landing/_sections/HeroSection";
import { ComparisonSection } from "./landing/_sections/ComparisonSection";
import { FeaturedCategoriesSection } from "./landing/_sections/FeaturedCategoriesSection";
import { NewsletterSection } from "~/components/cta/email/NewsletterSection";
import { api, HydrateClient } from "~/trpc/server";
import { LazyAquarium3D } from "./calculator/3d/LazyAquarium3D";
import { Aquarium3D } from "./calculator/3d/Aquarium3D";

export default async function LandingPage() {
	return (
		<HydrateClient>
			<main className="min-h-screen">
				{/* Hero with video background - full viewport */}
				<HeroSection />

				{/* Tagline + Product Slider */}
				<section className="py-16 md:py-24"> 
					<div className="container px-4">
						<div className="text-center mb-12 md:mb-16">
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal">
								Only nature can copy us
							</h2>
							<p className="mt-4 text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
								Handcrafted 3D backgrounds so realistic, even nature takes notes.
							</p>
						</div>
						<ProductSlider />
					</div>
				</section>

				{/* About - Why Aquadecor */}
				<section className="py-16 md:py-24 bg-accent/5">
					<div className="container px-4">
						<div className="max-w-4xl mx-auto text-center space-y-6">
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light">
								20+ years of excellence in aquarium design
							</h2>
							<p className="text-lg md:text-xl text-muted-foreground font-display font-light leading-relaxed">
								Since 2003, we've designed over 1,000 unique models and shipped 50,000+ products worldwide.
								Our handcrafted 3D backgrounds transform ordinary aquariums into natural masterpieces that
								even experts struggle to distinguish from the real thing.
							</p>
						</div>
					</div>
				</section>

				{/* Stats - Social Proof */}
				<section className="py-16 md:py-24">
					<div className="container px-4">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
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

				{/* Comparison - Standard vs Custom */}
				<ComparisonSection />

				<section className="border border-dashed py-12">
					<Aquarium3D />
					{/* <LazyAquarium3D /> */}
				</section>
				{/* Featured Categories - Horizontal Scroll */}
				{/* <FeaturedCategoriesSection /> */}

				{/* Newsletter CTA */}
				<NewsletterSection />
			</main>
		</HydrateClient>
	);
}