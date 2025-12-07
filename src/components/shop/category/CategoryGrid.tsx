// src/components/shop/category/CategoryGrid.tsx
"use client";

import { useState } from "react";
import { CategoryCard } from "./CategoryCard";
import { LayoutGrid, Grid2X2, RectangleHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface Category {
	id: string;
	slug: string;
	name: string | null;
	description: string | null;
	modelCode?: string | null;
	heroImageUrl?: string | null;
	productCount?: number;
}

interface CategoryGridProps {
	categories: Category[];
	productLineSlug: string;
	initialColumns?: "2" | "3" | "4";
	showControls?: boolean;
}

export function CategoryGrid({
	categories,
	productLineSlug,
	initialColumns = "3",
	showControls = true
}: CategoryGridProps) {
	const [columns, setColumns] = useState<"2" | "3" | "4">(initialColumns);

	if (!categories || categories.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-lg text-muted-foreground font-display font-light">
					No categories found
				</p>
			</div>
		);
	}

	const gridCols = {
		"2": "grid-cols-1 md:grid-cols-2",
		"3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
		"4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
	}[columns];

	return (
		<div className="space-y-6">
			{/* Grid Controls */}
			{showControls && (
				<div className="hidden md:flex justify-end mb-2 relative z-10 pointer-events-none">
					<div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm border rounded-lg p-1 pointer-events-auto shadow-sm">
						<Button
							variant="ghost"
							size="icon"
							className={cn("h-8 w-8", columns === "2" && "bg-muted text-primary")}
							onClick={() => setColumns("2")}
							title="2 Columns"
						>
							<RectangleHorizontal className="h-4 w-4" />
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
							className={cn("h-8 w-8 hidden xl:flex", columns === "4" && "bg-muted text-primary")}
							onClick={() => setColumns("4")}
							title="4 Columns"
						>
							<LayoutGrid className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}

			{/* The Grid */}
			<div className={`grid ${gridCols} gap-6 justify-items-center`}>
				{categories.map((category) => (
					<CategoryCard
						key={category.id}
						id={category.id}
						slug={category.slug}
						name={category.name}
						description={category.description}
						modelCode={category.modelCode}
						productLineSlug={productLineSlug}
						heroImageUrl={category.heroImageUrl}
						productCount={category.productCount}
					/>
				))}
			</div>
		</div>
	);
}