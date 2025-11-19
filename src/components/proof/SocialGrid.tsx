// src/components/proof/SocialGrid.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { ExternalLink, Eye, Heart, Play } from "lucide-react";
import { socialMentions, type SocialPlatform, type SocialMention } from "~/data/social-mentions";

interface SocialGridProps {
	initialLimit?: number;
	showTabs?: boolean;
	className?: string;
}

export function SocialGrid({
	initialLimit = 6,
	showTabs = true,
	className = "",
}: SocialGridProps) {
	const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | "all">("all");
	const [displayLimit, setDisplayLimit] = useState(initialLimit);
	const [loadedEmbeds, setLoadedEmbeds] = useState<Set<string>>(new Set());

	// Filter mentions by platform
	const filteredMentions = selectedPlatform === "all"
		? socialMentions
		: socialMentions.filter((m) => m.platform === selectedPlatform);

	const visibleMentions = filteredMentions.slice(0, displayLimit);
	const hasMore = displayLimit < filteredMentions.length;

	// Get unique platforms for tabs
	const platforms = Array.from(new Set(socialMentions.map((m) => m.platform)));

	// Platform counts
	const platformCounts = platforms.reduce(
		(acc, platform) => {
			acc[platform] = socialMentions.filter((m) => m.platform === platform).length;
			return acc;
		},
		{} as Record<SocialPlatform, number>,
	);

	const handleLoadMore = () => {
		setDisplayLimit((prev) => prev + 6);
	};

	return (
		<div className={className}>
			{/* Platform Tabs */}
			{showTabs && (
				<div className="flex flex-wrap items-center gap-2 mb-8">
					<button
						onClick={() => setSelectedPlatform("all")}
						className={`px-4 py-2 rounded-full font-display font-medium text-sm transition-all ${selectedPlatform === "all"
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground hover:bg-muted/80"
							}`}
					>
						All ({socialMentions.length})
					</button>
					{platforms.map((platform) => (
						<button
							key={platform}
							onClick={() => setSelectedPlatform(platform)}
							className={`px-4 py-2 rounded-full font-display font-medium text-sm transition-all capitalize ${selectedPlatform === platform
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground hover:bg-muted/80"
								}`}
						>
							{platform} ({platformCounts[platform]})
						</button>
					))}
				</div>
			)}

			{/* Masonry Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{visibleMentions.map((mention) => (
					<SocialCard
						key={mention.id}
						mention={mention}
						isLoaded={loadedEmbeds.has(mention.id)}
						onLoad={() => setLoadedEmbeds((prev) => new Set(prev).add(mention.id))}
					/>
				))}
			</div>

			{/* Load More Button */}
			{hasMore && (
				<div className="text-center mt-8">
					<Button
						onClick={handleLoadMore}
						variant="outline"
						size="lg"
						className="rounded-full"
					>
						Load More
					</Button>
				</div>
			)}
		</div>
	);
}

interface SocialCardProps {
	mention: SocialMention;
	isLoaded: boolean;
	onLoad: () => void;
}

function SocialCard({ mention, isLoaded, onLoad }: SocialCardProps) {
	const [isInView, setIsInView] = useState(false);
	const [showEmbed, setShowEmbed] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);

	// Intersection observer for lazy loading
	useEffect(() => {
		if (!cardRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					setIsInView(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "200px" },
		);

		observer.observe(cardRef.current);

		return () => observer.disconnect();
	}, []);

	// Aspect ratio classes
	const aspectRatioClass = {
		square: "aspect-square",
		portrait: "aspect-[9/16]",
		landscape: "aspect-video",
	}[mention.aspectRatio || "square"];

	const platformColor = {
		tiktok: "bg-pink-500",
		youtube: "bg-red-500",
		instagram: "bg-purple-500",
		facebook: "bg-blue-500",
		reddit: "bg-orange-500",
	}[mention.platform];

	return (
		<div ref={cardRef} className="group relative">
			<Link
				href={mention.url}
				target="_blank"
				rel="noopener noreferrer"
				className={`block relative ${aspectRatioClass} rounded-2xl overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] bg-muted`}
			>
				{/* Thumbnail or Embed */}
				{isInView && mention.thumbnail ? (
					<>
						<Image
							src={mention.thumbnail}
							alt={mention.caption || "Social media post"}
							fill
							className="object-cover"
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						/>

						{/* Gradient Overlay */}
						<div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/90" />

						{/* Platform Badge */}
						<div className="absolute top-3 right-3 z-10">
							<div className={`px-3 py-1 ${platformColor} text-white text-xs font-display font-medium rounded-full capitalize`}>
								{mention.platform}
							</div>
						</div>

						{/* Play Icon for Videos */}
						{(mention.platform === "tiktok" || mention.platform === "youtube") && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
									<Play className="h-8 w-8 text-primary fill-primary ml-1" />
								</div>
							</div>
						)}

						{/* Content Overlay */}
						<div className="absolute bottom-0 left-0 right-0 p-4 z-10">
							{mention.caption && (
								<p className="text-white font-display font-light text-sm mb-2 line-clamp-2">
									{mention.caption}
								</p>
							)}

							{/* Stats */}
							<div className="flex items-center gap-4 text-xs text-white/80">
								{mention.likes && (
									<div className="flex items-center gap-1">
										<Heart className="h-3 w-3" />
										<span>{mention.likes.toLocaleString()}</span>
									</div>
								)}
								{mention.views && (
									<div className="flex items-center gap-1">
										<Eye className="h-3 w-3" />
										<span>{mention.views.toLocaleString()}</span>
									</div>
								)}
								{mention.author && (
									<span className="font-display font-medium">@{mention.author}</span>
								)}
							</div>
						</div>

						{/* External Link Icon */}
						<div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
							<ExternalLink className="h-5 w-5 text-white" />
						</div>
					</>
				) : (
					<div className="absolute inset-0 flex items-center justify-center bg-muted">
						<div className="text-muted-foreground">Loading...</div>
					</div>
				)}
			</Link>
		</div>
	);
}