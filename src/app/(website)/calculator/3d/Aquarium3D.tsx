// src/app/calculator/3d/Aquarium3D.tsx

"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";
import { Slider } from "~/components/ui/slider";

interface AquariumProps {
	width?: number;
	height?: number;
	depth?: number;
}

function AquariumTank({ width = 100, height = 50, depth = 40 }: AquariumProps) {
	// Convert cm to three.js units
	const w = width / 10;
	const h = height / 10;
	const d = depth / 10;

	return (
		<group>
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

export function Aquarium3D() {
	const [dimensions, setDimensions] = useState({
		width: 100,
		height: 50,
		depth: 40,
	});

	const estimatedPrice = Math.round((dimensions.width * dimensions.height) / 100 * 2.5);
	const squareMeters = ((dimensions.width * dimensions.height) / 10000).toFixed(2);

	return (
		<div className="w-full h-[600px] rounded-xl overflow-hidden bg-linear-to-b from-background to-accent/5 flex flex-col lg:flex-row">
			{/* 3D Canvas - takes remaining space */}
			<div className="flex-1 relative">
				<Canvas
					camera={{ position: [8, 4, 8], fov: 50 }}
					gl={{
						antialias: true,
						alpha: true,
						powerPreference: "high-performance",
						failIfMajorPerformanceCaveat: false
					}}
					dpr={[1, 2]}
				>
					<color attach="background" args={["#0f0f0f"]} />
					<fog attach="fog" args={["#0f0f0f", 10, 30]} />

					<ambientLight intensity={0.4} />
					<directionalLight position={[10, 10, 5]} intensity={0.8} />
					<pointLight position={[-10, 5, -5]} intensity={0.3} color="#3781C2" />

					<AquariumTank {...dimensions} />

					<Environment preset="apartment" />
					<OrbitControls
						enablePan={false}
						enableZoom={true}
						minDistance={5}
						maxDistance={15}
						minPolarAngle={Math.PI / 6}
						maxPolarAngle={Math.PI / 2.2}
						autoRotate
						autoRotateSpeed={0.5}
					/>
				</Canvas>
			</div>

			{/* Controls - sidebar on desktop, bottom on mobile */}
			<div className="w-full lg:w-80 bg-card/50 backdrop-blur-sm border-t lg:border-t-0 lg:border-l p-6 space-y-6">
				{/* Width */}
				<div className="space-y-3">
					<div className="flex justify-between items-center">
						<label className="text-sm font-medium font-display">Width</label>
						<span className="text-sm font-mono text-muted-foreground">{dimensions.width}cm</span>
					</div>
					<Slider
						value={[dimensions.width]}
						onValueChange={([value]) => setDimensions({ ...dimensions, width: value ?? 100 })}
						min={50}
						max={200}
						step={5}
						className="w-full"
					/>
				</div>

				{/* Height */}
				<div className="space-y-3">
					<div className="flex justify-between items-center">
						<label className="text-sm font-medium font-display">Height</label>
						<span className="text-sm font-mono text-muted-foreground">{dimensions.height}cm</span>
					</div>
					<Slider
						value={[dimensions.height]}
						onValueChange={([value]) => setDimensions({ ...dimensions, height: value ?? 50 })}
						min={30}
						max={100}
						step={5}
						className="w-full"
					/>
				</div>

				{/* Depth */}
				<div className="space-y-3">
					<div className="flex justify-between items-center">
						<label className="text-sm font-medium font-display">Depth</label>
						<span className="text-sm font-mono text-muted-foreground">{dimensions.depth}cm</span>
					</div>
					<Slider
						value={[dimensions.depth]}
						onValueChange={([value]) => setDimensions({ ...dimensions, depth: value ?? 40 })}
						min={30}
						max={80}
						step={5}
						className="w-full"
					/>
				</div>

				{/* Divider */}
				<div className="border-t pt-6">
					{/* Price */}
					<div className="space-y-2 text-center">
						<p className="text-sm text-muted-foreground font-display">Estimated Price</p>
						<p className="text-4xl font-bold text-primary font-display">
							€{estimatedPrice}
						</p>
						<p className="text-xs text-muted-foreground font-display">
							Based on {squareMeters}m² surface area
						</p>
					</div>

					{/* Dimensions summary */}
					<div className="mt-6 p-4 rounded-lg bg-muted/30 space-y-1 text-xs font-mono">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Width:</span>
							<span>{dimensions.width}cm</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Height:</span>
							<span>{dimensions.height}cm</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Depth:</span>
							<span>{dimensions.depth}cm</span>
						</div>
						<div className="flex justify-between pt-2 border-t border-muted">
							<span className="text-muted-foreground">Volume:</span>
							<span className="font-semibold">
								{Math.round((dimensions.width * dimensions.height * dimensions.depth) / 1000)}L
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}