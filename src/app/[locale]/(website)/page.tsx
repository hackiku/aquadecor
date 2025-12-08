// src/app/(website)/page.tsx

"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
// db
import { ProductSlider } from "~/components/shop/product/ProductSlider";
import { SocialLinks } from "~/components/social/SocialLinks";
import { SocialGrid } from "~/components/social/SocialGrid";
// components
import { NewsletterForm } from "~/components/cta/email/NewsletterForm";
import { CompaniesLogos } from "~/components/proof/CompaniesLogos";
import { WaveDivider } from "~/components/ui/water/wave-divider";
import { WaveContainer } from "~/components/ui/water/wave-container";
import { MediaBlob } from "~/components/ui/water/media-blob";
// content
import { HeroSection } from "./_components/HeroSection";
import { ComparisonTable } from "./_components/ComparisonTable";
import { FeaturesLayout } from "./_components/FeaturesLayout";

export default function LandingPage() {
	const sliderRef = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: sliderRef,
		offset: ["start end", "end start"],
	});

	// Parallax: Cards move slower than scroll (creates "sticky" effect)
	const sliderY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-10%"]);

	// Headline emerges from behind cards as you scroll
	// Starts below the cards, slides up into view
	const headlineY = useTransform(scrollYProgress, [0, 0.3, 0.5], ["80px", "0px", "0px"]);
	const headlineOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 0.6, 1]);

	return (
		<main className="min-h-screen">
			{/* Hero with video background - full viewport */}
			<HeroSection />

			{/* Tagline + Product Slider with Parallax Scrollytelling Effect */}
			<section ref={sliderRef} className="relative overflow-hidden py-24">
				<div className="px-4 max-w-7xl mx-auto">

					{/* Headline emerges from behind as you scroll */}
					<motion.div
						style={{ y: headlineY, opacity: headlineOpacity }}
						className="text-center relative z-10 mb-24"
					>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal">
							Only Nature Can Copy Us
						</h2>
						<p className="mt-4 text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
							Handcrafted 3D backgrounds so realistic, even nature takes notes.
						</p>

					</motion.div>

					{/* Product slider - shows first, moves slower than scroll */}
					<motion.div style={{ y: sliderY }} className="relative z-20">
						<ProductSlider />
					</motion.div>

				</div>

				{/* Trust Signals */}
				<div className="mt-24 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto px-4">
					<div className="text-center space-y-2">
						<div className="text-4xl mb-2">🔬</div>
						<h3 className="font-display font-medium">Laboratory Tested</h3>
					</div>
					<div className="text-center space-y-2">
						<div className="text-4xl mb-2">🌊</div>
						<h3 className="font-display font-medium">100% Water-Safe</h3>
					</div>
					<div className="text-center space-y-2">
						<div className="text-4xl mb-2">♻️</div>
						<h3 className="font-display font-medium">Eco-Conscious materials</h3>
					</div>
				</div>
			</section>

			{/* Features Section with Parallax Annotations */}
			<section className="relative py-24 md:py-32 overflow-hidden">

				{/* Headline */}
				<div className="text-center mb-16 px-4">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal mb-4">
						Built to Last Forever
						<span className="block">(and Look the Part)</span>
					</h2>
					<p className="text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
						Obsessively hyper-realistic replicas, made from polyurethane/resin blends. Non-toxic, temperature-resistant, and come with 20-year or lifetime warranties.
					</p>
				</div>

				<div className="max-w-5xl mx-auto px-4">
					<FeaturesLayout />
					<CompaniesLogos />
				</div>

			</section>

			{/* Social Proof - Customer Content */}
			<section className="relative py-24 md:py-36 bg-gradient-to-b from-card/80 to-transparent overflow-hidden">
				{/* Top Wave Divider */}
				<WaveDivider position="top" color="currentColor" className="text-background" />

				<div className="px-4 relative z-10 max-w-7xl mx-auto">
					{/* Headline */}
					<div className="text-center mx-auto max-w-3xl mb-12 md:mb-16">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal mb-4">
							Trusted for 20+ years by 200K+ Tankheads
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

				<div className="mt-24 px-4 max-w-7xl mx-auto">
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

			{/* Stats - Social Proof */}
			{/* <section className="relative py-16 md:py-24 bg-linear-to-b from-card to-background">
				
			</section> */}

			{/* Whatever you choose section with proper wave integration */}
			<section className="relative">
				<WaveContainer>
					<div className="max-w-7xl mx-auto px-4 __pb-12">
						{/* Headline - positioned to be inside the cyan wave */}
						<div className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal mb-4 text-white">
								Whatever you choose, you won't regret it!
							</h2>
							<p className="text-lg text-cyan-100/80 font-display font-light max-w-2xl mx-auto">
								Standard dimensions for quick setup, or custom-made to fit your exact vision.
							</p>
						</div>

						{/* Comparison Table */}
						<ComparisonTable />

						{/* Calculator Demo Video */}
						<div className="mt-24 text-center">
							<h3 className="text-2xl md:text-3xl font-display font-light text-white mb-4">
								Design Your Perfect Background in 3D
							</h3>
							<p className="text-base text-cyan-100/70 font-display font-light mb-8 max-w-2xl mx-auto">
								Our interactive 3D calculator lets you visualize and customize every detail before ordering.
							</p>

							{/* Video showcase */}
							<div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border-2 border-cyan-400/30 shadow-2xl">
								<video
									autoPlay
									loop
									muted
									playsInline
									className="w-full h-auto"
									poster="/media/images/calculator-poster.jpg"
								>
									<source src="/media/videos/calculator-screencast-1.7x.mp4" type="video/mp4" />
								</video>
							</div>

							<div className="mt-8">
								<Link
									href="/calculator"
									className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-cyan-950 rounded-full font-display font-medium text-lg transition-all hover:scale-105"
								>
									Try the Calculator
									<ArrowRight className="h-5 w-5" />
								</Link>
							</div>
						</div>

						{/* Newsletter positioned to overlap bottom wave */}
						<div className="relative mt-24 pb-12">
							<NewsletterForm />
						</div>
					</div>
				</WaveContainer>
			</section>

		</main>
	);
}