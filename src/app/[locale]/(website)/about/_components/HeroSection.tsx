// src/app/[locale]/(website)/about/_components/HeroSection.tsx

"use client";

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
	const t = useTranslations('about');
	const containerRef = useRef<HTMLElement>(null);

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end start"],
	});

	const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
	const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

	return (
		<section
			ref={containerRef}
			className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-muted/50 via-background to-background"
		>
			{/* Background Image with Parallax */}
			<motion.div
				style={{ y, opacity }}
				className="absolute inset-0 z-0"
			>
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />
				<Image
					src="/images/about/workshop-hero.jpg" // Add workshop/craftsman image
					alt="Aquadecor workshop"
					fill
					className="object-cover opacity-20"
					priority
				/>
			</motion.div>

			{/* Content */}
			<div className="container px-4 max-w-xl md:max-w-3xl mx-auto relative z-20 pt-32 pb-16">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="space-y-8 text-center"
				>
					{/* Badge */}
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
						<Sparkles className="h-4 w-4 text-primary" />
						<span className="text-sm text-primary font-display font-medium">
							{t('hero.badge')}
						</span>
					</div>

					{/* Headline */}
					<h1 className="text-4xl md:text-6xl _lg:text-6xl font-display font-extralight tracking-tight leading-tight">
						{t('hero.title')}
					</h1>

					{/* Subtitle */}
					<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-3xl mx-auto leading-relaxed">
						{t('hero.subtitle')}
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/shop"
							className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-display font-medium hover:bg-primary/90 transition-all hover:scale-105"
						>
							{t('hero.ctaShop')}
						</Link>
						<a
							href="#story"
							className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-border rounded-full font-display font-medium hover:border-primary/50 hover:bg-accent/30 hover:text-primary/90 transition-all"
						>
							{t('hero.ctaStory')}
							<ArrowDown className="h-4 w-4" />
						</a>
					</div>
				</motion.div>

				{/* Stats Row */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
					className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
				>
					<div className="text-center space-y-2">
						<div className="text-4xl md:text-5xl font-display font-light text-primary">20+</div>
						<div className="text-sm text-muted-foreground font-display">{t('hero.stats.years')}</div>
					</div>
					<div className="text-center space-y-2">
						<div className="text-4xl md:text-5xl font-display font-light text-primary">50K+</div>
						<div className="text-sm text-muted-foreground font-display">{t('hero.stats.customers')}</div>
					</div>
					<div className="text-center space-y-2">
						<div className="text-4xl md:text-5xl font-display font-light text-primary">1000+</div>
						<div className="text-sm text-muted-foreground font-display">{t('hero.stats.designs')}</div>
					</div>
					<div className="text-center space-y-2">
						<div className="text-4xl md:text-5xl font-display font-light text-primary">50+</div>
						<div className="text-sm text-muted-foreground font-display">{t('hero.stats.countries')}</div>
					</div>
				</motion.div>
			</div>

			{/* Wave Divider */}
			<div className="absolute bottom-0 left-0 right-0 z-10">
				<svg
					viewBox="0 0 1200 120"
					preserveAspectRatio="none"
					className="relative block w-full h-[80px]"
				>
					<path
						d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
						className="fill-background"
					/>
				</svg>
			</div>
		</section>
	);
}