// src/app/[locale]/(website)/_components/HeroSection.tsx
"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { QuickShoutout } from "~/components/proof/QuickShoutout";
import { HeroVideoWave } from "~/components/ui/water/hero-video-wave";
import { WaveDivider } from "~/components/ui/water/wave-divider";
import { ShopButton } from "~/components/cta/ShopButton";

interface HeroSectionProps {
	locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
	const t = useTranslations('home.hero');
	const [underlineKey, setUnderlineKey] = useState(0);

	// Callback to trigger underline animation when testimonial changes
	const handleTestimonialChange = useCallback(() => {
		setUnderlineKey(prev => prev + 1);
	}, []);

	return (
		<section className="relative overflow-hidden h-dvh -mt-16 bg-black">
			<WaveDivider position="bottom" color="currentColor" />

			{/* Full-width video with wave cutout */}
			<div className="absolute inset-0 opacity-40">
				<HeroVideoWave
					videoSrc="/media/videos/banner-video.mp4"
					posterSrc="/media/images/video-poster.jpg"
				/>
			</div>

			{/* Gradient overlays */}
			{/* <div className="absolute inset-0 mb-12 bg-linear-to-b from-black/80 via-neutral-950/50 to-black" /> */}

			{/* Hero Content */}
			<div className="relative z-20 w-full h-full flex items-start justify-center pt-32 md:pt-40">
				<div className="w-full max-w-5xl px-4">
					<div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
						{/* Headline */}
						<h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-display font-extralight leading-tight tracking-tight">
							{t('headline.part1')}{" "}
							<span className="relative inline-block">
								<span className="relative z-10">{t('headline.highlighted')}</span>
								{/* Animated underline - left to right on trigger */}
								<motion.div
									key={underlineKey}
									className="absolute -bottom-2 left-0 right-0 h-1"
									initial={{ scaleX: 0, transformOrigin: "left" }}
									animate={{ scaleX: 1 }}
									transition={{ duration: 0.6, ease: "easeOut" }}
								>
									<svg
										className="w-full h-full"
										viewBox="0 0 200 10"
										preserveAspectRatio="none"
									>
										<path
											d="M 0 5 Q 50 3, 100 5 T 200 5"
											stroke="currentColor"
											strokeWidth="3"
											fill="none"
											className="text-primary"
											strokeLinecap="round"
										/>
									</svg>
								</motion.div>
							</span>
							{" "}{t('headline.part2')}
						</h1>

						{/* Subheadline */}
						<p className="text-lg md:text-xl text-zinc-400 font-display font-light max-w-xl mx-auto leading-relaxed">
							{t('subheadline.part1')}{' '}
							<span className="text-white italic font-regular">
								{t('subheadline.highlighted')}
							</span>{' '}
							{t('subheadline.part2')}
						</p>

						{/* CTAs */}
						<div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
							<ShopButton />
							<Link
								href="/calculator"
								className="inline-flex items-center justify-center px-8 py-3 bg-transparent hover:bg-white/10 text-white border-2 border-white rounded-full font-display font-medium text-base transition-all sm:w-auto"
							>
								{t('cta.secondary')}
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* QuickShoutout - with animation callback */}
			<div className="absolute z-30 -bottom-2 right-4 md:bottom-36 md:right-8 lg:right-12">
				<QuickShoutout
					onSlideChange={handleTestimonialChange}
				/>
			</div>
		</section>
	);
}