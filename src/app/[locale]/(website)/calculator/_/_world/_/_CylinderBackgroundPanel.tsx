// src/app/(website)/calculator/_world/BackgroundPanel.tsx
"use client";

import { useTexture } from "@react-three/drei";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

interface BackgroundPanelProps {
	width: number; // cm - INTERNAL width of aquarium
	height: number; // cm
	depth?: number; // cm - used for side panel calculations
	textureUrl?: string;
	showSidePanels?: "none" | "single" | "both";
	sidePanelWidth?: number; // cm - INTERNAL depth for side panels
	isEmpty?: boolean; // Show "CHOOSE BACKGROUND" state
}

/**
 * Curved background panel using cylinder geometry
 * Wraps texture from back wall into side panels seamlessly
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

	const w = width / 10; // Convert cm to decimeters for scene
	const h = height / 10;
	const sidePanelD = sidePanelWidth / 10;

	// Load texture
	const texture = useTexture(isEmpty ? "/3d/texture-placeholder.jpg" : textureUrl);

	// Calculate cylinder parameters based on side panel config
	const cylinderParams = useMemo(() => {
		// Base radius - determines how far back the curve sits
		// Larger radius = gentler curve, smaller = tighter curve
		const baseRadius = w * 0.8;

		let thetaStart: number;
		let thetaLength: number;

		if (showSidePanels === "none") {
			// Just back wall - small arc (nearly flat)
			thetaStart = Math.PI * 0.48;
			thetaLength = Math.PI * 0.04; // Very shallow curve
		} else if (showSidePanels === "single") {
			// L-shape: back + right side
			thetaStart = Math.PI * 0.50; // Start from center-back
			thetaLength = Math.PI * 0.28; // Wrap ~90 degrees to right
		} else {
			// U-shape: back + both sides
			thetaStart = Math.PI * 0.36; // Start left of center
			thetaLength = Math.PI * 0.56; // Wrap ~180 degrees
		}

		// Height segments for smoothness (more = smoother curve)
		const radialSegments = showSidePanels === "none" ? 8 : 32;

		return {
			radius: baseRadius,
			height: h * 0.9,
			radialSegments,
			heightSegments: 1,
			openEnded: true,
			thetaStart,
			thetaLength,
		};
	}, [w, h, showSidePanels, sidePanelD]);

	// Configure texture mapping
	useEffect(() => {
		if (!texture || !texture.image || isEmpty) return;

		texture.generateMipmaps = true;
		texture.minFilter = THREE.LinearMipmapLinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.anisotropy = 4;
		texture.wrapS = THREE.ClampToEdgeWrapping; // Prevent wrapping at seams
		texture.wrapT = THREE.RepeatWrapping;
		texture.colorSpace = THREE.SRGBColorSpace;

		const imgElement = texture.image as HTMLImageElement;
		const texWidth = imgElement.width || 1024;
		const texHeight = imgElement.height || 1024;
		const imageAspect = texWidth / texHeight;

		// Calculate how much of the texture width to use based on panels
		// none = use center portion, single = use center + right, both = use full width
		let textureWidthUsage = 1.0;
		if (showSidePanels === "none") {
			textureWidthUsage = 0.4; // Use only center 40%
		} else if (showSidePanels === "single") {
			textureWidthUsage = 0.7; // Use center + right 70%
		}

		// Scale texture to prevent stretching
		// We want to CROP vertically rather than stretch
		const targetAspect = (w * textureWidthUsage) / h;

		if (targetAspect > imageAspect) {
			// Image is too tall - crop top/bottom
			texture.repeat.set(textureWidthUsage, imageAspect / targetAspect);
			texture.offset.set((1 - textureWidthUsage) / 2, (1 - texture.repeat.y) / 2);
		} else {
			// Image is too wide - crop left/right (better than stretching)
			texture.repeat.set((targetAspect / imageAspect) * textureWidthUsage, 1);
			texture.offset.set((1 - texture.repeat.x) / 2, 0);
		}

		texture.needsUpdate = true;

		return () => {
			texture.dispose();
		};
	}, [width, height, texture, isEmpty, w, h, showSidePanels]);

	// EMPTY STATE: Diagonal stripes with text
	if (isEmpty) {
		return (
			<group>
				{/* Main back panel with diagonal stripe pattern */}
				<mesh receiveShadow position={[0, 0, 0]}>
					<planeGeometry args={[w * 0.95, h * 0.9]} />
					<meshStandardMaterial
						color="#1a1a1a"
						roughness={0.9}
						metalness={0.1}
						side={THREE.DoubleSide}
					/>
				</mesh>

				{/* Diagonal stripes overlay */}
				{Array.from({ length: 12 }).map((_, i) => (
					<mesh
						key={i}
						position={[
							-w * 0.6 + (i * w) / 5,
							0,
							0.02
						]}
						rotation={[0, 0, Math.PI / 4]}
					>
						<planeGeometry args={[0.2, h * 2]} />
						<meshBasicMaterial color="#2a2a2a" transparent opacity={0.4} side={THREE.DoubleSide} />
					</mesh>
				))}

				{/* Text overlay */}
				<Text
					position={[0, 0, 0.1]}
					fontSize={Math.min(w * 0.08, 1.2)}
					color="#555555"
					anchorX="center"
					anchorY="middle"
					maxWidth={w * 0.8}
				>
					+ CHOOSE BACKGROUND
				</Text>

				{/* Black background behind everything */}
				<mesh position={[0, 0, -0.1]}>
					<planeGeometry args={[w, h]} />
					<meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} />
				</mesh>
			</group>
		);
	}

	// CURVED BACKGROUND: Single cylinder wraps around corners
	return (
		<group>
			{/* Curved background panel */}
			<mesh
				ref={meshRef}
				receiveShadow
				rotation={[0, Math.PI, 0]} // Face forward
			>
				<cylinderGeometry args={[
					cylinderParams.radius,
					cylinderParams.radius,
					cylinderParams.height,
					cylinderParams.radialSegments,
					cylinderParams.heightSegments,
					cylinderParams.openEnded,
					cylinderParams.thetaStart,
					cylinderParams.thetaLength,
				]} />
				<meshStandardMaterial
					map={texture}
					roughness={0.85}
					metalness={0.05}
					side={THREE.DoubleSide}
				/>
			</mesh>

			{/* Black background behind cylinder */}
			<mesh position={[0, 0, -w * 0.9]}>
				<planeGeometry args={[w * 1.2, h * 1.2]} />
				<meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} />
			</mesh>
		</group>
	);
}