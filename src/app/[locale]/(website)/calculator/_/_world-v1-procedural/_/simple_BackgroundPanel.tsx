// src/app/(website)/calculator/_world/BackgroundPanel.tsx
"use client";

import { useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

interface BackgroundPanelProps {
	width: number; // cm
	height: number; // cm
	depth?: number; // cm - used for side panel calculations
	textureUrl?: string;
	showSidePanels?: "none" | "single" | "both";
	sidePanelWidth?: number; // cm
	isEmpty?: boolean; // NEW: Show "CHOOSE BACKGROUND" state
}

/**
 * Clean photo background for aquarium - no normal maps, just beautiful images
 */
export function BackgroundPanel({
	width,
	height,
	depth = 40,
	textureUrl = "/3d/texture-placeholder.jpg",
	showSidePanels = "none",
	sidePanelWidth = 40,
	isEmpty = false,
}: BackgroundPanelProps) {
	const meshRef = useRef<THREE.Mesh>(null);
	const leftPanelRef = useRef<THREE.Mesh>(null);
	const rightPanelRef = useRef<THREE.Mesh>(null);

	const w = width / 10;
	const h = height / 10;
	const d = depth / 10;
	const sidePanelW = sidePanelWidth / 10;

	// Only load texture if NOT empty state
	const texture = useTexture(isEmpty ? "/3d/texture-placeholder.png" : textureUrl);

	// Configure texture for proper tiling and aspect ratio
	useEffect(() => {
		if (!texture || !texture.image || isEmpty) return;

		// Optimize texture settings
		texture.generateMipmaps = true;
		texture.minFilter = THREE.LinearMipmapLinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.anisotropy = 2;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.colorSpace = THREE.SRGBColorSpace;

		// Type-safe image dimension access
		const imgElement = texture.image as HTMLImageElement;
		const texWidth = imgElement.width || 1024;
		const texHeight = imgElement.height || 1024;

		// Aspect-correct scaling - "contain" mode to show full image
		const wallAspect = w / h;
		const imageAspect = texWidth / texHeight;

		if (wallAspect > imageAspect) {
			// Wall is wider - fit height, crop sides
			texture.repeat.set(1, imageAspect / wallAspect);
			texture.offset.set(0, (1 - texture.repeat.y) / 2);
		} else {
			// Wall is taller - fit width, crop top/bottom
			texture.repeat.set(wallAspect / imageAspect, 1);
			texture.offset.set((1 - texture.repeat.x) / 2, 0);
		}

		texture.needsUpdate = true;

		// Cleanup
		return () => {
			texture.dispose();
		};
	}, [width, height, texture, isEmpty, w, h]);

	// EMPTY STATE: Diagonal stripes with text
	if (isEmpty) {
		return (
			<group>
				{/* Main back panel with diagonal stripe pattern */}
				<mesh ref={meshRef} receiveShadow position={[0, 0, 0]}>
					<planeGeometry args={[w * 0.95, h * 0.9]} />
					<meshStandardMaterial
						color="#1a1a1a"
						roughness={0.9}
						metalness={0.1}
						side={THREE.DoubleSide}
					/>
				</mesh>

				{/* Diagonal stripes overlay */}
				<mesh position={[0, 0, 0.01]}>
					<planeGeometry args={[w * 0.95, h * 0.9]} />
					<meshBasicMaterial color="#2a2a2a" transparent opacity={0.5} side={THREE.DoubleSide}>
						{/* Create stripe pattern with shader or simple repeating geometry */}
					</meshBasicMaterial>
				</mesh>

				{/* Add multiple thin diagonal stripe meshes */}
				{Array.from({ length: 8 }).map((_, i) => (
					<mesh
						key={i}
						position={[
							-w * 0.5 + (i * w) / 4,
							0,
							0.02
						]}
						rotation={[0, 0, Math.PI / 4]}
					>
						<planeGeometry args={[0.3, h * 2]} />
						<meshBasicMaterial color="#333333" transparent opacity={0.3} side={THREE.DoubleSide} />
					</mesh>
				))}

				{/* Text overlay */}
				<Text
					position={[0, 0, 0.01]}
					fontSize={w * 0.12}
					color="#666666"
					anchorX="center"
					anchorY="middle"
				>
					BACKGROUND
				</Text>

				{/* Black background behind everything */}
				<mesh position={[0, 0, -0.05]}>
					<planeGeometry args={[w, h]} />
					<meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} />
				</mesh>
			</group>
		);
	}

	// NORMAL STATE: Show texture
	return (
		<group>
			{/* Main back panel */}
			<mesh ref={meshRef} receiveShadow position={[0, 0, 0]}>
				<planeGeometry args={[w * 0.95, h * 0.9]} />
				<meshStandardMaterial
					map={texture}
					roughness={0.85}
					metalness={0.05}
					side={THREE.DoubleSide}
				/>
			</mesh>

			{/* Right side panel (if enabled) */}
			{(showSidePanels === "single" || showSidePanels === "both") && (
				<mesh
					ref={rightPanelRef}
					receiveShadow
					position={[w * 0.95 / 2 + sidePanelW / 2, 0, sidePanelW / 2]}
					rotation={[0, -Math.PI / 2, 0]}
				>
					<planeGeometry args={[sidePanelW, h * 0.9]} />
					<meshStandardMaterial
						map={texture}
						roughness={0.85}
						metalness={0.05}
						side={THREE.DoubleSide}
					/>
				</mesh>
			)}

			{/* Left side panel (if both enabled) */}
			{showSidePanels === "both" && (
				<mesh
					ref={leftPanelRef}
					receiveShadow
					position={[-w * 0.95 / 2 - sidePanelW / 2, 0, sidePanelW / 2]}
					rotation={[0, Math.PI / 2, 0]}
				>
					<planeGeometry args={[sidePanelW, h * 0.9]} />
					<meshStandardMaterial
						map={texture}
						roughness={0.85}
						metalness={0.05}
						side={THREE.DoubleSide}
					/>
				</mesh>
			)}

			{/* Black background behind everything (optional fallback) */}
			<mesh position={[0, 0, -0.05]}>
				<planeGeometry args={[w, h]} />
				<meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} />
			</mesh>
		</group>
	);
}