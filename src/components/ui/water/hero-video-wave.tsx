// src/components/ui/water/hero-video-wave.tsx

"use client";

import { useState } from "react";

interface HeroVideoWaveProps {
	videoSrc: string;
	posterSrc?: string;
	className?: string;
}

export function HeroVideoWave({
	videoSrc,
	posterSrc = "/media/images/video-poster.jpg",
	className = ""
}: HeroVideoWaveProps) {
	const [isLoaded, setIsLoaded] = useState(false);

	return (
		<div className={`relative w-full h-full ${className}`}>
			{/* Poster while loading */}
			{!isLoaded && posterSrc && (
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: `url(${posterSrc})` }}
				/>
			)}

			{/* Video */}
			<video
				autoPlay
				loop
				muted
				playsInline
				className="absolute inset-0 w-full h-full object-cover"
				poster={posterSrc}
				onLoadedData={() => setIsLoaded(true)}
			>
				<source src={videoSrc} type="video/mp4" />
			</video>

			{/* Dark gradient overlay - only on video, below SVG */}
			<div className="absolute inset-0 bg-linear-to-b from-black/90 via-black/80 to-black/30 z-[1]" />

			{/* Static wave overlay at bottom - fills with bg-background, above gradient */}
			<svg
				className="absolute rotate-180 bottom-0 left-0 w-full h-24 md:h-32 pointer-events-none z-10"
				viewBox="0 0 1200 120"
				preserveAspectRatio="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill="currentColor"
					className="text-background"
					d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
				/>
			</svg>
		</div>
	);
}