// src/app/(website)/calculator/_world/AquariumScene.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useState, Suspense } from "react";
import { Pause, RefreshCwIcon } from "lucide-react";
import { BackgroundPanel } from "./BackgroundPanel";
import type { SidePanelsType } from "../calculator-types";

interface AquariumSceneProps {
	width: number;
	height: number;
	depth: number;
	backgroundTexture?: string;
	subcategoryTexture?: string;
	showControls?: boolean;
	// NEW: Side panel props
	sidePanels?: SidePanelsType;
	sidePanelWidth?: number;
	isEmpty?: boolean; // NEW: Show empty state if no subcategory selected
}

function AquariumTank({
	width = 100,
	height = 50,
	depth = 40,
	backgroundTexture,
	subcategoryTexture,
	sidePanels = "none",
	sidePanelWidth = 40,
	isEmpty = false,
}: Omit<AquariumSceneProps, 'showControls'>) {
	const w = width / 10;
	const h = height / 10;
	const d = depth / 10;

	// CRITICAL: Validate URLs before passing to texture loader
	const isSafeUrl = (url?: string) => {
		if (!url) return false;
		// Only allow local paths or valid HTTP(S) URLs from known domains
		if (url.startsWith('/')) return true;
		if (url.startsWith('http') && url.includes('supabase')) return true;
		// Block broken CDN URLs
		return false;
	};

	const safeSubcategoryTexture = isSafeUrl(subcategoryTexture) ? subcategoryTexture : undefined;
	const safeBackgroundTexture = isSafeUrl(backgroundTexture) ? backgroundTexture : undefined;

	// Priority: subcategory (product) > category > fallback
	const activeTexture =
		safeSubcategoryTexture ||
		safeBackgroundTexture ||
		"/media/images/background-placeholder.png";

	return (
		<group>
			{/* Background panel with side panels support */}
			<Suspense fallback={null}>
				<group position={[0, 0, -d / 2 + 0.05]}>
					<BackgroundPanel
						width={width}
						height={height}
						depth={depth}
						textureUrl={activeTexture}
						showSidePanels={sidePanels}
						sidePanelWidth={sidePanelWidth}
						isEmpty={isEmpty}
					/>
				</group>
			</Suspense>

			{/* Water inside tank - fills ~90% */}
			<mesh position={[0, -h * 0.05, 0]}>
				<boxGeometry args={[w * 0.95, h * 0.9, d * 0.95]} />
				<meshPhysicalMaterial
					color="#3781C2"
					transparent
					opacity={0.35}
					roughness={0.1}
					metalness={0.1}
					transmission={0.6}
					thickness={2}
				/>
			</mesh>

			{/* Glass tank - thin edges */}
			<mesh>
				<boxGeometry args={[w, h, d]} />
				<meshPhysicalMaterial
					color="#87CEEB"
					transparent
					opacity={0.08}
					roughness={0.05}
					metalness={0.1}
					transmission={0.95}
					thickness={0.1}
					side={2} // THREE.DoubleSide
				/>
			</mesh>

			{/* Frame - top and bottom edges */}
			<mesh position={[0, h / 2, 0]}>
				<boxGeometry args={[w * 1.02, 0.15, d * 1.02]} />
				<meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.2} />
			</mesh>
			<mesh position={[0, -h / 2, 0]}>
				<boxGeometry args={[w * 1.02, 0.15, d * 1.02]} />
				<meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.2} />
			</mesh>

			{/* Bottom substrate */}
			<mesh position={[0, -h / 2 + 0.3, 0]}>
				<boxGeometry args={[w * 0.95, 0.5, d * 0.95]} />
				<meshStandardMaterial color="#8B7355" roughness={0.9} />
			</mesh>
		</group>
	);
}

export function AquariumScene({
	width = 100,
	height = 50,
	depth = 40,
	backgroundTexture,
	subcategoryTexture,
	showControls = true,
	sidePanels = "none",
	sidePanelWidth = 40,
	isEmpty = false,
}: AquariumSceneProps) {
	const [autoRotate, setAutoRotate] = useState(true);

	// Calculate stats for debug
	const volumeL = Math.round((width * height * depth) / 1000);
	const surfaceM2 = ((width * height) / 10000).toFixed(2);

	return (
		<div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-background to-accent/5">
			<Canvas
				camera={{ position: [8, 4, 8], fov: 50 }}
				frameloop={autoRotate ? "always" : "demand"}
				gl={{
					antialias: true,
					alpha: true,
					powerPreference: "default",
					failIfMajorPerformanceCaveat: false,
				}}
				dpr={[1, 1.5]}
			>
				<color attach="background" args={["#0f0f0f"]} />
				<fog attach="fog" args={["#0f0f0f", 10, 30]} />

				<ambientLight intensity={0.4} />
				<directionalLight position={[10, 10, 5]} intensity={0.8} />
				<pointLight position={[-10, 5, -5]} intensity={0.3} color="#3781C2" />

				<Suspense fallback={null}>
					<AquariumTank
						width={width}
						height={height}
						depth={depth}
						backgroundTexture={backgroundTexture}
						subcategoryTexture={subcategoryTexture}
						sidePanels={sidePanels}
						sidePanelWidth={sidePanelWidth}
						isEmpty={isEmpty}
					/>
				</Suspense>

				<Environment preset="apartment" />
				<OrbitControls
					enablePan={false}
					enableZoom={true}
					minDistance={5}
					maxDistance={15}
					minPolarAngle={Math.PI / 6}
					maxPolarAngle={Math.PI / 2.2}
					autoRotate={autoRotate}
					autoRotateSpeed={0.5}
					makeDefault
				/>
			</Canvas>

			{showControls && (
				<>
					{/* Auto-rotate toggle */}
					<div
						onClick={() => setAutoRotate(!autoRotate)}
						className="absolute bottom-2 left-2 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 text-white text-xs font-display font-light hover:bg-black/80 transition-colors cursor-pointer"
						title={autoRotate ? "Disable auto-rotate" : "Enable auto-rotate"}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								setAutoRotate(!autoRotate);
							}
						}}
					>
						{autoRotate ? (
							<div className="flex gap-1 items-center">
								<RefreshCwIcon className="w-4 h-4" /> Auto
							</div>
						) : (
							<div className="flex gap-1 items-center">
								<Pause className="w-4 h-4" /> Paused
							</div>
						)}
					</div>

					{/* Debug stats */}
					<div className="absolute bottom-3 right-3 px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 text-white text-xs font-mono space-y-1">
						<div className="flex justify-between gap-4">
							<span className="text-white/60">W×H×D:</span>
							<span>{width}×{height}×{depth}cm</span>
						</div>
						<div className="flex justify-between gap-4">
							<span className="text-white/60">Area:</span>
							<span>{surfaceM2}m²</span>
						</div>
						<div className="flex justify-between gap-4">
							<span className="text-white/60">Vol:</span>
							<span>{volumeL}L</span>
						</div>
						{sidePanels !== "none" && (
							<div className="flex justify-between gap-4">
								<span className="text-white/60">Sides:</span>
								<span>{sidePanels}</span>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}