// src/app/(website)/calculator/_components/dimensions/DimensionControls.tsx

"use client";

import { Slider } from "~/components/ui/slider";
import { useUnitConverter } from "../../_context/UnitContext";
import type { Dimensions } from "../../calculator-types";

interface DimensionControlsProps {
	dimensions: Dimensions;
	unit: "cm" | "inch"; // Keep for compatibility but will use context
	onChange: (dimensions: Dimensions) => void;
}

export function DimensionControls({ dimensions, onChange }: DimensionControlsProps) {
	const { format } = useUnitConverter();

	return (
		<section className="py-12 space-y-8">
			<div className="space-y-3">
				<h2 className="text-2xl md:text-3xl font-display font-light">
					Configure Dimensions
				</h2>
				<p className="text-muted-foreground font-display font-light text-lg">
					Adjust the width, height, and depth of your aquarium background. Watch it update in real-time.
				</p>
			</div>

			<div className="grid gap-8 max-w-2xl">
				{/* Width */}
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<div className="space-y-1">
							<label className="text-sm font-medium font-display flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-red-500" />
								Width (Internal)
							</label>
							<p className="text-xs text-muted-foreground font-display font-light">
								Minimum: 50cm (20")
							</p>
						</div>
						<span className="text-lg font-mono font-semibold">
							{format(dimensions.width)}
						</span>
					</div>
					<Slider
						value={[dimensions.width]}
						onValueChange={([value]) =>
							onChange({ ...dimensions, width: value ?? 100 })
						}
						min={50}
						max={200}
						step={5}
						className="w-full"
					/>
				</div>

				{/* Height */}
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<div className="space-y-1">
							<label className="text-sm font-medium font-display flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-green-500" />
								Height (Internal)
							</label>
							<p className="text-xs text-muted-foreground font-display font-light">
								Minimum: 30cm (12")
							</p>
						</div>
						<span className="text-lg font-mono font-semibold">
							{format(dimensions.height)}
						</span>
					</div>
					<Slider
						value={[dimensions.height]}
						onValueChange={([value]) =>
							onChange({ ...dimensions, height: value ?? 50 })
						}
						min={30}
						max={100}
						step={5}
						className="w-full"
					/>
				</div>

				{/* Depth */}
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<div className="space-y-1">
							<label className="text-sm font-medium font-display flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-blue-500" />
								Depth (Internal)
							</label>
							<p className="text-xs text-muted-foreground font-display font-light">
								Minimum: 30cm (12")
							</p>
						</div>
						<span className="text-lg font-mono font-semibold">
							{format(dimensions.depth)}
						</span>
					</div>
					<Slider
						value={[dimensions.depth]}
						onValueChange={([value]) =>
							onChange({ ...dimensions, depth: value ?? 40 })
						}
						min={30}
						max={80}
						step={5}
						className="w-full"
					/>
				</div>
			</div>

			{/* Summary Card */}
			<div className="p-6 bg-muted/30 rounded-xl max-w-2xl">
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div className="space-y-1">
						<p className="text-muted-foreground font-display font-light">Surface Area</p>
						<p className="text-lg font-display font-medium">
							{((dimensions.width * dimensions.height) / 10000).toFixed(2)}m²
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-muted-foreground font-display font-light">Volume</p>
						<p className="text-lg font-display font-medium">
							{Math.round((dimensions.width * dimensions.height * dimensions.depth) / 1000)}L
						</p>
					</div>
				</div>
			</div>

			{/* Color Legend */}
			<div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground font-display font-light">
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 rounded-full bg-red-500" />
					<span>Width</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 rounded-full bg-green-500" />
					<span>Height</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 rounded-full bg-blue-500" />
					<span>Depth</span>
				</div>
			</div>
		</section>
	);
}