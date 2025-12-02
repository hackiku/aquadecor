// src/app/(website)/calculator/page.tsx

"use client";

import { useState } from "react";
import { UnitProvider } from "./_context/UnitContext";
import { ProgressBar } from "./_components/sticky/ProgressBar";
import { StickyCalculator } from "./_components/sticky/StickyCalculator";
import { ModelCategoryGrid } from "./_components/product/ModelCategoryGrid";
import { SubcategorySelector } from "./_components/product/SubcategorySelector";
import { DimensionControls } from "./_components/dimensions/DimensionControls";
import { FlexibilityToggle } from "./_components/options/FlexibilityToggle";
import { SidePanelsSelector } from "./_components/options/SidePanelsSelector";
import { FiltrationSelector } from "./_components/options/FiltrationSelector";
import { CountrySelect } from "./_components/shipping/CountrySelect";
import { QuoteModal } from "./_components/quote/QuoteModal";
import { useQuoteEstimate } from "./_hooks/useQuoteEstimate";
import { hasSubcategories, MODEL_CATEGORIES, MODEL_SUBCATEGORIES } from "./_data/model-categories";
import type { QuoteConfig } from "./calculator-types";
import { Button } from "~/components/ui/button";

// Default configuration
const DEFAULT_CONFIG: QuoteConfig = {
	modelCategory: null,
	subcategory: null,
	flexibility: "solid",
	dimensions: {
		width: 100,
		height: 50,
		depth: 40,
	},
	unit: "cm",
	sidePanels: "none",
	filtrationType: "none",
	country: "",
};

function CalculatorContent() {
	const [config, setConfig] = useState<QuoteConfig>(DEFAULT_CONFIG);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const estimate = useQuoteEstimate(config);

	// Calculate completion percentage for progress indicator
	const completionSteps = [
		config.modelCategory !== null,
		!config.modelCategory || !hasSubcategories(config.modelCategory) || config.subcategory !== null,
		config.country !== "",
	];
	const completionPercent = (completionSteps.filter(Boolean).length / completionSteps.length) * 100;

	const handleQuoteSubmit = async (data: { name: string; email: string; notes?: string }) => {
		console.log("Quote submission:", { config, estimate, ...data });
		// TODO: await api.calculator.createQuote.mutate({ ...config, ...data });
		setIsModalOpen(false);
		alert("Quote request submitted! We'll email you within 24 hours.");
	};

	const canRequestQuote = config.modelCategory !== null && config.country !== "";
	const selectedCategory = MODEL_CATEGORIES.find(c => c.id === config.modelCategory);

	const getSubcategoryTexture = (): string | undefined => {
		if (!config.subcategory || config.subcategory === "skip") return undefined;
		const subcategory = MODEL_SUBCATEGORIES.find(s => s.id === config.subcategory);
		return subcategory?.textureUrl;
	};

	return (
		<>
			<main className="min-h-screen pb-24">
				{/* Hero Section */}
				<section className="pt-32 md:pt-44 bg-linear-to-b from-muted/50 via-muted/30 to-transparent">
					<div className="container px-4 max-w-7xl mx-auto text-center space-y-6">
						<span className="bg-primary/20 px-4 py-2 rounded-full text-primary/90">
							How much For the Fish
						</span>
						<h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
							Custom Aquarium Background Calculator
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-3xl mx-auto leading-relaxed">
							Configure your perfect 3D background in real-time. Adjust dimensions, choose materials,
							get an instant price estimate.
						</p>
					</div>
				</section>

				{/* Main Content - Full width, layout handles margin */}
				<section className="py-12">
					<div className="container px-4 max-w-6xl mx-auto">
						<div className="space-y-0">
							{/* Step 1: Model Selection */}
							<ModelCategoryGrid
								selected={config.modelCategory}
								onSelect={(category) => setConfig({
									...config,
									modelCategory: category,
									subcategory: null,
								})}
							/>

							{config.modelCategory && (
								<>
									{/* Step 1.5: Subcategory Selection (if applicable) */}
									{hasSubcategories(config.modelCategory) && (
										<SubcategorySelector
											categoryId={config.modelCategory}
											selected={config.subcategory}
											onSelect={(subcategoryId) =>
												setConfig({ ...config, subcategory: subcategoryId })
											}
										/>
									)}

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

									{/* Step 5: Filtration Cutout */}
									<FiltrationSelector
										selected={config.filtrationType}
										customNotes={config.filtrationCustomNotes}
										onChange={(filtrationType, customNotes) =>
											setConfig({ ...config, filtrationType, filtrationCustomNotes: customNotes })
										}
									/>

									{/* Step 6: Shipping Country */}
									<CountrySelect
										selected={config.country}
										onChange={(country) => setConfig({ ...config, country })}
									/>

									{/* CTA Section */}
									<section className="py-12">
										<div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border-2 border-primary/20">
											<div className="space-y-6 text-center">
												<h2 className="text-3xl font-display font-light">
													Ready to Get Your Custom Quote?
												</h2>
												<p className="text-muted-foreground font-display font-light text-lg">
													Submit your configuration and receive a detailed quote within 24 hours.
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
			</main>

			{/* Progress Bar - thin bar at bottom */}
			{config.modelCategory && (
				<ProgressBar completionPercent={completionPercent} />
			)}

			{/* Sticky Calculator - sits ON TOP of progress bar */}
			{config.modelCategory && (
				<StickyCalculator
					dimensions={config.dimensions}
					estimate={estimate}
					backgroundTexture={selectedCategory?.textureUrl}
					subcategoryTexture={getSubcategoryTexture()}
				/>
			)}

			{/* Quote Modal */}
			<QuoteModal
				config={config}
				estimate={estimate}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleQuoteSubmit}
			/>
		</>
	);
}

export default function CalculatorPage() {
	return (
		<UnitProvider>
			<CalculatorContent />
		</UnitProvider>
	);
}