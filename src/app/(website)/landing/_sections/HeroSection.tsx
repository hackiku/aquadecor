// src/app/(website)/landing/_sections/HeroSection.tsx
"use client";

import Link from "next/link";
import { ShopButton } from "~/components/cta/ShopButton";
import { Button } from "~/components/ui/button";

export function HeroSection() {
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

				{/* Animated SVG Mask - organic blob with wavy bottom */}
				<svg className="absolute inset-0 w-full h-full pointer-events-none">
					<defs>
						<clipPath id="blobMask" clipPathUnits="objectBoundingBox">
							<path d="
								M 0.05,0.08
								C 0.08,0.03 0.15,0.01 0.25,0.02
								C 0.35,0.03 0.42,0.01 0.52,0.01
								C 0.62,0.01 0.68,0.03 0.75,0.03
								C 0.85,0.03 0.92,0.02 0.95,0.08
								L 0.98,0.82
								Q 0.75,0.79 0.5,0.82
								T 0.02,0.82
								Z
							">
								<animate
									attributeName="d"
									dur="12s"
									repeatCount="indefinite"
									values="
										M 0.05,0.08
										C 0.08,0.03 0.15,0.01 0.25,0.02
										C 0.35,0.03 0.42,0.01 0.52,0.01
										C 0.62,0.01 0.68,0.03 0.75,0.03
										C 0.85,0.03 0.92,0.02 0.95,0.08
										L 0.98,0.82
										Q 0.75,0.79 0.5,0.82
										T 0.02,0.82
										Z;

										M 0.03,0.10
										C 0.06,0.04 0.13,0.02 0.23,0.03
										C 0.33,0.04 0.40,0.02 0.50,0.02
										C 0.60,0.02 0.67,0.04 0.77,0.04
										C 0.87,0.04 0.94,0.03 0.97,0.10
										L 0.98,0.84
										Q 0.70,0.81 0.5,0.84
										T 0.02,0.84
										Z;

										M 0.04,0.06
										C 0.07,0.02 0.16,0.01 0.26,0.01
										C 0.36,0.01 0.43,0.02 0.53,0.02
										C 0.63,0.02 0.70,0.01 0.78,0.02
										C 0.88,0.02 0.93,0.01 0.96,0.07
										L 0.97,0.83
										Q 0.73,0.80 0.5,0.83
										T 0.03,0.83
										Z;

										M 0.05,0.08
										C 0.08,0.03 0.15,0.01 0.25,0.02
										C 0.35,0.03 0.42,0.01 0.52,0.01
										C 0.62,0.01 0.68,0.03 0.75,0.03
										C 0.85,0.03 0.92,0.02 0.95,0.08
										L 0.98,0.82
										Q 0.75,0.79 0.5,0.82
										T 0.02,0.82
										Z
									"
								/>
							</path>
						</clipPath>
					</defs>
				</svg>

				{/* Gradient overlays */}
				<div className="absolute inset-0 bg-linear-to-b from-zinc-950/60 via-zinc-950/40 to-zinc-950/90" />
				<div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent" />
			</div>

			{/* Hero Content */}
			<div className="relative z-20 container px-4 max-w-7xl mt-24">
				<div className="max-w-3xl space-y-6">

					{/* Headline */}
					<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-display font-extralight leading-tight tracking-tight">
						World's most realistic 3D Aquarium Backgrounds & Decorations
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
			</div>
		</section>
	);
}
