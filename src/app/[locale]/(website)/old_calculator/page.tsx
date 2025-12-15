// src/app/(website)/calculator/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useCalculatorLayout } from "./_context/CalculatorLayoutContext";
import { ModelCategoryGrid } from "./_components/product/ModelCategoryGrid";
import { SubcategorySelector } from "./_components/product/SubcategorySelector";
import { DimensionControls } from "./_components/dimensions/DimensionControls";
import { FlexibilityToggle } from "./_components/options/FlexibilityToggle";
import { SidePanelsSelector } from "./_components/options/SidePanelsSelector";
import { FiltrationSelector } from "./_components/options/FiltrationSelector";
import { CountrySelect } from "./_components/shipping/CountrySelect";
import { useQuoteEstimate } from "./_hooks/useQuoteEstimate";
import { hasSubcategories } from "./_data/model-categories";
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

export default function CalculatorPage() {
	const [localConfig, setLocalConfig] = useState<QuoteConfig>(DEFAULT_CONFIG);
	const estimate = useQuoteEstimate(localConfig);
	const { setConfig, setEstimate, setCompletionPercent, openQuoteModal } = useCalculatorLayout();

	// Sync local config and estimate to layout context
	useEffect(() => {
		setConfig(localConfig);
		setEstimate(estimate);

		// Calculate completion percentage
		const completionSteps = [
			localConfig.modelCategory !== null,
			!localConfig.modelCategory ||
			!hasSubcategories(localConfig.modelCategory) ||
			localConfig.subcategory !== null,
			localConfig.country !== "",
		];
		const percent = (completionSteps.filter(Boolean).length / completionSteps.length) * 100;
		setCompletionPercent(percent);
	}, [localConfig, estimate, setConfig, setEstimate, setCompletionPercent]);

	const canRequestQuote = localConfig.modelCategory !== null && localConfig.country !== "";

	return (
		<main className="min-h-screen">
			{/* Hero Section */}
			<section className="pt-16 md:pt-24 bg-linear-to-b from-muted/50 via-muted/30 to-transparent">
				<div className="container px-4 max-w-7xl mx-auto text-center space-y-6">
					<span className="inline-block italic bg-primary/20 px-4 py-2 rounded-full text-primary/90 text-md font-display font-medium">
						How much for the fish?
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

			{/* Main Content */}
			<section className="py-12">
				<div className="container px-4 max-w-6xl mx-auto">
					<div className="space-y-0">
						{/* Step 1: Model Selection */}
						<ModelCategoryGrid
							selected={localConfig.modelCategory}
							onSelect={(category) =>
								setLocalConfig({
									...localConfig,
									modelCategory: category,
									subcategory: null,
								})
							}
						/>

						{localConfig.modelCategory && (
							<>
								{/* Step 1.5: Subcategory Selection (if applicable) */}
								{hasSubcategories(localConfig.modelCategory) && (
									<SubcategorySelector
										categoryId={localConfig.modelCategory}
										selected={localConfig.subcategory}
										onSelect={(subcategoryId) =>
											setLocalConfig({ ...localConfig, subcategory: subcategoryId })
										}
									/>
								)}

								{/* Step 2: Dimensions */}
								<DimensionControls
									dimensions={localConfig.dimensions}
									unit={localConfig.unit}
									onChange={(dimensions) =>
										setLocalConfig({ ...localConfig, dimensions })
									}
								/>

								{/* Step 3: Material Type */}
								<FlexibilityToggle
									selected={localConfig.flexibility}
									onChange={(flexibility) =>
										setLocalConfig({ ...localConfig, flexibility })
									}
								/>

								{/* Step 4: Side Panels */}
								<SidePanelsSelector
									selected={localConfig.sidePanels}
									sidePanelWidth={localConfig.sidePanelWidth}
									onChange={(sidePanels, width) =>
										setLocalConfig({ ...localConfig, sidePanels, sidePanelWidth: width })
									}
								/>

								{/* Step 5: Filtration Cutout */}
								<FiltrationSelector
									selected={localConfig.filtrationType}
									customNotes={localConfig.filtrationCustomNotes}
									onChange={(filtrationType, customNotes) =>
										setLocalConfig({
											...localConfig,
											filtrationType,
											filtrationCustomNotes: customNotes,
										})
									}
								/>

								{/* Step 6: Shipping Country */}
								<CountrySelect
									selected={localConfig.country}
									onChange={(country) => setLocalConfig({ ...localConfig, country })}
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
												onClick={openQuoteModal}
												disabled={!canRequestQuote}
												className="w-full md:w-auto px-12 py-6 bg-primary text-white hover:bg-primary/90 font-display font-medium text-lg rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
											>
												{canRequestQuote
													? "Request Custom Quote"
													: "Complete configuration to continue"}
											</Button>

											{!canRequestQuote && (
												<p className="text-sm text-muted-foreground font-display font-light">
													{!localConfig.modelCategory && "• Select a model"}
													{!localConfig.country && " • Choose shipping country"}
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
	);
}