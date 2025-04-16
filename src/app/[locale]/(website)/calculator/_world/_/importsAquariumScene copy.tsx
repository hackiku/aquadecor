
// src/app/(website)/calculator/_world/AquariumScene.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import { useState, Suspense } from "react";
import * as THREE from "three";
import { Pause, RefreshCwIcon, Loader2 } from "lucide-react";
import { BackgroundPanel } from "./BackgroundPanel";

interface AquariumSceneProps {
	width: number;
	height: number;
	depth: number;
	backgroundTexture?: string;
	subcategoryTexture?: string;
	showControls?: boolean; // NEW PROP
}

function TankStructure({ width, height, depth }: { width: number; height: number; depth: number }) {
	const w = width / 10;
	const h = height / 10;
	const d = depth / 10;

	return (
		<group>
			{/* Water Volume */}
			<mesh position={[0, -h * 0.05, 0]}>
				<boxGeometry args={[w * 0.99, h * 0.9, d * 0.99]} />
				<meshPhysicalMaterial
					color="#3781C2"
					transparent
					opacity={0.2}
					roughness={0}
					metalness={0.1}
					transmission={0.95}
					thickness={1}
					ior={1.33}
				/>
			</mesh>

			{/* Glass Edges */}
			<mesh>
				<boxGeometry args={[w, h, d]} />
				<meshPhysicalMaterial
					color="#ffffff"
					transparent
					opacity={0.15}
					roughness={0.1}
					metalness={0.5}
					transmission={1}
					side={THREE.BackSide}
				/>
			</mesh>

			{/* Sand */}
			<mesh position={[0, -h / 2 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
				<planeGeometry args={[w, d]} />
				<meshStandardMaterial color="#C2B280" roughness={1} />
			</mesh>
		</group>
	);
}

export function AquariumScene({
	width,
	height,
	depth,
	backgroundTexture,
	subcategoryTexture,
	showControls = true, // Default to true
}: AquariumSceneProps) {
	const [autoRotate, setAutoRotate] = useState(true);

	const activeTexture = subcategoryTexture || backgroundTexture;

	return (
		<div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-950">
			<Canvas
				shadows
				dpr={[1, 2]}
				gl={{
					antialias: true,
					toneMapping: THREE.ACESFilmicToneMapping,
					toneMappingExposure: 1.2
				}}
			>
				<PerspectiveCamera makeDefault position={[8, 5, 12]} fov={45} />

				<ambientLight intensity={0.4} />
				<spotLight
					position={[10, 15, 10]}
					angle={0.3}
					penumbra={1}
					intensity={1.5}
					castShadow
					shadow-bias={-0.0001}
				/>
				<pointLight position={[-10, 5, -5]} intensity={0.5} color="#3781C2" />

				<Suspense fallback={null}>
					<group position={[0, 0, 0]}>
						<group position={[0, 0, -depth / 20]}>
							{activeTexture && (
								<BackgroundPanel
									width={width}
									height={height}
									textureUrl={activeTexture}
								/>
							)}
						</group>
						<TankStructure width={width} height={height} depth={depth} />
					</group>
					<Environment preset="city" />
				</Suspense>

				<OrbitControls
					enablePan={false}
					enableZoom={showControls} // Disable zoom in mini mode too
					minDistance={5}
					maxDistance={20}
					minPolarAngle={0}
					maxPolarAngle={Math.PI / 2.1}
					autoRotate={autoRotate}
					autoRotateSpeed={0.8}
				/>
			</Canvas>

			{/* Loading Overlay */}
			<Suspense fallback={
				<div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20">
					<Loader2 className="w-8 h-8 text-white animate-spin" />
				</div>
			}>
				<></>
			</Suspense>

			{/* Controls UI - Only render if showControls is true */}
			{showControls && (
				<div className="absolute bottom-3 left-3 z-10">
					<button
						onClick={(e) => {
							e.stopPropagation(); // Stop click from bubbling up
							setAutoRotate(!autoRotate);
						}}
						className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs font-display backdrop-blur-md border border-white/10 hover:bg-black/70 transition-colors cursor-pointer"
					>
						{autoRotate ? <Pause className="w-3 h-3" /> : <RefreshCwIcon className="w-3 h-3" />}
						{autoRotate ? "Pause" : "Rotate"}
					</button>
				</div>
			)}
		</div>
	);
}