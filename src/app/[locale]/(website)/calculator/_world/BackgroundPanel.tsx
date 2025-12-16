// src/app/(website)/calculator/_world/BackgroundPanel.tsx
"use client";

import { ProceduralRockWall } from "./ProceduralRockWall";
import type { SidePanelsType } from "../calculator-types";

interface BackgroundPanelProps {
	width: number; // cm - INTERNAL width of aquarium
	height: number; // cm
	depth?: number; // cm - wall thickness (1-2cm as mentioned)
	sidePanels?: SidePanelsType;
	sidePanelWidth?: number; // cm - INTERNAL depth for side panels
	baseColor?: string; // Hex color for rocks (optional color map support)
}

/**
 * Background panel with procedural rock wall
 * Generates stone wall that fills space based on dimensions and side panel config
 */
export function BackgroundPanel({
	width,
	height,
	depth = 2, // 1-2cm thick wall as specified
	sidePanels = "none",
	sidePanelWidth = 40,
	baseColor = "#6B5D52", // Default gray-brown stone
}: BackgroundPanelProps) {
	// Calculate appropriate number of rocks based on surface area
	// ~0.5 rocks per 100cm² gives good density without overcrowding
	const surfaceAreaCm2 = width * height;
	const numRocks = Math.min(Math.max(Math.floor(surfaceAreaCm2 / 350), 20), 40);

	return (
		<group>
			<ProceduralRockWall
				width={width}
				height={height}
				depth={depth}
				sidePanels={sidePanels}
				sidePanelDepth={sidePanelWidth}
				numRocks={numRocks}
				baseColor={baseColor}
			/>
		</group>
	);
}