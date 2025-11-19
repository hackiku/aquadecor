// src/app/shop/_components/CategorySlider.tsx

import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowRight } from "lucide-react";

interface Category {
	id: string;
	slug: string;
	name: string;
	description: string | null;
}

interface CategorySliderProps {
	categories: Category[];
	productLineSlug: string;
}

export function CategorySlider({ categories, productLineSlug }: CategorySliderProps) {
	return (
		<div className="relative">
			{/* Horizontal Scroll Container */}
			<div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
				<div className="flex gap-6 pb-4">
					{categories.map((category) => (
						<Link
							key={category.id}
							href={`/shop/${productLineSlug}/${category.slug}`}
							className="group flex-shrink-0 w-[320px] md:w-[380px]"
						>
							<Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-card/50 backdrop-blur-sm">
								<CardContent className="p-6 h-full flex flex-col">
									<div className="flex items-start justify-between mb-4">
										<h4 className="text-xl font-display font-normal leading-tight group-hover:text-primary transition-colors pr-4">
											{category.name}
										</h4>
										<ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
									</div>

									{category.description && (
										<p className="text-sm text-muted-foreground font-display font-light leading-relaxed flex-1">
											{category.description}
										</p>
									)}

									<div className="mt-4 pt-4 border-t">
										<span className="text-sm text-primary font-display font-medium inline-flex items-center gap-1.5">
											View products
											<ArrowRight className="h-3.5 w-3.5" />
										</span>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</div>

			{/* Scroll Indicators - Gradient Fades */}
			<div className="absolute top-0 left-0 bottom-4 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none" />
			<div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
		</div>
	);
}