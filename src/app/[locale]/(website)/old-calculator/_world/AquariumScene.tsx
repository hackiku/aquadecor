// src/app/(website)/calculator/_world/AquariumScene.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { useState, Suspense } from "react";
import { Pause, RefreshCwIcon } from "lucide-react";
import { BackgroundPanel } from "./BackgroundPanel";
import { DimensionsOverlay } from "./DimensionsOverlay";
import { Fish } from "./Fish";
import type { SidePanelsType } from "../calculator-types";
import { Dory } from "./Dory";
import { Nemo } from "./Nemo";

interface AquariumSceneProps {
	width: number;
	height: number;
	depth: number;
	showControls?: boolean;
	sidePanels?: SidePanelsType;
	sidePanelWidth?: number;
	isEmpty?: boolean;
	// Legacy texture props - IGNORED
	backgroundTexture?: string;
	subcategoryTexture?: string;
}

function AquariumTank({
	width = 100,
	height = 50,
	depth = 40,
	sidePanels = "none",
	sidePanelWidth = 40,
	isEmpty = false,
}: Omit<AquariumSceneProps, 'showControls' | 'backgroundTexture' | 'subcategoryTexture'>) {
	// Convert cm to decimeters
	const w = width / 10;
	const h = height / 10;
	const d = depth / 10;

	// 🎨 PLACEHOLDER COLOR - No dynamic extraction, no texture loading
	const ROCK_COLOR = "#6B5D52";

	return (
		<group>
			{/* PROCEDURAL ROCK BACKGROUND */}
			<Suspense fallback={null}>
				<group position={[0, 0, -d / 2 + 0.05]}>
					<BackgroundPanel
						width={width}
						height={height}
						depth={2}
						sidePanels={sidePanels}
						sidePanelWidth={sidePanelWidth}
						baseColor={ROCK_COLOR}
					/>
				</group>
			</Suspense>

			{/* THE FISH */}
			<Suspense fallback={null}>
				<Nemo
					tankWidth={width}
					tankHeight={height}
					tankDepth={depth}
				/>
			</Suspense>

			<Suspense fallback={null}>
				<Dory
					tankWidth={width}
					tankHeight={height}
					tankDepth={depth}
				/>
			</Suspense>
			
			{/* <Suspense fallback={null}>
				<Fish
					tankWidth={width}
					tankHeight={height}
					tankDepth={depth}
				/>
			</Suspense> */}

			{/* WATER VOLUME */}
			<mesh position={[0, -h * 0.05, 0]}>
				<boxGeometry args={[w * 0.98, h * 0.92, d * 0.98]} />
				<meshPhysicalMaterial
					color="#3781C2"
					transparent
					opacity={0.3}
					roughness={0.1}
					metalness={0.1}
					transmission={0.8}
					thickness={2}
					ior={1.33}
				/>
			</mesh>

			{/* GLASS WALLS */}
			<mesh>
				<boxGeometry args={[w, h, d]} />
				<meshPhysicalMaterial
					color="#87CEEB"
					transparent
					opacity={0.1}
					roughness={0.0}
					metalness={0.2}
					transmission={0.98}
					thickness={0.1}
					side={2}
				/>
			</mesh>

			{/* FRAMES */}
			<mesh position={[0, h / 2, 0]}>
				<boxGeometry args={[w * 1.02, 0.15, d * 1.02]} />
				<meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
			</mesh>
			<mesh position={[0, -h / 2, 0]}>
				<boxGeometry args={[w * 1.02, 0.15, d * 1.02]} />
				<meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
			</mesh>

			{/* SUBSTRATE */}
			<mesh position={[0, -h / 2 + 0.15, 0]}>
				<boxGeometry args={[w * 0.98, 0.2, d * 0.98]} />
				<meshStandardMaterial color="#E3DAC9" roughness={1} metalness={0} />
			</mesh>

			{/* DIMENSIONS OVERLAY */}
			<DimensionsOverlay width={width} height={height} depth={depth} />
		</group>
	);
}

export function AquariumScene({
	width = 100,
	height = 50,
	depth = 40,
	showControls = true,
	sidePanels = "none",
	sidePanelWidth = 40,
	isEmpty = false,
	// Texture props ignored
	backgroundTexture,
	subcategoryTexture,
}: AquariumSceneProps) {
	const [autoRotate, setAutoRotate] = useState(true);

	// Calculate stats
	const volumeL = Math.round((width * height * depth) / 1000);
	const surfaceM2 = ((width * height) / 10000).toFixed(2);

	return (
		<div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950">
			<Canvas
				camera={{ position: [8, 5, 10], fov: 45 }}
				resize={{ debounce: 50 }} // trying context loss fix
				frameloop="always"
				gl={{
					antialias: true,
					alpha: false,
					powerPreference: "high-performance",
				}}
				dpr={[1, 1.5]}
				shadows
			>
				<color attach="background" args={["#09090b"]} />
				<fog attach="fog" args={["#09090b", 10, 40]} />

				{/* Lighting */}
				<ambientLight intensity={0.5} />
				<directionalLight
					position={[5, 10, 5]}
					intensity={1.5}
					castShadow
					shadow-mapSize={[1024, 1024]}
				/>
				<pointLight position={[0, 5, -5]} intensity={0.5} color="#00aaee" />

				<Suspense fallback={null}>
					<AquariumTank
						width={width}
						height={height}
						depth={depth}
						sidePanels={sidePanels}
						sidePanelWidth={sidePanelWidth}
						isEmpty={isEmpty}
					/>

					<ContactShadows
						position={[0, -height / 20 - 0.1, 0]}
						opacity={0.4}
						scale={20}
						blur={2}
						far={4}
					/>
				</Suspense>

				<Environment preset="city" blur={0.8} />

				<OrbitControls
					enablePan={false}
					enableZoom={true}
					minDistance={5}
					maxDistance={20}
					minPolarAngle={Math.PI / 6}
					maxPolarAngle={Math.PI / 2.1}
					autoRotate={autoRotate}
					autoRotateSpeed={0.8}
					makeDefault
				/>
			</Canvas>

			{/* UI CONTROLS */}
			{showControls && (
				<>
					{/* Auto-rotate toggle */}
					<div
						onClick={() => setAutoRotate(!autoRotate)}
						className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium hover:bg-black/80 transition-all cursor-pointer flex gap-2 items-center group shadow-lg"
						role="button"
					>
						{autoRotate ? (
							<>
								<RefreshCwIcon className="w-3.5 h-3.5 animate-spin-slow" />
								<span>Rotating</span>
							</>
						) : (
							<>
								<Pause className="w-3.5 h-3.5" />
								<span>Paused</span>
							</>
						)}
					</div>

					{/* Stats Badge */}
					<div className="absolute top-2 left-2 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs space-y-1 shadow-lg pointer-events-none">
						<div className="flex items-center gap-3 justify-between">
							{/* <span className="text-white/50">Area</span> */}
							<span className="font-mono">{surfaceM2}m²</span>
							{/* <span>•</span> */}
							<span className="font-mono">{volumeL}L</span>
						</div>
						{/* <div className="flex items-center gap-3 justify-between border-t border-white/10 pt-1 mt-1">
							<span className="text-white/50">Vol</span>
							<span className="font-mono">{volumeL}L</span>
						</div> */}
					</div>
				</>
			)}
		</div>
	);
}