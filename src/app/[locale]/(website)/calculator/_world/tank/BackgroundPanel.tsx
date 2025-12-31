// src/app/(website)/calculator/_world/BackgroundPanel.tsx
"use client";

import { ProceduralRockSheet } from "./ProceduralRockSheet";
import type { SidePanelsType } from "../../calculator-types";

interface BackgroundPanelProps {
	width: number;       // cm - INTERNAL width
	height: number;      // cm
	depth?: number;      // cm - base thickness
	sidePanels?: SidePanelsType;
	sidePanelWidth?: number; // cm - depth of side panels
	baseColor?: string;
}

export function BackgroundPanel({
	width,
	height,
	depth = 2,
	sidePanels = "none",
	sidePanelWidth = 40,
	baseColor = "#6B5D52",
}: BackgroundPanelProps) {

	// Convert depths to decimeters for positioning calculations
	const wDm = width / 10;
	const sideDm = sidePanelWidth / 10;
	const dDm = depth / 10;

	return (
		<group>
			{/* --- BACK PANEL --- */}
			{/* Positioned slightly forward so its back is at z=0 local space */}
			<group position={[0, 0, 0]}>
				<ProceduralRockSheet
					width={width}
					height={height}
					thickness={depth}
					relief={12} // Main relief
					color={baseColor}
					seed={1}
					bias={0} // Balanced growth
				/>
			</group>

			{/* --- RIGHT PANEL --- */}
			{(sidePanels === "single" || sidePanels === "both") && (
				<group
					position={[wDm / 2 - dDm / 2, 0, sideDm / 2]}
					rotation={[0, -Math.PI / 2, 0]}
				>
					<ProceduralRockSheet
						width={sidePanelWidth} // This becomes width in local space
						height={height}
						thickness={depth}
						relief={10}
						color={baseColor}
						seed={2}
						bias={-0.5} // Grow slightly larger towards the back corner
					/>
				</group>
			)}

			{/* --- LEFT PANEL --- */}
			{sidePanels === "both" && (
				<group
					position={[-wDm / 2 + dDm / 2, 0, sideDm / 2]}
					rotation={[0, Math.PI / 2, 0]}
				>
					<ProceduralRockSheet
						width={sidePanelWidth}
						height={height}
						thickness={depth}
						relief={10}
						color={baseColor}
						seed={3}
						bias={-0.5} // Grow slightly larger towards the back corner
					/>
				</group>
			)}
		</group>
	);
}