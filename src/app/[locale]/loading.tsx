// src/app/[locale]/loading.tsx

import { Skeleton } from "~/components/ui/skeleton";
import { Loader2 } from "lucide-react";

/**
 * Universal loading state for all pages
 * Individual routes can override with their own loading.tsx
 */
export default function Loading() {
	return (
		<main className="min-h-screen bg-linear-to-b from-muted/30 to-background">
			{/* Hero Skeleton */}
			<section className="relative pt-32 md:pt-40 pb-16 md:pb-24">
				<div className="container px-4 max-w-5xl mx-auto text-center space-y-6">
					<Skeleton className="h-8 w-32 mx-auto rounded-full" />
					<Skeleton className="h-16 w-full max-w-2xl mx-auto" />
					<Skeleton className="h-6 w-full max-w-3xl mx-auto" />
					<div className="flex justify-center gap-4 pt-4">
						<Skeleton className="h-12 w-32 rounded-full" />
						<Skeleton className="h-12 w-32 rounded-full" />
					</div>
				</div>
			</section>

			{/* Content Skeleton */}
			<section className="py-16 md:py-24">
				<div className="container px-4 max-w-7xl mx-auto space-y-12">
					{/* Section Title */}
					<div className="text-center space-y-4">
						<Skeleton className="h-12 w-64 mx-auto" />
						<Skeleton className="h-6 w-96 mx-auto" />
					</div>

					{/* Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="space-y-4">
								<Skeleton className="aspect-[4/3] w-full rounded-2xl" />
								<Skeleton className="h-6 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Loading Indicator */}
			<div className="fixed bottom-8 right-8 z-50">
				<div className="bg-background/80 backdrop-blur-sm border rounded-full px-4 py-2 flex items-center gap-2">
					<Loader2 className="h-4 w-4 animate-spin text-primary" />
					<span className="text-sm font-display font-light text-muted-foreground">
						Loading...
					</span>
				</div>
			</div>
		</main>
	);
}