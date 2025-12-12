// src/components/shop/product/LongDescriptionSection.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface LongDescriptionSectionProps {
	longDescription?: string | null;
}

export function LongDescriptionSection({ longDescription }: LongDescriptionSectionProps) {
	const t = useTranslations('shop.productDetail.description');
	const [isExpanded, setIsExpanded] = useState(false);

	if (!longDescription) {
		return null;
	}

	// Split by \n\n for paragraphs, then handle \n within paragraphs
	const paragraphs = longDescription.split(/\n\n+/).filter(p => p.trim());

	return (
		<div className="relative">
			{/* Content Container */}
			<div
				className={`
					relative overflow-hidden transition-all duration-500
					${isExpanded ? 'max-h-none' : 'max-h-48'}
				`}
			>
				<div className="space-y-4 font-display font-light leading-relaxed text-muted-foreground">
					{paragraphs.map((paragraph, idx) => {
						// Check if it's a bullet list (lines starting with •)
						const isList = paragraph.trim().startsWith('•');

						if (isList) {
							const listItems = paragraph
								.split('\n')
								.map(line => line.trim())
								.filter(line => line.startsWith('•'));

							return (
								<ul key={idx} className="space-y-2 pl-0">
									{listItems.map((item, i) => (
										<li key={i} className="flex items-start gap-3">
											<span className="text-primary mt-1">•</span>
											<span>{item.replace(/^•\s*/, '')}</span>
										</li>
									))}
								</ul>
							);
						}

						// Regular paragraph with potential line breaks
						const lines = paragraph.split('\n').filter(l => l.trim());
						return (
							<p key={idx}>
								{lines.map((line, i) => (
									<span key={i}>
										{line}
										{i < lines.length - 1 && <br />}
									</span>
								))}
							</p>
						);
					})}
				</div>

				{/* Gradient Fade */}
				{!isExpanded && (
					<div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
				)}
			</div>

			{/* Read More Button */}
			<div className="flex justify-center pt-4">
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="group inline-flex items-center gap-2 text-sm font-display font-medium text-primary hover:text-primary/80 transition-colors"
				>
					{isExpanded ? t('showLess') : t('readMore')}
					<ChevronDown
						className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
					/>
				</button>
			</div>
		</div>
	);
}