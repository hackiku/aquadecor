// src/components/proof/ReviewCard.tsx

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
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
		<Card className="h-full flex flex-col">
			<CardHeader className="space-y-3">
				{/* Rating Stars */}
				<div className="flex items-center gap-3">
					<div className="flex gap-0.5">
						{Array.from({ length: 5 }).map((_, i) => (
							<Star
								key={i}
								className={`h-4 w-4 ${i < review.rating
										? "fill-primary text-primary"
										: "fill-muted text-muted"
									}`}
							/>
						))}
					</div>
					{review.verifiedPurchase && (
						<Badge variant="secondary" className="text-xs">
							Verified Purchase
						</Badge>
					)}
				</div>

				{/* Review Title */}
				{review.title && (
					<CardTitle className="text-xl font-display font-normal leading-tight">
						{review.title}
					</CardTitle>
				)}

				{/* Author Info */}
				<CardDescription className="font-display">
					<span className="font-medium text-foreground">{review.authorName}</span>
					{review.authorLocation && (
						<span className="text-muted-foreground"> • {review.authorLocation}</span>
					)}
				</CardDescription>
			</CardHeader>

			{/* Review Content */}
			<CardContent className="flex-1">
				<p className="text-muted-foreground font-display font-light leading-relaxed">
					{review.content}
				</p>
			</CardContent>

			{/* Source Link */}
			{review.sourceUrl && (
				<CardFooter>
					<a
						href={review.sourceUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-primary hover:underline font-display flex items-center gap-1.5 group"
					>
						<span>View original review</span>
						<ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
					</a>
				</CardFooter>
			)}
		</Card>
	);
}
