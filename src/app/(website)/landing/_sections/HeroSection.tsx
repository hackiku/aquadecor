// src/app/(website)/landing/_sections/HeroSection.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ShopButton } from "~/components/cta/ShopButton";
import { Button } from "~/components/ui/button";

export function HeroSection() {
	const bubbleRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!bubbleRef.current) return;

		let animationFrameId: number;
		let time = 0;

		const animate = () => {
			time += 0.001; // Speed of movement

			// Lissajous curve for smooth, organic movement
			const x = Math.sin(time * 1.2) * 8; // Horizontal movement (±8%)
			const y = Math.cos(time * 0.8) * 5; // Vertical movement (±5%)
			const scale = 1 + Math.sin(time * 0.5) * 0.03; // Subtle breathing (±3%)

			if (bubbleRef.current) {
				bubbleRef.current.style.transform = `translate(${x}%, ${y}%) scale(${scale})`;
			}

			animationFrameId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	}, []);

	return (
		<section className="relative overflow-hidden bg-zinc-950 h-dvh flex items-center justify-center">
			{/* Animated Bubble Video Cutout */}
			<div className="absolute inset-0 z-0">
				{/* Gradient overlay for text readability */}
				<div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/50 to-zinc-950/80 z-20" />

				{/* Animated bubble mask container */}
				<div
					ref={bubbleRef}
					className="absolute inset-0 flex items-center justify-center"
					style={{
						willChange: "transform",
						transition: "transform 0.1s ease-out",
					}}
				>
					{/* SVG mask for bubble shape */}
					<svg
						className="absolute inset-0 w-full h-full"
						style={{ mixBlendMode: "normal" }}
					>
						<defs>
							<clipPath id="bubbleClip">
								{/* Organic bubble shape - not quite a perfect circle */}
								<ellipse
									cx="50%"
									cy="50%"
									rx="45%"
									ry="47%"
								/>
							</clipPath>
						</defs>
					</svg>

					{/* Video with bubble clip */}
					<div
						className="absolute inset-0 opacity-30"
						style={{
							clipPath: "url(#bubbleClip)",
							WebkitClipPath: "url(#bubbleClip)",
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
				</div>

				{/* Subtle vignette */}
				<div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-zinc-950/40 z-10" />
			</div>

			{/* Hero Content */}
			<div className="relative z-30 container px-4 max-w-7xl">
				<div className="max-w-3xl space-y-6">
					{/* Slogan/Tagline */}
					<div className="inline-block">
						<p className="text-sm md:text-base text-primary font-display font-medium tracking-wide uppercase">
							Only nature can copy us
						</p>
					</div>

					{/* Main Headline */}
					<h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-display font-extralight leading-tight tracking-tight">
						The most realistic 3D Aquarium Backgrounds & Decorations
					</h1>

					{/* Subheadline */}
					<p className="text-lg md:text-xl text-zinc-200 font-display font-light max-w-2xl leading-relaxed">
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
			</div>
		</section>
	);
}