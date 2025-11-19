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
import { SocialLinks } from "~/components/social/SocialLinks";
import { SocialGrid } from "~/components/proof/SocialGrid";
import { WaveDivider } from "~/components/ui/wave-divider";
import { QuickShoutout } from "~/components/proof/QuickShoutout";
import { CompaniesLogos } from "~/components/proof/CompaniesLogos";

export default async function LandingPage() {
	return (
		<HydrateClient>
			<main className="min-h-screen">
				{/* Hero with video background - full viewport */}
				<HeroSection />

				{/* Tagline + Product Slider */}
				<section className="py-16 md:py-24"> 
					
					<div className="px-4">
						<div className="text-center mb-12 md:mb-16">
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal">
								Even Nature Takes Notes
							</h2>
							<p className="mt-4 text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
								Handcrafted 3D backgrounds so realistic, even nature takes notes.
							</p>
						</div>
						<ProductSlider />
					</div>
				</section>


				<section className="py-16 md:py-24"> 
					
					<div className="px-4">
						<div className="text-center mb-12 md:mb-16">
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal">
								Features blah
							</h2>
							<p className="mt-4 text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
								Safe to sleep with the fishes
							</p>
						</div>

						<CompaniesLogos />
						{/* <CompaniesLogos grayscale={true} /> */}

					</div>
				</section>



				{/* Social Proof - Customer Content */}
				<section className="relative py-16 md:py-32 bg-linear-to-b from-card/80 to-transparent overflow-hidden">
					{/* Top Wave Divider */}
					<WaveDivider position="top" color="currentColor" className="text-background" />

					{/* Optional: Blob Background for visual interest */}
					{/* <BlobBackground color="#3781C2" opacity={0.05} className="top-1/4" /> */}

					<div className="px-4 relative z-10">
						{/* Headline */}
						<div className="text-center mx-auto max-w-3xl mb-12 md:mb-16">
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal mb-4">
								Trusted for 20+ years by 200K+ Aquarium Enthusiasts
							</h2>
							<p className="text-xl text-muted-foreground font-display font-light max-w-2xl mx-auto">
								Real-as-rain setups from aquarium enthusiasts worldwide.
							</p>
						</div>

						{/* Social Grid */}
						<SocialGrid initialLimit={6} showTabs={true} />

						{/* Social Links with Follower Counts */}
						<div className="flex justify-center mt-12">
							<SocialLinks showFollowers={true} />
						</div>
					</div>

					{/* Bottom Wave Divider (flipped) */}
					<WaveDivider position="bottom" flip={true} color="currentColor" className="text-background" />
					
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