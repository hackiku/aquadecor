// src/app/(website)/calculator/_world/BackgroundPanel.tsx
"use client";

import { ProceduralRockWall } from "./ProceduralRockWall";
import type { SidePanelsType } from "../calculator-types";

interface BackgroundPanelProps {
	width: number; // cm - INTERNAL width of aquarium
	height: number; // cm
	sidePanels?: SidePanelsType;
	sidePanelWidth?: number; // cm - INTERNAL depth for side panels
	baseColor?: string; // Hex color for stone (optional color map support)
	segments?: number; // Mesh resolution (default: 64 for good detail/performance balance)
}

/**
 * Background panel with procedural stone relief sheet
 * Generates continuous stone surface with bumps/cracks that conforms to aquarium edges
 */
export function BackgroundPanel({
	width,
	height,
	sidePanels = "none",
	sidePanelWidth = 40,
	baseColor = "#6B5D52", // Default gray-brown stone
	segments = 64, // Higher = more detail bumps, lower = better performance
}: BackgroundPanelProps) {
	return (
		<group>
			<ProceduralRockWall
				width={width}
				height={height}
				sidePanels={sidePanels}
				sidePanelDepth={sidePanelWidth}
				baseColor={baseColor}
				segments={segments}
			/>
		</group>
	);
}