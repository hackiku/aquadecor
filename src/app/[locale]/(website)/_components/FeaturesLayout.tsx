// src/app/(website)/_components/FeaturesLayout.tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

// Editorial scattered layout - images positioned absolutely with annotations
const FEATURES = [
	{
		label: "Acid Resistant",
		description: "Zero limestone - won't affect pH",
		// Image specs - you'll cut images to these exact sizes
		image: {
			src: "/media/images/feature-acid-zoom.webp",
			width: 400,
			height: 300,
		},
		// Position on page (desktop)
		position: {
			top: "80px",
			left: "0px",
		},
		// Arrow annotation position relative to image
		annotation: {
			x: "60%",
			y: "40%",
			direction: "top-right", // where arrow points from
		},
	},
	{
		label: "Heat Proof",
		description: "Boiling water safe",
		image: {
			src: "/media/images/feature-heat-detail.webp",
			width: 350,
			height: 350,
		},
		position: {
			top: "120px",
			right: "40px",
		},
		annotation: {
			x: "30%",
			y: "50%",
			direction: "top-left",
		},
	},
	{
		label: "Load Bearing",
		description: "1500kg car tested",
		image: {
			src: "/media/images/feature-strength.webp",
			width: 420,
			height: 280,
		},
		position: {
			top: "480px",
			left: "80px",
		},
		annotation: {
			x: "70%",
			y: "30%",
			direction: "bottom-right",
		},
	},
	{
		label: "Never Degrades",
		description: "Lifetime warranty",
		image: {
			src: "/media/images/feature-durability.webp",
			width: 380,
			height: 320,
		},
		position: {
			top: "520px",
			right: "0px",
		},
		annotation: {
			x: "25%",
			y: "60%",
			direction: "bottom-left",
		},
	},
	{
		label: "Water Safe",
		description: "100% non-toxic",
		image: {
			src: "/media/images/feature-watersafe.webp",
			width: 340,
			height: 260,
		},
		position: {
			top: "860px",
			left: "50%",
			transform: "translateX(-50%)", // Center it
		},
		annotation: {
			x: "50%",
			y: "20%",
			direction: "top",
		},
	},
];

export function FeaturesLayout() {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});

	return (
		<>
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
						<div className="relative rounded-2xl overflow-hidden border-2 border-border shadow-xl">
							<Image
								src={feature.image.src}
								alt={feature.label}
								width={feature.image.width}
								height={feature.image.height}
								className="w-full h-auto"
							/>
						</div>
						<div>
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
		</>
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

	// Subtle parallax
	const imageY = useTransform(scrollProgress, [0, 1], ["0%", `${index % 2 === 0 ? '8%' : '-8%'}`]);

	// Arrow path based on direction
	const getArrowPath = (direction: string) => {
		switch (direction) {
			case "top-right":
				return "M 10 60 Q 50 30, 90 10";
			case "top-left":
				return "M 90 60 Q 50 30, 10 10";
			case "bottom-right":
				return "M 10 10 Q 50 40, 90 60";
			case "bottom-left":
				return "M 90 10 Q 50 40, 10 60";
			case "top":
				return "M 50 60 Q 50 30, 50 10";
			default:
				return "M 10 60 Q 50 30, 90 10";
		}
	};

	return (
		<motion.div
			style={{
				opacity,
				y,
				position: "absolute",
				...feature.position
			}}
			className="group"
		>
			{/* Image with parallax */}
			<motion.div
				style={{
					y: imageY,
					width: `${feature.image.width}px`,
					height: `${feature.image.height}px`,
				}}
				className="relative rounded-2xl overflow-hidden border-2 border-border shadow-2xl"
			>
				<Image
					src={feature.image.src}
					alt={feature.label}
					width={feature.image.width}
					height={feature.image.height}
					className="object-cover"
				/>

				{/* Arrow + Label annotation */}
				<div
					className="absolute pointer-events-none"
					style={{
						left: feature.annotation.x,
						top: feature.annotation.y,
						transform: "translate(-50%, -50%)",
					}}
				>
					{/* Curved arrow */}
					<svg
						width="100"
						height="70"
						viewBox="0 0 100 70"
						className="absolute -top-16 -left-12"
					>
						<defs>
							<marker
								id={`arrow-tip-${index}`}
								viewBox="0 0 10 10"
								refX="5"
								refY="5"
								markerWidth="6"
								markerHeight="6"
								orient="auto"
							>
								<circle cx="5" cy="5" r="4" className="fill-primary" />
							</marker>
						</defs>
						<path
							d={getArrowPath(feature.annotation.direction)}
							className="stroke-primary stroke-[2.5]"
							fill="none"
							markerEnd={`url(#arrow-tip-${index})`}
							strokeDasharray="4 6"
							strokeLinecap="round"
						/>
					</svg>

					{/* Label callout */}
					<div className="absolute -top-20 -left-16 bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-xl border-2 border-primary whitespace-nowrap">
						<p className="text-xs font-display font-bold uppercase tracking-wider">
							{feature.label}
						</p>
						<p className="text-[10px] font-display font-light opacity-90">
							{feature.description}
						</p>
					</div>

					{/* Dot on image */}
					<div className="w-3 h-3 bg-primary rounded-full ring-4 ring-primary/30 animate-pulse" />
				</div>
			</motion.div>
		</motion.div>
	);
}