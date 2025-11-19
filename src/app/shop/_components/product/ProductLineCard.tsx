// src/app/shop/_components/product/ProductLineCard.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface ProductLineCardProps {
	slug: string;
	name: string;
	description: string;
	image: string;
	label: string;
	position: "left" | "right";
	categoryCount: number;
}

export function ProductLineCard({
	slug,
	name,
	description,
	image,
	label,
	position,
	categoryCount,
}: ProductLineCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			if (!cardRef.current) return;

			const rect = cardRef.current.getBoundingClientRect();
			const windowHeight = window.innerHeight;

			// Expand when card enters viewport
			const isInView = rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;

			setIsExpanded(isInView);
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll(); // Initial check

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div ref={cardRef}>
			<Link
				href={`/shop/${slug}`}
				className="block group"
			>
				<div className={`relative overflow-hidden rounded-3xl border-2 border-border hover:border-primary/50 transition-all duration-700 ease-out ${isExpanded
						? "h-[450px] md:h-[600px] scale-100 opacity-100"
						: "h-[350px] md:h-[450px] scale-95 opacity-90"
					}`}>
					{/* Background Image */}
					<Image
						src={image}
						alt={name}
						fill
						className="object-cover transition-transform duration-700 group-hover:scale-105"
						priority={position === "left"}
					/>

					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-500" />

					{/* Content */}
					<div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
						<div className="max-w-2xl space-y-4">
							<div className="flex items-center gap-3 mb-2">
								<span className="text-primary text-xs md:text-sm font-display font-medium tracking-wider uppercase">
									{label}
								</span>
								<ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-2 transition-transform duration-300" />
							</div>
							<h2 className={`font-display font-extralight text-white tracking-tight transition-all duration-700 ${isExpanded
									? "text-3xl md:text-5xl lg:text-6xl"
									: "text-2xl md:text-3xl lg:text-4xl"
								}`}>
								{name}
							</h2>
							<p className={`text-white/90 font-display font-light leading-relaxed transition-all duration-700 ${isExpanded
									? "text-base md:text-xl opacity-100"
									: "text-sm md:text-base opacity-80"
								}`}>
								{description}
							</p>
							<div className={`pt-4 transition-opacity duration-500 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
								<span className="inline-flex items-center gap-2 text-primary font-display font-medium">
									Explore {categoryCount} categories
									<ArrowRight className="h-4 w-4" />
								</span>
							</div>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
}