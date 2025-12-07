// src/app/gallery/page.tsx


// src/app/gallery/page.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { GallerySidebar } from "./_components/GallerySidebar";
import { GalleryGridSelector, type GridCols } from "./_components/GalleryGridSelector";
import { GalleryMediaGrid } from "./_components/GalleryMediaGrid";
import { ShopButton } from "~/components/cta/ShopButton";
import { Button } from "~/components/ui/button";
import { WaveDivider } from "~/components/ui/water/wave-divider";
import { Loader2 } from "lucide-react";

export default function GalleryPage() {
	const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
	const [gridCols, setGridCols] = useState<GridCols>("3");

	// Infinite Query for Images
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading
	} = api.media.getGallery.useInfiniteQuery(
		{
			categoryId: selectedCategory,
			limit: 20,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}
	);

	const allImages = data?.pages.flatMap((page) => page.items) || [];

	return (
		<main className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative py-16 md:py-24 bg-black text-white overflow-hidden">
				{/* Background Element */}
				<div className="absolute inset-0 z-0">
					<div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent z-10" />
					{/* Optional: Add a subtle blurry background image here */}
				</div>

				<div className="relative z-10 px-4 max-w-7xl mx-auto text-center space-y-6">
					<h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extralight tracking-tight">
						Inspiration Gallery
					</h1>
					<p className="text-lg md:text-xl text-white/80 font-display font-light max-w-2xl mx-auto leading-relaxed">
						See how 50,000+ hobbyists have transformed their tanks.
						<br className="hidden md:block" />
						From massive 1000L setups to nano cubes.
					</p>
				</div>
			</section>
			
			<div className="relative pb-12 md:pb-20">
				<WaveDivider position="top" color="black" className="text-black" />
			</div>

			{/* Main Layout */}
			<section className="-mt-20 max-w-[1800px] mx-auto px-4 py-8 md:py-24 bg-linear-to-b from-card to-transparent">
				<div className="flex flex-col lg:flex-row gap-8 xl:gap-12">

					{/* Sidebar */}
					<GallerySidebar
						selectedCategory={selectedCategory}
						onSelectCategory={setSelectedCategory}
					/>

					{/* Main Content */}
					<div className="flex-1 space-y-8 min-w-0">

						{/* Toolbar */}
						<div className="flex items-center justify-between sticky top-4 z-30 bg-background/80 backdrop-blur-md p-2 rounded-xl border border-border/50">
							<span className="text-sm text-muted-foreground font-display font-light px-2">
								{allImages.length > 0 ? `${allImages.length} results` : "Loading..."}
							</span>
							<GalleryGridSelector columns={gridCols} onChange={setGridCols} />
						</div>

						{/* Grid */}
						<GalleryMediaGrid
							images={allImages}
							columns={gridCols}
							isLoading={isLoading}
						/>

						{/* Empty State */}
						{!isLoading && allImages.length === 0 && (
							<div className="text-center py-20 space-y-4 border-2 border-dashed border-border rounded-3xl">
								<p className="text-xl font-display font-light text-muted-foreground">
									No images found in this category yet.
								</p>
								<Button variant="outline" onClick={() => setSelectedCategory(undefined)}>
									View All Photos
								</Button>
							</div>
						)}

						{/* Load More */}
						{hasNextPage && (
							<div className="flex flex-col items-center gap-4 pt-8 pb-20">
								<p className="text-sm text-muted-foreground font-display font-light italic">
									"Only nature can copy us"
								</p>
								<div className="flex gap-4">
									<Button
										onClick={() => fetchNextPage()}
										disabled={isFetchingNextPage}
										variant="secondary"
										size="lg"
										className="rounded-full px-8 min-w-[200px]"
									>
										{isFetchingNextPage ? (
											<>
												<Loader2 className="w-4 h-4 mr-2 animate-spin" />
												Loading...
											</>
										) : (
											"Load More Inspiration"
										)}
									</Button>
									<ShopButton />
								</div>
							</div>
						)}
					</div>
				</div>
			</section>
		</main>
	);
}