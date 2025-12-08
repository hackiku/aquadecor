// src/app/(website)/calculator/_components/product/SubcategorySelector.tsx
"use client";

import { getSubcategories, MODEL_CATEGORIES } from "../../_data/model-categories";
import { ModelCard } from "./ModelCard";
import type { ModelCategory } from "../../calculator-types";

interface SubcategorySelectorProps {
	categoryId: ModelCategory;
	selected: string | null | undefined;
	onSelect: (subcategoryId: string) => void;
}

export function SubcategorySelector({ categoryId, selected, onSelect }: SubcategorySelectorProps) {
	const subcategories = getSubcategories(categoryId);
	const category = MODEL_CATEGORIES.find(c => c.id === categoryId);

	if (subcategories.length === 0) {
		return null;
	}

	return (
		<section className="py-12 space-y-6">
			<div className="space-y-3">
				<h2 className="text-2xl md:text-3xl font-display font-light">
					Choose Specific Design
				</h2>
				<p className="text-muted-foreground font-display font-light text-lg">
					Select the exact background pattern you prefer. Each design has unique textures and formations.
				</p>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
				{subcategories.map((sub) => (
					<ModelCard
						key={sub.id}
						id={sub.id}
						name={sub.name}
						description="Slim Amazonian design with tree trunk motifs" // Generic desc for subcategories
						categoryName={category?.name.split(" - ")[0]} // e.g., "E Models"
						image={sub.imageUrl}
						baseRatePerM2={category?.baseRatePerM2 ?? 260}
						isSelected={selected === sub.id}
						onClick={() => onSelect(sub.id)}
					/>
				))}
			</div>

			{/* Skip button - allow users to skip subcategory selection */}
			{!selected && (
				<div className="p-6 bg-accent/5 rounded-xl border text-center space-y-3">
					<p className="text-sm text-muted-foreground font-display font-light">
						💡 Not sure which design? Skip this step and we'll help you choose during the quote process.
					</p>
					<button
						onClick={() => onSelect("skip")}
						className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 font-display font-medium transition-colors"
					>
						Skip Design Selection
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			)}
		</section>
	);
}