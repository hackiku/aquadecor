// src/app/(website)/calculator/_components/CalculatorFlow.tsx
"use client";

import { useState, useEffect } from "react";

import { useCalculatorLayout } from "../_context/CalculatorLayoutContext";
import { ModelCategoryGrid } from "./product/ModelCategoryGrid";
import { SubcategorySelector } from "./product/SubcategorySelector";
import { DimensionControls } from "./dimensions/DimensionControls";
// options
import { FlexibilityToggle } from "./options/FlexibilityToggle";
import { SidePanelsSelector } from "./options/SidePanelsSelector";
import { FiltrationSelector } from "./options/FiltrationSelector";
import { CountrySelect } from "./options/CountrySelect";
import { useQuoteEstimate } from "../_hooks/useQuoteEstimate";
import type { QuoteConfig, CalculatorCategory } from "../calculator-types";
import { Button } from "~/components/ui/button";
import { AdditionalItemCard } from "./product/AdditionalItemCard";


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

export function CalculatorFlow({ initialCategories }: { initialCategories: CalculatorCategory[] }) {
	const [localConfig, setLocalConfig] = useState<QuoteConfig>(DEFAULT_CONFIG);
	const estimate = useQuoteEstimate(localConfig);
	const {
		setConfig,
		setEstimate,
		setCompletionPercent,
		openQuoteModal,
		setIsCalculatorExpanded,
		hasAutoExpanded
	} = useCalculatorLayout();


	// Sync local config and estimate to global layout context (for StickyCalculator)
	useEffect(() => {
		setConfig(localConfig);
		setEstimate(estimate);

		// Calculate progress
		const completionSteps = [
			localConfig.modelCategory !== null,
			// Step 2 is complete if we have a subcategory OR if the category doesn't support them
			!localConfig.modelCategory?.hasSubcategories || localConfig.subcategory !== null,
			localConfig.country !== "",
		];

		const percent = (completionSteps.filter(Boolean).length / completionSteps.length) * 100;
		setCompletionPercent(percent);
	}, [localConfig, estimate, setConfig, setEstimate, setCompletionPercent]);

	// AUTO-EXPAND: When user selects a category, immediately expand the sticky calculator
	useEffect(() => {
		// Only expand if we have a category AND we haven't done it yet
		if (localConfig.modelCategory && !hasAutoExpanded.current) {
			setIsCalculatorExpanded(true);
			hasAutoExpanded.current = true; // Mark as done
		}
	}, [localConfig.modelCategory, setIsCalculatorExpanded, hasAutoExpanded]);


	const canRequestQuote = localConfig.modelCategory !== null && localConfig.country !== "";

	return (
		<div className="space-y-0">
			{/* Step 1: Model Selection */}
			<ModelCategoryGrid
				categories={initialCategories}
				selected={localConfig.modelCategory}
				onSelect={(category) =>
					setLocalConfig({
						...localConfig,
						modelCategory: category,
						subcategory: null,
						// Reset subcategory when changing main category
					})
				}
			/>

			{localConfig.modelCategory && (
				<div className="animate-in fade-in duration-700">
					{/* Step 1.5: Subcategory Selection */}
					{localConfig.modelCategory.hasSubcategories && (
						<SubcategorySelector
							category={localConfig.modelCategory}
							selected={localConfig.subcategory}
							onSelect={(subId, textureUrl) =>
								setLocalConfig({
									...localConfig,
									subcategory: subId,
									subcategoryTexture: textureUrl // Store texture URL
								})
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


					{/* Step 3: Side Panels */}
					<SidePanelsSelector
						selected={localConfig.sidePanels}
						sidePanelWidth={localConfig.sidePanelWidth}
						onChange={(sidePanels, width) =>
							setLocalConfig({ ...localConfig, sidePanels, sidePanelWidth: width })
						}
					/>

					{/* Step 4: Material */}
					<FlexibilityToggle
						selected={localConfig.flexibility}
						onChange={(flexibility) =>
							setLocalConfig({ ...localConfig, flexibility })
						}
					/>


					{/* Step 5: Filtration */}
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

					{/* Step 6: Shipping */}
					<CountrySelect
						selected={localConfig.country}
						onChange={(country) => setLocalConfig({ ...localConfig, country })}
					/>

					{/* Step 7: additional items */}

					<div className="space-y-3">
						<h2 className="text-2xl md:text-3xl font-display font-light">
							Add additional items
						</h2>
						<p className="text-muted-foreground font-display font-light text-lg">
							We recommend adding some of our hand-made additional items along with the backgrounds to enhance the beauty of your fish tank.
						</p>
					</div>
					<div className="h-[50vh] w-full rounded-3xl border bg-card">
					
						{/* TODO: write additional item grid */}
						{/* <AdditionalItemGrid /> */}
						
					</div>

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
									className="w-full md:w-auto px-12 py-6 bg-primary text-white hover:bg-primary/90 font-display font-medium text-lg rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
				</div>
			)}
		</div>
	);
}