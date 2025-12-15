
// src/app/(website)/calculator/_components/product/ModelCategoryGrid.tsx
"use client";

import { ModelCard } from "./ModelCard";
import { BackgroundCard } from "./BackgroundCard";
import type { CalculatorCategory } from "../../calculator-types";

interface ModelCategoryGridProps {
	categories: CalculatorCategory[];
	selected: CalculatorCategory | null;
	onSelect: (category: CalculatorCategory) => void;
}

export function ModelCategoryGrid({ categories, selected, onSelect }: ModelCategoryGridProps) {
	return (
		<section className="py-12 space-y-6">
			<div className="space-y-3">
				<h2 className="text-2xl md:text-3xl font-display font-light">
					1. Select Background Style
				</h2>
				<p className="text-muted-foreground font-display font-light text-lg">
					Choose from our handcrafted 3D background collections.
				</p>
			</div>

			{categories.length === 0 ? (
				<div className="p-12 text-center border-2 border-dashed rounded-xl">
					<p className="text-muted-foreground">No models available at the moment.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{categories.map((model) => (
						// <ModelCard
						<BackgroundCard
							key={model.id}
							id={model.id}
							name={model.name || model.slug}
							description={model.description || "Custom 3D Background"}
							image={model.image || "/media/placeholders/category-placeholder.jpg"}
							isSelected={selected?.id === model.id}
							onClick={() => onSelect(model)}
						/>
					))}
				</div>
			)}
		</section>
	);
}