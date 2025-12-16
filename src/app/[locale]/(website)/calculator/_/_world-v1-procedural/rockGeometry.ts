// src/app/(website)/calculator/_world/rockGeometry.ts
import * as THREE from "three";

/**
 * Seeded random number generator for consistent rock placement
 */
export function seededRandom(seed: number): number {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

/**
 * 3D Simplex-like noise function (simplified)
 */
function noise3D(x: number, y: number, z: number): number {
	// Simple hash-based noise
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
 * Fractal Brownian Motion for organic surface detail
 */
function fbm(x: number, y: number, z: number, octaves = 4): number {
	let value = 0;
	let amplitude = 0.5;
	let frequency = 1.0;

	for (let i = 0; i < octaves; i++) {
		value += amplitude * noise3D(x * frequency, y * frequency, z * frequency);
		frequency *= 2.0;
		amplitude *= 0.5;
	}

	return value;
}

/**
 * Generate a single rock/stone geometry with procedural displacement
 */
export function generateRockGeometry(seed: number, complexity: number = 16): THREE.BufferGeometry {
	// Start with icosphere for smooth base
	const geometry = new THREE.IcosahedronGeometry(1.0, complexity);
	const positions = geometry.attributes.position;

	// Apply noise displacement to vertices
	for (let i = 0; i < positions.count; i++) {
		const x = positions.getX(i);
		const y = positions.getY(i);
		const z = positions.getZ(i);

		// Normalize to get surface normal direction
		const len = Math.sqrt(x * x + y * y + z * z);
		const nx = x / len;
		const ny = y / len;
		const nz = z / len;

		// Apply multi-scale noise for rocky detail
		const noise = fbm(
			x * 2.0 + seed * 100,
			y * 2.0 + seed * 100,
			z * 2.0 + seed * 100,
			4
		);

		// Displace along normal
		const displacement = 0.15 + noise * 0.25; // 15-40% displacement
		positions.setXYZ(
			i,
			x + nx * displacement,
			y + ny * displacement,
			z + nz * displacement
		);
	}

	geometry.computeVertexNormals();
	geometry.computeBoundingSphere();

	return geometry;
}

/**
 * Generate a library of unique rock shapes (call once, reuse via instancing)
 */
export function generateRockLibrary(numShapes: number = 5): THREE.BufferGeometry[] {
	const library: THREE.BufferGeometry[] = [];

	for (let i = 0; i < numShapes; i++) {
		// Vary complexity based on shape index (some simple, some detailed)
		const complexity = i === 0 ? 12 : 16; // First one is lower poly for LOD
		library.push(generateRockGeometry(i + 1, complexity));
	}

	return library;
}

/**
 * Calculate rock positions to fill a wall area
 */
export interface RockInstance {
	position: [number, number, number];
	rotation: [number, number, number];
	scale: number;
	shapeIndex: number;
}

export function generateRockWall(
	width: number, // cm
	height: number, // cm
	depth: number, // cm (thickness of wall)
	sidePanels: "none" | "single" | "both" = "none",
	sidePanelDepth: number = 40, // cm
	numRocks: number = 30
): RockInstance[] {
	const rocks: RockInstance[] = [];
	const w = width / 10; // Convert to decimeters
	const h = height / 10;
	const d = depth / 10;
	const sideD = sidePanelDepth / 10;

	// Generate back wall rocks
	for (let i = 0; i < numRocks; i++) {
		const seed = i * 7.12345;

		// Distribute across back wall
		const x = (seededRandom(seed) - 0.5) * w * 0.9;
		const y = (seededRandom(seed + 1) - 0.5) * h * 0.9;
		const z = seededRandom(seed + 2) * d * 0.3 - d * 0.15; // Slight depth variation

		// Random rotation
		const rotX = seededRandom(seed + 3) * Math.PI * 2;
		const rotY = seededRandom(seed + 4) * Math.PI * 2;
		const rotZ = seededRandom(seed + 5) * Math.PI * 2;

		// Size variation (smaller rocks = more detail, larger = fill space)
		const scale = 0.4 + seededRandom(seed + 6) * 0.6; // 40-100% scale

		// Pick shape variant
		const shapeIndex = Math.floor(seededRandom(seed + 7) * 5);

		rocks.push({
			position: [x, y, z],
			rotation: [rotX, rotY, rotZ],
			scale,
			shapeIndex,
		});
	}

	// Add side panel rocks if enabled
	if (sidePanels === "single" || sidePanels === "both") {
		const sideRockCount = Math.floor(numRocks * 0.4); // Fewer rocks on sides

		for (let i = 0; i < sideRockCount; i++) {
			const seed = (numRocks + i) * 7.12345;

			// Right side panel
			const x = w * 0.45 + seededRandom(seed) * sideD * 0.4;
			const y = (seededRandom(seed + 1) - 0.5) * h * 0.9;
			const z = -seededRandom(seed + 2) * sideD * 0.8;

			const rotX = seededRandom(seed + 3) * Math.PI * 2;
			const rotY = seededRandom(seed + 4) * Math.PI * 2 + Math.PI / 2; // Rotated to face inward
			const rotZ = seededRandom(seed + 5) * Math.PI * 2;

			const scale = 0.4 + seededRandom(seed + 6) * 0.6;
			const shapeIndex = Math.floor(seededRandom(seed + 7) * 5);

			rocks.push({
				position: [x, y, z],
				rotation: [rotX, rotY, rotZ],
				scale,
				shapeIndex,
			});
		}
	}

	if (sidePanels === "both") {
		const sideRockCount = Math.floor(numRocks * 0.4);

		for (let i = 0; i < sideRockCount; i++) {
			const seed = (numRocks + sideRockCount + i) * 7.12345;

			// Left side panel
			const x = -w * 0.45 - seededRandom(seed) * sideD * 0.4;
			const y = (seededRandom(seed + 1) - 0.5) * h * 0.9;
			const z = -seededRandom(seed + 2) * sideD * 0.8;

			const rotX = seededRandom(seed + 3) * Math.PI * 2;
			const rotY = seededRandom(seed + 4) * Math.PI * 2 - Math.PI / 2; // Rotated to face inward
			const rotZ = seededRandom(seed + 5) * Math.PI * 2;

			const scale = 0.4 + seededRandom(seed + 6) * 0.6;
			const shapeIndex = Math.floor(seededRandom(seed + 7) * 5);

			rocks.push({
				position: [x, y, z],
				rotation: [rotX, rotY, rotZ],
				scale,
				shapeIndex,
			});
		}
	}

	return rocks;
}