// src/app/_components/Hero.tsx

import { ShopButton } from "~/components/cta/ShopButton";

export function Hero() {
	return (
		<section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-linear-to-b from-background to-accent/20">
			{/* Background pattern or image would go here */}
			<div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10" />

			<div className="container relative z-10 px-4 py-32 md:py-40">
				<div className="mx-auto max-w-4xl text-center space-y-8">
					<div className="space-y-4">
						<p className="text-sm font-medium text-primary tracking-wider uppercase">
							Only nature can copy us
						</p>
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
							World's Most Realistic 3D Aquarium Backgrounds & Decorations
						</h1>
						<p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
							Transform your aquarium into a natural masterpiece with handcrafted 3D backgrounds that bring underwater beauty to life.
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<ShopButton>Explore Collection</ShopButton>
						<ShopButton href="/about">
							Learn More
						</ShopButton>
					</div>
				</div>
			</div>
		</section>
	);
}