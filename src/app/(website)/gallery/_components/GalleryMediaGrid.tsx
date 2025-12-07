// src/app/gallery/_components/GalleryMediaGrid.tsx
"use client";

import { MasonryGrid, type GalleryImage } from "~/components/media/MasonryGrid";
import { cn } from "~/lib/utils";

interface GalleryMediaGridProps {
	images: GalleryImage[];
	columns: "2" | "3" | "4";
	isLoading?: boolean;
}

export function GalleryMediaGrid({ images, columns, isLoading }: GalleryMediaGridProps) {

	// Map columns prop to Tailwind classes
	const columnClasses = {
		"2": "sm:columns-2",
		"3": "sm:columns-2 lg:columns-3",
		"4": "sm:columns-2 lg:columns-3 xl:columns-4",
	};

	if (isLoading) {
		return (
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{[...Array(6)].map((_, i) => (
					<div key={i} className="aspect-square bg-muted/50 rounded-xl animate-pulse" />
				))}
			</div>
		);
	}

	return (
		<MasonryGrid
			images={images}
			className={cn(
				// Base: 1 column on mobile always
				"columns-1 gap-4 space-y-4 transition-all duration-500",
				columnClasses[columns]
			)}
		/>
	);
}