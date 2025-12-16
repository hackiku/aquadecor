// src/app/(website)/calculator/page.tsx
import { api, HydrateClient } from "~/trpc/server";
import { CalculatorFlow } from "./_components/CalculatorFlow";
import { VeenieKitBadge } from "./_components/VeenieKitBadge";

export default async function CalculatorPage() {
	// Fetch initial model categories server-side
	const categories = await api.calculator.getCalculatorModels({ locale: "en" });

	return (
		<HydrateClient>
			<main className="min-h-screen">

				{/* Hero Section */}
				<section className="pt-16 md:pt-24 bg-gradient-to-b from-muted/50 via-muted/30 to-transparent">
					<div className="container px-4 max-w-7xl mx-auto text-center space-y-3">
						<span className="inline-block bg-primary/20 px-4 py-2 rounded-full text-primary/90 text-sm font-display font-medium">
							How Much for the Fish?
						</span>
						<h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
							Custom Aquarium Background Calculator
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-3xl mx-auto leading-relaxed">
							Configure your perfect 3D background in real-time. Adjust dimensions, choose materials,
							and get an instant price estimate.
						</p>
					</div>
				</section>

				{/* Interactive Calculator Flow */}
				<section className="py-12">
					<div className="container px-4 max-w-6xl mx-auto">
						<CalculatorFlow initialCategories={categories} />
					</div>
				</section>

				{/* Trust Signals */}
				<section className="py-16 bg-accent/5 border-y">
					<div className="container px-4 max-w-5xl mx-auto">
						<div className="grid md:grid-cols-3 gap-8 text-center">
							<div className="space-y-2">
								<div className="text-4xl font-display font-light text-primary">24h</div>
								<p className="text-sm text-muted-foreground font-display">Quote Response Time</p>
							</div>
							<div className="space-y-2">
								<div className="text-4xl font-display font-light text-primary">20+</div>
								<p className="text-sm text-muted-foreground font-display">Years Experience</p>
							</div>
							<div className="space-y-2">
								<div className="text-4xl font-display font-light text-primary">100%</div>
								<p className="text-sm text-muted-foreground font-display">Handcrafted</p>
							</div>
						</div>
					</div>
				</section>

				{/* Veenie Kit Attribution */}
				<section className="py-8 border-t">
					<div className="container px-4 max-w-5xl mx-auto flex justify-center">
						<VeenieKitBadge />
					</div>
				</section>
			</main>
		</HydrateClient>
	);
}