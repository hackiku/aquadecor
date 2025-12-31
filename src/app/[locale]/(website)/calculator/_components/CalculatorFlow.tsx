// src/app/(website)/calculator/_components/CalculatorFlow.tsx
"use client";

import { useState, useEffect, startTransition } from "react";

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
import { AdditionalItemsGrid } from "./product/AdditionalItemsGrid";


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
	additionalItems: [], // Initialize empty array
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
	// BUT: Use a micro-delay to allow React to finish rendering before expanding
	useEffect(() => {
		if (localConfig.modelCategory && !hasAutoExpanded.current) {
			// Use startTransition to defer this state update until React finishes current work
			startTransition(() => {
				// Small delay to let the SubcategorySelector mount and start its query
				setTimeout(() => {
					setIsCalculatorExpanded(true);
					hasAutoExpanded.current = true;
				}, 100); // 100ms delay - enough for tRPC to initialize
			});
		}
	}, [localConfig.modelCategory, setIsCalculatorExpanded, hasAutoExpanded]);

	// Handler for adding additional items
	const handleAddItem = (itemId: string, quantity: number) => {
		setLocalConfig((prev) => {
			const currentItems = prev.additionalItems || [];
			const existingItemIndex = currentItems.findIndex((item) => item.id === itemId);

			if (existingItemIndex >= 0) {
				// Update existing item quantity
				const updatedItems = [...currentItems];
				updatedItems[existingItemIndex] = {
					id: itemId,
					quantity: updatedItems[existingItemIndex].quantity + quantity,
				};
				return { ...prev, additionalItems: updatedItems };
			} else {
				// Add new item
				return {
					...prev,
					additionalItems: [...currentItems, { id: itemId, quantity }],
				};
			}
		});
	};

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

					{/* Step 7: Additional Items */}
					<section className="py-12 space-y-6">
						<div className="space-y-3">
							<h2 className="text-2xl md:text-3xl font-display font-light">
								7. Add Additional Items (Optional)
							</h2>
							<p className="text-muted-foreground font-display font-light text-lg">
								Enhance your aquarium with our hand-crafted decorations and accessories.
							</p>
						</div>

						<AdditionalItemsGrid onItemAdd={handleAddItem} />
					</section>

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