// src/app/(website)/calculator/_world/rockGeometry.ts
import * as THREE from "three";

/**
 * Seeded random number generator for consistent patterns
 */
export function seededRandom(seed: number): number {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

/**
 * 3D Simplex-like noise function
 */
function noise3D(x: number, y: number, z: number): number {
	const hash = (n: number) => {
		const h = Math.sin(n * 127.1) * 43758.5453123;
		return h - Math.floor(h);
	};

	const ix = Math.floor(x);
	const iy = Math.floor(y);
	const iz = Math.floor(z);

	const fx = x - ix;
	const fy = y - iy;
	const fz = z - iz;

	// Smooth interpolation
	const u = fx * fx * (3 - 2 * fx);
	const v = fy * fy * (3 - 2 * fy);
	const w = fz * fz * (3 - 2 * fz);

	// Hash corners
	const a = hash(ix + iy * 57.0 + iz * 113.0);
	const b = hash(ix + 1 + iy * 57.0 + iz * 113.0);
	const c = hash(ix + (iy + 1) * 57.0 + iz * 113.0);
	const d = hash(ix + 1 + (iy + 1) * 57.0 + iz * 113.0);

	const e = hash(ix + iy * 57.0 + (iz + 1) * 113.0);
	const f = hash(ix + 1 + iy * 57.0 + (iz + 1) * 113.0);
	const g = hash(ix + (iy + 1) * 57.0 + (iz + 1) * 113.0);
	const h = hash(ix + 1 + (iy + 1) * 57.0 + (iz + 1) * 113.0);

	// Trilinear interpolation
	const k0 = a + u * (b - a);
	const k1 = c + u * (d - c);
	const k2 = e + u * (f - e);
	const k3 = g + u * (h - g);

	const l0 = k0 + v * (k1 - k0);
	const l1 = k2 + v * (k3 - k2);

	return l0 + w * (l1 - l0);
}

/**
 * Fractal Brownian Motion - layered noise for organic detail
 */
function fbm(x: number, y: number, z: number, octaves = 5): number {
	let value = 0;
	let amplitude = 0.5;
	let frequency = 1.0;

	for (let i = 0; i < octaves; i++) {
		value += amplitude * noise3D(x * frequency, y * frequency, z * frequency);
		frequency *= 2.1; // Slightly irregular for more organic feel
		amplitude *= 0.48;
	}

	return value;
}

/**
 * Generate continuous stone relief sheet with displacement
 * This is ONE MESH with bumps, not separate rocks
 */
export function generateStoneSheet(
	widthCm: number,
	heightCm: number,
	segments: number = 64 // Higher = more detail, lower = better performance
): THREE.PlaneGeometry {
	const w = widthCm / 10;
	const h = heightCm / 10;

	// Create high-resolution plane
	const geometry = new THREE.PlaneGeometry(w, h, segments, segments);
	const positions = geometry.attributes.position;

	// Apply multi-scale displacement to create stone bumps
	for (let i = 0; i < positions.count; i++) {
		const x = positions.getX(i);
		const y = positions.getY(i);
		const z = positions.getZ(i);

		// Large bumps (stone chunks)
		const largeBumps = fbm(x * 1.2, y * 1.2, 0, 3) * 0.25;

		// Medium details (cracks, ridges)
		const mediumDetail = fbm(x * 3.5, y * 3.5, 100, 4) * 0.12;

		// Fine texture (surface roughness)
		const fineDetail = fbm(x * 8.0, y * 8.0, 200, 5) * 0.05;

		// Combine all scales - this creates the relief effect
		const totalDisplacement = largeBumps + mediumDetail + fineDetail;

		// Push vertices OUT toward camera (positive Z)
		positions.setZ(i, totalDisplacement);
	}

	geometry.computeVertexNormals();
	geometry.computeBoundingSphere();

	return geometry;
}

/**
 * Generate side panel sheet (same technique, rotated placement)
 */
export function generateSidePanelSheet(
	depthCm: number,
	heightCm: number,
	segments: number = 48 // Slightly lower res for sides
): THREE.PlaneGeometry {
	const d = depthCm / 10;
	const h = heightCm / 10;

	const geometry = new THREE.PlaneGeometry(d, h, segments, Math.floor(segments * (h / d)));
	const positions = geometry.attributes.position;

	// Apply displacement with different seed for variation
	for (let i = 0; i < positions.count; i++) {
		const x = positions.getX(i);
		const y = positions.getY(i);

		// Use different offset in noise space for side panels
		const largeBumps = fbm(x * 1.2, y * 1.2, 500, 3) * 0.25;
		const mediumDetail = fbm(x * 3.5, y * 3.5, 600, 4) * 0.12;
		const fineDetail = fbm(x * 8.0, y * 8.0, 700, 5) * 0.05;

		const totalDisplacement = largeBumps + mediumDetail + fineDetail;
		positions.setZ(i, totalDisplacement);
	}

	geometry.computeVertexNormals();
	geometry.computeBoundingSphere();

	return geometry;
}