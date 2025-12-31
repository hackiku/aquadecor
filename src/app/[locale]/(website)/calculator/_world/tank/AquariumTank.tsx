// src/app/(website)/calculator/_world/tank/AquariumTank.tsx
"use client";

import { Suspense, useRef } from "react";
import { BackgroundPanel } from "./BackgroundPanel";
import { DimensionsOverlay } from "./DimensionsOverlay";
import { Nemo } from "../objects/Nemo";
import { Dory } from "../objects/Dory";
import type { SidePanelsType } from "../../calculator-types";
import type * as THREE from "three";

interface AquariumTankProps {
	width: number;
	height: number;
	depth: number;
	hasBackground?: boolean;
	sidePanels?: SidePanelsType;
	sidePanelWidth?: number;
	showDimensions?: boolean;
	baseColor?: string;
}

export function AquariumTank({
	width = 100,
	height = 50,
	depth = 40,
	hasBackground = false,
	sidePanels = "none",
	sidePanelWidth = 40,
	showDimensions = true,
	baseColor = "#6B5D52",
}: AquariumTankProps) {
	// Convert cm to decimeters for Three.js world units
	const w = width / 10;
	const h = height / 10;
	const d = depth / 10;

	// Fish refs for collision avoidance
	const nemoRef = useRef<THREE.Group>(null);
	const doryRef = useRef<THREE.Group>(null);

	return (
		<group>
			{/* PROCEDURAL ROCK BACKGROUND - Appears when design selected! */}
			{hasBackground && (
				<Suspense fallback={null}>
					<group position={[0, 0, -d / 2 + 0.05]}>
						<BackgroundPanel
							width={width}
							height={height}
							depth={2}
							sidePanels={sidePanels}
							sidePanelWidth={sidePanelWidth}
							baseColor={baseColor}
						/>
					</group>
				</Suspense>
			)}

			{/* THE FISH - Always swimming */}
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

			{/* TANK FRAMES */}
			<mesh position={[0, h / 2, 0]}>
				<boxGeometry args={[w * 1.02, 0.15, d * 1.02]} />
				<meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
			</mesh>
			<mesh position={[0, -h / 2, 0]}>
				<boxGeometry args={[w * 1.02, 0.15, d * 1.02]} />
				<meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
			</mesh>

			{/* SUBSTRATE (Sand/Gravel) */}
			<mesh position={[0, -h / 2 + 0.15, 0]}>
				<boxGeometry args={[w * 0.98, 0.2, d * 0.98]} />
				<meshStandardMaterial color="#E3DAC9" roughness={1} metalness={0} />
			</mesh>

			{/* DIMENSIONS OVERLAY (Optional) */}
			{showDimensions && (
				<DimensionsOverlay width={width} height={height} depth={depth} />
			)}
		</group>
	);
}