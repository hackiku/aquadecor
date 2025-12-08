// src/app/[locale]/(website)/reviews/_components/ReviewFilter.tsx
"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
	Star,
	SlidersHorizontal,
	CheckCircle2,
	ExternalLink,
	X
} from "lucide-react";

interface ReviewFilterProps {
	totalCount: number;
}

type SortOption = "newest" | "oldest" | "highest" | "lowest";
type SourceFilter = "all" | "youtube" | "forum" | "facebook" | "email";

export function ReviewFilter({ totalCount }: ReviewFilterProps) {
	const [sortBy, setSortBy] = useState<SortOption>("newest");
	const [filterRating, setFilterRating] = useState<number | null>(null);
	const [filterSource, setFilterSource] = useState<SourceFilter>("all");
	const [verifiedOnly, setVerifiedOnly] = useState(false);
	const [showFilters, setShowFilters] = useState(false);

	// Active filter count for badge
	const activeFilterCount = [
		filterRating !== null,
		filterSource !== "all",
		verifiedOnly,
	].filter(Boolean).length;

	const handleSort = (option: SortOption) => {
		setSortBy(option);
		// TODO: Implement client-side sorting or refetch with params
		console.log("Sort by:", option);
	};

	const handleRatingFilter = (rating: number) => {
		setFilterRating(filterRating === rating ? null : rating);
		// TODO: Filter reviews
		console.log("Filter rating:", rating);
	};

	const handleSourceFilter = (source: SourceFilter) => {
		setFilterSource(source);
		// TODO: Filter reviews
		console.log("Filter source:", source);
	};

	const clearFilters = () => {
		setFilterRating(null);
		setFilterSource("all");
		setVerifiedOnly(false);
		setSortBy("newest");
		// TODO: Reset view
	};

	return (
		<div className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
			<div className="container px-4 py-4">
				{/* Top Row - Sort & Filter Toggle */}
				<div className="flex items-center justify-between gap-4 flex-wrap">
					{/* Sort Options */}
					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground font-display">
							Sort by:
						</span>
						<div className="flex gap-1">
							<Button
								variant={sortBy === "newest" ? "default" : "outline"}
								size="sm"
								onClick={() => handleSort("newest")}
								className="rounded-full"
							>
								Newest
							</Button>
							<Button
								variant={sortBy === "oldest" ? "default" : "outline"}
								size="sm"
								onClick={() => handleSort("oldest")}
								className="rounded-full"
							>
								Oldest
							</Button>
							<Button
								variant={sortBy === "highest" ? "default" : "outline"}
								size="sm"
								onClick={() => handleSort("highest")}
								className="rounded-full"
							>
								Highest
							</Button>
							<Button
								variant={sortBy === "lowest" ? "default" : "outline"}
								size="sm"
								onClick={() => handleSort("lowest")}
								className="rounded-full"
							>
								Lowest
							</Button>
						</div>
					</div>

					{/* Filter Toggle */}
					<div className="flex items-center gap-2">
						{activeFilterCount > 0 && (
							<Button
								variant="ghost"
								size="sm"
								onClick={clearFilters}
								className="text-muted-foreground hover:text-foreground"
							>
								Clear filters
								<X className="h-4 w-4 ml-1" />
							</Button>
						)}
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowFilters(!showFilters)}
							className="rounded-full"
						>
							<SlidersHorizontal className="h-4 w-4 mr-2" />
							Filters
							{activeFilterCount > 0 && (
								<Badge
									variant="default"
									className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
								>
									{activeFilterCount}
								</Badge>
							)}
						</Button>
					</div>
				</div>

				{/* Filter Panel - Expandable */}
				{showFilters && (
					<div className="mt-4 pt-4 border-t space-y-4">
						{/* Rating Filter */}
						<div className="space-y-2">
							<p className="text-sm font-display font-medium">
								Filter by rating
							</p>
							<div className="flex gap-2 flex-wrap">
								{[5, 4, 3, 2, 1].map((rating) => (
									<Button
										key={rating}
										variant={filterRating === rating ? "default" : "outline"}
										size="sm"
										onClick={() => handleRatingFilter(rating)}
										className="rounded-full"
									>
										<div className="flex items-center gap-1">
											{rating}
											<Star className="h-3 w-3 fill-current" />
										</div>
									</Button>
								))}
							</div>
						</div>

						{/* Source Filter */}
						<div className="space-y-2">
							<p className="text-sm font-display font-medium">
								Filter by source
							</p>
							<div className="flex gap-2 flex-wrap">
								<Button
									variant={filterSource === "all" ? "default" : "outline"}
									size="sm"
									onClick={() => handleSourceFilter("all")}
									className="rounded-full"
								>
									All Sources
								</Button>
								<Button
									variant={filterSource === "youtube" ? "default" : "outline"}
									size="sm"
									onClick={() => handleSourceFilter("youtube")}
									className="rounded-full"
								>
									YouTube
								</Button>
								<Button
									variant={filterSource === "forum" ? "default" : "outline"}
									size="sm"
									onClick={() => handleSourceFilter("forum")}
									className="rounded-full"
								>
									Forums
								</Button>
								<Button
									variant={filterSource === "facebook" ? "default" : "outline"}
									size="sm"
									onClick={() => handleSourceFilter("facebook")}
									className="rounded-full"
								>
									Facebook
								</Button>
								<Button
									variant={filterSource === "email" ? "default" : "outline"}
									size="sm"
									onClick={() => handleSourceFilter("email")}
									className="rounded-full"
								>
									Email
								</Button>
							</div>
						</div>

						{/* Verified Only Toggle */}
						<div className="space-y-2">
							<Button
								variant={verifiedOnly ? "default" : "outline"}
								size="sm"
								onClick={() => setVerifiedOnly(!verifiedOnly)}
								className="rounded-full"
							>
								<CheckCircle2 className="h-4 w-4 mr-2" />
								Verified purchases only
							</Button>
						</div>
					</div>
				)}

				{/* Active Filters Summary */}
				{activeFilterCount > 0 && !showFilters && (
					<div className="mt-3 flex items-center gap-2 flex-wrap">
						<span className="text-xs text-muted-foreground font-display">
							Active filters:
						</span>
						{filterRating && (
							<Badge variant="secondary" className="font-display">
								{filterRating} stars
							</Badge>
						)}
						{filterSource !== "all" && (
							<Badge variant="secondary" className="font-display">
								{filterSource}
							</Badge>
						)}
						{verifiedOnly && (
							<Badge variant="secondary" className="font-display">
								Verified only
							</Badge>
						)}
					</div>
				)}
			</div>
		</div>
	);
}