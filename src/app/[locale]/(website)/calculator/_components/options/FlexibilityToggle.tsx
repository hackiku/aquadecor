// src/app/(website)/calculator/_components/options/FlexibilityToggle.tsx

"use client";

import type { FlexibilityType } from "../../calculator-types";

interface FlexibilityToggleProps {
	selected: FlexibilityType;
	onChange: (type: FlexibilityType) => void;
}

export function FlexibilityToggle({ selected, onChange }: FlexibilityToggleProps) {
	return (
		<section className="py-12 space-y-6">
			<div className="space-y-3">
				<h2 className="text-2xl md:text-3xl font-display font-light">
					Material Type
				</h2>
				<p className="text-muted-foreground font-display font-light text-lg">
					Choose between solid or flexible material based on your installation preference.
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-6 max-w-3xl">
				{/* Solid Option */}
				<button
					onClick={() => onChange("solid")}
					className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${selected === "solid"
							? "border-primary bg-primary/5 scale-[1.02]"
							: "border-border hover:border-primary/50 hover:shadow-lg"
						}`}
				>
					{/* Selected indicator */}
					{selected === "solid" && (
						<div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
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
						{/* Icon */}
						<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-primary"
							>
								<rect width="18" height="18" x="3" y="3" rx="2" />
							</svg>
						</div>

						{/* Title */}
						<div>
							<h3 className={`text-xl font-display font-medium mb-2 transition-colors ${selected === "solid" ? "text-primary" : ""
								}`}>
								Solid (Standard)
							</h3>
							<p className="text-sm text-muted-foreground font-display font-light">
								Rigid material with vacuum suction cups. Easy installation, stays firmly in place.
							</p>
						</div>

						{/* Features */}
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li className="flex items-start gap-2">
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
									className="text-primary shrink-0 mt-0.5"
								>
									<path d="M20 6 9 17l-5-5" />
								</svg>
								<span className="font-display font-light">Most popular choice</span>
							</li>
							<li className="flex items-start gap-2">
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
									className="text-primary shrink-0 mt-0.5"
								>
									<path d="M20 6 9 17l-5-5" />
								</svg>
								<span className="font-display font-light">Suction cup installation</span>
							</li>
							<li className="flex items-start gap-2">
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
									className="text-primary shrink-0 mt-0.5"
								>
									<path d="M20 6 9 17l-5-5" />
								</svg>
								<span className="font-display font-light">Standard pricing</span>
							</li>
						</ul>
					</div>
				</button>

				{/* Flexible Option */}
				<button
					onClick={() => onChange("flexible")}
					className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${selected === "flexible"
							? "border-primary bg-primary/5 scale-[1.02]"
							: "border-border hover:border-primary/50 hover:shadow-lg"
						}`}
				>
					{/* Selected indicator */}
					{selected === "flexible" && (
						<div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
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
						{/* Icon */}
						<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-primary"
							>
								<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
							</svg>
						</div>

						{/* Title */}
						<div>
							<h3 className={`text-xl font-display font-medium mb-2 transition-colors ${selected === "flexible" ? "text-primary" : ""
								}`}>
								Flexible (+20%)
							</h3>
							<p className="text-sm text-muted-foreground font-display font-light">
								Bendable material for custom curves. Perfect for bow-front tanks or unique shapes.
							</p>
						</div>

						{/* Features */}
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li className="flex items-start gap-2">
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
									className="text-primary shrink-0 mt-0.5"
								>
									<path d="M20 6 9 17l-5-5" />
								</svg>
								<span className="font-display font-light">Curves to fit tank shape</span>
							</li>
							<li className="flex items-start gap-2">
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
									className="text-primary shrink-0 mt-0.5"
								>
									<path d="M20 6 9 17l-5-5" />
								</svg>
								<span className="font-display font-light">Ideal for bow-front tanks</span>
							</li>
							<li className="flex items-start gap-2">
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
									className="text-primary shrink-0 mt-0.5"
								>
									<path d="M20 6 9 17l-5-5" />
								</svg>
								<span className="font-display font-light">+20% material cost</span>
							</li>
						</ul>
					</div>
				</button>
			</div>
		</section>
	);
}