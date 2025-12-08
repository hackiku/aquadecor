// src/app/(website)/calculator/_components/options/FiltrationSelector.tsx

"use client";

import { useState } from "react";
import type { FiltrationType } from "../../calculator-types";

interface FiltrationSelectorProps {
	selected: FiltrationType;
	customNotes?: string;
	onChange: (type: FiltrationType, customNotes?: string) => void;
}

const FILTRATION_OPTIONS = [
	{ value: "none" as const, label: "No Cutout", description: "Background without filter opening" },
	{ value: "eheim-classic" as const, label: "Eheim Classic", description: "For Eheim Classic series filters" },
	{ value: "jbl-cristalprofi" as const, label: "JBL CristalProfi", description: "For JBL CristalProfi series" },
	{ value: "juwel-bioflow" as const, label: "Juwel Bioflow", description: "For Juwel internal filters" },
	{ value: "fluval" as const, label: "Fluval", description: "For Fluval canister filters" },
	{ value: "tetra-ex" as const, label: "Tetra EX", description: "For Tetra EX series" },
	{ value: "custom" as const, label: "Custom/Other", description: "Specify your filter model" },
];

export function FiltrationSelector({ selected, customNotes, onChange }: FiltrationSelectorProps) {
	const [tempCustomNotes, setTempCustomNotes] = useState(customNotes || "");

	const handleSelect = (type: FiltrationType) => {
		if (type === "custom") {
			onChange(type, tempCustomNotes);
		} else {
			onChange(type);
		}
	};

	return (
		<section className="py-12 space-y-6">
			<div className="space-y-3">
				<h2 className="text-2xl md:text-3xl font-display font-light">
					Filtration Cutout (Optional)
				</h2>
				<p className="text-muted-foreground font-display font-light text-lg">
					If you have a filter that needs to sit behind or through the background, select your filter type below.
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-4 max-w-4xl">
				{FILTRATION_OPTIONS.map((option) => (
					<button
						key={option.value}
						onClick={() => handleSelect(option.value)}
						className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${selected === option.value
								? "border-primary bg-primary/5 scale-[1.02]"
								: "border-border hover:border-primary/50 hover:shadow-md"
							}`}
					>
						{/* Selected indicator */}
						{selected === option.value && (
							<div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
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

						<div className="space-y-2 pr-8">
							<h3 className={`text-lg font-display font-medium transition-colors ${selected === option.value ? "text-primary" : ""
								}`}>
								{option.label}
							</h3>
							<p className="text-sm text-muted-foreground font-display font-light">
								{option.description}
							</p>
						</div>
					</button>
				))}
			</div>

			{/* Custom filter notes input */}
			{selected === "custom" && (
				<div className="max-w-2xl space-y-3 p-6 bg-muted/30 rounded-xl border">
					<label className="text-sm font-medium font-display block">
						Filter Details
					</label>
					<textarea
						value={tempCustomNotes}
						onChange={(e) => {
							setTempCustomNotes(e.target.value);
							onChange("custom", e.target.value);
						}}
						placeholder="Please specify your filter brand, model, and any special requirements for the cutout..."
						rows={4}
						className="w-full px-4 py-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary font-display text-sm"
					/>
					<p className="text-xs text-muted-foreground font-display font-light">
						💡 Include filter dimensions if known, or we'll confirm these details with you during the quote process.
					</p>
				</div>
			)}

			{/* Pricing note */}
			{selected !== "none" && (
				<div className="max-w-2xl p-4 bg-accent/5 rounded-xl border">
					<p className="text-sm text-muted-foreground font-display font-light">
						ℹ️ Filter cutouts are included at a flat rate of €50 per opening. We'll confirm exact placement during the quote process.
					</p>
				</div>
			)}
		</section>
	);
}