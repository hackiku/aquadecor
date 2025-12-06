// src/components/proof/QuickShoutout.tsx

"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface QuickReview {
	id: string;
	quote: string;
	fullReview?: string;
	author: string;
	location?: string;
	source: string;
	sourceUrl?: string;
	avatar?: string;
	media?: {
		type: "youtube" | "image";
		url: string;
		thumbnail?: string;
	};
}

const REVIEWS: QuickReview[] = [
	{
		id: "1",
		quote: "Every single person that has seen it has thought that it was real wood and rocks that I cut and assembled together.",
		fullReview: "I looked at every website known to mankind and I finally settled on a custom 3D background from Aquadecor. Completely worth it. Every single person that has seen it has thought that it was real wood and rocks that I cut and assembled together.",
		author: "Kevin 'fishbubbles'",
		location: "Florida",
		source: "Forum",
		sourceUrl: "#",
		avatar: "/media/avatars/placeholder-1.jpg",
	},
	{
		id: "2",
		quote: "The hand-painted details really stand out and make this background a work of art.",
		fullReview: "The hand-painted details really stand out and make this background a work of art. It has a Styrofoam core, but on the surface it feels just like a rock. Every classic rock aquarium background is entirely customized to the build of your fish tank and matches perfectly the exact dimensions.",
		author: "Joey Mullen (King of DIY)",
		location: "YouTube",
		source: "YouTube",
		sourceUrl: "https://www.youtube.com/@TheKingofDIY",
		avatar: "/media/avatars/placeholder-2.jpg",
		media: {
			type: "youtube",
			url: "https://www.youtube.com/watch?v=placeholder",
			thumbnail: "https://img.youtube.com/vi/placeholder/maxresdefault.jpg",
		},
	},
	{
		id: "3",
		quote: "The attention to detail is incredible. Setup was easy and my fish love it.",
		fullReview: "The attention to detail is incredible. Setup was easy and my fish love it. Customer service was super responsive and helpful throughout the custom order process.",
		author: "Sarah M.",
		location: "United Kingdom",
		source: "Verified Purchase",
		avatar: "/media/avatars/placeholder-3.jpg",
	},
	{
		id: "4",
		quote: "Looks so natural that my guests ask where I collected the rocks from.",
		fullReview: "Absolutely stunning craftsmanship. Looks so natural that my guests ask where I collected the rocks from. The custom sizing was perfect for my irregular tank dimensions.",
		author: "Marcus T.",
		location: "Germany",
		source: "Email",
		avatar: "/media/avatars/placeholder-4.jpg",
	},
];

interface QuickShoutoutProps {
	onSlideChange?: () => void;
}

export function QuickShoutout({ onSlideChange }: QuickShoutoutProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	const currentReview = REVIEWS[currentIndex];
	const hasFullReview = !!currentReview?.fullReview;

	// Trigger callback when index changes
	useEffect(() => {
		onSlideChange?.();
	}, [currentIndex, onSlideChange]);

	// Auto-rotate every 4 seconds when not expanded
	useEffect(() => {
		if (isExpanded || isPaused) return;

		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
		}, 4000);

		return () => clearInterval(interval);
	}, [isExpanded, isPaused]);

	const handlePrevious = () => {
		setCurrentIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
		setIsPaused(true);
		setTimeout(() => setIsPaused(false), 8000);
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
		setIsPaused(true);
		setTimeout(() => setIsPaused(false), 8000);
	};

	const toggleExpanded = () => {
		if (hasFullReview) {
			setIsExpanded(!isExpanded);
		}
	};

	if (!currentReview) return null;

	return (
		<motion.div
			layout
			initial={false}
			animate={{
				width: isExpanded ? 400 : 320,
			}}
			transition={{
				layout: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
			}}
			className="max-w-[calc(100vw-2rem)]"
		>
			<motion.div
				layout
				className="relative bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden cursor-pointer"
				onClick={toggleExpanded}
			>
				{/* Content */}
				<motion.div layout="position" className="p-4">
					{/* Quote */}
					<motion.blockquote
						layout="position"
						className="text-white font-display font-light text-sm leading-relaxed mb-3"
					>
						"{isExpanded && currentReview.fullReview ? currentReview.fullReview : currentReview.quote}"
					</motion.blockquote>

					{/* Media (if expanded and available) */}
					<AnimatePresence>
						{isExpanded && currentReview.media && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.2 }}
								className="mb-3"
							>
								<div className="rounded-lg overflow-hidden border-2 border-primary">
									{currentReview.media.type === "youtube" && currentReview.media.thumbnail ? (
										<div className="relative aspect-video bg-zinc-800">
											<Image
												src={currentReview.media.thumbnail}
												alt="Review media"
												fill
												className="object-cover"
											/>
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
													<div className="w-0 h-0 border-l-8 border-l-white border-y-6 border-y-transparent ml-1" />
												</div>
											</div>
										</div>
									) : currentReview.media.type === "image" ? (
										<div className="relative aspect-video bg-zinc-800">
											<Image
												src={currentReview.media.url}
												alt="Review media"
												fill
												className="object-cover"
											/>
										</div>
									) : null}
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Author Info */}
					<motion.div layout="position" className="flex items-center gap-3">
						<div className="relative w-8 h-8 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0 border-2 border-primary">
							{currentReview.avatar ? (
								<Image
									src={currentReview.avatar}
									alt={currentReview.author}
									fill
									className="object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs font-display font-medium">
									{currentReview.author[0]}
								</div>
							)}
						</div>

						<div className="flex-1 min-w-0">
							<p className="text-white text-xs font-display font-medium truncate">
								{currentReview.author}
							</p>
							<div className="flex items-center gap-2">
								{currentReview.location && (
									<p className="text-zinc-400 text-xs font-display font-light">
										{currentReview.location}
									</p>
								)}
								{currentReview.location && currentReview.sourceUrl && (
									<span className="text-zinc-600">•</span>
								)}
								{currentReview.sourceUrl && (
									<Link
										href={currentReview.sourceUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary text-xs font-display font-medium hover:underline inline-flex items-center gap-1"
										onClick={(e) => e.stopPropagation()}
									>
										{currentReview.source}
										<ExternalLink className="h-2.5 w-2.5" />
									</Link>
								)}
							</div>
						</div>
					</motion.div>
				</motion.div>

				{/* Navigation Arrows - Bottom Right */}
				<div className="absolute bottom-3 right-3 flex items-center gap-1 z-20">
					<button
						onClick={(e) => {
							e.stopPropagation();
							handlePrevious();
						}}
						className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
						aria-label="Previous review"
					>
						<ChevronLeft className="h-3.5 w-3.5" />
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleNext();
						}}
						className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
						aria-label="Next review"
					>
						<ChevronRight className="h-3.5 w-3.5" />
					</button>
				</div>

				{/* Progress Indicator */}
				{!isExpanded && !isPaused && (
					<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
						<motion.div
							className="h-full bg-primary"
							initial={{ width: "0%" }}
							animate={{ width: "100%" }}
							transition={{ duration: 4, ease: "linear", repeat: Infinity }}
						/>
					</div>
				)}
			</motion.div>
		</motion.div>
	);
}