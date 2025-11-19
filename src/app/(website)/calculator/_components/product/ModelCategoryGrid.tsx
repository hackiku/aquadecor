// src/app/(website)/calculator/_components/product/ModelCategoryGrid.tsx

// Model category selection grid - Visual cards for A/B/C/E/F/G/K/L/N models

"use client";

import Image from "next/image";
import { MODEL_CATEGORIES } from "../../_data/model-categories";
import type { ModelCategory } from "../../calculator-types";
import { formatEUR } from "../../_hooks/useQuoteEstimate";

interface ModelCategoryGridProps {
	selected: ModelCategory | null;
	onSelect: (category: ModelCategory) => void;
}

export function ModelCategoryGrid({ selected, onSelect }: ModelCategoryGridProps) {
	return (
		<section className="py-12 space-y-8">
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
					<button
						key={model.id}
						onClick={() => onSelect(model.id)}
						className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 text-left ${selected === model.id
								? "border-primary bg-primary/5 scale-[1.02]"
								: "border-border hover:border-primary/50 hover:shadow-lg"
							}`}
					>
						{/* Image */}
						<div className="relative h-48 bg-muted overflow-hidden">
							<Image
								src={model.image}
								alt={model.name}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-110"
							/>

							{/* Selected badge */}
							{selected === model.id && (
								<div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
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

							{/* Price tag */}
							<div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg">
								<p className="text-xs text-white font-display font-light">
									From {formatEUR(model.baseRatePerM2)}/m²
								</p>
							</div>
						</div>

						{/* Content */}
						<div className="p-5 space-y-2">
							<h3 className={`text-lg font-display font-medium transition-colors ${selected === model.id ? "text-primary" : "group-hover:text-primary"
								}`}>
								{model.name}
							</h3>
							<p className="text-sm text-muted-foreground font-display font-light line-clamp-2">
								{model.description}
							</p>

							{/* Min dimensions */}
							<div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground">
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
									<rect width="18" height="18" x="3" y="3" rx="2" />
								</svg>
								<span className="font-display font-light">
									Min: {model.minDimensions.widthCm}×{model.minDimensions.heightCm}cm
								</span>
							</div>
						</div>
					</button>
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