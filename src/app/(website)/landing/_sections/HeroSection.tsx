// src/app/(website)/landing/_sections/HeroSection.tsx

import Link from "next/link";
import { ShopButton } from "~/components/cta/ShopButton";
import { Button } from "~/components/ui/button";

export function HeroSection() {
	return (
		<section className="relative overflow-hidden bg-zinc-950 h-dvh flex items-center justify-center">
			{/* Video background - you'll add actual video later */}
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-linear-to-b from-zinc-950/50 to-zinc-950/80 z-10" />
				<div
					className="absolute inset-0 bg-cover bg-center opacity-20"
					style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
				/>
				{/* TODO: Add BackgroundVideo component when ready */}
			</div>

			{/* Hero Content */}
			<div className="relative z-20 container px-4 max-w-7xl">
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
							<Link href="/store/configurator">Order custom</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}