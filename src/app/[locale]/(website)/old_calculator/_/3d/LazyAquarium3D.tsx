// src/app/store/calculator/3d/LazyAquarium3D.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import R3F component - only loads when visible
const Aquarium3D = dynamic(
	() => import("./Aquarium3D").then((mod) => ({ default: mod.Aquarium3D })),
	{
		ssr: false,
		loading: () => (
			<div className="w-full h-[500px] rounded-xl border-2 border-border bg-linear-to-b from-background to-accent/10 flex items-center justify-center">
				<div className="text-center space-y-3">
					<div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
					<p className="text-sm text-muted-foreground font-display">Loading 3D configurator...</p>
				</div>
			</div>
		)
	}
);

export function LazyAquarium3D() {
	const [shouldLoad, setShouldLoad] = useState(false);
	const triggerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Only run on client
		if (typeof window === "undefined") return;

		const observer = new IntersectionObserver(
			(entries) => {
				// Load when element is 50% visible
				if (entries[0]?.isIntersecting) {
					setShouldLoad(true);
					observer.disconnect(); // Stop observing once loaded
				}
			},
			{
				threshold: 0.5, // Trigger when 50% visible
				rootMargin: "100px", // Start loading 100px before visible
			}
		);

		if (triggerRef.current) {
			observer.observe(triggerRef.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div ref={triggerRef} className="w-full">
			{shouldLoad ? (
				<Aquarium3D />
			) : (
				// Placeholder with exact same dimensions to prevent layout shift
				<div className="w-full h-[500px] rounded-xl border-2 border-border bg-gradient-to-b from-background to-accent/10 flex items-center justify-center">
					<div className="text-center space-y-3">
						<div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
							<svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
							</svg>
						</div>
						<p className="text-lg font-display font-medium">Interactive 3D Aquarium Configurator</p>
						<p className="text-sm text-muted-foreground font-display">Scroll down to load</p>
					</div>
				</div>
			)}
		</div>
	);
}