// src/app/admin/content/gallery/_components/GalleryFilters.tsx
"use client";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	Search,
	Grid3x3,
	LayoutGrid,
	Image as ImageIcon,
	Trash2,
} from "lucide-react";
import { cn } from "~/lib/utils";

interface GalleryFiltersProps {
	// Search & Sort
	searchQuery: string;
	onSearchChange: (query: string) => void;
	sortBy: "createdAt" | "sortOrder" | "altText";
	onSortByChange: (value: "createdAt" | "sortOrder" | "altText") => void;
	sortOrder: "asc" | "desc";
	onSortOrderChange: () => void;

	// Category filter
	categories?: Array<{
		id: string;
		name: string;
		imageCount: number;
	}>;
	selectedCategoryId?: string;
	onCategoryChange: (categoryId?: string) => void;

	// View options
	gridSize: "sm" | "md" | "lg";
	onGridSizeChange: (size: "sm" | "md" | "lg") => void;

	// Selection
	selectedCount: number;
	totalCount: number;
	onSelectAll: () => void;
	onBulkDelete: () => void;
}

export function GalleryFilters({
	searchQuery,
	onSearchChange,
	sortBy,
	onSortByChange,
	sortOrder,
	onSortOrderChange,
	categories = [],
	selectedCategoryId,
	onCategoryChange,
	gridSize,
	onGridSizeChange,
	selectedCount,
	totalCount,
	onSelectAll,
	onBulkDelete,
}: GalleryFiltersProps) {
	return (
		<div className="space-y-4">
			{/* Top row: Search + Category + Sort */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search by alt text or URL..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-10 font-display font-light"
					/>
				</div>

				{categories.length > 0 && (
					<Select
						value={selectedCategoryId ?? "all"}
						onValueChange={(v) => onCategoryChange(v === "all" ? undefined : v)}
					>
						<SelectTrigger className="w-[250px] font-display font-light">
							<SelectValue placeholder="All Categories" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all" className="font-display font-light">
								All Categories
							</SelectItem>
							{categories.map((cat) => (
								<SelectItem key={cat.id} value={cat.id} className="font-display font-light">
									{cat.name} ({cat.imageCount})
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}

				<Select value={sortBy} onValueChange={onSortByChange}>
					<SelectTrigger className="w-[180px] font-display font-light">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="createdAt" className="font-display font-light">
							Date uploaded
						</SelectItem>
						<SelectItem value="sortOrder" className="font-display font-light">
							Sort order
						</SelectItem>
						<SelectItem value="altText" className="font-display font-light">
							Alt text
						</SelectItem>
					</SelectContent>
				</Select>

				<Button
					variant="outline"
					size="icon"
					onClick={onSortOrderChange}
					className="rounded-full"
					title={sortOrder === "asc" ? "Ascending" : "Descending"}
				>
					{sortOrder === "asc" ? "↑" : "↓"}
				</Button>
			</div>

			{/* Bottom row: View options + Selection actions */}
			<div className="flex items-center justify-between">
				{/* Grid size toggle */}
				<div className="flex gap-1 p-1 rounded-lg border">
					<Button
						variant={gridSize === "sm" ? "secondary" : "ghost"}
						size="icon"
						onClick={() => onGridSizeChange("sm")}
						className="h-7 w-7"
						title="Small grid"
					>
						<Grid3x3 className="h-4 w-4" />
					</Button>
					<Button
						variant={gridSize === "md" ? "secondary" : "ghost"}
						size="icon"
						onClick={() => onGridSizeChange("md")}
						className="h-7 w-7"
						title="Medium grid"
					>
						<LayoutGrid className="h-4 w-4" />
					</Button>
					<Button
						variant={gridSize === "lg" ? "secondary" : "ghost"}
						size="icon"
						onClick={() => onGridSizeChange("lg")}
						className="h-7 w-7"
						title="Large grid"
					>
						<ImageIcon className="h-4 w-4" />
					</Button>
				</div>

				{/* Selection actions */}
				{selectedCount > 0 && (
					<div className="flex gap-2 items-center">
						<Badge variant="secondary" className="font-display font-light">
							{selectedCount} selected
						</Badge>
						<Button
							variant="outline"
							size="sm"
							onClick={onSelectAll}
							className="rounded-full"
						>
							{selectedCount === totalCount ? "Deselect all" : "Select all"}
						</Button>
						<Button
							variant="destructive"
							size="sm"
							onClick={onBulkDelete}
							className="rounded-full"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}