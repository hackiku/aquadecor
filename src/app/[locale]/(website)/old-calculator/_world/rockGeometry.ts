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

export interface EdgeMask {
	top?: boolean;
	bottom?: boolean;
	left?: boolean; // In local space
	right?: boolean; // In local space
}

export function displaceGeometryToRock(
	geometry: THREE.BufferGeometry,
	options: {
		seed: number;
		scale: number;
		amplitude: number;
		bias: number;
		thickness: number;
		edgeSmoothing?: number;
		edgeMask?: EdgeMask; // <--- NEW PROP
	}
) {
	const {
		seed, scale, amplitude, bias, thickness,
		edgeSmoothing = 0.1,
		// Default to smoothing all sides if not specified
		edgeMask = { top: true, bottom: true, left: true, right: true }
	} = options;

	const posAttribute = geometry.attributes.position as THREE.BufferAttribute;

	if (!posAttribute) return geometry;

	const vertex = new THREE.Vector3();

	geometry.computeBoundingBox();
	const bbox = geometry.boundingBox!;
	const width = bbox.max.x - bbox.min.x;
	const height = bbox.max.y - bbox.min.y;

	const falloffX = width * edgeSmoothing;
	const falloffY = height * edgeSmoothing;
	const freq = scale * 0.5;

	for (let i = 0; i < posAttribute.count; i++) {
		vertex.fromBufferAttribute(posAttribute, i);
		const isFrontFace = vertex.z > (thickness / 20) - 0.01;

		if (isFrontFace) {
			const n = fbm(vertex.x * freq + seed * 100, vertex.y * freq + seed * 100, seed * 10, 4);

			// Bias logic
			let biasFactor = 1.0;
			if (bias !== 0) {
				const normalizedX = (vertex.x - bbox.min.x) / width;
				const gradient = bias > 0 ? normalizedX : (1.0 - normalizedX);
				biasFactor = 0.5 + (gradient * 1.5);
			}

			// --- SMART EDGE SMOOTHING ---
			let factorX = 1.0;
			let factorY = 1.0;

			// Only apply smoothing if the mask for that side is TRUE
			if (edgeMask.left) {
				const dist = vertex.x - bbox.min.x;
				if (dist < falloffX) factorX = Math.min(factorX, dist / falloffX);
			}
			if (edgeMask.right) {
				const dist = bbox.max.x - vertex.x;
				if (dist < falloffX) factorX = Math.min(factorX, dist / falloffX);
			}
			if (edgeMask.bottom) {
				const dist = vertex.y - bbox.min.y;
				if (dist < falloffY) factorY = Math.min(factorY, dist / falloffY);
			}
			if (edgeMask.top) {
				const dist = bbox.max.y - vertex.y;
				if (dist < falloffY) factorY = Math.min(factorY, dist / falloffY);
			}

			// Combine factors
			const edgeFactor = THREE.MathUtils.smoothstep(Math.min(factorX, factorY), 0, 1);
			// -----------------------------

			const displacement = (n + 0.2) * (amplitude / 10) * biasFactor * edgeFactor;

			vertex.z += Math.max(0, displacement);

			// Apply warp, but strictly masked by edgeFactor so sharp edges stay straight
			const warp = (fbm(vertex.y * 2, vertex.z * 2, seed) - 0.5) * 0.05 * edgeFactor;
			vertex.x = THREE.MathUtils.clamp(vertex.x + warp, bbox.min.x, bbox.max.x);
			vertex.y = THREE.MathUtils.clamp(vertex.y + warp, bbox.min.y, bbox.max.y);

			posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
		}
	}

	geometry.computeVertexNormals();
	return geometry;
}