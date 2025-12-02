// src/app/(website)/calculator/_components/sticky/ProgressBar.tsx
"use client";

interface ProgressBarProps {
	completionPercent: number;
}

export function ProgressBar({ completionPercent }: ProgressBarProps) {
	return (
		<div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
			{/* Gradient fade at top with progress label inside */}
			<div className="relative h-10 bg-linear-to-b from-transparent to-background">
				<div className="absolute bottom-2 left-4 flex items-center gap-2">
					<span className="text-sm font-display font-light text-muted-foreground">
						Progress
					</span>
					<span className="text-lg font-display font-bold text-foreground">
						{Math.round(completionPercent)}%
					</span>
				</div>
			</div>

			{/* Thin progress bar */}
			<div className="h-1.5 bg-neutral-400 dark:bg-neutral-700 relative overflow-hidden">
				<div
					className="absolute inset-y-0 left-0 bg-primary transition-all duration-500"
					style={{ width: `${completionPercent}%` }}
				/>
			</div>
		</div>
	);
}