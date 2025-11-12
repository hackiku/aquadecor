// src/app/(website)/calculator/page.tsx

import { Aquarium3D } from "./3d/Aquarium3D";
import { LazyAquarium3D } from "./3d/LazyAquarium3D";
import { ShopButton } from "~/components/cta/ShopButton";

export default function CalculatorPage() {
	return (
		<main className="min-h-screen">
			{/* Hero Section */}
			<section className="py-16 md:py-24 bg-linear-to-b from-background to-accent/5">
				<div className="container px-4 max-w-4xl mx-auto text-center space-y-6">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-light tracking-tight">
						Custom Aquarium Background Calculator
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-2xl mx-auto leading-relaxed">
						Configure your perfect aquarium background in 3D. Adjust dimensions in real-time and get an instant price estimate.
					</p>
				</div>
			</section>

			{/* 3D Configurator */}
			<section className="py-12 md:py-16">
				<div className="container px-4 max-w-6xl mx-auto">
					{/* <LazyAquarium3D /> */}
					<Aquarium3D />
				</div>
			</section>

			{/* Simple 3-Step Process */}
			<section className="py-16 md:py-24 bg-accent/5">
				<div className="container px-4 max-w-5xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-display font-light text-center mb-12">
						How It Works
					</h2>

					<div className="grid md:grid-cols-3 gap-8">
						{/* Step 1 */}
						<div className="space-y-4 text-center">
							<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
								<span className="text-2xl font-bold text-primary">1</span>
							</div>
							<h3 className="text-xl font-display font-normal">
								Configure Dimensions
							</h3>
							<p className="text-muted-foreground font-display font-light">
								Use the 3D configurator above to adjust your aquarium's width, height, and depth. See your design come to life in real-time.
							</p>
						</div>

						{/* Step 2 */}
						<div className="space-y-4 text-center">
							<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
								<span className="text-2xl font-bold text-primary">2</span>
							</div>
							<h3 className="text-xl font-display font-normal">
								Select Options
							</h3>
							<p className="text-muted-foreground font-display font-light">
								Choose your background style, flexibility type, and any additional decorations. Customize to match your vision.
							</p>
						</div>

						{/* Step 3 */}
						<div className="space-y-4 text-center">
							<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
								<span className="text-2xl font-bold text-primary">3</span>
							</div>
							<h3 className="text-xl font-display font-normal">
								Get Your Quote
							</h3>
							<p className="text-muted-foreground font-display font-light">
								Receive an instant price estimate. Submit your request and we'll send you a custom Stripe payment link within 24 hours.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Options Form - Simplified */}
			<section className="py-16 md:py-24">
				<div className="container px-4 max-w-3xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-display font-light text-center mb-12">
						Customize Your Background
					</h2>

					<div className="space-y-8">
						{/* Background Style */}
						<div className="space-y-3">
							<label className="text-lg font-display font-normal block">
								Background Style
							</label>
							<select className="w-full px-4 py-3 rounded-lg border bg-background">
								<option>Rocky Cave (G Models)</option>
								<option>Amazonian Roots (E Models)</option>
								<option>Slim Stone (A Models)</option>
								<option>Coral Reef</option>
							</select>
						</div>

						{/* Flexibility */}
						<div className="space-y-3">
							<label className="text-lg font-display font-normal block">
								Flexibility Type
							</label>
							<div className="grid grid-cols-2 gap-4">
								<button className="px-6 py-4 rounded-lg border-2 border-primary bg-primary/5 text-left hover:bg-primary/10 transition-colors">
									<div className="font-display font-medium">Solid</div>
									<div className="text-sm text-muted-foreground">Vacuum suction cups</div>
								</button>
								<button className="px-6 py-4 rounded-lg border hover:border-primary text-left hover:bg-accent/50 transition-colors">
									<div className="font-display font-medium">Flexible</div>
									<div className="text-sm text-muted-foreground">Bendable material</div>
								</button>
							</div>
						</div>

						{/* Side Panels */}
						<div className="space-y-3">
							<label className="text-lg font-display font-normal block">
								Side Panels (Optional)
							</label>
							<div className="grid grid-cols-3 gap-4">
								<button className="px-6 py-4 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors">
									<div className="font-display font-medium">None</div>
								</button>
								<button className="px-6 py-4 rounded-lg border hover:border-primary hover:bg-accent/50 transition-colors">
									<div className="font-display font-medium">Single Side</div>
								</button>
								<button className="px-6 py-4 rounded-lg border hover:border-primary hover:bg-accent/50 transition-colors">
									<div className="font-display font-medium">Both Sides</div>
								</button>
							</div>
						</div>

						{/* Shipping Country */}
						<div className="space-y-3">
							<label className="text-lg font-display font-normal block">
								Shipping Country
							</label>
							<select className="w-full px-4 py-3 rounded-lg border bg-background">
								<option>United States</option>
								<option>Germany</option>
								<option>Netherlands</option>
								<option>United Kingdom</option>
								<option>Other (specify in notes)</option>
							</select>
						</div>

						{/* Additional Notes */}
						<div className="space-y-3">
							<label className="text-lg font-display font-normal block">
								Additional Notes (Optional)
							</label>
							<textarea
								className="w-full px-4 py-3 rounded-lg border bg-background min-h-[120px]"
								placeholder="Any special requests or questions..."
							/>
						</div>

						{/* Submit */}
						<div className="pt-6">
							<ShopButton href="#" className="w-full text-center block">
								Request Custom Quote
							</ShopButton>
							<p className="text-sm text-muted-foreground text-center mt-4 font-display font-light">
								We'll send you a custom payment link within 24 hours
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Trust Signals */}
			<section className="py-16 bg-accent/5">
				<div className="container px-4 max-w-5xl mx-auto">
					<div className="grid md:grid-cols-3 gap-8 text-center">
						<div className="space-y-2">
							<div className="text-4xl font-display font-light text-primary">24h</div>
							<p className="text-sm text-muted-foreground font-display">Response Time</p>
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
		</main>
	);
}