// src/app/about/_components/TechSection.tsx

import { Shield, Flame, Droplet, Mountain } from "lucide-react";

const DURABILITY_TESTS = [
	{
		icon: Droplet,
		title: "Acid Resistant",
		description: "Tested with hydrochloric acid to prove zero limestone content. Won't alter pH or dissolve over time like natural rocks.",
	},
	{
		icon: Mountain,
		title: "Acetone Proof",
		description: "No reaction to harsh solvents. Color, shape, and structure remain unchanged even with nail polish remover-strength chemicals.",
	},
	{
		icon: Flame,
		title: "Extreme Temperature",
		description: "Tested with fire and boiling water. Slim backgrounds remain flexible, returning to original shape even after extreme conditions.",
	},
	{
		icon: Shield,
		title: "1500kg Load Tested",
		description: "Withstands over 1,500 kilograms of weight. Engineered for durability that outlasts your aquarium itself.",
	},
];

export function TechSection() {
	return (
		<section className="py-16 md:py-24 bg-accent/5">
			<div className="container px-4 max-w-6xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12 md:mb-16">
					<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-6">
						<span className="text-sm text-primary font-display font-medium">
							Why We're Different
						</span>
					</div>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light mb-4">
						20-Year Warranty. Lifetime Durability.
					</h2>
					<p className="text-lg text-muted-foreground font-display font-light max-w-3xl mx-auto">
						We don't just say our backgrounds are the best—we prove it. Every product undergoes extreme testing that would destroy inferior alternatives.
					</p>
				</div>

				{/* Durability Grid */}
				<div className="grid md:grid-cols-2 gap-6 mb-12">
					{DURABILITY_TESTS.map((test) => (
						<div
							key={test.title}
							className="group bg-card/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-card/80 transition-all duration-300"
						>
							<div className="flex items-start gap-4">
								<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
									<test.icon className="h-6 w-6 text-primary" />
								</div>
								<div className="space-y-2">
									<h3 className="text-xl font-display font-medium">
										{test.title}
									</h3>
									<p className="text-sm text-muted-foreground font-display font-light leading-relaxed">
										{test.description}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Why It Matters */}
				<div className="bg-linear-to-br from-primary/5 to-primary/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 border-2 border-primary/20">
					<div className="max-w-3xl mx-auto text-center space-y-4">
						<h3 className="text-2xl md:text-3xl font-display font-light">
							Why This Matters for Your Aquarium
						</h3>
						<p className="text-muted-foreground font-display font-light leading-relaxed">
							Natural rocks often contain limestone that dissolves in water, constantly changing your pH and harming sensitive fish. Our backgrounds are chemically inert—they'll look perfect and keep your water stable for decades. That's why we can offer a 20-year warranty on standard backgrounds and lifetime warranty on premium products.
						</p>
						<div className="pt-4">
							<a
								href="https://www.youtube.com/watch?v=your-test-video"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 text-primary hover:underline font-display font-medium"
							>
								Watch the durability tests →
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}