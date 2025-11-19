// src/components/proof/ReviewCard.tsx

import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Star, ExternalLink } from "lucide-react";

interface Review {
	id: string;
	rating: number;
	title: string | null;
	content: string;
	authorName: string;
	authorLocation: string | null;
	verifiedPurchase: boolean | null;
	source: string | null;
	sourceUrl: string | null;
}

interface ReviewCardProps {
	review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
	return (
		<Card className="h-full flex flex-col group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
			<CardContent className="flex-1 p-6 md:p-8 space-y-5">
				{/* Rating Stars */}
				<div className="flex items-center gap-1">
					{Array.from({ length: 5 }).map((_, i) => (
						<Star
							key={i}
							className={`h-5 w-5 transition-colors ${i < review.rating
									? "fill-primary text-primary"
									: "fill-muted-foreground/20 text-muted-foreground/20"
								}`}
						/>
					))}
				</div>

				{/* Review Title */}
				{review.title && (
					<h3 className="text-xl md:text-2xl font-display font-light leading-tight text-foreground/90 group-hover:text-foreground transition-colors">
						"{review.title}"
					</h3>
				)}

				{/* Review Content */}
				<p className="text-base md:text-lg text-muted-foreground font-display font-light leading-relaxed">
					{review.content}
				</p>

				{/* Verified Badge */}
				{review.verifiedPurchase && (
					<Badge
						variant="secondary"
						className="bg-primary/10 text-primary border-primary/20 text-xs font-display font-medium"
					>
						✓ Verified Purchase
					</Badge>
				)}
			</CardContent>

			{/* Footer with Author and Source */}
			<CardFooter className="flex flex-col items-start gap-3 p-6 md:p-8 pt-0 border-t border-border/50">
				{/* Author Info */}
				<div className="space-y-1">
					<p className="font-display font-medium text-foreground">
						{review.authorName}
					</p>
					{review.authorLocation && (
						<p className="text-sm text-muted-foreground font-display font-light">
							{review.authorLocation}
						</p>
					)}
				</div>

				{/* Source Link */}
				{review.sourceUrl && (
					<a
						href={review.sourceUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-primary hover:text-primary/80 font-display font-medium flex items-center gap-2 group/link transition-colors"
					>
						<span>View on {review.source || "original source"}</span>
						<ExternalLink className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
					</a>
				)}
			</CardFooter>
		</Card>
	);
}