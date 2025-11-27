// src/app/(website)/_components/HeroSection.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShopButton } from "~/components/cta/ShopButton";
import { Button } from "~/components/ui/button";
import { QuickShoutout } from "~/components/proof/QuickShoutout";

export function HeroSection() {
	const [isUnderlineVisible, setIsUnderlineVisible] = useState(false);

	// Sync with QuickShoutout's 4-second cycle
	useEffect(() => {
		// Show underline after 1 second, hide at 3 seconds
		const showTimer = setTimeout(() => setIsUnderlineVisible(true), 1000);
		const hideTimer = setTimeout(() => setIsUnderlineVisible(false), 3000);

		// Repeat every 4 seconds
		const interval = setInterval(() => {
			setIsUnderlineVisible(true);
			setTimeout(() => setIsUnderlineVisible(false), 2000);
		}, 4000);

		return () => {
			clearTimeout(showTimer);
			clearTimeout(hideTimer);
			clearInterval(interval);
		};
	}, []);

	return (
		<section className="relative overflow-hidden bg-zinc-950 h-dvh flex items-center justify-center">
			{/* Video with Animated Blob Mask */}
			<div className="absolute inset-0">
				{/* Video layer */}
				<div
					className="absolute inset-0 opacity-30"
					style={{
						clipPath: "url(#blobMask)",
						WebkitClipPath: "url(#blobMask)",
					}}
				>
					<video
						autoPlay
						loop
						muted
						playsInline
						className="w-full h-full object-cover"
					>
						<source src="/media/videos/banner-video.mp4" type="video/mp4" />
					</video>
				</div>

				{/* Animated SVG Mask */}
				<svg className="absolute inset-0 w-full h-full pointer-events-none">
					<defs>
						<clipPath id="blobMask" clipPathUnits="objectBoundingBox">
							<path d="
								M 0.02,0.15
								C 0.01,0.08 0.03,0.02 0.08,0.01
								C 0.15,0.00 0.25,0.01 0.35,0.01
								C 0.45,0.01 0.55,0.01 0.65,0.01
								C 0.75,0.01 0.85,0.00 0.92,0.01
								C 0.97,0.02 0.99,0.08 0.98,0.15
								L 0.98,0.65
								C 0.95,0.70 0.90,0.73 0.85,0.75
								Q 0.75,0.78 0.65,0.80
								Q 0.55,0.82 0.45,0.80
								Q 0.35,0.78 0.25,0.75
								Q 0.15,0.72 0.05,0.68
								C 0.03,0.67 0.02,0.64 0.02,0.60
								L 0.02,0.15
								Z
							">
								<animate
									attributeName="d"
									dur="15s"
									repeatCount="indefinite"
									values="
										M 0.02,0.15 C 0.01,0.08 0.03,0.02 0.08,0.01 C 0.15,0.00 0.25,0.01 0.35,0.01 C 0.45,0.01 0.55,0.01 0.65,0.01 C 0.75,0.01 0.85,0.00 0.92,0.01 C 0.97,0.02 0.99,0.08 0.98,0.15 L 0.98,0.65 C 0.95,0.70 0.90,0.73 0.85,0.75 Q 0.75,0.78 0.65,0.80 Q 0.55,0.82 0.45,0.80 Q 0.35,0.78 0.25,0.75 Q 0.15,0.72 0.05,0.68 C 0.03,0.67 0.02,0.64 0.02,0.60 L 0.02,0.15 Z;
										M 0.01,0.18 C 0.00,0.10 0.02,0.03 0.07,0.015 C 0.14,0.00 0.24,0.005 0.34,0.01 C 0.44,0.015 0.54,0.01 0.64,0.005 C 0.74,0.00 0.84,0.005 0.91,0.015 C 0.98,0.025 0.995,0.10 0.99,0.18 L 0.99,0.68 C 0.96,0.73 0.91,0.76 0.86,0.78 Q 0.76,0.81 0.66,0.83 Q 0.56,0.85 0.46,0.83 Q 0.36,0.81 0.26,0.78 Q 0.16,0.75 0.06,0.71 C 0.04,0.70 0.01,0.67 0.01,0.63 L 0.01,0.18 Z;
										M 0.015,0.12 C 0.005,0.06 0.025,0.015 0.075,0.005 C 0.145,0.00 0.245,0.01 0.345,0.015 C 0.445,0.02 0.545,0.015 0.645,0.01 C 0.745,0.005 0.845,0.00 0.915,0.005 C 0.975,0.01 0.995,0.06 0.985,0.12 L 0.985,0.62 C 0.955,0.68 0.905,0.71 0.855,0.73 Q 0.755,0.76 0.655,0.78 Q 0.555,0.80 0.455,0.78 Q 0.355,0.76 0.255,0.73 Q 0.155,0.70 0.055,0.66 C 0.035,0.65 0.015,0.62 0.015,0.58 L 0.015,0.12 Z;
										M 0.02,0.15 C 0.01,0.08 0.03,0.02 0.08,0.01 C 0.15,0.00 0.25,0.01 0.35,0.01 C 0.45,0.01 0.55,0.01 0.65,0.01 C 0.75,0.01 0.85,0.00 0.92,0.01 C 0.97,0.02 0.99,0.08 0.98,0.15 L 0.98,0.65 C 0.95,0.70 0.90,0.73 0.85,0.75 Q 0.75,0.78 0.65,0.80 Q 0.55,0.82 0.45,0.80 Q 0.35,0.78 0.25,0.75 Q 0.15,0.72 0.05,0.68 C 0.03,0.67 0.02,0.64 0.02,0.60 L 0.02,0.15 Z
									"
								/>
							</path>
						</clipPath>
					</defs>
				</svg>

				{/* Gradient overlays */}
				<div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/40 to-zinc-950/90" />
				<div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
			</div>

			{/* Hero Content */}
			<div className="relative z-20 w-full max-w-7xl px-4 mt-24">
				<div className="flex items-end justify-between gap-8">
					{/* Left: Main headline and CTAs */}
					<div className="max-w-3xl space-y-6">
						{/* Headline with animated underline on "most realistic" */}
						<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-display font-extralight leading-tight tracking-tight">
							World's{" "}
							<span className="relative inline-block">
								<span className="relative z-10">most realistic</span>
								<motion.span
									className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
									initial={{ scaleX: 0 }}
									animate={{ scaleX: isUnderlineVisible ? 1 : 0 }}
									transition={{ duration: 0.4, ease: "easeInOut" }}
									style={{ transformOrigin: "left" }}
								/>
							</span>
							{" "}3D Aquarium Backgrounds & Decorations
						</h1>

						{/* Subheadline */}
						<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-2xl leading-relaxed">
							A simple and effective way to create a natural habitat in your fish tank.
						</p>

						{/* CTAs */}
						<div className="flex flex-col sm:flex-row gap-4 pt-4">
							<ShopButton />

							<Button
								asChild
								variant="outline"
								size="lg"
								className="rounded-full w-full sm:w-auto text-white border-white hover:bg-white hover:text-zinc-950"
							>
								<Link href="/calculator">Order custom</Link>
							</Button>
						</div>
					</div>

					{/* Right: QuickShoutout - hidden on mobile */}
					<div className="hidden lg:block shrink-0">
						<QuickShoutout />
					</div>
				</div>
			</div>
		</section>
	);
}