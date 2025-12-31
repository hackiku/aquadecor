// src/app/(website)/calculator/_world/AquariumScene.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { useState, Suspense } from "react";
import { Pause, RefreshCwIcon } from "lucide-react";
import { AquariumTank } from "./tank/AquariumTank";
import type { SidePanelsType } from "../calculator-types";

interface AquariumSceneProps {
	width: number;
	height: number;
	depth: number;
	hasBackground?: boolean;
	sidePanels?: SidePanelsType;
	sidePanelWidth?: number;
	showControls?: boolean;
	showDimensions?: boolean;
	showStats?: boolean;
	cameraPreset?: "default" | "closeup";
}

function getCameraConfig(preset: "default" | "closeup") {
	switch (preset) {
		case "closeup":
			return { position: [6, 3, 8] as [number, number, number], fov: 50 };
		case "default":
		default:
			return { position: [8, 5, 10] as [number, number, number], fov: 45 };
	}
}

export function AquariumScene({
	width = 100,
	height = 50,
	depth = 40,
	hasBackground = false,
	sidePanels = "none",
	sidePanelWidth = 40,
	showControls = true,
	showDimensions = true,
	showStats = true,
	cameraPreset = "default",
}: AquariumSceneProps) {
	const [autoRotate, setAutoRotate] = useState(true);
	const cameraConfig = getCameraConfig(cameraPreset);

	// Calculate stats
	const volumeL = Math.round((width * height * depth) / 1000);
	const surfaceM2 = ((width * height) / 10000).toFixed(2);

	return (
		<div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950">
			<Canvas
				camera={cameraConfig}
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
						showDimensions={showDimensions}
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

				{showControls && (
					<OrbitControls
						enablePan={false}
						enableZoom={true}
						minDistance={5}
						maxDistance={20}
						minPolarAngle={Math.PI / 6}
						maxPolarAngle={Math.PI / 2.1}
						autoRotate={autoRotate}
						autoRotateSpeed={0.8}
						makeDefault
					/>
				)}
			</Canvas>

			{/* UI CONTROLS */}
			{showControls && (
				<>
					{/* Auto-rotate toggle */}
					<div
						onClick={() => setAutoRotate(!autoRotate)}
						className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium hover:bg-black/80 transition-all cursor-pointer flex gap-2 items-center group shadow-lg"
						role="button"
					>
						{autoRotate ? (
							<>
								<RefreshCwIcon className="w-3.5 h-3.5 animate-spin-slow" />
								<span>Rotating</span>
							</>
						) : (
							<>
								<Pause className="w-3.5 h-3.5" />
								<span>Paused</span>
							</>
						)}
					</div>

					{/* Stats Badge */}
					{showStats && (
						<div className="absolute top-2 left-2 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs space-y-1 shadow-lg pointer-events-none">
							<div className="flex items-center gap-3 justify-between">
								<span className="font-mono">{surfaceM2}m²</span>
								<span className="font-mono">{volumeL}L</span>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}