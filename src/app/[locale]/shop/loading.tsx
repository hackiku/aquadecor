// src/app/[locale]/shop/loading.tsx

import { Skeleton } from "~/components/ui/skeleton";

export default function ShopLoading() {
	return (
		<main className="min-h-screen">
			{/* Header Skeleton */}
			<section className="relative py-16 md:py-24 bg-black">
				<div className="px-14 max-w-5xl mx-auto text-center space-y-6">
					<Skeleton className="h-16 w-96 mx-auto bg-muted/20" />
					<Skeleton className="h-6 w-full max-w-3xl mx-auto bg-muted/20" />
				</div>
			</section>

			{/* Product Sections Skeleton */}
			<section className="relative py-24 md:py-32 bg-card">
				<div className="px-4 max-w-7xl mx-auto space-y-12">
					{/* Section Title */}
					<div className="text-center space-y-4">
						<Skeleton className="h-12 w-64 mx-auto" />
						<Skeleton className="h-6 w-96 mx-auto" />
					</div>

					{/* Product Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="space-y-4">
								<Skeleton className="aspect-[4/3] w-full rounded-lg" />
								<Skeleton className="h-6 w-3/4" />
								<Skeleton className="h-4 w-24" />
							</div>
						))}
					</div>

					{/* Features Grid */}
					<div className="grid md:grid-cols-3 gap-8 mt-16">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="text-center space-y-3">
								<Skeleton className="h-12 w-12 mx-auto rounded-full" />
								<Skeleton className="h-6 w-32 mx-auto" />
								<Skeleton className="h-16 w-full" />
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Second Section */}
			<section className="relative py-24 md:py-32 bg-muted/10">
				<div className="px-4 max-w-7xl mx-auto space-y-12">
					<div className="text-center space-y-4">
						<Skeleton className="h-12 w-64 mx-auto" />
						<Skeleton className="h-6 w-96 mx-auto" />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="space-y-4">
								<Skeleton className="aspect-4/3 w-full rounded-lg" />
								<Skeleton className="h-6 w-3/4" />
								<Skeleton className="h-4 w-24" />
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}