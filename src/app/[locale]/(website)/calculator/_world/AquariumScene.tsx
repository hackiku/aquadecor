// src/app/(website)/calculator/_world/AquariumScene.tsx

"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useState, Suspense } from "react";
import * as THREE from "three";
import { Pause, RefreshCwIcon } from "lucide-react";

interface AquariumSceneProps {
	width: number;
	height: number;
	depth: number;
	backgroundTexture?: string; // CDN URL for background texture
	subcategoryTexture?: string; // CDN URL for subcategory texture (higher priority)
}

function BackgroundPlane({ width, height, depth, textureUrl }: {
	width: number;
	height: number;
	depth: number;
	textureUrl?: string;
}) {
	// Convert cm to three.js units
	const w = width / 10;
	const h = height / 10;
	const d = depth / 10;

	// Try to load texture, fallback to solid color if fails
	let texture: THREE.Texture | null = null;

	try {
		if (textureUrl) {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			texture = useLoader(THREE.TextureLoader, textureUrl);
			// Configure texture
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			// Adjust repeat based on aspect ratio to prevent stretching
			const aspectRatio = w / h;
			texture.repeat.set(aspectRatio * 0.5, 0.5);
		}
	} catch (error) {
		console.warn("Failed to load background texture:", error);
		texture = null;
	}

	return (
		<mesh position={[0, 0, -d / 2 + 0.02]} rotation={[0, 0, 0]}>
			<planeGeometry args={[w * 0.95, h * 0.9]} />
			{texture ? (
				<meshStandardMaterial
					map={texture}
					roughness={0.8}
					metalness={0.1}
				/>
			) : (
				<meshStandardMaterial
					color="#6B5B4A"
					roughness={0.9}
					metalness={0.05}
				/>
			)}
		</mesh>
	);
}

function AquariumTank({
	width = 100,
	height = 50,
	depth = 40,
	backgroundTexture,
	subcategoryTexture,
}: AquariumSceneProps) {
	// Convert cm to three.js units (divide by 10 for scale)
	const w = width / 10;
	const h = height / 10;
	const d = depth / 10;

	// Use subcategory texture if available, otherwise category texture
	const activeTexture = subcategoryTexture || backgroundTexture;

	return (
		<group>
			{/* Background texture plane - BEHIND water */}
			<Suspense fallback={null}>
				<BackgroundPlane
					width={width}
					height={height}
					depth={depth}
					textureUrl={activeTexture}
				/>
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
					side={THREE.DoubleSide}
				/>
			</mesh>

			{/* Frame - just top and bottom edges */}
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
	width,
	height,
	depth,
	backgroundTexture,
	subcategoryTexture,
}: AquariumSceneProps) {
	const [autoRotate, setAutoRotate] = useState(true);

	// Calculate volume and surface area for debug
	const volumeL = Math.round((width * height * depth) / 1000);
	const surfaceM2 = ((width * height) / 10000).toFixed(2);

	return (
		<div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-background to-accent/5">
			{/* 3D Canvas */}
			<Canvas
				camera={{ position: [8, 4, 8], fov: 50 }}
				gl={{
					antialias: true,
					alpha: true,
					powerPreference: "high-performance",
					failIfMajorPerformanceCaveat: false,
				}}
				dpr={[1, 2]}
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
				/>
			</Canvas>


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
				{ autoRotate ? (
					<div className="flex gap-1">
						<RefreshCwIcon className="w-4 h-4"/> Auto
					</div>
					
				) : (
					<div className="flex gap-1">
							<Pause className="w-4 h-4" /> Paused
					</div>
				)}
			</div>
			{/* Debug overlay - bottom right */}
			<div className="absolute bottom-3 right-3 space-y-2 pointer-events-auto">
				{/* AutoRotate toggle */}


				{/* Dimensions debug */}
				<div className="px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 text-white text-xs font-mono space-y-1">
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
				</div>
			</div>

			{/* Texture indicator */}
			{/* {(backgroundTexture || subcategoryTexture) && (
				<div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 text-white text-xs font-display font-light">
					{subcategoryTexture ? "📐 Design Preview" : "🎨 Category Preview"}
				</div>
			)} */}
		</div>
	);
}