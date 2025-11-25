// src/app/(website)/landing/_sections/FeaturesSection.tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const FEATURES = [
	{
		label: "Hydrochloric Acid Resistant",
		description: "Zero limestone content - won't affect pH or hardness",
		position: { x: "20%", y: "15%" },
		anchor: { x: "25%", y: "20%" },
	},
	{
		label: "Heat & Flame Proof",
		description: "Safe to disinfect with boiling water",
		position: { x: "70%", y: "25%" },
		anchor: { x: "65%", y: "30%" },
	},
	{
		label: "Extreme Load Bearing",
		description: "Tested by driving a 1500kg car over it",
		position: { x: "15%", y: "70%" },
		anchor: { x: "20%", y: "65%" },
	},
	{
		label: "Lifetime Warranty",
		description: "Chemical-resistant, never leaches or degrades",
		position: { x: "75%", y: "75%" },
		anchor: { x: "70%", y: "70%" },
	},
];

export function FeaturesSection() {
	const ref = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});

	// Parallax effects for the image
	const imageY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
	const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

	return (
		<section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
			<div className="px-4 max-w-7xl mx-auto">
				{/* Headline */}
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal mb-4">
						Built to Last Forever
					</h2>
					<p className="text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
						Obsessive about hyper-realistic replicas made from polyurethane/resin blends. Non-toxic, temperature-resistant, and come with 20-year or lifetime warranties.
					</p>
				</div>

				{/* Editorial Layout - Image + Annotations */}
				<div className="relative max-w-5xl mx-auto">
					{/* Main Product Image */}
					<motion.div
						style={{ y: imageY, scale: imageScale }}
						className="relative aspect-[16/10] rounded-2xl overflow-hidden border-2 border-border shadow-2xl"
					>
						<Image
							src="/media/images/3d-backgrounds_500px.webp"
							alt="Aquadecor 3D Background Detail"
							fill
							className="object-cover"
						/>

						{/* Subtle overlay for better annotation visibility */}
						<div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent" />
					</motion.div>

					{/* Feature Annotations */}
					{FEATURES.map((feature, index) => (
						<FeatureAnnotation
							key={index}
							feature={feature}
							index={index}
							scrollProgress={scrollYProgress}
						/>
					))}
				</div>

				{/* Additional Trust Signals */}
				<div className="grid md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
					<div className="text-center space-y-2">
						<div className="text-4xl mb-2">🔬</div>
						<h3 className="font-display font-medium">Laboratory Tested</h3>
						<p className="text-sm text-muted-foreground font-display font-light">
							Rigorous quality control ensures every piece meets our standards
						</p>
					</div>
					<div className="text-center space-y-2">
						<div className="text-4xl mb-2">🌊</div>
						<h3 className="font-display font-medium">100% Water-Safe</h3>
						<p className="text-sm text-muted-foreground font-display font-light">
							Won't alter water chemistry or harm any aquatic life
						</p>
					</div>
					<div className="text-center space-y-2">
						<div className="text-4xl mb-2">♻️</div>
						<h3 className="font-display font-medium">Eco-Conscious</h3>
						<p className="text-sm text-muted-foreground font-display font-light">
							Durable materials mean no replacements, less waste
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

function FeatureAnnotation({
	feature,
	index,
	scrollProgress,
}: {
	feature: typeof FEATURES[0];
	index: number;
	scrollProgress: any;
}) {
	// Stagger animations based on index
	const opacity = useTransform(
		scrollProgress,
		[0.2 + index * 0.05, 0.3 + index * 0.05],
		[0, 1]
	);

	const y = useTransform(
		scrollProgress,
		[0.2 + index * 0.05, 0.3 + index * 0.05],
		[20, 0]
	);

	return (
		<motion.div
			style={{ opacity, y }}
			className="absolute hidden lg:block"
			initial={{ opacity: 0 }}
		>
			{/* Connector Line with Arrow */}
			<svg
				className="absolute"
				style={{
					left: feature.position.x,
					top: feature.position.y,
					width: "200px",
					height: "100px",
				}}
			>
				<defs>
					<marker
						id={`arrow-${index}`}
						viewBox="0 0 10 10"
						refX="9"
						refY="5"
						markerWidth="6"
						markerHeight="6"
						orient="auto"
					>
						<circle cx="5" cy="5" r="4" className="fill-primary" />
					</marker>
				</defs>
				<path
					d={`M 0 0 Q 50 -20, 100 0`}
					className="stroke-primary stroke-[2]"
					fill="none"
					markerEnd={`url(#arrow-${index})`}
					strokeDasharray="4 4"
				/>
			</svg>

			{/* Feature Label Card */}
			<div
				className="absolute bg-background/95 backdrop-blur-sm border-2 border-primary rounded-lg px-4 py-3 shadow-xl max-w-[240px]"
				style={{
					left: feature.position.x,
					top: feature.position.y,
					transform: "translate(-50%, -120%)",
				}}
			>
				<p className="text-sm font-display font-semibold text-primary mb-1">
					{feature.label}
				</p>
				<p className="text-xs text-muted-foreground font-display font-light">
					{feature.description}
				</p>
			</div>
		</motion.div>
	);
}