// src/app/(website)/calculator/_world/AquariumSceneCollapsed.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import { AquariumTank } from "./tank/AquariumTank";
import type { SidePanelsType } from "../calculator-types";

interface AquariumSceneCollapsedProps {
	width: number;
	height: number;
	depth: number;
	hasBackground?: boolean;
	sidePanels?: SidePanelsType;
	sidePanelWidth?: number;
}

export function AquariumSceneCollapsed({
	width = 100,
	height = 50,
	depth = 40,
	hasBackground = false,
	sidePanels = "none",
	sidePanelWidth = 40,
}: AquariumSceneCollapsedProps) {
	return (
		<div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950">
			<Canvas
				camera={{ position: [6, 3, 8], fov: 50 }}
				resize={{ debounce: 50 }}
				frameloop="always"
				gl={{
					antialias: true,
					alpha: false,
					powerPreference: "high-performance",
				}}
				dpr={[1, 1.5]}
				shadows
			>
				<color attach="background" args={["#09090b"]} />
				<fog attach="fog" args={["#09090b", 10, 40]} />

				{/* Lighting */}
				<ambientLight intensity={0.5} />
				<directionalLight
					position={[5, 10, 5]}
					intensity={1.5}
					castShadow
					shadow-mapSize={[1024, 1024]}
				/>
				<pointLight position={[0, 5, -5]} intensity={0.5} color="#00aaee" />

				<Suspense fallback={null}>
					<AquariumTank
						width={width}
						height={height}
						depth={depth}
						hasBackground={hasBackground}
						sidePanels={sidePanels}
						sidePanelWidth={sidePanelWidth}
						showDimensions={false}
					/>

					<ContactShadows
						position={[0, -height / 20 - 0.1, 0]}
						opacity={0.4}
						scale={20}
						blur={2}
						far={4}
					/>
				</Suspense>

				<Environment preset="city" blur={0.8} />

				{/* NO ORBIT CONTROLS - entire preview is a button */}
			</Canvas>
		</div>
	);
}