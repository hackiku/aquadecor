// src/app/(website)/calculator/_world/tank/DimensionsOverlay.tsx
"use client";

import { Line, Html } from "@react-three/drei";
import { useUnitConverter } from "../../_context/UnitContext";
import * as THREE from "three";

interface DimensionsOverlayProps {
	width: number; // cm
	height: number; // cm
	depth: number; // cm
}

export function DimensionsOverlay({ width, height, depth }: DimensionsOverlayProps) {
	const { format } = useUnitConverter();

	const w = width / 10;
	const h = height / 10;
	const d = depth / 10;

	const offset = 0.5;
	const color = "white";
	const opacity = 0.6;

	return (
		<group>
			{/* WIDTH (Front Bottom) */}
			<DimensionLine
				start={[-w / 2, -h / 2 - offset, d / 2]}
				end={[w / 2, -h / 2 - offset, d / 2]}
				label={format(width)}
				color={color}
				opacity={opacity}
			/>

			{/* HEIGHT (Right Side) */}
			<DimensionLine
				start={[w / 2 + offset, -h / 2, d / 2]}
				end={[w / 2 + offset, h / 2, d / 2]}
				label={format(height)}
				color={color}
				opacity={opacity}
			/>

			{/* DEPTH (Bottom Right) */}
			<DimensionLine
				start={[w / 2, -h / 2 - offset, d / 2]}
				end={[w / 2, -h / 2 - offset, -d / 2]}
				label={format(depth)}
				color={color}
				opacity={opacity}
			/>
		</group>
	);
}

function DimensionLine({
	start,
	end,
	label,
	color,
	opacity
}: {
	start: [number, number, number],
	end: [number, number, number],
	label: string,
	color: string,
	opacity: number
}) {
	const startVec = new THREE.Vector3(...start);
	const endVec = new THREE.Vector3(...end);
	const midVec = startVec.clone().add(endVec).multiplyScalar(0.5);

	// Ticks
	const dir = endVec.clone().sub(startVec).normalize();
	let perp = new THREE.Vector3(0, 1, 0);
	if (Math.abs(dir.y) > 0.9) perp = new THREE.Vector3(1, 0, 0);

	const tickSize = 0.15;
	const tickStart1 = startVec.clone().add(perp.clone().multiplyScalar(tickSize));
	const tickEnd1 = startVec.clone().add(perp.clone().multiplyScalar(-tickSize));
	const tickStart2 = endVec.clone().add(perp.clone().multiplyScalar(tickSize));
	const tickEnd2 = endVec.clone().add(perp.clone().multiplyScalar(-tickSize));

	return (
		<group>
			<Line points={[start, end]} color={color} lineWidth={1} transparent opacity={opacity} />
			<Line points={[tickStart1, tickEnd1]} color={color} lineWidth={1} transparent opacity={opacity} />
			<Line points={[tickStart2, tickEnd2]} color={color} lineWidth={1} transparent opacity={opacity} />

			{/* HTML Label - No font crashes! */}
			<Html position={midVec} center>
				<div className="px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded text-white text-[10px] font-mono whitespace-nowrap border border-white/10">
					{label}
				</div>
			</Html>
		</group>
	);
}