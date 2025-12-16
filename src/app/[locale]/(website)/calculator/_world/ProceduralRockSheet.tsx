// src/app/(website)/calculator/_world/ProceduralRockSheet.tsx
"use client";

import { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { displaceGeometryToRock } from "./rockGeometry";

interface ProceduralRockSheetProps {
	width: number;      // cm
	height: number;     // cm
	thickness?: number; // cm (base wall thickness)
	relief?: number;    // cm (max depth of rocks sticking out)
	color?: string;
	seed?: number;
	bias?: number;      // -1 to 1 (grow direction)
}

export function ProceduralRockSheet({
	width,
	height,
	thickness = 2,
	relief = 15,
	color = "#6B5D52",
	seed = 123,
	bias = 0,
}: ProceduralRockSheetProps) {
	const meshRef = useRef<THREE.Mesh>(null);

	// Convert cm to dm (Three.js units in this project)
	const w = width / 10;
	const h = height / 10;
	const t = thickness / 10;

	// Generate unique geometry when dimensions or parameters change
	const geometry = useMemo(() => {
		// Resolution: higher = more detail, lower = faster
		// We need high segments for the displacement to look good
		const segmentsX = Math.round(width / 1.5); // 1 vertex every 1.5cm
		const segmentsY = Math.round(height / 1.5);
		const segmentsZ = 1; // Sides don't need detail

		const geo = new THREE.BoxGeometry(w, h, t, segmentsX, segmentsY, segmentsZ);

		// Apply the rocky displacement
		displaceGeometryToRock(geo, {
			seed,
			scale: 1.2,        // Noise frequency
			amplitude: relief, // How far rocks protrude
			bias,              // Left/Right growth
			thickness: thickness // pass original cm thickness for logic
		});

		return geo;
	}, [width, height, thickness, relief, seed, bias, w, h, t]);

	return (
		<group>
			<mesh
				ref={meshRef}
				geometry={geometry}
				castShadow
				receiveShadow
			>
				{/* "Wet Stone" Material Look */}
				<meshPhysicalMaterial
					color={color}
					roughness={0.4}       // Somewhat smooth (wet)
					metalness={0.1}       // Stone isn't metal
					clearcoat={0.3}       // The "wet" layer
					clearcoatRoughness={0.2}
					reflectivity={0.2}
					flatShading={false}   // Smooth normals for organic look
				/>
			</mesh>

			{/* Optional: Add a backing plate to ensure no light leaks behind */}
			<mesh position={[0, 0, -t / 2 - 0.01]}>
				<planeGeometry args={[w, h]} />
				<meshBasicMaterial color="#000" />
			</mesh>
		</group>
	);
}