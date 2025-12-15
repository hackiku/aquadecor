// @ts-nocheck
// src/app/(website)/calculator/_world/BackgroundPanel.tsx
"use client";

import { useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BackgroundPanelProps {
	width: number;
	height: number;
	textureUrl?: string;
}

export function BackgroundPanel({ width, height, textureUrl }: BackgroundPanelProps) {
	const meshRef = useRef<THREE.Mesh>(null);

	// Load all maps at once - static PBR maps + dynamic color texture
	const maps = useTexture({
		// colorMap: textureUrl || "/3d/pics/b-1-amazonian-tree-trunk.jpg",
		// colorMap: textureUrl || "/3d/pics/bg.png",
		colorMap: "/3d/pics/bg.png",
		normalMap: "/3d/textures/NormalMap.png",
		displacementMap: "/3d/textures/DisplacementMap.png",
		aoMap: "/3d/textures/AmbientOcclusionMap.png",
		roughnessMap: "/3d/textures/SpecularMap.png",
	});

	// Configure all textures for proper tiling and aspect ratio
	useEffect(() => {
		const allTextures = Object.values(maps);

		allTextures.forEach((tex) => {
			if (!tex || !tex.image) return;

			// Conservative texture settings to prevent GPU overload
			tex.generateMipmaps = true;
			tex.minFilter = THREE.LinearMipmapLinearFilter;
			tex.magFilter = THREE.LinearFilter;
			tex.anisotropy = 2; // Reduced from 4 - less GPU memory

			// Set wrapping mode for tiling
			tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
			tex.colorSpace = THREE.SRGBColorSpace;

			// Type-safe image dimension access
			const imgElement = tex.image as HTMLImageElement;
			const texWidth = imgElement.width || 1024;
			const texHeight = imgElement.height || 1024;

			// Log large textures
			if (texWidth > 2048 || texHeight > 2048) {
				console.warn(`[BackgroundPanel] Large texture: ${texWidth}x${texHeight} - GPU memory intensive`);
			}

			// Aspect-correct scaling to prevent stretching
			const w = width / 10;
			const h = height / 10;
			const wallAspect = w / h;
			const imageAspect = texWidth / texHeight;

			if (wallAspect > imageAspect) {
				// Wall is wider than texture - fit height, crop width
				tex.repeat.set(1, imageAspect / wallAspect);
				tex.offset.set(0, (1 - tex.repeat.y) / 2);
			} else {
				// Wall is taller than texture - fit width, crop height
				tex.repeat.set(wallAspect / imageAspect, 1);
				tex.offset.set((1 - tex.repeat.x) / 2, 0);
			}

			tex.needsUpdate = true;
		});

		// CRITICAL: Cleanup function to dispose textures on unmount
		return () => {
			allTextures.forEach((tex) => {
				if (tex) {
					tex.dispose();
				}
			});
		};
	}, [width, height, maps]);

	const w = width / 10;
	const h = height / 10;

	return (
		<mesh ref={meshRef} receiveShadow castShadow>
			{/* Reduced to 64x64 from 128x128 - 75% fewer vertices */}
			<planeGeometry args={[w, h, 64, 64]} />
			<meshStandardMaterial
				// Color texture (the actual photo)
				map={maps.colorMap}

				// Normal map for surface detail bumps
				normalMap={maps.normalMap}
				normalScale={new THREE.Vector2(1.2, 1.2)} // Reduced from 1.5

				// Displacement for actual 3D geometry deformation
				displacementMap={maps.displacementMap}
				displacementScale={0.15} // Reduced from 0.2 - less GPU work
				displacementBias={-0.08}

				// Ambient occlusion for shadow detail
				aoMap={maps.aoMap}
				aoMapIntensity={1.0} // Reduced from 1.2

				// Roughness/specular for shininess control
				roughnessMap={maps.roughnessMap}
				roughness={0.85}
				metalness={0.05}

				side={THREE.DoubleSide}
			/>
		</mesh>
	);
}