// src/app/(website)/calculator/_world/ProceduralRockSheet.tsx
"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { displaceGeometryToRock, type EdgeMask } from "./rockGeometry";

interface ProceduralRockSheetProps {
	width: number;
	height: number;
	thickness?: number;
	relief?: number;
	color?: string;
	seed?: number;
	bias?: number;
	edgeMask?: EdgeMask; // <--- Add this
}

export function ProceduralRockSheet({
	width,
	height,
	thickness = 2,
	relief = 15,
	color = "#6B5D52",
	seed = 123,
	bias = 0,
	edgeMask, // <--- Destructure this
}: ProceduralRockSheetProps) {
	const meshRef = useRef<THREE.Mesh>(null);
	const w = width / 10;
	const h = height / 10;
	const t = thickness / 10;

	const geometry = useMemo(() => {
		const segmentsX = Math.round(width / 1.5);
		const segmentsY = Math.round(height / 1.5);
		const geo = new THREE.BoxGeometry(w, h, t, segmentsX, segmentsY, 1);

		displaceGeometryToRock(geo, {
			seed,
			scale: 1.2,
			amplitude: relief,
			bias,
			thickness,
			edgeSmoothing: 0.15,
			edgeMask // <--- Pass it down
		});

		return geo;
	}, [width, height, thickness, relief, seed, bias, w, h, t, edgeMask]); // Add to dependency array

	return (
		<group>
			<mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
				<meshPhysicalMaterial
					color={color}
					roughness={0.4}
					metalness={0.1}
					clearcoat={0.3}
					clearcoatRoughness={0.2}
					reflectivity={0.2}
					flatShading={false}
				/>
			</mesh>
			<mesh position={[0, 0, -t / 2 - 0.01]}>
				<planeGeometry args={[w, h]} />
				<meshBasicMaterial color="#000" />
			</mesh>
		</group>
	);
}