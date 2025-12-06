// src/app/(website)/_components/HeroSection.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { QuickShoutout } from "~/components/proof/QuickShoutout";
import { HeroVideoWave } from "~/components/ui/water/hero-video-wave";
import { WaveDivider } from "~/components/ui/water/wave-divider";

export function HeroSection() {
	const [isUnderlineVisible, setIsUnderlineVisible] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	// Trigger underline animation when slide changes
	const triggerUnderlineAnimation = () => {
		setIsUnderlineVisible(true);
		setTimeout(() => setIsUnderlineVisible(false), 600);
	};

	return (
		<section className="relative overflow-hidden h-dvh -mt-16">
			<WaveDivider position="bottom" color="black"/>
			{/* Full-width video with wave cutout */}
			<div className="absolute inset-0 opacity-40">
				<HeroVideoWave
					videoSrc="/media/videos/banner-video.mp4"
					posterSrc="/media/images/video-poster.jpg"
				/>
			</div>

			{/* Gradient overlays */}
			<div className="absolute inset-0 mb-12 bg-linear-to-b from-zinc-950/80 via-zinc-900/50 to-black" />
			{/* <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" /> */}

			{/* Hero Content */}
			<div className="relative z-20 w-full h-full flex items-start justify-center pt-32 md:pt-40">
				<div className="w-full max-w-5xl px-4">
					<div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
						{/* Headline */}
						<h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-display font-extralight leading-tight tracking-tight">
							World's{" "}
							<span className="relative inline-block">
								<span className="relative z-10">most realistic</span>
								{/* Animated underline */}
								<motion.svg
									className="absolute -bottom-2 left-0 w-full h-4"
									viewBox="0 0 200 10"
									preserveAspectRatio="none"
									initial={{ pathLength: 0, opacity: 0 }}
									animate={{
										pathLength: isUnderlineVisible && !isPaused ? 1 : 0,
										opacity: isUnderlineVisible && !isPaused ? 1 : 0
									}}
									transition={{ duration: 0.6, ease: "easeInOut" }}
								>
									<motion.path
										d="M 0 5 Q 50 0, 100 5 T 200 5"
										stroke="currentColor"
										strokeWidth="3"
										fill="none"
										className="text-primary"
										strokeLinecap="round"
									/>
								</motion.svg>
							</span>
							{" "}3D Aquarium Backgrounds & Decorations
						</h1>

						{/* Subheadline */}
						<p className="text-lg md:text-xl text-zinc-400 font-display font-light max-w-xl mx-auto leading-relaxed">
							The aquarium community's {' '}
							<span className="text-white italic font-regular">
								least-kept secret
							</span> {' '}
							for creating gorgeously-looking natural habitats.
						</p>

						{/* CTAs */}
						<div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
							{/* Shop Now - primary button */}
							<Link
								href="/shop"
								className="inline-flex items-center justify-center px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-display font-medium text-base transition-all hover:scale-105 sm:w-auto"
							>
								Shop Now
							</Link>

							{/* Order Custom - outline button */}
							<Link
								href="/calculator"
								className="inline-flex items-center justify-center px-8 py-3 bg-transparent hover:bg-white/10 text-white border-2 border-white rounded-full font-display font-medium text-base transition-all sm:w-auto"
							>
								Order custom
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* QuickShoutout */}
			<div className="absolute -bottom-2 right-4 md:bottom-36 md:right-8 lg:right-12">
				<QuickShoutout
					onSlideChange={triggerUnderlineAnimation}
					isPaused={isPaused}
					onPauseChange={setIsPaused}
				/>
			</div>
		</section>
	);
}