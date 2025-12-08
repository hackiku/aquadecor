// src/app/[locale]/(website)/reviews/page.tsx

import { api, HydrateClient } from "~/trpc/server";
import { ReviewCard } from "~/components/proof/ReviewCard";
import { ReviewFilter } from "./_components/ReviewFilter";

export default async function ReviewsPage() {
	// Load all approved reviews using reviews API
	const allReviews = await api.reviews.getAll();
	const stats = await api.reviews.getStats();

	return (
		<HydrateClient>
			<main className="min-h-screen">
				{/* Header */}
				<section className="border-b bg-gradient-to-b from-background to-muted/30">
					<div className="px-4 py-12 md:py-16 max-w-7xl mx-auto">
						<div className="max-w-3xl">
							<h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-tight">
								Customer Reviews
							</h1>
							<p className="mt-4 text-lg text-muted-foreground font-display font-light">
								See what our customers are saying about Aquadecor products
							</p>
							<div className="mt-6 flex items-center gap-6">
								<div className="text-center">
									<p className="text-4xl font-display font-light text-primary">
										{stats.totalCount}
									</p>
									<p className="text-sm text-muted-foreground font-display">
										Total Reviews
									</p>
								</div>
								<div className="text-center">
									<p className="text-4xl font-display font-light text-primary">
										{stats.avgRating}
									</p>
									<p className="text-sm text-muted-foreground font-display">
										Average Rating
									</p>
								</div>
								<div className="text-center">
									<p className="text-4xl font-display font-light text-primary">
										{stats.ratingBreakdown[5]}
									</p>
									<p className="text-sm text-muted-foreground font-display">
										5-Star Reviews
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Filter - Sticky */}
				<ReviewFilter totalCount={stats.totalCount} />

				{/* Reviews Grid */}
				<section className="py-12 md:py-16">
					<div className="px-4 max-w-7xl mx-auto">
						<div
							id="reviews-grid"
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
						>
							{allReviews.map((review) => (
								<ReviewCard key={review.id} review={review} />
							))}
						</div>

						{/* Empty State */}
						{allReviews.length === 0 && (
							<div className="text-center py-12">
								<p className="text-lg text-muted-foreground font-display font-light">
									No reviews yet. Be the first to leave one!
								</p>
							</div>
						)}
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-16 md:py-20 bg-muted/30 border-t">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="max-w-3xl mx-auto text-center space-y-6">
							<h2 className="text-3xl md:text-4xl font-display font-light">
								Ready to experience it yourself?
							</h2>
							<p className="text-lg text-muted-foreground font-display font-light">
								Join {stats.verifiedCount.toLocaleString()}+ satisfied customers who transformed their aquariums
							</p>
						</div>
					</div>
				</section>
			</main>
		</HydrateClient>
	);
}