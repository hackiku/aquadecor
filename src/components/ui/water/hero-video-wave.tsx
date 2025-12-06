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
		<div className={`hero-video-wave relative w-full h-full ${className}`}>
			{/* Poster/skeleton while loading */}
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

			{/* Animated wave cutout at bottom */}
			<svg
				className="absolute bottom-0 left-0 w-full h-24 md:h-32 pointer-events-none"
				viewBox="0 0 1200 120"
				preserveAspectRatio="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill="currentColor"
					className="text-background"
					d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
				>
					<animate
						attributeName="d"
						dur="10s"
						repeatCount="indefinite"
						values="
							M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z;
							M300,60c60-8,120-25,180-38,85-15,170-18,255-2,80,15,165,55,245,75,72,18,150,25,220,5V0H0V30C100,45,200,70,300,60Z;
							M340,50c55-12,110-28,168-40,80-18,165-20,248-5,82,15,160,60,240,80,68,17,145,28,210,8V0H0V25C110,40,220,62,340,50Z;
							M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z
						"
					/>
				</path>
			</svg>

			<style jsx>{`
				.hero-video-wave {
					clip-path: polygon(
						0 0,
						100% 0,
						100% calc(100% - 6rem),
						0 calc(100% - 6rem)
					);
				}

				@media (max-width: 768px) {
					.hero-video-wave {
						clip-path: polygon(
							0 0,
							100% 0,
							100% calc(100% - 4rem),
							0 calc(100% - 4rem)
						);
					}
				}
			`}</style>
		</div>
	);
}