// src/app/_components/Features.tsx

import { Leaf, Wrench, Globe, Shield } from "lucide-react";

const features = [
	{
		icon: Leaf,
		title: "100% Eco-Friendly",
		description: "Safe for fish, plants, and the environment. Made from premium, non-toxic materials.",
	},
	{
		icon: Wrench,
		title: "Easy Setup",
		description: "Simple installation in minutes. No silicone required for most models.",
	},
	{
		icon: Globe,
		title: "Worldwide Shipping",
		description: "We ship globally with fast, reliable delivery to your door.",
	},
	{
		icon: Shield,
		title: "Lifetime Warranty",
		description: "Quality guaranteed from 5 years up to a lifetime on select products.",
	},
];

export function Features() {
	return (
		<section className="py-24 md:py-32">
			<div className="container px-4">
				<div className="text-center space-y-4 mb-16">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
						Why Choose Aquadecor?
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Premium quality, trusted by aquarium enthusiasts worldwide.
					</p>
				</div>

				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{features.map((feature) => {
						const Icon = feature.icon;
						return (
							<div
								key={feature.title}
								className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card transition-colors hover:bg-accent/50"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
									<Icon className="h-6 w-6 text-primary" />
								</div>
								<h3 className="text-xl font-semibold">{feature.title}</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{feature.description}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}