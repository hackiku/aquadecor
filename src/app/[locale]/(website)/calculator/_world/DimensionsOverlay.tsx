// src/app/(website)/calculator/_world/DimensionsOverlay.tsx
"use client";

import { Text, Billboard, Line } from "@react-three/drei";
import { useUnitConverter } from "../_context/UnitContext";
import * as THREE from "three";

interface DimensionsOverlayProps {
	width: number; // cm
	height: number; // cm
	depth: number; // cm
}

export function DimensionsOverlay({ width, height, depth }: DimensionsOverlayProps) {
	const { format } = useUnitConverter();

	// Convert to world units (dm)
	const w = width / 10;
	const h = height / 10;
	const d = depth / 10;

	// Offset for the lines so they float slightly off the glass
	const offset = 0.5;
	const color = "white";
	const opacity = 0.8;
	const textSize = 0.35; // increased slightly for readability

	return (
		<group>
			{/* WIDTH ARROW (Bottom Front) */}
			<DimensionLine
				start={[-w / 2, -h / 2 - offset, d / 2]}
				end={[w / 2, -h / 2 - offset, d / 2]}
				label={format(width)}
				color={color}
				opacity={opacity}
				textSize={textSize}
			/>

			{/* HEIGHT ARROW (Right Front) */}
			<DimensionLine
				start={[w / 2 + offset, -h / 2, d / 2]}
				end={[w / 2 + offset, h / 2, d / 2]}
				label={format(height)}
				color={color}
				opacity={opacity}
				textSize={textSize}
			/>

			{/* DEPTH ARROW (Bottom Right) */}
			<DimensionLine
				start={[w / 2, -h / 2 - offset, d / 2]}
				end={[w / 2, -h / 2 - offset, -d / 2]}
				label={format(depth)}
				color={color}
				opacity={opacity}
				textSize={textSize}
			/>
		</group>
	);
}

function DimensionLine({
	start,
	end,
	label,
	color,
	opacity,
	textSize
}: {
	start: [number, number, number],
	end: [number, number, number],
	label: string,
	color: string,
	opacity: number,
	textSize: number
}) {
	const startVec = new THREE.Vector3(...start);
	const endVec = new THREE.Vector3(...end);
	const midVec = startVec.clone().add(endVec).multiplyScalar(0.5);

	// Calculate tick marks (small perpendicular lines at ends)
	const dir = endVec.clone().sub(startVec).normalize();
	// Arbitrary perpendicular vector
	let perp = new THREE.Vector3(0, 1, 0);
	if (Math.abs(dir.y) > 0.9) perp = new THREE.Vector3(1, 0, 0);

	const tickSize = 0.15;
	const tickStart1 = startVec.clone().add(perp.clone().multiplyScalar(tickSize));
	const tickEnd1 = startVec.clone().add(perp.clone().multiplyScalar(-tickSize));
	const tickStart2 = endVec.clone().add(perp.clone().multiplyScalar(tickSize));
	const tickEnd2 = endVec.clone().add(perp.clone().multiplyScalar(-tickSize));

	return (
		<group>
			{/* Main Line */}
			<Line
				points={[start, end]}
				color={color}
				lineWidth={1}
				transparent
				opacity={opacity}
			/>

			{/* End Ticks */}
			<Line points={[tickStart1, tickEnd1]} color={color} lineWidth={1} transparent opacity={opacity} />
			<Line points={[tickStart2, tickEnd2]} color={color} lineWidth={1} transparent opacity={opacity} />

			{/* Label */}
			<Billboard position={midVec}>
				<Text
					fontSize={textSize}
					color={color}
					anchorX="center"
					anchorY="top" // Moves text slightly above line
					outlineWidth={0.03}
					outlineColor="#000000"
				// REMOVED font prop to prevent 404 crash
				>
					{label}
				</Text>
			</Billboard>
		</group>
	);
}