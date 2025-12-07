// src/app/gallery/page.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { MasonryGrid } from "~/components/media/MasonryGrid";
import { Button } from "~/components/ui/button";
import { WaveDivider } from "~/components/ui/water/wave-divider";
import { Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";

export default function GalleryPage() {
	const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

	// Fetch Categories
	const { data: categories } = api.media.getCategories.useQuery();

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

	// Flatten pages into one array
	const allImages = data?.pages.flatMap((page) => page.items) || [];

	return (
		<main className="min-h-screen">
			{/* Hero Section */}
			<section className="relative py-20 md:py-32 bg-black text-white overflow-hidden">
				<div className="absolute inset-0 z-0 opacity-40">
					{/* Optional: Add a hero background image/video here */}
					<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
				</div>

				<div className="relative z-10 px-4 max-w-7xl mx-auto text-center space-y-6">
					<h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extralight tracking-tight">
						Inspiration Gallery
					</h1>
					<p className="text-lg md:text-xl text-white/80 font-display font-light max-w-2xl mx-auto">
						See how 50,000+ hobbyists have transformed their tanks. From massive 1000L setups to nano cubes.
					</p>
				</div>
			</section>

			{/* Filters & Grid Section */}
			<section className="relative py-12 md:py-20 bg-background">
				<WaveDivider position="top" color="black" className="text-black" />

				<div className="px-4 max-w-[1600px] mx-auto space-y-12">

					{/* Category Filter Pills */}
					<div className="flex flex-wrap justify-center gap-2">
						<Button
							variant={!selectedCategory ? "default" : "outline"}
							onClick={() => setSelectedCategory(undefined)}
							className="rounded-full"
						>
							All Photos
						</Button>
						{categories?.map((cat) => (
							<Button
								key={cat.id}
								variant={selectedCategory === cat.id ? "default" : "outline"}
								onClick={() => setSelectedCategory(cat.id)}
								className={cn(
									"rounded-full",
									selectedCategory === cat.id && "bg-primary text-primary-foreground"
								)}
							>
								{cat.name} <span className="ml-1 opacity-60 text-xs">{cat.imageCount}</span>
							</Button>
						))}
					</div>

					{/* Loading State */}
					{isLoading && (
						<div className="flex justify-center py-20">
							<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
						</div>
					)}

					{/* Empty State */}
					{!isLoading && allImages.length === 0 && (
						<div className="text-center py-20 space-y-4">
							<p className="text-xl font-display font-light text-muted-foreground">
								No images found in this category yet.
							</p>
							<Button variant="outline" onClick={() => setSelectedCategory(undefined)}>
								View All Photos
							</Button>
						</div>
					)}

					{/* Image Grid */}
					<MasonryGrid images={allImages} />

					{/* Load More Trigger */}
					{hasNextPage && (
						<div className="flex justify-center pt-8">
							<Button
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage}
								variant="secondary"
								size="lg"
								className="rounded-full px-8"
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
						</div>
					)}
				</div>
			</section>
		</main>
	);
}