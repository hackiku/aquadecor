// src/components/social/SocialGrid.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { ExternalLink, Play } from "lucide-react";
import { socialMentions, type SocialPlatform, type SocialMention } from "~/data/social-mentions";
// import { SocialVideoEmbed } from "./SocialVideoEmbed";

interface SocialGridProps {
	initialLimit?: number;
	showTabs?: boolean;
	className?: string;
}

// Predefined aspect ratios for consistent masonry
const ASPECT_RATIOS = ['square', 'portrait', 'landscape', 'square', 'landscape', 'portrait'] as const;

export function SocialGrid({
	initialLimit = 6,
	showTabs = true,
	className = "",
}: SocialGridProps) {
	const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | "all">("all");
	const [displayLimit, setDisplayLimit] = useState(initialLimit);

	// Filter mentions by platform
	const filteredMentions = selectedPlatform === "all"
		? socialMentions
		: socialMentions.filter((m) => m.platform === selectedPlatform);

	const visibleMentions = filteredMentions.slice(0, displayLimit);
	const hasMore = displayLimit < filteredMentions.length;

	// Get unique platforms for tabs
	const platforms = Array.from(new Set(socialMentions.map((m) => m.platform)));

	const handleLoadMore = () => {
		setDisplayLimit((prev) => prev + 6);
	};

	return (
		<div className={className}>

			{/* <SocialVideoEmbed
				url="https://www.tiktok.com/@aquadecorbackgrounds/video/7530031215806631174"
				className="aspect-video"
			/> */}

			{/* Platform Tabs */}
			{showTabs && (
				<div className="flex flex-wrap items-center gap-2 mb-8 justify-center">
					<button
						onClick={() => setSelectedPlatform("all")}
						className={`px-4 py-2 rounded-full font-display font-medium text-sm transition-all ${selectedPlatform === "all"
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground hover:bg-muted/80"
							}`}
					>
						All
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
							{platform}
						</button>
					))}
				</div>
			)}

			{/* Masonry Grid - columns-based for better flow */}
			<div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
				{visibleMentions.map((mention, idx) => (
					<SocialCard
						key={mention.id}
						mention={mention}
						// Cycle through predefined aspect ratios
						forceAspectRatio={ASPECT_RATIOS[idx % ASPECT_RATIOS.length]}
					/>
				))}
			</div>

			{/* Load More Button */}
			{hasMore && (
				<div className="text-center mt-12">
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
	forceAspectRatio?: 'square' | 'portrait' | 'landscape';
}

function SocialCard({ mention, forceAspectRatio }: SocialCardProps) {
	const [isInView, setIsInView] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

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

	// Use forced aspect ratio for consistent masonry, or fall back to mention's ratio
	const aspectRatio = forceAspectRatio || mention.aspectRatio || "square";

	const aspectRatioClass = {
		square: "aspect-square",
		portrait: "aspect-[9/16]",
		landscape: "aspect-video",
	}[aspectRatio];

	const platformColor = {
		tiktok: "bg-pink-500",
		youtube: "bg-red-500",
		instagram: "bg-purple-500",
		facebook: "bg-blue-500",
		reddit: "bg-orange-500",
	}[mention.platform];

	const hasVideo = !!mention.videoFile;

	const handleVideoClick = (e: React.MouseEvent) => {
		e.preventDefault();
		if (videoRef.current) {
			if (isPlaying) {
				videoRef.current.pause();
				setIsPlaying(false);
			} else {
				videoRef.current.play();
				setIsPlaying(true);
			}
		}
	};

	return (
		<div ref={cardRef} className="group break-inside-avoid mb-4">
			<Link
				href={mention.url}
				target="_blank"
				rel="noopener noreferrer"
				className={`block relative ${aspectRatioClass} rounded-2xl overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] bg-muted`}
				onClick={hasVideo ? handleVideoClick : undefined}
			>
				{/* Content */}
				{isInView && (
					<>
						{/* Video or Image */}
						{hasVideo ? (
							<>
								<video
									ref={videoRef}
									src={mention.videoFile}
									poster={mention.thumbnail}
									className="absolute inset-0 w-full h-full object-cover"
									loop
									playsInline
									muted
									onPlay={() => setIsPlaying(true)}
									onPause={() => setIsPlaying(false)}
								/>

								{/* Play/Pause Button Overlay */}
								{!isPlaying && (
									<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
										<div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
											<Play className="h-8 w-8 text-primary fill-primary ml-1" />
										</div>
									</div>
								)}
							</>
						) : mention.thumbnail ? (
							<Image
								src={mention.thumbnail}
								alt={mention.caption || "Social media post"}
								fill
								className="object-cover"
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							/>
						) : null}

						{/* Gradient Overlay */}
						<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />

						{/* Platform Badge */}
						<div className="absolute top-3 right-3 z-10">
							<div className={`w-8 h-8 ${platformColor} rounded-full flex items-center justify-center shadow-lg`}>
								<span className="text-white text-xs font-bold uppercase">
									{mention.platform[0]}
								</span>
							</div>
						</div>

						{/* Content Overlay */}
						<div className="absolute bottom-3 left-3 right-3 z-10 space-y-1">
							{mention.author && (
								<p className="text-white font-display font-medium text-sm">
									@{mention.author}
								</p>
							)}
							{mention.caption && (
								<p className="text-white/80 font-display font-light text-xs line-clamp-2">
									{mention.caption}
								</p>
							)}
						</div>

						{/* External Link Icon on Hover */}
						<div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
							<ExternalLink className="h-4 w-4 text-white drop-shadow-lg" />
						</div>
					</>
				)}
			</Link>
		</div>
	);
}