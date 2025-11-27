// src/app/(website)/page.tsx

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ProductSlider } from "~/components/shop/product/ProductSlider";
import { HeroSection } from "./landing/_sections/HeroSection";
import { FeaturesSection } from "./landing/_sections/FeaturesSection";
import { ComparisonTable } from "./_components/ComparisonTable";
import { NewsletterSection } from "~/components/cta/email/NewsletterSection";
import { SocialLinks } from "~/components/social/SocialLinks";
import { SocialGrid } from "~/components/proof/SocialGrid";
import { WaveDivider } from "~/components/ui/water/wave-divider";
import { WaveContainer } from "~/components/ui/water/wave-container";
import { NegativeWave } from "~/components/ui/water/negative-wave";
import { CompaniesLogos } from "~/components/proof/CompaniesLogos";

export default function LandingPage() {
	const sliderRef = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: sliderRef,
		offset: ["start end", "end start"],
	});

	// Parallax: Slider moves slower than scroll
	const sliderY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

	// Headline emerges from bottom
	const headlineY = useTransform(scrollYProgress, [0, 0.3], ["100%", "0%"]);
	const headlineOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

	return (
		<main className="min-h-screen">
			{/* Hero with video background - full viewport */}
			<HeroSection />

			{/* Tagline + Product Slider with Parallax */}
			<section ref={sliderRef} className="relative py-24 md:py-32 overflow-hidden">
				<div className="px-4 max-w-7xl mx-auto">
					{/* Headline emerges as slider scrolls up */}
					<motion.div
						style={{ y: headlineY, opacity: headlineOpacity }}
						className="text-center mb-16 md:mb-20"
					>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal">
							Only Nature Can Copy Us
						</h2>
						<p className="mt-4 text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
							Handcrafted 3D backgrounds so realistic, even nature takes notes.
						</p>
					</motion.div>

					{/* Product slider with slower scroll */}
					<motion.div style={{ y: sliderY }}>
						<ProductSlider />
					</motion.div>
				</div>
			</section>

			{/* Features Section with Parallax Annotations */}
			<FeaturesSection />

			{/* Companies Logos */}
			{/* <section className="py-16 md:py-24"> */}
				<div className="px-4 max-w-7xl mx-auto">
					<CompaniesLogos />
				</div>
			{/* </section> */}

			{/* Social Proof - Customer Content */}
			<section className="relative py-24 md:py-36 bg-gradient-to-b from-card/80 to-transparent overflow-hidden">
				{/* Top Wave Divider */}
				<WaveDivider position="top" color="currentColor" className="text-background" />

				<div className="px-4 relative z-10 max-w-7xl mx-auto">
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
			</section>

			{/* Stats - Social Proof */}
			<section className="relative py-16 md:py-24 bg-gradient-to-b from-card to-background">
				{/* Top wave matching background color */}
				{/* <NegativeWave position="top" bgColor="bg-background" /> */}

				<div className="px-4 max-w-7xl mx-auto">
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


			<section className="py-8 md:py-12">
				<WaveContainer>
					<div className="max-w-7xl mx-auto px-4 py-72">
						<div className="text-center mb-12 md:mb-16">
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal mb-4 text-white">
								Whatever you choose, you won't regret it!
							</h2>
							<p className="text-lg text-cyan-100/80 font-display font-light max-w-2xl mx-auto">
								Standard dimensions for quick setup, or custom-made to fit your exact vision.
							</p>
						</div>
						<ComparisonTable />
					</div>
				</WaveContainer>
			</section>


			{/* Newsletter CTA */}
			<NewsletterSection />
		</main>
	);
}