// src/app/gallery/_components/GalleryGridSelector.tsx
"use client";

import { Button } from "~/components/ui/button";
import { Grid3x3, LayoutGrid, Rows } from "lucide-react";
import { cn } from "~/lib/utils";

export type GridCols = "2" | "3" | "4";

interface GalleryGridSelectorProps {
	columns: GridCols;
	onChange: (cols: GridCols) => void;
}

export function GalleryGridSelector({ columns, onChange }: GalleryGridSelectorProps) {
	return (
		<div className="flex items-center bg-muted/30 p-1 rounded-lg border border-border/50 backdrop-blur-sm">
			<Button
				variant="ghost"
				size="icon"
				className={cn("h-8 w-8 rounded-md transition-all", columns === "2" && "bg-background shadow-sm text-primary")}
				onClick={() => onChange("2")}
				title="2 Columns"
			>
				<Rows className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				className={cn("h-8 w-8 rounded-md transition-all", columns === "3" && "bg-background shadow-sm text-primary")}
				onClick={() => onChange("3")}
				title="3 Columns"
			>
				<LayoutGrid className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				className={cn("h-8 w-8 rounded-md transition-all hidden md:flex", columns === "4" && "bg-background shadow-sm text-primary")}
				onClick={() => onChange("4")}
				title="4 Columns"
			>
				<Grid3x3 className="h-4 w-4" />
			</Button>
		</div>
	);
}