// src/components/proof/QuickShoutout.tsx

"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Play, Pause } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface QuickReview {
	id: string;
	quote: string;
	author: string;
	location?: string;
	source: string;
	sourceUrl?: string;
	avatar?: string;
}

const REVIEWS: QuickReview[] = [
	{
		id: "1",
		quote: "Every single person that has seen it has thought that it was real wood and rocks that I cut and assembled together",
		author: "Kevin 'fishbubbles'",
		location: "Florida",
		source: "Forum",
		sourceUrl: "https://forum.simplydiscus.com/forum/main-discus-topics/hardware-technical-and-do-it-yourself/tanks-and-equipment/101677-the-costs-of-setting-up-and-maintaining-a-265-gallon-discus-tank",
		avatar: "/assets/avatars/kevin-fishbubbles.jpg",
	},
	{
		id: "2",
		quote: "The hand-painted details really stand out and make this background a work of art",
		// quote: "It has a Styrofoam core, but on the surface it feels just like a rock.",
		author: "Joey Mullen (King of DIY)",
		location: "Canada",
		source: "YouTube",
		sourceUrl: "https://www.youtube.com/watch?v=1vYBlkf1zKo",
		avatar: "/assets/avatars/king-of-diy.png",
	},
	{
		id: "3",
		quote: "The detail is insane. feels like real rock/wood, custom fit, and the painting is spot-on for a natural look",
		author: "Joe (XPriceTagX)",
		location: "Ohio, USA",
		source: "YouTube",
		sourceUrl: "https://www.youtube.com/watch?v=YgHs8n49ZYI",
		avatar: "/assets/avatars/joe-XPriceTagX.webp",
	},
	{
		id: "4",
		quote: "Absolutely stunning craftsmanship. Looks so natural that my guests ask where I collected the rocks from",
		author: "Marcus T.",
		location: "Germany",
		source: "Email",
		avatar: "/media/avatars/placeholder-4.jpg",
	},
];

interface QuickShoutoutProps {
	onSlideChange?: () => void;
	isPaused?: boolean;
	onPauseChange?: (paused: boolean) => void;
}

export function QuickShoutout({ onSlideChange, isPaused: externalPaused, onPauseChange }: QuickShoutoutProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [internalPaused, setInternalPaused] = useState(false);

	const isPaused = externalPaused !== undefined ? externalPaused : internalPaused;
	const setPaused = onPauseChange || setInternalPaused;

	const currentReview = REVIEWS[currentIndex];

	// Trigger callback when index changes
	useEffect(() => {
		onSlideChange?.();
	}, [currentIndex, onSlideChange]);

	// Auto-rotate every 4 seconds when not paused
	useEffect(() => {
		if (isPaused) return;

		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
		}, 4000);

		return () => clearInterval(interval);
	}, [isPaused]);

	const handlePrevious = () => {
		setCurrentIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
	};

	const togglePause = () => {
		setPaused(!isPaused);
	};

	if (!currentReview) return null;

	return (
		<div className="flex flex-col gap-4 w-[320px] md:w-[360px]">
			{/* Quote box - text aligned left */}
			<div className="relative  p-2 overflow-hidden">
				<blockquote className="text-white font-display font-light text-sm leading-relaxed text-left mb-4">
					"{currentReview.quote}"
				</blockquote>

				{/* Animated underline at bottom of box */}
				<motion.div
					className="absolute bottom-0 left-0 h-0.5 bg-primary"
					initial={{ width: "0%" }}
					animate={{ width: isPaused ? "0%" : "100%" }}
					transition={{ duration: 4, ease: "linear" }}
					key={`underline-${currentIndex}-${isPaused}`}
				/>
			</div>

			{/* Row: Avatar | Name/Location/Link | Controls */}
			<div className="flex items-center gap-3">
				{/* Avatar */}
				<div className="relative w-12 h-12 rounded-full bg-zinc-800 overflow-hidden shrink-0 border-2 border-primary shadow-lg">
					{currentReview.avatar ? (
						<Image
							src={currentReview.avatar}
							alt={currentReview.author}
							fill
							className="object-cover"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-white text-lg font-display font-bold">
							{currentReview.author[0]}
						</div>
					)}
				</div>

				{/* Name, Location, Link (2 rows) */}
				<div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
					<p className="text-white text-sm font-display font-medium truncate">
						{currentReview.author}
					</p>
					<div className="flex items-center gap-2 flex-wrap text-xs">
						{currentReview.location && (
							<span className="text-zinc-400 font-display font-light">
								{currentReview.location}
							</span>
						)}
						{currentReview.location && currentReview.sourceUrl && (
							<span className="text-zinc-600">•</span>
						)}
						{currentReview.sourceUrl && (
							<Link
								href={currentReview.sourceUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary font-display font-medium hover:underline inline-flex items-center gap-1"
							>
								{currentReview.source}
								<ExternalLink className="h-2.5 w-2.5" />
							</Link>
						)}
					</div>
				</div>

				{/* Controls */}
				<div className="flex items-center gap-1 shrink-0">
					<button
						onClick={handlePrevious}
						className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
						aria-label="Previous review"
					>
						<ChevronLeft className="h-4 w-4" />
					</button>
					<button
						onClick={togglePause}
						className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
						aria-label={isPaused ? "Play" : "Pause"}
					>
						{isPaused ? <Play className="h-3 w-3 ml-0.5" /> : <Pause className="h-3 w-3" />}
					</button>
					<button
						onClick={handleNext}
						className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
						aria-label="Next review"
					>
						<ChevronRight className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
}