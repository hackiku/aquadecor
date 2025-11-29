// src/components/social/SocialCard.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, ExternalLink, Heart, Eye, Maximize2 } from "lucide-react";
import { SocialEmbedModal } from "./SocialEmbedModal";
import type { SocialMention } from "~/data/social-mentions";

interface SocialCardProps {
	mention: SocialMention;
	forceAspectRatio?: "square" | "portrait" | "landscape";
	showEmbedButton?: boolean; // Show "View on Platform" button
}

export function SocialCard({
	mention,
	forceAspectRatio,
	showEmbedButton = true
}: SocialCardProps) {
	const [isInView, setIsInView] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [showModal, setShowModal] = useState(false);
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
		e.stopPropagation();
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

	const handleCardClick = () => {
		// If video is playing, pause it
		if (isPlaying && videoRef.current) {
			videoRef.current.pause();
			setIsPlaying(false);
		}
		// Open modal
		setShowModal(true);
	};

	return (
		<>
			<div ref={cardRef} className="group break-inside-avoid mb-4">
				<div
					className={`relative ${aspectRatioClass} rounded-2xl overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] bg-muted cursor-pointer`}
					onClick={handleCardClick}
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
										onClick={handleVideoClick}
									/>

									{/* Play Button Overlay */}
									{!isPlaying && (
										<div
											className="absolute inset-0 flex items-center justify-center pointer-events-none"
											onClick={handleVideoClick}
										>
											<div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl pointer-events-auto">
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

							{/* Expand Icon (top-left on hover) */}
							{showEmbedButton && (
								<div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
									<button
										onClick={(e) => {
											e.stopPropagation();
											setShowModal(true);
										}}
										className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
									>
										<Maximize2 className="h-4 w-4 text-white" />
									</button>
								</div>
							)}

							{/* Content Overlay (bottom) */}
							<div className="absolute bottom-0 left-0 right-0 z-10 p-4 space-y-2">
								{/* Author */}
								{mention.author && (
									<p className="text-white font-display font-medium text-sm">
										@{mention.author}
									</p>
								)}

								{/* Caption */}
								{mention.caption && (
									<p className="text-white/80 font-display font-light text-xs line-clamp-2">
										{mention.caption}
									</p>
								)}

								{/* Metrics */}
								{(mention.likes || mention.views) && (
									<div className="flex items-center gap-4 text-xs text-white/70">
										{mention.likes && (
											<div className="flex items-center gap-1.5">
												<Heart className="h-3.5 w-3.5" />
												<span className="font-display font-medium">
													{formatNumber(mention.likes)}
												</span>
											</div>
										)}
										{mention.views && (
											<div className="flex items-center gap-1.5">
												<Eye className="h-3.5 w-3.5" />
												<span className="font-display font-medium">
													{formatNumber(mention.views)}
												</span>
											</div>
										)}
									</div>
								)}

								{/* View on Platform Button */}
								{showEmbedButton && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											setShowModal(true);
										}}
										className="w-full mt-2 py-2 px-4 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-display font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100"
									>
										<ExternalLink className="h-3 w-3" />
										View on {mention.platform}
									</button>
								)}
							</div>
						</>
					)}
				</div>
			</div>

			{/* Modal */}
			<SocialEmbedModal
				mention={mention}
				isOpen={showModal}
				onClose={() => setShowModal(false)}
			/>
		</>
	);
}

// Helper to format large numbers
function formatNumber(num: number): string {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + "M";
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + "K";
	}
	return num.toString();
}