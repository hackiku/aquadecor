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
import { AdditionalItemsGrid } from "./product/AdditionalItemsGrid";
import { QuoteSection } from "./quote/QuoteSection";
import { api } from "~/trpc/react";


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
		setIsCalculatorExpanded,
		hasAutoExpanded
	} = useCalculatorLayout();

	// tRPC mutation for quote submission
	const createQuoteMutation = api.calculator.createQuote.useMutation();

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

	// Handler for adding additional items - FIXED TypeScript error
	const handleAddItem = (itemId: string, quantity: number) => {
		setLocalConfig((prev) => {
			const currentItems = prev.additionalItems || [];
			const existingItemIndex = currentItems.findIndex((item) => item.id === itemId);

			if (existingItemIndex >= 0) {
				// Update existing item quantity
				const updatedItems = [...currentItems];
				const existingItem = updatedItems[existingItemIndex];
				if (existingItem) { // TypeScript safety check
					updatedItems[existingItemIndex] = {
						id: itemId,
						quantity: existingItem.quantity + quantity,
					};
				}
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

	// Handler for quote submission
	const handleQuoteSubmit = async (data: { firstName: string; lastName: string; email: string; notes?: string }) => {
		if (!localConfig.modelCategory) return;

		try {
			await createQuoteMutation.mutateAsync({
				modelCategoryId: localConfig.modelCategory.id,
				subcategoryId: localConfig.subcategory,
				flexibility: localConfig.flexibility,
				dimensions: {
					width: localConfig.dimensions.width,
					height: localConfig.dimensions.height,
					depth: localConfig.dimensions.depth,
				},
				unit: localConfig.unit,
				sidePanels: localConfig.sidePanels,
				sidePanelWidth: localConfig.sidePanelWidth,
				filtrationType: localConfig.filtrationType,
				filtrationCustomNotes: localConfig.filtrationCustomNotes,
				country: localConfig.country,
				name: `${data.firstName} ${data.lastName}`,
				email: data.email,
				notes: data.notes,
				additionalItems: localConfig.additionalItems,
			});

			console.log("Quote submitted successfully!");
		} catch (error) {
			console.error("Failed to submit quote:", error);
			throw error;
		}
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

					{/* Quote Section - Replaces CTA + Modal */}
					{canRequestQuote && (
						<QuoteSection
							config={localConfig}
							estimate={estimate}
							onSubmit={handleQuoteSubmit}
						/>
					)}

					{/* Show message if not ready */}
					{!canRequestQuote && (
						<section className="py-12">
							<div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl border-2 border-border">
								<div className="space-y-4 text-center">
									<h2 className="text-2xl font-display font-light">
										Complete Configuration to Continue
									</h2>
									<div className="space-y-2">
										{!localConfig.modelCategory && (
											<p className="text-sm text-muted-foreground font-display font-light">
												• Select a model
											</p>
										)}
										{!localConfig.country && (
											<p className="text-sm text-muted-foreground font-display font-light">
												• Choose shipping country
											</p>
										)}
									</div>
								</div>
							</div>
						</section>
					)}
				</div>
			)}
		</div>
	);
}