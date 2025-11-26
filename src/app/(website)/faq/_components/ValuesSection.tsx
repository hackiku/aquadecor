// src/app/about/_components/ValuesSection.tsx

import { Target, Award, Heart } from "lucide-react";

const VALUES = [
	{
		icon: Target,
		title: "Perfect Quality",
		description: "While perfecting the natural look of our 3D backgrounds, our focus was always on achieving the highest quality standards.",
	},
	{
		icon: Award,
		title: "Guaranteed Durability",
		description: "Since 2016, our standard backgrounds come with a 20-year warranty, while premium products have lifetime warranty.",
	},
	{
		icon: Heart,
		title: "Long Tradition",
		description: "Mr. Florian Kovac has continuously developed new techniques since 2004, satisfying the highest standards and customer wishes.",
	},
];

export function ValuesSection() {
	return (
		<section className="py-16 md:py-24 bg-accent/5">
			<div className="container px-4 max-w-6xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
						Our Commitment
					</h2>
				</div>

				<div className="grid md:grid-cols-3 gap-6">
					{VALUES.map((value) => (
						<div
							key={value.title}
							className="group bg-card/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-card/80 transition-all duration-300"
						>
							<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
								<value.icon className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-xl font-display font-medium mb-3">
								{value.title}
							</h3>
							<p className="text-sm text-muted-foreground font-display font-light leading-relaxed">
								{value.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

// Placeholder component for store photos slider
export function StoreSlider() {
	return (
		<section className="py-16 md:py-24">
			<div className="container px-4 max-w-6xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
						Behind the Scenes
					</h2>
					<p className="text-lg text-muted-foreground font-display font-light">
						A glimpse into our workshop and production process
					</p>
				</div>

				{/* Placeholder grid */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="aspect-square rounded-2xl bg-muted animate-pulse"
						/>
					))}
				</div>
			</div>
		</section>
	);
}

// Placeholder component for blog posts slider
export function BlogSlider() {
	return (
		<section className="py-16 md:py-24 bg-accent/5">
			<div className="container px-4 max-w-6xl mx-auto">
				<div className="flex items-center justify-between mb-12">
					<div>
						<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
							From Our Blog
						</h2>
						<p className="text-lg text-muted-foreground font-display font-light">
							Latest insights and aquarium tips
						</p>
					</div>
					<a
						href="/blog"
						className="text-primary hover:underline font-display font-medium"
					>
						View all posts →
					</a>
				</div>

				{/* Placeholder grid */}
				<div className="grid md:grid-cols-3 gap-6">
					{[1, 2, 3].map((i) => (
						<div key={i} className="space-y-4">
							<div className="aspect-video rounded-2xl bg-muted animate-pulse" />
							<div className="space-y-2">
								<div className="h-6 bg-muted rounded animate-pulse w-3/4" />
								<div className="h-4 bg-muted rounded animate-pulse w-full" />
								<div className="h-4 bg-muted rounded animate-pulse w-5/6" />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}