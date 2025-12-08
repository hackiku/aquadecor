// src/app/(website)/calculator/_components/product/ModelCategoryGrid.tsx

"use client";

import { MODEL_CATEGORIES } from "../../_data/model-categories";
import { ModelCard } from "./ModelCard";
import type { ModelCategory } from "../../calculator-types";

interface ModelCategoryGridProps {
	selected: ModelCategory | null;
	onSelect: (category: ModelCategory) => void;
}

export function ModelCategoryGrid({ selected, onSelect }: ModelCategoryGridProps) {
	return (
		<section className="py-12 space-y-6">
			<div className="space-y-3">
				<h2 className="text-2xl md:text-3xl font-display font-light">
					Select Background Style
				</h2>
				<p className="text-muted-foreground font-display font-light text-lg">
					Choose from our handcrafted 3D background collections. Each model is custom-made to your exact dimensions.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{MODEL_CATEGORIES.map((model) => (
					<ModelCard
						key={model.id}
						id={model.id}
						name={model.name}
						description={model.description}
						image={model.image}
						baseRatePerM2={model.baseRatePerM2}
						isSelected={selected === model.id}
						onClick={() => onSelect(model.id)}
					/>
				))}
			</div>

			{/* Help text */}
			{!selected && (
				<div className="p-6 bg-accent/5 rounded-xl border text-center">
					<p className="text-sm text-muted-foreground font-display font-light">
						💡 Not sure which model to choose? All backgrounds are custom-made to your specifications.
						Select any style and we'll confirm the design details with you within 24 hours.
					</p>
				</div>
			)}
		</section>
	);
}