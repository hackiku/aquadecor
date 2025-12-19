// src/app/[locale]/(website)/_components/FeaturesLayout.tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MediaBlob } from "~/components/ui/water/media-blob-square";
import { StickyShop } from "~/components/cta/StickyShop";

interface FeaturesLayoutProps {
	headline: string;
	subheadline: string;
}

// Features with real image paths from comparison table + fallbacks
const FEATURES = [
	{
		label: "Acid Resistant",
		description: "Zero limestone - won't affect pH",
		image: {
			src: "/media/images/standard-tank.webp", // Using actual image from comparison
			fallback: "/media/images/feature-acid-zoom.webp",
			width: 400,
			height: 300,
		},
		position: {
			top: "80px",
			left: "0px",
		},
		annotation: {
			x: "110%", // Position label to the right of the blob
			y: "30%",
			direction: "left",
		},
	},
	{
		label: "Heat Proof",
		description: "Boiling water safe",
		image: {
			src: "/media/images/custom-tank.webp", // Using actual image from comparison
			fallback: "/media/images/feature-heat-detail.webp",
			width: 350,
			height: 350,
		},
		position: {
			top: "120px",
			right: "40px",
		},
		annotation: {
			x: "-15%", // Position label to the left of the blob
			y: "50%",
			direction: "right",
		},
	},
	{
		label: "Load Bearing",
		description: "1500kg car tested",
		image: {
			src: "/media/images/standard-tank.webp",
			fallback: "/media/images/feature-strength.webp",
			width: 420,
			height: 280,
		},
		position: {
			top: "480px",
			left: "80px",
		},
		annotation: {
			x: "110%",
			y: "70%",
			direction: "left",
		},
	},
	{
		label: "Never Degrades",
		description: "Lifetime warranty",
		image: {
			src: "/media/images/custom-tank.webp",
			fallback: "/media/images/feature-durability.webp",
			width: 380,
			height: 320,
		},
		position: {
			top: "520px",
			right: "0px",
		},
		annotation: {
			x: "-15%",
			y: "40%",
			direction: "right",
		},
	},
	{
		label: "Water Safe",
		description: "100% non-toxic",
		image: {
			src: "/media/images/standard-tank.webp",
			fallback: "/media/images/feature-watersafe.webp",
			width: 340,
			height: 260,
		},
		position: {
			top: "860px",
			left: "50%",
			transform: "translateX(-50%)",
		},
		annotation: {
			x: "50%",
			y: "-10%",
			direction: "bottom",
		},
	},
];

export function FeaturesLayout({ headline, subheadline }: FeaturesLayoutProps) {
	const ref = useRef<HTMLDivElement>(null);
	const featuresRef = useRef<HTMLElement>(null);

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});

	return (
		<section ref={featuresRef} className="relative py-24 md:py-32 overflow-hidden">
			<StickyShop triggerRef={featuresRef} />
			

			{/* Headline */}
			<div className="text-center mb-16 px-4">
				<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal mb-4">
					{headline}
				</h2>
				<p className="text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
					{subheadline}
				</p>
			</div>

			<div className="max-w-5xl mx-auto px-4">
				{/* Editorial Scrollytelling Section - Desktop only */}
				<div ref={ref} className="hidden lg:block relative min-h-[1200px] -mx-4">
					{FEATURES.map((feature, index) => (
						<FeatureAnnotation
							key={index}
							feature={feature}
							index={index}
							scrollProgress={scrollYProgress}
						/>
					))}
				</div>

				{/* Mobile: Simple stacked layout */}
				<div className="lg:hidden space-y-12">
					{FEATURES.map((feature, index) => (
						<div key={index} className="space-y-4">
							<MediaBlob
								asset={feature.image.src}
								type="image"
								alt={feature.label}
								className="mx-auto"
								amount={1.5}
								duration={12}
							/>
							<div className="text-center">
								<h3 className="text-xl font-display font-semibold text-primary mb-2">
									{feature.label}
								</h3>
								<p className="text-sm text-muted-foreground font-display font-light">
									{feature.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

interface FeatureAnnotationProps {
	feature: typeof FEATURES[0];
	index: number;
	scrollProgress: any;
}

function FeatureAnnotation({ feature, index, scrollProgress }: FeatureAnnotationProps) {
	// Stagger fade-in based on scroll
	const opacity = useTransform(
		scrollProgress,
		[0.1 + index * 0.12, 0.3 + index * 0.12],
		[0, 1]
	);

	const y = useTransform(
		scrollProgress,
		[0.1 + index * 0.12, 0.3 + index * 0.12],
		[40, 0]
	);

	// Subtle parallax for the blob
	const blobY = useTransform(scrollProgress, [0, 1], ["0%", `${index % 2 === 0 ? '8%' : '-8%'}`]);

	return (
		<motion.div
			style={{
				opacity,
				y,
				position: "absolute",
				...feature.position
			}}
			className="group z-10"
		>
			{/* MediaBlob with parallax */}
			<motion.div
				style={{ y: blobY }}
				className="relative"
			>
				<MediaBlob
					asset={feature.image.src}
					type="image"
					alt={feature.label}
					className="shadow-2xl"
					amount={1.5}
					duration={12}
				/>

				{/* Label callout - positioned OUTSIDE the blob */}
				<div
					className="absolute pointer-events-none z-20"
					style={{
						left: feature.annotation.x,
						top: feature.annotation.y,
						transform: "translate(-50%, -50%)",
					}}
				>
					<div className="relative">
						{/* Connecting line */}
						<svg
							width="80"
							height="3"
							viewBox="0 0 80 3"
							className={`absolute top-1/2 -translate-y-1/2 ${feature.annotation.direction === "left"
									? "right-full mr-2"
									: feature.annotation.direction === "right"
										? "left-full ml-2"
										: "hidden"
								}`}
						>
							<line
								x1="0"
								y1="1.5"
								x2="80"
								y2="1.5"
								stroke="currentColor"
								strokeWidth="2"
								strokeDasharray="4 4"
								className="text-primary"
							/>
						</svg>

						{/* Label box */}
						<div className="bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-xl border-2 border-primary whitespace-nowrap">
							<p className="text-sm font-display font-bold uppercase tracking-wider">
								{feature.label}
							</p>
							<p className="text-xs font-display font-light opacity-90">
								{feature.description}
							</p>
						</div>

						{/* Dot indicator on blob edge */}
						<div
							className={`absolute w-3 h-3 bg-primary rounded-full ring-4 ring-primary/30 ${feature.annotation.direction === "left"
									? "right-full mr-24"
									: feature.annotation.direction === "right"
										? "left-full ml-24"
										: feature.annotation.direction === "bottom"
											? "top-full mt-12 left-1/2 -translate-x-1/2"
											: "bottom-full mb-12 left-1/2 -translate-x-1/2"
								}`}
						/>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}