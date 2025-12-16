// src/app/(website)/calculator/_world/rockGeometry.ts
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

// Initialize noise generator
const noise3D = createNoise3D();

/**
 * Fractal Brownian Motion for organic surface detail
 * Combines multiple layers of noise at different frequencies
 */
export function fbm(x: number, y: number, z: number, octaves = 4, persistence = 0.5, lacunarity = 2): number {
	let total = 0;
	let frequency = 1;
	let amplitude = 1;
	let maxValue = 0; // Used for normalizing result to 0.0 - 1.0

	for (let i = 0; i < octaves; i++) {
		total += noise3D(x * frequency, y * frequency, z * frequency) * amplitude;
		maxValue += amplitude;
		amplitude *= persistence;
		frequency *= lacunarity;
	}

	return total / maxValue;
}

/**
 * Modifies a BufferGeometry in-place to create a rocky surface
 * Only displaces vertices that are facing 'forward' (Z > 0)
 */
export function displaceGeometryToRock(
	geometry: THREE.BufferGeometry,
	options: {
		seed: number;
		scale: number;      // Texture frequency (zoomed in/out)
		amplitude: number;  // How far rocks stick out (cm)
		bias: number;       // -1 (left) to 1 (right) growth, 0 is balanced
		thickness: number;  // Base thickness of the sheet
	}
) {
	const { seed, scale, amplitude, bias, thickness } = options;

	const posAttribute = geometry.attributes.position;
	const vertex = new THREE.Vector3();

	// Get bounding box to normalize coordinates for bias
	geometry.computeBoundingBox();
	const minX = geometry.boundingBox!.min.x;
	const maxX = geometry.boundingBox!.max.x;
	const width = maxX - minX;

	// Scale factors for noise (adjusted for dm units)
	const freq = scale * 0.5;

	for (let i = 0; i < posAttribute.count; i++) {
		vertex.fromBufferAttribute(posAttribute, i);

		// Only displace the front face (vertices approx at Z = thickness/2)
		// We use a small epsilon because float math isn't perfect
		const isFrontFace = vertex.z > (thickness / 20) - 0.01;

		if (isFrontFace) {
			// 1. Calculate Base Noise
			// Offset by seed to get unique patterns
			const n = fbm(
				vertex.x * freq + seed * 100,
				vertex.y * freq + seed * 100,
				seed * 10, // Z seed
				4 // Octaves
			);

			// 2. Calculate Growth Bias (Gradient)
			// bias -1: larger on left, bias 1: larger on right, bias 0: flat
			let biasFactor = 1.0;
			if (bias !== 0) {
				const normalizedX = (vertex.x - minX) / width; // 0 to 1
				// If bias is positive (right), factor goes 0.5 -> 1.5
				// If bias is negative (left), factor goes 1.5 -> 0.5
				const gradient = bias > 0 ? normalizedX : (1.0 - normalizedX);
				biasFactor = 0.5 + (gradient * 1.5); // Range 0.5 to 2.0
			}

			// 3. Apply Displacement
			// Map noise (-1 to 1) to (0 to 1) then scale
			const displacement = (n + 0.2) * (amplitude / 10) * biasFactor;

			// Apply to Z, ensuring we don't go backwards into the wall
			vertex.z += Math.max(0, displacement);

			// Slight organic warp to X and Y to make it look less like a grid
			vertex.x += (fbm(vertex.y * 2, vertex.z * 2, seed) - 0.5) * 0.05;
			vertex.y += (fbm(vertex.x * 2, vertex.z * 2, seed) - 0.5) * 0.05;

			posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
		}
	}

	// CRITICAL: Recompute normals for lighting to look correct on the new bumps
	geometry.computeVertexNormals();

	return geometry;
}