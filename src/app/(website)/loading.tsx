// src/app/(website)/loading.tsx

import { Skeleton } from "~/components/ui/skeleton";

export default function HomeLoading() {
	return (
		<main className="min-h-screen">
			{/* Hero Skeleton */}
			<section className="relative h-screen">
				<Skeleton className="absolute inset-0" />
				<div className="relative z-10 h-full flex items-center justify-center">
					<div className="text-center space-y-6 px-4">
						<Skeleton className="h-20 w-[600px] mx-auto" />
						<Skeleton className="h-8 w-96 mx-auto" />
						<Skeleton className="h-12 w-48 mx-auto rounded-full" />
					</div>
				</div>
			</section>

			{/* Product Slider Skeleton */}
			<section className="relative py-24">
				<div className="px-4 max-w-7xl mx-auto space-y-12">
					{/* Section Header */}
					<div className="text-center space-y-4">
						<Skeleton className="h-12 w-96 mx-auto" />
						<Skeleton className="h-6 w-[500px] mx-auto" />
					</div>

					{/* Product Rows */}
					{[...Array(2)].map((_, rowIndex) => (
						<div key={rowIndex} className="space-y-6">
							<div className="flex items-end justify-between">
								<div className="space-y-2">
									<Skeleton className="h-8 w-48" />
									<Skeleton className="h-4 w-64" />
								</div>
								<Skeleton className="h-6 w-24" />
							</div>

							<div className="flex gap-4 overflow-hidden">
								{[...Array(6)].map((_, i) => (
									<div key={i} className="shrink-0 w-[260px] md:w-[300px]">
										<Skeleton className="aspect-4/3 w-full rounded-lg" />
									</div>
								))}
							</div>
						</div>
					))}

					{/* Trust Signals */}
					<div className="grid md:grid-cols-3 gap-8 mt-16">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="text-center space-y-2">
								<Skeleton className="h-12 w-12 mx-auto rounded-full" />
								<Skeleton className="h-6 w-32 mx-auto" />
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section Skeleton */}
			<section className="relative py-24 md:py-32">
				<div className="max-w-5xl mx-auto px-4">
					<div className="text-center mb-16 space-y-4">
						<Skeleton className="h-12 w-96 mx-auto" />
						<Skeleton className="h-6 w-[600px] mx-auto" />
					</div>

					<div className="space-y-8">
						{[...Array(3)].map((_, i) => (
							<Skeleton key={i} className="h-64 w-full rounded-2xl" />
						))}
					</div>
				</div>
			</section>

			{/* Stats Section Skeleton */}
			<section className="py-16 md:py-24">
				<div className="px-4 max-w-7xl mx-auto">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="text-center space-y-2">
								<Skeleton className="h-12 w-24 mx-auto" />
								<Skeleton className="h-4 w-32 mx-auto" />
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}