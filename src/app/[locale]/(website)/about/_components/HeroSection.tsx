// src/app/about/_components/HeroSection.tsx

export function HeroSection() {
	return (
		<section className="relative pt-32 md:pt-40 pb-16 md:pb-24 bg-linear-to-b from-muted/50 to-transparent overflow-hidden">
			<div className="container px-4 max-w-5xl mx-auto">
				<div className="space-y-6">
					<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
						<span className="text-sm text-primary font-display font-medium">
							Est. 2004
						</span>
					</div>
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
						Nature-Inspired Aquascapers Since 2004
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-3xl leading-relaxed">
						We are Aquadecor, a Serbia-based company that creates unique, handmade 3D backgrounds for aquariums.
						For over 20 years, we've perfected the art of bringing nature into your fish tank.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 pt-4">
						<a
							href="#story"
							className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-display font-medium hover:bg-primary/90 transition-all hover:scale-105"
						>
							Our Story
						</a>
						<a
							href="/shop"
							className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-border rounded-full font-display font-medium hover:border-primary/50 hover:bg-accent/30 transition-all"
						>
							Browse Products
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}