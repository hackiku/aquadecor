// src/app/(website)/landing/_sections/FeaturedCategoriesSection.tsx

"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";

const FEATURED_CATEGORIES = [
	{
		title: "Real or not? No one will be able to tell the difference!",
		description: "Our additional items are ready to use without any preparation, and completely safe and neutral for all environments. Carefully molded and hand painted to charm everyone, from visitors to residents.",
		image: "/images/featured/additional-items.jpg",
		href: "/store/additional-items",
		bgGradient: "from-blue-500/20 to-cyan-500/20"
	},
	{
		title: "Save space and install a Slim 3D fish tank background",
		description: "A perfect solution for hiding the equipment. They are ready to be used right away since they don't need to be siliconed.",
		image: "/images/featured/slim-models.jpg",
		href: "/store/3d-backgrounds/slim-models",
		bgGradient: "from-emerald-500/20 to-teal-500/20"
	},
	{
		title: "Or perhaps a way to bring the Amazon into your home?",
		description: "With E and B models you can easily create a perfect Amazonian setup in your fish tank. 3D Aquarium backgrounds designed for Discus fish and other Amazonian species.",
		image: "/images/featured/amazonian.jpg",
		href: "/store/3d-backgrounds/amazonian-models",
		bgGradient: "from-amber-500/20 to-orange-500/20"
	},
];

export function FeaturedCategoriesSection() {
	const targetRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: targetRef,
	});

	const x = useTransform(scrollYProgress, [0, 1], ["1%", "-55%"]);

	return (
		<>
			{/* Desktop: Horizontal scroll animation */}
			<section ref={targetRef} className="relative h-[300vh] hidden lg:block">
				<div className="sticky top-0 flex h-screen items-center overflow-hidden">
					<motion.div style={{ x }} className="flex gap-6 px-4">
						{FEATURED_CATEGORIES.map((category, index) => (
							<CategoryCard key={index} {...category} />
						))}
					</motion.div>
				</div>
			</section>

			{/* Mobile: Stacked cards */}
			<section className="lg:hidden py-10 space-y-0">
				{FEATURED_CATEGORIES.map((category, index) => (
					<CategoryCard key={index} {...category} mobile />
				))}
			</section>
		</>
	);
}

interface CategoryCardProps {
	title: string;
	description: string;
	image: string;
	href: string;
	bgGradient: string;
	mobile?: boolean;
}

function CategoryCard({ title, description, image, href, bgGradient, mobile }: CategoryCardProps) {
	return (
		<div className={`group relative overflow-hidden bg-neutral-200 dark:bg-neutral-800 ${mobile ? "w-full h-[500px] md:h-[500px]" : "w-[800px] h-full rounded-2xl"
			}`}>
			{/* Background Image - placeholder for now */}
			<div className={`absolute inset-0 z-0 bg-gradient-to-br ${bgGradient}`} />

			{/* Content Overlay */}
			<div className="absolute flex flex-col items-start justify-between gap-y-4 p-8 md:p-10 inset-0 z-10 bg-stone-100/90 dark:bg-zinc-950/90">
				<div className="space-y-4">
					<h3 className={`${mobile ? "text-3xl" : "text-4xl lg:text-5xl"
						} font-display font-light leading-tight`}>
						{title}
					</h3>
					<p className="text-muted-foreground font-display font-light text-base md:text-lg leading-relaxed max-w-2xl">
						{description}
					</p>
				</div>
				<Button
					asChild
					variant="outline"
					size="lg"
					className="rounded-full bg-background"
				>
					<Link href={href}>Shop now</Link>
				</Button>
			</div>
		</div>
	);
}