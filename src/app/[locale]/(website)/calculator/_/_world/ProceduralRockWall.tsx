// src/app/(website)/calculator/_world/ProceduralRockWall.tsx
"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { generateStoneSheet, generateSidePanelSheet } from "./rockGeometry";

interface ProceduralRockWallProps {
	width: number; // cm
	height: number; // cm
	sidePanels?: "none" | "single" | "both";
	sidePanelDepth?: number; // cm
	baseColor?: string; // Hex color for stone
	segments?: number; // Mesh resolution (higher = more detail, lower = better perf)
}

/**
 * Continuous stone relief sheet (NOT separate rocks)
 * Creates a single displaced plane with bumps and cracks
 */
export function ProceduralRockWall({
	width,
	height,
	sidePanels = "none",
	sidePanelDepth = 40,
	baseColor = "#6B5D52",
	segments = 64, // Good balance of detail vs performance
}: ProceduralRockWallProps) {
	const w = width / 10;
	const h = height / 10;
	const sideD = sidePanelDepth / 10;

	// Generate main back panel geometry (only when dimensions change)
	const backGeometry = useMemo(
		() => generateStoneSheet(width, height, segments),
		[width, height, segments]
	);

	// Generate side panel geometries if needed
	const rightSideGeometry = useMemo(
		() => (sidePanels === "single" || sidePanels === "both"
			? generateSidePanelSheet(sidePanelDepth, height, Math.floor(segments * 0.75))
			: null),
		[sidePanels, sidePanelDepth, height, segments]
	);

	const leftSideGeometry = useMemo(
		() => (sidePanels === "both"
			? generateSidePanelSheet(sidePanelDepth, height, Math.floor(segments * 0.75))
			: null),
		[sidePanels, sidePanelDepth, height, segments]
	);

	// Stone material with flatShading for faceted look
	const stoneMaterial = useMemo(
		() =>
			new THREE.MeshStandardMaterial({
				color: baseColor,
				roughness: 0.9,
				metalness: 0.05,
				flatShading: true, // Creates angular facets like real carved stone
				side: THREE.DoubleSide, // Visible from both sides
			}),
		[baseColor]
	);

	return (
		<group>
			{/* Main back panel - continuous stone sheet */}
			<mesh
				geometry={backGeometry}
				material={stoneMaterial}
				position={[0, 0, 0]}
				castShadow
				receiveShadow
			/>

			{/* Right side panel - wraps around right edge */}
			{rightSideGeometry && (
				<mesh
					geometry={rightSideGeometry}
					material={stoneMaterial}
					position={[w / 2, 0, -sideD / 2]} // At right edge, extends back
					rotation={[0, Math.PI / 2, 0]} // Rotated 90° to face left
					castShadow
					receiveShadow
				/>
			)}

			{/* Left side panel - wraps around left edge */}
			{leftSideGeometry && (
				<mesh
					geometry={leftSideGeometry}
					material={stoneMaterial}
					position={[-w / 2, 0, -sideD / 2]} // At left edge, extends back
					rotation={[0, -Math.PI / 2, 0]} // Rotated 90° to face right
					castShadow
					receiveShadow
				/>
			)}

			{/* Black background plane behind sheet */}
			<mesh position={[0, 0, -0.15]}>
				<planeGeometry args={[w * 1.05, h * 1.05]} />
				<meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} />
			</mesh>
		</group>
	);
}