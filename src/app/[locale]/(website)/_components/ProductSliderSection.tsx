// src/app/[locale]/(website)/_components/ProductSliderSection.tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Hammer, Shield, Ruler } from "lucide-react";
import { FeaturedProductSlider } from "~/components/shop/product/FeaturedProductSlider";
// import { StickyShop } from "~/components/cta/StickyShop";

interface ProductSliderSectionProps {
	headline: string;
	subheadline: string;
	backgroundsTitle: string;
	backgroundsSubtitle: string;
	backgroundsHref: string;
	backgroundsCta: string;
	decorationsTitle: string;
	decorationsSubtitle: string;
	decorationsHref: string;
	decorationsCta: string;
	locale: string;
}

export function ProductSliderSection({
	headline,
	subheadline,
	backgroundsTitle,
	backgroundsSubtitle,
	backgroundsHref,
	backgroundsCta,
	decorationsTitle,
	decorationsSubtitle,
	decorationsHref,
	decorationsCta,
	locale,
}: ProductSliderSectionProps) {
	const sliderRef = useRef<HTMLElement>(null);

	const { scrollYProgress } = useScroll({
		target: sliderRef,
		offset: ["start end", "end start"],
	});

	// Parallax: Cards move slower than scroll
	const sliderY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-10%"]);

	// Headline emerges from behind cards
	const headlineY = useTransform(scrollYProgress, [0, 0.3, 0.5], ["80px", "0px", "0px"]);
	const headlineOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 0.6, 1]);

	return (
		// <section ref={sliderRef}
		<section ref={sliderRef} className="relative overflow-hidden py-24 bg-linear-to-b from-card/50 to-transparent">
			{/* <StickyShop triggerRef={sliderRef} /> */}

			<div className="pl-4 lg:pl-8 _max-w-7xl mx-auto">
				{/* Headline emerges from behind as you scroll */}
				<motion.div
					style={{ y: headlineY, opacity: headlineOpacity }}
					className="text-center relative z-10 mb-24"
				>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal">
						{headline}
					</h2>
					<p className="mt-4 text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
						{subheadline}
					</p>
				</motion.div>

				{/* Product slider */}
				<motion.div style={{ y: sliderY }} className="relative z-20">
					<FeaturedProductSlider
						backgroundsTitle={backgroundsTitle}
						backgroundsSubtitle={backgroundsSubtitle}
						backgroundsHref={backgroundsHref}
						backgroundsCta={backgroundsCta}
						decorationsTitle={decorationsTitle}
						decorationsSubtitle={decorationsSubtitle}
						decorationsHref={decorationsHref}
						decorationsCta={decorationsCta}
						locale={locale}
					/>
				</motion.div>
			</div>

			{/* Trust Signals */}
			<div className="mt-24 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto px-4">
				<div className="text-center space-y-2">
					<Hammer className="h-14 w-14 mx-auto mb-4 text-primary" strokeWidth={1} />
					<h3 className="font-display font-medium">Handcrafted</h3>
				</div>
				<div className="text-center space-y-2">
					<Shield className="h-14 w-14 mx-auto mb-4 text-primary" strokeWidth={1} />
					<h3 className="font-display font-medium">Lifetime warranty</h3>
				</div>
				<div className="text-center space-y-2">
					<Ruler className="h-14 w-14 mx-auto mb-4 text-primary" strokeWidth={1} />
					<h3 className="font-display font-medium">Perfect fit</h3>
				</div>
			</div>
		</section>
	);
}