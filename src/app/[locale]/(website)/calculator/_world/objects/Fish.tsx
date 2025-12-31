// src/app/(website)/calculator/_world/Fish.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface FishProps {
	tankWidth: number;  // cm
	tankHeight: number; // cm
	tankDepth: number;  // cm
}

export function Fish({ tankWidth, tankHeight, tankDepth }: FishProps) {
	const group = useRef<THREE.Group>(null);
	const { scene, animations } = useGLTF("/3d/models/nemo.glb");
	const { actions } = useAnimations(animations, group);

	// Convert tank cm to world units (dm)
	const bounds = {
		x: (tankWidth / 10) / 2 - 1.5, // 1.5dm margin from glass
		y: (tankHeight / 10) / 2 - 1.5,
		z: (tankDepth / 10) / 2 - 1.0  // Stay away from front glass/back rock
	};

	// Physics state
	const [velocity] = useState(() => new THREE.Vector3(0.015, 0, 0.005)); // Initial slow speed
	const target = useRef(new THREE.Vector3(0, 0, 0));

	// Start swimming animation if available
	useEffect(() => {
		const actionName = Object.keys(actions)[0];
		// Guard clause: if no animation found, stop
		if (!actionName) return;

		const action = actions[actionName];

		if (action) {
			action.reset().fadeIn(0.5).play();
			// Randomize playback speed slightly for realism
			action.timeScale = 0.8 + Math.random() * 0.4;
		}

		return () => {
			// Use the captured variable, not the index look-up
			action?.fadeOut(0.5);
		}
	}, [actions]);


	useFrame((state, delta) => {
		if (!group.current) return;

		const pos = group.current.position;

		// 1. BOUNDARY CHECK (Soft turn)
		// If hitting a wall, steer towards center
		if (pos.x > bounds.x) velocity.x -= 0.001;
		if (pos.x < -bounds.x) velocity.x += 0.001;

		if (pos.y > bounds.y) velocity.y -= 0.001;
		if (pos.y < -bounds.y) velocity.y += 0.001;

		if (pos.z > bounds.z) velocity.z -= 0.002; // Stronger turn from front glass
		if (pos.z < -bounds.z) velocity.z += 0.002;

		// 2. RANDOM WANDER
		// Occasionally change vertical direction slightly
		if (Math.random() < 0.02) {
			velocity.y += (Math.random() - 0.5) * 0.002;
		}
		// Occasionally steer left/right
		if (Math.random() < 0.01) {
			velocity.x += (Math.random() - 0.5) * 0.002;
			velocity.z += (Math.random() - 0.5) * 0.002;
		}

		// 3. NORMALIZE SPEED
		// Ensure fish doesn't accelerate infinitely or stop
		const maxSpeed = 0.012; // Slow lazy swim
		const currentSpeed = velocity.length();
		if (currentSpeed > maxSpeed) {
			velocity.multiplyScalar(maxSpeed / currentSpeed);
		} else if (currentSpeed < 0.005) {
			velocity.multiplyScalar(1.1);
		}

		// 4. ROTATION (Face direction)
		// Smoothly rotate to face velocity vector
		const lookTarget = pos.clone().add(velocity);
		const dummy = new THREE.Object3D();
		dummy.position.copy(pos);
		dummy.lookAt(lookTarget);
		group.current.quaternion.slerp(dummy.quaternion, 0.1); // 0.1 = turn speed

		// 5. MOVE
		pos.add(velocity);
	});

	return (
		<group ref={group} dispose={null}>
			{/* 
				Scale Calculation:
				Real Nemo = ~8cm
				World Unit (1) = 10cm
				Therefore Scale = 0.8
				*Check your GLB: if raw model is huge/tiny, adjust this multiplier*
			*/}
			<primitive
				object={scene}
				scale={0.8}
			/>
		</group>
	);
}

// Preload to avoid pop-in
useGLTF.preload("/3d/models/nemo.glb");