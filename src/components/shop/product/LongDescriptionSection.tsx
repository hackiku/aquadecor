// src/components/shop/product/LongDescriptionSection.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface LongDescriptionSectionProps {
	longDescription?: string | null;
}

export function LongDescriptionSection({ longDescription }: LongDescriptionSectionProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	if (!longDescription) {
		return null;
	}

	return (
		<div className="relative space-y-4">
				{/* Content Container */}
				<div
					className={`
						relative overflow-hidden transition-all duration-500
						${isExpanded ? 'max-h-none' : 'max-h-48'}
					`}
				>
					<div className="prose prose-sm max-w-none font-display font-light leading-relaxed text-muted-foreground">
						{longDescription}
					</div>

					{/* Gradient Fade */}
					{!isExpanded && (
						<div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent pointer-events-none" />
					)}
				</div>

				{/* Read More Button */}
				<div className="flex justify-center pt-4">
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="group inline-flex items-center gap-2 text-sm font-display font-medium text-primary hover:text-primary/80 transition-colors"
					>
						{isExpanded ? 'Show less' : 'Read more'}
						<ChevronDown
							className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
						/>
					</button>
				</div>
		</div>
	);
}