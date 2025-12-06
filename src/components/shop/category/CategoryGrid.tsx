// src/components/shop/category/CategoryGrid.tsx

import { CategoryCard } from "./CategoryCard";

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
	columns?: "2" | "3" | "4";
}

export function CategoryGrid({
	categories,
	productLineSlug,
	columns = "3"
}: CategoryGridProps) {
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
	);
}