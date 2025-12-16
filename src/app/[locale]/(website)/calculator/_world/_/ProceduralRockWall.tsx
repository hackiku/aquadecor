// src/app/(website)/calculator/_world/ProceduralRockWall.tsx
"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { generateRockLibrary, generateRockWall, type RockInstance } from "./rockGeometry";

interface ProceduralRockWallProps {
	width: number; // cm
	height: number; // cm
	depth?: number; // cm - wall thickness
	sidePanels?: "none" | "single" | "both";
	sidePanelDepth?: number; // cm
	numRocks?: number;
	baseColor?: string; // Hex color for rocks
}

/**
 * Procedural rock wall using instanced mesh rendering
 * Generates unique rock shapes and distributes them across the background
 */
export function ProceduralRockWall({
	width,
	height,
	depth = 20, // Default wall thickness
	sidePanels = "none",
	sidePanelDepth = 40,
	numRocks = 30,
	baseColor = "#6B5D52", // Gray-brown stone
}: ProceduralRockWallProps) {
	const groupRef = useRef<THREE.Group>(null);

	// Generate rock shapes once (expensive operation)
	const rockLibrary = useMemo(() => generateRockLibrary(5), []);

	// Generate rock positions when dimensions change
	const rockInstances = useMemo(
		() => generateRockWall(width, height, depth, sidePanels, sidePanelDepth, numRocks),
		[width, height, depth, sidePanels, sidePanelDepth, numRocks]
	);

	// Group rocks by shape index for efficient rendering
	const rocksByShape = useMemo(() => {
		const grouped: Record<number, RockInstance[]> = {};

		rockInstances.forEach((rock) => {
			if (!grouped[rock.shapeIndex]) {
				grouped[rock.shapeIndex] = [];
			}
			grouped[rock.shapeIndex].push(rock);
		});

		return grouped;
	}, [rockInstances]);

	// Material with slight roughness for stone look
	const rockMaterial = useMemo(
		() =>
			new THREE.MeshStandardMaterial({
				color: baseColor,
				roughness: 0.85,
				metalness: 0.05,
				flatShading: true, // Gives faceted look
			}),
		[baseColor]
	);

	return (
		<group ref={groupRef}>
			{/* Render each rock shape as an instanced mesh */}
			{Object.entries(rocksByShape).map(([shapeIdx, rocks]) => {
				const geometry = rockLibrary[parseInt(shapeIdx)];
				if (!geometry || rocks.length === 0) return null;

				return (
					<InstancedRockGroup
						key={shapeIdx}
						geometry={geometry}
						material={rockMaterial}
						instances={rocks}
					/>
				);
			})}

			{/* Black background plane behind rocks */}
			<mesh position={[0, 0, -depth / 10 - 0.1]}>
				<planeGeometry args={[width / 10, height / 10]} />
				<meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} />
			</mesh>
		</group>
	);
}

/**
 * Individual instanced mesh group for one rock shape
 */
function InstancedRockGroup({
	geometry,
	material,
	instances,
}: {
	geometry: THREE.BufferGeometry;
	material: THREE.Material;
	instances: RockInstance[];
}) {
	const meshRef = useRef<THREE.InstancedMesh>(null);

	// Apply transformations to each instance
	useEffect(() => {
		if (!meshRef.current) return;

		const tempObject = new THREE.Object3D();

		instances.forEach((rock, i) => {
			tempObject.position.set(...rock.position);
			tempObject.rotation.set(...rock.rotation);
			tempObject.scale.setScalar(rock.scale);
			tempObject.updateMatrix();

			meshRef.current!.setMatrixAt(i, tempObject.matrix);
		});

		meshRef.current.instanceMatrix.needsUpdate = true;
	}, [instances]);

	return (
		<instancedMesh
			ref={meshRef}
			args={[geometry, material, instances.length]}
			castShadow
			receiveShadow
		/>
	);
}