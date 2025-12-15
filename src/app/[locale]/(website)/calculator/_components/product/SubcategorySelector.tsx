// src/app/(website)/calculator/_components/product/SubcategorySelector.tsx
"use client";

import { api } from "~/trpc/react";
import { ModelCard } from "./ModelCard";
import { Loader2 } from "lucide-react";
import type { CalculatorCategory } from "../../calculator-types";

interface SubcategorySelectorProps {
	category: CalculatorCategory;
	selected: string | null;
	onSelect: (subcategoryId: string) => void;
}

export function SubcategorySelector({ category, selected, onSelect }: SubcategorySelectorProps) {
	// Fetch products for this category using tRPC
	const { data, isLoading, error } = api.product.getByCategory.useQuery({
		categorySlug: category.slug,
	});

	if (isLoading) {
		return (
			<div className="py-24 flex justify-center items-center flex-col gap-4">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<p className="text-sm text-muted-foreground font-display">Loading designs...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="py-8 text-center text-red-500">
				Failed to load designs. Please try again.
			</div>
		);
	}

	if (!data?.products || data.products.length === 0) {
		return null;
	}

	return (
		<section className="py-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="space-y-3">
				<h2 className="text-2xl md:text-3xl font-display font-light">
					2. Choose Specific Design
				</h2>
				<p className="text-muted-foreground font-display font-light text-lg">
					Select the exact background pattern you prefer.
				</p>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
				{data.products.map((product) => (
					<ModelCard
						key={product.id}
						id={product.id}
						name={product.name || product.slug}
						description={product.shortDescription || "Custom fit design"}
						categoryName={category.name?.split(" - ")[0] || category.slug}
						image={product.heroImageUrl || "/media/placeholders/product-placeholder.jpg"}
						// Pass the category rate as base, 
						// though specific products might override this in the future logic
						baseRatePerM2={category.baseRatePerM2}
						isSelected={selected === product.id}
						onClick={() => onSelect(product.id)}
					/>
				))}
			</div>

			{/* Skip Option */}
			{!selected && (
				<div className="mt-8 p-6 bg-accent/5 rounded-xl border border-dashed text-center space-y-4">
					<p className="text-sm text-muted-foreground font-display font-light">
						💡 Not sure which design to pick yet? You can skip this step and decide later with our team.
					</p>
					<button
						onClick={() => onSelect("skip")}
						className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full font-display font-medium text-sm transition-colors"
					>
						Skip Design Selection
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
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