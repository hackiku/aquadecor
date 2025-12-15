// src/app/(website)/calculator/_components/product/SubcategorySelector.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { BackgroundCard } from "./BackgroundCard";
import { Loader2, LayoutGrid, Grid2X2, Columns2, Square } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { CalculatorCategory } from "../../calculator-types";

interface SubcategorySelectorProps {
	category: CalculatorCategory;
	selected: string | null;
	onSelect: (subcategoryId: string) => void;
}

export function SubcategorySelector({ category, selected, onSelect }: SubcategorySelectorProps) {
	// State for grid columns: 1, 2, 3, or 4
	const [columns, setColumns] = useState<"1" | "2" | "3" | "4">("4");

	// Fetch specific products (designs) for this category
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

	// Dynamic grid classes based on selection
	const gridCols = {
		"1": "grid-cols-1 max-w-xl mx-auto",
		"2": "grid-cols-1 md:grid-cols-2",
		"3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
		"4": "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
	}[columns];

	return (
		<section className="py-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

			{/* Header + Controls Row */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
				<div className="space-y-3">
					<h2 className="text-2xl md:text-3xl font-display font-light">
						2. Choose Specific Design
					</h2>
					<p className="text-muted-foreground font-display font-light text-lg">
						Select the exact background pattern you prefer.
					</p>
				</div>

				{/* Grid Controls - Left aligned relative to the grid, but Right aligned in this flex container */}
				<div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm border rounded-lg p-1 shadow-sm self-start md:self-auto">
					<Button
						variant="ghost"
						size="icon"
						className={cn("h-8 w-8", columns === "1" && "bg-muted text-primary")}
						onClick={() => setColumns("1")}
						title="1 Column"
					>
						<Square className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className={cn("h-8 w-8", columns === "2" && "bg-muted text-primary")}
						onClick={() => setColumns("2")}
						title="2 Columns"
					>
						<Columns2 className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className={cn("h-8 w-8", columns === "3" && "bg-muted text-primary")}
						onClick={() => setColumns("3")}
						title="3 Columns"
					>
						<Grid2X2 className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className={cn("h-8 w-8 hidden lg:flex", columns === "4" && "bg-muted text-primary")}
						onClick={() => setColumns("4")}
						title="4 Columns"
					>
						<LayoutGrid className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* The Grid */}
			<div className={cn("grid gap-4 md:gap-6", gridCols)}>
				{data.products.map((product) => (
					<BackgroundCard
						key={product.id}
						id={product.id}
						name={product.name || product.slug}
						description={product.shortDescription || "Custom fit design"}
						modelCode={product.sku || undefined} // Use SKU as model code (e.g. "E-3")
						image={product.heroImageUrl || "/media/placeholders/product-placeholder.jpg"}
						// Pass the category rate as base for visual reference
						pricePerM2={category.baseRatePerM2}
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