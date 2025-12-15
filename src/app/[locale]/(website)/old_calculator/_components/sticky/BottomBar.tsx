// src/app/(website)/calculator/_components/sticky/BottomBar.tsx
"use client";

import { useState } from "react";
import { AquariumScene } from "../../_world/AquariumScene";
import { PriceBreakdown } from "./PriceBreakdown";
import { UnitToggle } from "../dimensions/UnitToggle";
import type { Dimensions, PriceEstimate } from "../../calculator-types";

type BottomBarState = "collapsed" | "preview" | "showcase";

interface BottomBarProps {
	dimensions: Dimensions;
	estimate: PriceEstimate;
	backgroundTexture?: string;
	subcategoryTexture?: string;
	completionPercent: number;
}

export function BottomBar({
	dimensions,
	estimate,
	backgroundTexture,
	subcategoryTexture,
	completionPercent,
}: BottomBarProps) {
	const [state, setState] = useState<BottomBarState>("preview");

	// Collapsed: Only show progress + price + expand button
	if (state === "collapsed") {
		return (
			<div className="fixed bottom-0 left-0 right-0 z-40 bg-primary border-t-4 border-primary-foreground/20 shadow-2xl">
				<div className="container max-w-7xl mx-auto px-4">
					<div className="flex items-center justify-between py-4">
						{/* Left: Progress */}
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<span className="text-sm font-display font-light text-primary-foreground/80">
									Progress
								</span>
								<span className="text-lg font-display font-bold text-primary-foreground">
									{Math.round(completionPercent)}%
								</span>
							</div>

							{/* Progress bar */}
							<div className="hidden md:block w-48 h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
								<div
									className="h-full bg-primary-foreground transition-all duration-500"
									style={{ width: `${completionPercent}%` }}
								/>
							</div>
						</div>

						{/* Right: Price + Expand */}
						<div className="flex items-center gap-4">
							<div className="text-right">
								<p className="text-xs font-display font-light text-primary-foreground/80">
									Estimated Total
								</p>
								<p className="text-2xl font-display font-bold text-primary-foreground">
									€{estimate.total}
								</p>
							</div>

							<button
								onClick={() => setState("preview")}
								className="p-3 bg-primary-foreground text-primary rounded-full hover:scale-110 transition-transform"
								aria-label="Expand calculator"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="m18 15-6-6-6 6" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Preview: Price summary + small 3D (default)
	if (state === "preview") {
		return (
			<div className="fixed bottom-0 left-0 right-0 z-40 bg-primary border-t-4 border-primary-foreground/20 shadow-2xl">
				<div className="container max-w-7xl mx-auto px-4 py-4">
					<div className="flex items-start justify-between gap-6">
						{/* Left: Progress */}
						<div className="flex-shrink-0 pt-2">
							<div className="flex items-center gap-3">
								<div className="flex items-center gap-2">
									<span className="text-sm font-display font-light text-primary-foreground/80">
										Progress
									</span>
									<span className="text-xl font-display font-bold text-primary-foreground">
										{Math.round(completionPercent)}%
									</span>
								</div>

								{/* Progress bar - vertical on mobile */}
								<div className="hidden md:block w-32 h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
									<div
										className="h-full bg-primary-foreground transition-all duration-500"
										style={{ width: `${completionPercent}%` }}
									/>
								</div>
							</div>
						</div>

						{/* Right: Sticky Container */}
						<div className="flex-shrink-0 w-full md:w-auto md:min-w-[400px] lg:min-w-[500px]">
							<div className="bg-card rounded-t-2xl shadow-2xl border-2 border-primary-foreground/20">
								{/* Header with controls */}
								<div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
									<div className="flex items-center gap-3">
										<h3 className="text-sm font-display font-medium">Live Preview</h3>
										<UnitToggle />
									</div>

									<div className="flex items-center gap-2">
										{/* Showcase button - desktop only */}
										<button
											onClick={() => setState("showcase")}
											className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
											title="Expand to showcase mode"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path d="M21 21H3V3h5.5M21 3h-7.5M21 3v7.5" />
												<path d="M21 3L9 15" />
											</svg>
											<span className="text-xs font-display">Expand</span>
										</button>

										{/* Collapse button */}
										<button
											onClick={() => setState("collapsed")}
											className="p-2 rounded-lg hover:bg-accent transition-colors"
											aria-label="Collapse calculator"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path d="m6 9 6 6 6-6" />
											</svg>
										</button>
									</div>
								</div>

								{/* Content: 3D + Price side by side */}
								<div className="grid md:grid-cols-[1fr_280px] gap-4 p-4">
									{/* 3D Scene */}
									<div className="rounded-xl overflow-hidden border bg-gradient-to-b from-background to-accent/5">
										<div className="h-[280px]">
											<AquariumScene
												width={dimensions.width}
												height={dimensions.height}
												depth={dimensions.depth}
												backgroundTexture={backgroundTexture}
												subcategoryTexture={subcategoryTexture}
											/>
										</div>
									</div>

									{/* Price Breakdown */}
									<div className="hidden md:block">
										<PriceBreakdown estimate={estimate} />
									</div>
								</div>

								{/* Mobile: Price below 3D */}
								<div className="md:hidden px-4 pb-4">
									<PriceBreakdown estimate={estimate} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Showcase: Big 3D left + Price right (desktop only)
	if (state === "showcase") {
		return (
			<div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg">
				<div className="container max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
					<div className="w-full h-full max-h-[90vh] py-8">
						<div className="bg-card rounded-2xl shadow-2xl border-2 border-primary/20 h-full flex flex-col">
							{/* Header */}
							<div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
								<div className="flex items-center gap-4">
									<h2 className="text-xl font-display font-medium">Interactive Preview</h2>
									<UnitToggle />
								</div>

								<div className="flex items-center gap-2">
									<button
										onClick={() => setState("preview")}
										className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M3 15h7.5M3 15v7.5M3 15L9 21" />
											<path d="M21 9h-7.5M21 9V1.5M21 9l-6-6" />
										</svg>
										<span className="text-sm font-display">Minimize</span>
									</button>
								</div>
							</div>

							{/* Content: Big 3D left, Price right */}
							<div className="flex-1 grid grid-cols-[1fr_320px] gap-6 p-6 overflow-hidden">
								{/* 3D Scene - takes most space */}
								<div className="rounded-2xl overflow-hidden border bg-gradient-to-b from-background to-accent/5">
									<AquariumScene
										width={dimensions.width}
										height={dimensions.height}
										depth={dimensions.depth}
										backgroundTexture={backgroundTexture}
										subcategoryTexture={subcategoryTexture}
									/>
								</div>

								{/* Price Breakdown - sidebar */}
								<div className="overflow-y-auto">
									<PriceBreakdown estimate={estimate} />

									{/* Trust badges */}
									<div className="mt-4 space-y-3">
										<div className="p-4 bg-accent/5 rounded-xl border">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="18"
														height="18"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="text-primary"
													>
														<path d="M20 6 9 17l-5-5" />
													</svg>
												</div>
												<div>
													<p className="text-sm font-display font-medium">Free Shipping</p>
													<p className="text-xs text-muted-foreground font-display">10-12 day production</p>
												</div>
											</div>
										</div>

										<div className="p-4 bg-accent/5 rounded-xl border">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="18"
														height="18"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="text-primary"
													>
														<path d="M12 2v20M2 12h20" />
													</svg>
												</div>
												<div>
													<p className="text-sm font-display font-medium">Handcrafted</p>
													<p className="text-xs text-muted-foreground font-display">20+ years experience</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return null;
}