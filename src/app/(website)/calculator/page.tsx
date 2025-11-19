// src/app/(website)/calculator/page.tsx

"use client";

import { useState } from "react";
import { StickyPanel } from "./_components/sticky/StickyPanel";
import { ModelCategoryGrid } from "./_components/product/ModelCategoryGrid";
import { DimensionControls } from "./_components/dimensions/DimensionControls";
import { FlexibilityToggle } from "./_components/options/FlexibilityToggle";
import { SidePanelsSelector } from "./_components/options/SidePanelsSelector";
import { CountrySelect } from "./_components/shipping/CountrySelect";
import { QuoteModal } from "./_components/quote/QuoteModal";
import { useQuoteEstimate } from "./_hooks/useQuoteEstimate";
import type { QuoteConfig } from "./calculator-types";
import { Button } from "~/components/ui/button";

// Default configuration
const DEFAULT_CONFIG: QuoteConfig = {
	modelCategory: null,
	flexibility: "solid",
	dimensions: {
		width: 100,
		height: 50,
		depth: 40,
	},
	unit: "cm",
	sidePanels: "none",
	country: "",
};

export default function CalculatorPage() {
	const [config, setConfig] = useState<QuoteConfig>(DEFAULT_CONFIG);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const estimate = useQuoteEstimate(config);

	// Calculate completion percentage for progress indicator
	const completionSteps = [
		config.modelCategory !== null, // Model selected
		config.country !== "",          // Country selected
	];
	const completionPercent = (completionSteps.filter(Boolean).length / completionSteps.length) * 100;

	const handleQuoteSubmit = async (data: { name: string; email: string; notes?: string }) => {
		console.log("Quote submission:", { config, estimate, ...data });

		// TODO: Call tRPC mutation here
		// await api.calculator.createQuote.mutate({ ...config, ...data });

		// For now, just close modal
		setIsModalOpen(false);

		// Show success message (you can add toast notification here)
		alert("Quote request submitted! We'll email you within 24 hours.");
	};

	const canRequestQuote = config.modelCategory !== null && config.country !== "";

	return (
		<main className="min-h-screen">
			{/* Hero Section */}
			<section className="pt-32 md:pt-44 bg-linear-to-b from-muted/50 via-muted/30 to-transparent">
				<div className="container px-4 max-w-7xl mx-auto text-center space-y-6">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
						Custom Aquarium Background Calculator
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-3xl mx-auto leading-relaxed">
						Configure your perfect 3D background in real-time. Adjust dimensions, choose materials,
						and get an instant price estimate.
					</p>

					{/* Progress bar */}
					{completionPercent > 0 && completionPercent < 100 && (
						<div className="max-w-md mx-auto pt-4">
							<div className="flex items-center justify-between text-sm mb-2">
								<span className="text-muted-foreground font-display font-light">
									Configuration Progress
								</span>
								<span className="text-primary font-display font-medium">
									{Math.round(completionPercent)}%
								</span>
							</div>
							<div className="h-2 bg-muted rounded-full overflow-hidden">
								<div
									className="h-full bg-primary transition-all duration-500"
									style={{ width: `${completionPercent}%` }}
								/>
							</div>
						</div>
					)}
				</div>
			</section>

			{/* Main Content - 2 Column Layout */}
			<section className="py-12">
				<div className="container px-4 max-w-7xl mx-auto">
					<div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
						{/* Left Column - Configuration Steps */}
						<div className="space-y-0">
							{/* Step 1: Model Selection */}
							<ModelCategoryGrid
								selected={config.modelCategory}
								onSelect={(category) => setConfig({ ...config, modelCategory: category })}
							/>

							{/* Only show remaining steps if model is selected */}
							{config.modelCategory && (
								<>
									{/* Step 2: Dimensions */}
									<DimensionControls
										dimensions={config.dimensions}
										unit={config.unit}
										onChange={(dimensions) => setConfig({ ...config, dimensions })}
									/>

									{/* Step 3: Material Type */}
									<FlexibilityToggle
										selected={config.flexibility}
										onChange={(flexibility) => setConfig({ ...config, flexibility })}
									/>

									{/* Step 4: Side Panels */}
									<SidePanelsSelector
										selected={config.sidePanels}
										sidePanelWidth={config.sidePanelWidth}
										onChange={(sidePanels, width) =>
											setConfig({ ...config, sidePanels, sidePanelWidth: width })
										}
									/>

									{/* Step 5: Shipping Country */}
									<CountrySelect
										selected={config.country}
										onChange={(country) => setConfig({ ...config, country })}
									/>

									{/* CTA Section */}
									<section className="py-12">
										<div className="max-w-2xl p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border-2 border-primary/20">
											<div className="space-y-6 text-center">
												<h2 className="text-3xl font-display font-light">
													Ready to Get Your Custom Quote?
												</h2>
												<p className="text-muted-foreground font-display font-light text-lg">
													Submit your configuration and receive a detailed quote within 24 hours.
													No obligation to purchase.
												</p>

												<Button
													onClick={() => setIsModalOpen(true)}
													disabled={!canRequestQuote}
													className="w-full md:w-auto px-12 py-6 bg-primary text-white hover:bg-primary/90 font-display font-medium text-lg rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
												>
													{canRequestQuote
														? "Request Custom Quote"
														: "Complete configuration to continue"}
												</Button>

												{!canRequestQuote && (
													<p className="text-sm text-muted-foreground font-display font-light">
														{!config.modelCategory && "• Select a model"}
														{!config.country && " • Choose shipping country"}
													</p>
												)}
											</div>
										</div>
									</section>
								</>
							)}
						</div>

						{/* Right Column - Sticky Sidebar */}
						{config.modelCategory && (
							<StickyPanel
								dimensions={config.dimensions}
								unit={config.unit}
								estimate={estimate}
								onUnitToggle={(unit) => setConfig({ ...config, unit })}
								onDimensionsChange={(dimensions) => setConfig({ ...config, dimensions })}
							/>
						)}
					</div>
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

			{/* Quote Modal */}
			<QuoteModal
				config={config}
				estimate={estimate}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleQuoteSubmit}
			/>
		</main>
	);
}