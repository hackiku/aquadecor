// src/app/(website)/calculator/_components/options/SidePanelsSelector.tsx

"use client";

import { useState } from "react";
import type { SidePanelsType } from "../../calculator-types";

interface SidePanelsSelectorProps {
	selected: SidePanelsType;
	sidePanelWidth?: number;
	onChange: (type: SidePanelsType, width?: number) => void;
}

export function SidePanelsSelector({ selected, sidePanelWidth = 40, onChange }: SidePanelsSelectorProps) {
	const [tempWidth, setTempWidth] = useState(sidePanelWidth);

	const handlePanelChange = (type: SidePanelsType) => {
		if (type === "none") {
			onChange(type);
		} else {
			onChange(type, tempWidth);
		}
	};

	return (
		<section className="py-12 space-y-6">
			<div className="space-y-3">
				<h2 className="text-2xl md:text-3xl font-display font-light">
					Side Panels (Optional)
				</h2>
				<p className="text-muted-foreground font-display font-light text-lg">
					Add side panels to create a complete 3D environment. Perfect for corner or peninsula tanks.
				</p>
			</div>

			<div className="grid md:grid-cols-3 gap-6 max-w-4xl">
				{/* None */}
				<button
					onClick={() => handlePanelChange("none")}
					className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-center ${selected === "none"
							? "border-primary bg-primary/5 scale-[1.02]"
							: "border-border hover:border-primary/50 hover:shadow-lg"
						}`}
				>
					{selected === "none" && (
						<div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
								<path d="M20 6 9 17l-5-5" />
							</svg>
						</div>
					)}

					<div className="space-y-4">
						{/* Simple diagram */}
						<div className="w-full h-24 flex items-center justify-center">
							<div className="relative">
								<div className="w-16 h-20 border-4 border-primary/40 rounded" />
							</div>
						</div>

						<div>
							<h3 className={`text-lg font-display font-medium mb-2 ${selected === "none" ? "text-primary" : ""}`}>
								No Side Panels
							</h3>
							<p className="text-sm text-muted-foreground font-display font-light">
								Back wall only
							</p>
						</div>
					</div>
				</button>

				{/* Single */}
				<button
					onClick={() => handlePanelChange("single")}
					className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-center ${selected === "single"
							? "border-primary bg-primary/5 scale-[1.02]"
							: "border-border hover:border-primary/50 hover:shadow-lg"
						}`}
				>
					{selected === "single" && (
						<div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
								<path d="M20 6 9 17l-5-5" />
							</svg>
						</div>
					)}

					<div className="space-y-4">
						{/* L-shape diagram */}
						<div className="w-full h-24 flex items-center justify-center">
							<div className="relative">
								<div className="w-16 h-20 border-4 border-primary/40 rounded" />
								<div className="absolute right-0 top-0 w-8 h-20 border-4 border-l-0 border-primary rounded-r" />
							</div>
						</div>

						<div>
							<h3 className={`text-lg font-display font-medium mb-2 ${selected === "single" ? "text-primary" : ""}`}>
								Single Side
							</h3>
							<p className="text-sm text-muted-foreground font-display font-light">
								L-shaped design
							</p>
						</div>
					</div>
				</button>

				{/* Both */}
				<button
					onClick={() => handlePanelChange("both")}
					className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-center ${selected === "both"
							? "border-primary bg-primary/5 scale-[1.02]"
							: "border-border hover:border-primary/50 hover:shadow-lg"
						}`}
				>
					{selected === "both" && (
						<div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
								<path d="M20 6 9 17l-5-5" />
							</svg>
						</div>
					)}

					<div className="space-y-4">
						{/* U-shape diagram */}
						<div className="w-full h-24 flex items-center justify-center">
							<div className="relative">
								<div className="w-16 h-20 border-4 border-primary/40 rounded" />
								<div className="absolute right-0 top-0 w-8 h-20 border-4 border-l-0 border-primary rounded-r" />
								<div className="absolute left-0 top-0 w-8 h-20 border-4 border-r-0 border-primary rounded-l" />
							</div>
						</div>

						<div>
							<h3 className={`text-lg font-display font-medium mb-2 ${selected === "both" ? "text-primary" : ""}`}>
								Both Sides
							</h3>
							<p className="text-sm text-muted-foreground font-display font-light">
								U-shaped enclosure
							</p>
						</div>
					</div>
				</button>
			</div>

			{/* Width input (if single or both selected) */}
			{selected !== "none" && (
				<div className="max-w-md space-y-4 p-6 bg-muted/30 rounded-xl border">
					<div className="space-y-2">
						<label className="text-sm font-medium font-display flex items-center justify-between">
							<span className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-blue-500" />
								Side Panel Width (Internal)
							</span>
							<span className="text-lg font-mono font-semibold">{tempWidth}cm</span>
						</label>
						<p className="text-xs text-muted-foreground font-display font-light">
							Minimum: 30cm
						</p>
					</div>

					<input
						type="range"
						min="30"
						max="80"
						step="5"
						value={tempWidth}
						onChange={(e) => {
							const newWidth = parseInt(e.target.value);
							setTempWidth(newWidth);
							onChange(selected, newWidth);
						}}
						className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
					/>
				</div>
			)}
		</section>
	);
}