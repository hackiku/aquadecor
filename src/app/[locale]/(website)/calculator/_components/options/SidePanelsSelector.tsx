// src/app/(website)/calculator/_components/options/SidePanelsSelector.tsx

"use client";

import { useState, useEffect } from "react";
import type { SidePanelsType } from "../../calculator-types";
import { useUnit } from "../../_context/UnitContext";
import { useCalculatorLayout } from "../../_context/CalculatorLayoutContext";

interface SidePanelsSelectorProps {
	selected: SidePanelsType;
	sidePanelWidth?: number;
	onChange: (type: SidePanelsType, width?: number) => void;
}

export function SidePanelsSelector({ selected, sidePanelWidth = 40, onChange }: SidePanelsSelectorProps) {
	const [tempWidth, setTempWidth] = useState(sidePanelWidth);
	const { unit } = useUnit();
	const { config } = useCalculatorLayout();

	// Get tank width for max constraint (in cm)
	const tankWidthCm = config?.dimensions?.width || 120;
	const maxSidePanelWidth = Math.min(80, tankWidthCm * 0.8); // Max 80cm or 80% of tank width

	// Convert cm to display unit
	const displayWidth = unit === "inch" ? (tempWidth / 2.54).toFixed(1) : tempWidth;
	const displayMax = unit === "inch" ? (maxSidePanelWidth / 2.54).toFixed(1) : maxSidePanelWidth;
	const displayMin = unit === "inch" ? (30 / 2.54).toFixed(1) : "30";
	const unitLabel = unit === "inch" ? '"' : "cm";

	// Update temp width when unit changes
	useEffect(() => {
		setTempWidth(sidePanelWidth);
	}, [sidePanelWidth]);

	const handlePanelChange = (type: SidePanelsType) => {
		if (type === "none") {
			onChange(type);
		} else {
			onChange(type, tempWidth);
		}
	};

	const handleWidthChange = (value: number) => {
		// Value is always in cm (internal storage)
		setTempWidth(value);
		onChange(selected, value);
	};

	return (
		<section className="py-12 space-y-6">
			<div className="space-y-3">
				<h2 className="text-2xl md:text-3xl font-display font-light">
					3. Side Panels (Optional)
				</h2>
				<p className="text-muted-foreground font-display font-light text-lg">
					Add side panels to create a complete 3D environment. Planform view shows your aquarium from above.
				</p>
			</div>

			{/* 2x2 Grid Layout with Planform View */}
			<div className="grid grid-cols-2 gap-4 max-w-2xl">
				{/* None - Back panel only (bottom edge) */}
				<button
					onClick={() => handlePanelChange("none")}
					className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-center ${selected === "none"
							? "border-primary bg-primary/5 scale-[1.02] shadow-lg"
							: "border-border hover:border-primary/50 hover:shadow-md"
						}`}
				>
					{selected === "none" && (
						<div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center z-10">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M20 6 9 17l-5-5" />
							</svg>
						</div>
					)}

					<div className="space-y-4">
						{/* Planform view - aspect-video, back panel at bottom */}
						<div className="w-full aspect-5/2 flex items-center justify-center p-4">
							<div className="relative w-full h-full max-w-[120px]">
								{/* Aquarium outline */}
								<div className="absolute inset-0 border-2 border-muted-foreground/30 rounded" />
								{/* Back panel - bottom edge only */}
								<div className="absolute bottom-0 left-0 right-0 h-[4px] bg-primary/60 rounded-b" />
							</div>
						</div>

						<div>
							<h3
								className={`text-base font-display font-medium mb-1 ${selected === "none" ? "text-primary" : ""
									}`}
							>
								No Panels
							</h3>
							<p className="text-xs text-muted-foreground font-display font-light">
								Back wall only
							</p>
						</div>
					</div>
				</button>

				{/* Left Side Panel */}
				<button
					onClick={() => handlePanelChange("left")}
					className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-center ${selected === "left"
							? "border-primary bg-primary/5 scale-[1.02] shadow-lg"
							: "border-border hover:border-primary/50 hover:shadow-md"
						}`}
				>
					{selected === "left" && (
						<div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center z-10">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M20 6 9 17l-5-5" />
							</svg>
						</div>
					)}

					<div className="space-y-4">
						{/* Planform view - left side panel */}
						<div className="w-full aspect-5/2 flex items-center justify-center p-4">
							<div className="relative w-full h-full max-w-[120px]">
								{/* Aquarium outline */}
								<div className="absolute inset-0 border-2 border-muted-foreground/30 rounded" />
								{/* Back panel - bottom */}
								<div className="absolute bottom-0 left-0 right-0 h-[4px] bg-primary/60 rounded-b" />
								{/* Left panel */}
								<div className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary rounded-l" />
							</div>
						</div>

						<div>
							<h3
								className={`text-base font-display font-medium mb-1 ${selected === "left" ? "text-primary" : ""
									}`}
							>
								Left Panel
							</h3>
							<p className="text-xs text-muted-foreground font-display font-light">
								Left side extension
							</p>
						</div>
					</div>
				</button>

				{/* Right Side Panel */}
				<button
					onClick={() => handlePanelChange("right")}
					className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-center ${selected === "right"
							? "border-primary bg-primary/5 scale-[1.02] shadow-lg"
							: "border-border hover:border-primary/50 hover:shadow-md"
						}`}
				>
					{selected === "right" && (
						<div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center z-10">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M20 6 9 17l-5-5" />
							</svg>
						</div>
					)}

					<div className="space-y-4">
						{/* Planform view - right side panel */}
						<div className="w-full aspect-5/2 flex items-center justify-center p-4">
							<div className="relative w-full h-full max-w-[120px]">
								{/* Aquarium outline */}
								<div className="absolute inset-0 border-2 border-muted-foreground/30 rounded" />
								{/* Back panel - bottom */}
								<div className="absolute bottom-0 left-0 right-0 h-[4px] bg-primary/60 rounded-b" />
								{/* Right panel */}
								<div className="absolute right-0 top-0 bottom-0 w-[4px] bg-primary rounded-r" />
							</div>
						</div>

						<div>
							<h3
								className={`text-base font-display font-medium mb-1 ${selected === "right" ? "text-primary" : ""
									}`}
							>
								Right Panel
							</h3>
							<p className="text-xs text-muted-foreground font-display font-light">
								Right side extension
							</p>
						</div>
					</div>
				</button>

				{/* Both Sides */}
				<button
					onClick={() => handlePanelChange("both")}
					className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-center ${selected === "both"
							? "border-primary bg-primary/5 scale-[1.02] shadow-lg"
							: "border-border hover:border-primary/50 hover:shadow-md"
						}`}
				>
					{selected === "both" && (
						<div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center z-10">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M20 6 9 17l-5-5" />
							</svg>
						</div>
					)}

					<div className="space-y-4">
						{/* Planform view - both panels (U-shape) */}
						<div className="w-full aspect-5/2 flex items-center justify-center p-4">
							<div className="relative w-full h-full max-w-[120px]">
								{/* Aquarium outline */}
								<div className="absolute inset-0 border-2 border-muted-foreground/30 rounded" />
								{/* Back panel - bottom */}
								<div className="absolute bottom-0 left-0 right-0 h-[4px] bg-primary/60 rounded-b" />
								{/* Right panel */}
								<div className="absolute right-0 top-0 bottom-0 w-[4px] bg-primary rounded-r" />
								{/* Left panel */}
								<div className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary rounded-l" />
							</div>
						</div>

						<div>
							<h3
								className={`text-base font-display font-medium mb-1 ${selected === "both" ? "text-primary" : ""
									}`}
							>
								Both Sides
							</h3>
							<p className="text-xs text-muted-foreground font-display font-light">
								Full U-shaped wrap
							</p>
						</div>
					</div>
				</button>
			</div>

			{/* Width input (if any side panel selected) */}
			{selected !== "none" && (
				<div className="max-w-md space-y-4 p-6 bg-muted/30 rounded-xl border">
					<div className="space-y-2">
						<label className="text-sm font-medium font-display flex items-center justify-between">
							<span className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-blue-500" />
								Side Panel Width (Internal)
							</span>
							<span className="text-lg font-mono font-semibold">
								{displayWidth}{unitLabel}
							</span>
						</label>
						<p className="text-xs text-muted-foreground font-display font-light">
							Range: {displayMin}{unitLabel} - {displayMax}{unitLabel}
						</p>
					</div>

					<input
						type="range"
						min="30"
						max={Math.floor(maxSidePanelWidth)}
						step="5"
						value={tempWidth}
						onChange={(e) => {
							const newWidth = parseInt(e.target.value);
							handleWidthChange(newWidth);
						}}
						className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
					/>
				</div>
			)}
		</section>
	);
}