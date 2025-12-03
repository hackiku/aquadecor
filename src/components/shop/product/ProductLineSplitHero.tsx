// src/components/shop/product/ProductLineSplitHero.tsx

"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface ProductLine {
	slug: string;
	name: string;
	description: string;
	image: string;
	label: string;
}

const productLines: ProductLine[] = [
	{
		slug: "3d-backgrounds",
		name: "3D Backgrounds",
		description: "Transform your aquarium with custom-made 3D backgrounds so realistic that even experts can't tell the difference from natural rock formations.",
		image: "/media/images/3d-backgrounds_500px.webp",
		label: "Handcrafted Since 2004",
	},
	{
		slug: "aquarium-decorations",
		name: "Aquarium Decorations",
		description: "Realistic plants, rocks, driftwood, and accessories crafted from neutral materials for unlimited lifespan and zero water chemistry impact.",
		image: "/media/images/additional-items_500px.webp",
		label: "Complete Your Aquascape",
	},
];

export function ProductLineSplitHero() {
	const [activeSection, setActiveSection] = useState<"3d-backgrounds" | "aquarium-decorations" | null>(null);
	const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const id = entry.target.id;
						if (id === "3d-backgrounds" || id === "aquarium-decorations") {
							setActiveSection(id);
						}
					}
				});
			},
			{ threshold: 0.5 }
		);

		const backgrounds = document.getElementById("3d-backgrounds");
		const decorations = document.getElementById("aquarium-decorations");

		if (backgrounds) observer.observe(backgrounds);
		if (decorations) observer.observe(decorations);

		return () => observer.disconnect();
	}, []);

	// Calculate scale and position based on active section
	const getTransform = (slug: string) => {
		if (!activeSection) {
			// Initial state - both equal
			return { scale: 1, x: "0%", opacity: 1 };
		}

		if (activeSection === slug) {
			// Active - full screen
			return { scale: 1, x: "0%", opacity: 1 };
		} else {
			// Inactive - slide behind
			return {
				scale: 0.95,
				x: slug === "3d-backgrounds" ? "-100%" : "100%",
				opacity: hoveredSide ? 0.7 : 0.3,
			};
		}
	};

	return (
		<section className="relative h-screen overflow-hidden">
			{/* Left Side - 3D Backgrounds */}
			<motion.div
				animate={getTransform("3d-backgrounds")}
				transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
				onHoverStart={() => setHoveredSide("left")}
				onHoverEnd={() => setHoveredSide(null)}
				className="absolute inset-0 md:left-0 md:right-1/2"
			>
				<ProductLinePanel line={productLines[0]!} />
			</motion.div>

			{/* Right Side - Aquarium Decorations */}
			<motion.div
				animate={getTransform("aquarium-decorations")}
				transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
				onHoverStart={() => setHoveredSide("right")}
				onHoverEnd={() => setHoveredSide(null)}
				className="absolute inset-0 md:left-1/2 md:right-0"
			>
				<ProductLinePanel line={productLines[1]!} />
			</motion.div>

			{/* Scroll Indicator */}
			{!activeSection && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1, duration: 0.6 }}
					className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
				>
					<div className="flex flex-col items-center gap-2 text-white/80">
						<span className="text-sm font-display font-light">Scroll to explore</span>
						<motion.div
							animate={{ y: [0, 8, 0] }}
							transition={{ duration: 1.5, repeat: Infinity }}
						>
							<ArrowRight className="h-5 w-5 rotate-90" />
						</motion.div>
					</div>
				</motion.div>
			)}
		</section>
	);
}

function ProductLinePanel({ line }: { line: ProductLine }) {
	return (
		<Link href={`/shop/${line.slug}`} className="block h-full group relative">
			{/* Background Image */}
			<Image
				src={line.image}
				alt={line.name}
				fill
				className="object-cover transition-transform duration-700 group-hover:scale-105"
				priority
			/>

			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-black/30 group-hover:from-black/95 transition-all duration-500" />

			{/* Content */}
			<div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="space-y-4 max-w-2xl"
				>
					<span className="text-primary text-sm font-display font-medium tracking-wider uppercase">
						{line.label}
					</span>
					<h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight text-white tracking-tight">
						{line.name}
					</h2>
					<p className="text-lg md:text-xl text-white/90 font-display font-light leading-relaxed">
						{line.description}
					</p>
					<div className="inline-flex items-center gap-2 text-primary font-display font-medium group-hover:gap-3 transition-all">
						<span>Explore Collection</span>
						<ArrowRight className="h-5 w-5" />
					</div>
				</motion.div>
			</div>
		</Link>
	);
}