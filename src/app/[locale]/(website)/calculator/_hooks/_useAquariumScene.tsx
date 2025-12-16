// src/app/(website)/calculator/_hooks/useAquariumScene.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

interface AquariumSceneProps {
	width: number;
	height: number;
	depth: number;
	backgroundTexture?: string;
	subcategoryTexture?: string;
	showControls?: boolean;
}

// Loading placeholder component
function SceneLoader() {
	return (
		<div className= "w-full h-full flex items-center justify-center bg-gradient-to-b from-background to-accent/5 rounded-xl" >
		<div className="text-center space-y-2" >
			<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
				<p className="text-sm text-muted-foreground font-display" > Loading 3D preview...</p>
					</div>
					</div>
	);
}

/**
 * Hook to safely load AquariumScene component client-side only.
 * Prevents SSR hydration issues and WebGL context problems.
 * 
 * @example
 * const AquariumScene = useAquariumScene();
 * return <AquariumScene width={100} height={50} depth={40} />;
 */
export function useAquariumScene() {
	const [Scene, setScene] = useState<ComponentType<AquariumSceneProps> | null>(null);

	useEffect(() => {
		// Dynamic import only runs client-side
		const loadScene = async () => {
			const { AquariumScene } = await import("../_world/AquariumScene");
			setScene(() => AquariumScene);
		};

		loadScene();
	}, []);

	// Return loader until scene is ready
	if (!Scene) {
		return SceneLoader as ComponentType<AquariumSceneProps>;
	}

	return Scene;
}

/**
 * Pre-configured dynamic import for immediate use.
 * Use this if you don't need the hook pattern.
 */
export const AquariumSceneDynamic = dynamic(
	() => import("../_world/AquariumScene").then((mod) => mod.AquariumScene),
	{
		ssr: false,
		loading: () => <SceneLoader />
	}
);