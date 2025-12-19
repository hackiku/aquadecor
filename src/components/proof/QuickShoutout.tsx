// src/components/proof/QuickShoutout.tsx

"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { REVIEWS_BY_LOCALE, type QuickReview } from "~/data/shoutouts";

interface QuickShoutoutProps {
	onSlideChange?: () => void;
}

export function QuickShoutout({ onSlideChange }: QuickShoutoutProps) {
	const locale = useLocale();
	// Get reviews for current locale, fallback to English
	const reviews = REVIEWS_BY_LOCALE[locale] || REVIEWS_BY_LOCALE.en || [];

	const [currentIndex, setCurrentIndex] = useState(0);
	const [progress, setProgress] = useState(0);

	const currentReview = reviews[currentIndex];

	// Trigger callback when index changes
	useEffect(() => {
		onSlideChange?.();
	}, [currentIndex, onSlideChange]);

	// Progress animation (4 seconds)
	useEffect(() => {
		setProgress(0);
		const duration = 4000;
		const interval = 50;
		const increment = (interval / duration) * 100;

		const timer = setInterval(() => {
			setProgress(prev => {
				if (prev >= 100) {
					setCurrentIndex(prevIndex => (prevIndex + 1) % reviews.length);
					return 0;
				}
				return prev + increment;
			});
		}, interval);

		return () => clearInterval(timer);
	}, [currentIndex, reviews.length]);

	const handlePrevious = () => {
		setProgress(0);
		setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
	};

	const handleNext = () => {
		setProgress(0);
		setCurrentIndex((prev) => (prev + 1) % reviews.length);
	};

	if (!currentReview) return null;

	return (
		<div className="flex flex-col gap-4 w-[320px] md:w-[360px]">
			{/* Quote box */}
			<div className="relative p-2">
				<blockquote className="text-white font-display font-light text-sm leading-relaxed text-left">
					"{currentReview.quote}"
				</blockquote>
			</div>

			{/* Row: Avatar with circular progress | Name/Location/Link | Controls */}
			<div className="flex items-center gap-3">
				{/* Avatar with circular progress */}
				<div className="relative shrink-0">
					<svg className="absolute -inset-1 w-14 h-14" viewBox="0 0 56 56">
						{/* Background circle */}
						<circle
							cx="28"
							cy="28"
							r="26"
							fill="none"
							stroke="rgba(255, 255, 255, 0.1)"
							strokeWidth="2"
						/>
						{/* Progress circle - counterclockwise */}
						<circle
							cx="28"
							cy="28"
							r="26"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							strokeLinecap="round"
							className="text-primary"
							strokeDasharray="163.36"
							strokeDashoffset={163.36 - (163.36 * progress) / 100}
							transform="rotate(-90 28 28)"
							style={{ transition: 'stroke-dashoffset 50ms linear' }}
						/>
					</svg>

					<div className="relative w-12 h-12 rounded-full bg-zinc-800 overflow-hidden border-2 border-primary shadow-lg">
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
				</div>

				{/* Name, Location, Link */}
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

				{/* Controls - larger chevrons */}
				<div className="flex items-center gap-2 shrink-0">
					<button
						onClick={handlePrevious}
						className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
						aria-label="Previous review"
					>
						<ChevronLeft className="h-6 w-6" />
					</button>
					<button
						onClick={handleNext}
						className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
						aria-label="Next review"
					>
						<ChevronRight className="h-6 w-6" />
					</button>
				</div>
			</div>
		</div>
	);
}