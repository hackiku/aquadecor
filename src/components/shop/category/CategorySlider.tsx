// src/components/shop/category/CategorySlider.tsx

import { CategoryCard } from "./CategoryCard";

interface Category {
	id: string;
	slug: string;
	name: string | null;
	description: string | null;
}

interface CategorySliderProps {
	categories: Category[];
	productLineSlug: string;
	doubleRow?: boolean;
}

export function CategorySlider({ categories, productLineSlug, doubleRow = false }: CategorySliderProps) {
	if (!categories || categories.length === 0) {
		return null;
	}

	// Split into two rows if doubleRow is true
	if (doubleRow && categories.length > 3) {
		const midpoint = Math.ceil(categories.length / 2);
		const topRow = categories.slice(0, midpoint);
		const bottomRow = categories.slice(midpoint);

		return (
			<div className="space-y-6">
				<CategorySliderRow categories={topRow} productLineSlug={productLineSlug} />
				<CategorySliderRow categories={bottomRow} productLineSlug={productLineSlug} />
			</div>
		);
	}

	return <CategorySliderRow categories={categories} productLineSlug={productLineSlug} />;
}

function CategorySliderRow({ categories, productLineSlug }: { categories: Category[]; productLineSlug: string }) {
	return (
		<div className="relative -mx-4 px-4">
			{/* Horizontal Scroll Container */}
			<div className="overflow-x-auto scrollbar-hide">
				<div className="flex gap-6 pb-4 min-w-min">
					{categories.map((category) => (
						<CategoryCard
							key={category.id}
							id={category.id}
							slug={category.slug}
							name={category.name}
							description={category.description}
							productLineSlug={productLineSlug}
						/>
					))}
				</div>
			</div>

			{/* Gradient Fades */}
			<div className="absolute top-0 left-0 bottom-4 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none" />
			<div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
		</div>
	);
}