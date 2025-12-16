// src/app/(website)/calculator/_world/rockGeometry.ts
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

const noise3D = createNoise3D();

export function fbm(x: number, y: number, z: number, octaves = 4, persistence = 0.5, lacunarity = 2): number {
	let total = 0;
	let frequency = 1;
	let amplitude = 1;
	let maxValue = 0;

	for (let i = 0; i < octaves; i++) {
		total += noise3D(x * frequency, y * frequency, z * frequency) * amplitude;
		maxValue += amplitude;
		amplitude *= persistence;
		frequency *= lacunarity;
	}

	return total / maxValue;
}

export function displaceGeometryToRock(
	geometry: THREE.BufferGeometry,
	options: {
		seed: number;
		scale: number;
		amplitude: number;
		bias: number;
		thickness: number;
		edgeSmoothing?: number; // 0.0 to 0.5 (percentage of width/height to smooth)
	}
) {
	const { seed, scale, amplitude, bias, thickness, edgeSmoothing = 0.1 } = options;

	const posAttribute = geometry.attributes.position;
	const vertex = new THREE.Vector3();

	geometry.computeBoundingBox();
	const bbox = geometry.boundingBox!;
	const width = bbox.max.x - bbox.min.x;
	const height = bbox.max.y - bbox.min.y;

	// Calculate falloff distances (in units)
	const falloffX = width * edgeSmoothing;
	const falloffY = height * edgeSmoothing;

	const freq = scale * 0.5;

	for (let i = 0; i < posAttribute.count; i++) {
		vertex.fromBufferAttribute(posAttribute, i);

		const isFrontFace = vertex.z > (thickness / 20) - 0.01;

		if (isFrontFace) {
			// 1. Base Noise
			const n = fbm(
				vertex.x * freq + seed * 100,
				vertex.y * freq + seed * 100,
				seed * 10,
				4
			);

			// 2. Bias (Growth Direction)
			let biasFactor = 1.0;
			if (bias !== 0) {
				const normalizedX = (vertex.x - bbox.min.x) / width;
				const gradient = bias > 0 ? normalizedX : (1.0 - normalizedX);
				biasFactor = 0.5 + (gradient * 1.5);
			}

			// 3. Edge Smoothing (Taper) calculation
			// Distance from left/right edges
			const distLeft = vertex.x - bbox.min.x;
			const distRight = bbox.max.x - vertex.x;
			const factorX = Math.min(distLeft, distRight) / falloffX; // 0 at edge, 1 at falloff distance

			// Distance from top/bottom edges
			const distBottom = vertex.y - bbox.min.y;
			const distTop = bbox.max.y - vertex.y;
			const factorY = Math.min(distBottom, distTop) / falloffY;

			// smoothstep makes the transition silky smooth (no hard linear angles)
			const edgeFactor = THREE.MathUtils.smoothstep(Math.min(factorX, factorY), 0, 1);

			// 4. Apply Final Displacement
			// We multiply everything by edgeFactor to force zero displacement at edges
			const displacement = (n + 0.2) * (amplitude / 10) * biasFactor * edgeFactor;

			vertex.z += Math.max(0, displacement);

			// Optional: Warp X/Y slightly for organic feel, but strictly clamp to bounds to prevent gaps
			const warp = (fbm(vertex.y * 2, vertex.z * 2, seed) - 0.5) * 0.05 * edgeFactor;
			vertex.x = THREE.MathUtils.clamp(vertex.x + warp, bbox.min.x, bbox.max.x);
			vertex.y = THREE.MathUtils.clamp(vertex.y + warp, bbox.min.y, bbox.max.y);

			posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
		}
	}

	geometry.computeVertexNormals();
	return geometry;
}