// src/app/(website)/calculator/_components/product/SubcategorySelector.tsx
"use client";

import Image from "next/image";
import { getSubcategories } from "../../_data/model-categories";
import type { ModelCategory } from "../../calculator-types";

interface SubcategorySelectorProps {
	categoryId: ModelCategory;
	selected: string | null | undefined;
	onSelect: (subcategoryId: string) => void;
}

export function SubcategorySelector({ categoryId, selected, onSelect }: SubcategorySelectorProps) {
	const subcategories = getSubcategories(categoryId);

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
					<button
						key={sub.id}
						onClick={() => onSelect(sub.id)}
						className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${selected === sub.id
								? "border-primary bg-primary/5 scale-[1.02]"
								: "border-border hover:border-primary/50 hover:shadow-lg"
							}`}
					>
						{/* Image */}
						<div className="relative aspect-square bg-muted overflow-hidden">
							<Image
								src={sub.imageUrl}
								alt={sub.name}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-110"
								sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
							/>

							{/* Selected badge */}
							{selected === sub.id && (
								<div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center z-10">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="3"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M20 6 9 17l-5-5" />
									</svg>
								</div>
							)}
						</div>

						{/* Label */}
						<div className="p-3 text-center">
							<h3 className={`text-sm font-display font-medium transition-colors ${selected === sub.id ? "text-primary" : "group-hover:text-primary"
								}`}>
								{sub.name}
							</h3>
						</div>
					</button>
				))}
			</div>

			{/* Skip button - allow users to skip subcategory selection */}
			{!selected && (
				<div className="p-4 bg-accent/5 rounded-xl border text-center">
					<p className="text-sm text-muted-foreground font-display font-light">
						💡 Not sure which design? Skip this step and we'll help you choose during the quote process.
					</p>
					<button
						onClick={() => onSelect("skip")}
						className="mt-3 text-sm font-display font-medium text-primary hover:underline"
					>
						Skip Design Selection →
					</button>
				</div>
			)}
		</section>
	);
}