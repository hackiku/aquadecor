// src/app/admin/_components/primitives/DraggableGrid.tsx

"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { GripVertical, Pencil, ImageIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

interface GridItemProps {
	id: string;
	index: number;
	title: string;
	subtitle?: string;
	imageUrl?: string | null;
	status?: boolean;
	onDragStart: (index: number) => void;
	onDragEnter: (index: number) => void;
	onDragEnd: () => void;
	onEdit?: () => void;
	isDragging: boolean;
}

function GridItem({
	title,
	subtitle,
	imageUrl,
	status,
	onDragStart,
	onDragEnter,
	onDragEnd,
	onEdit,
	index,
	isDragging,
}: GridItemProps) {
	return (
		<div
			draggable
			onDragStart={() => onDragStart(index)}
			onDragEnter={() => onDragEnter(index)}
			onDragEnd={onDragEnd}
			onDragOver={(e) => e.preventDefault()}
			className={cn(
				"relative group transition-all duration-200 ease-in-out touch-none",
				isDragging ? "opacity-50 scale-95 z-50 ring-2 ring-primary" : "opacity-100",
				"h-full"
			)}
		>
			<Card className="h-full overflow-hidden border-2 hover:border-primary/50 transition-colors bg-card">
				{/* Image Area */}
				<div className="relative aspect-square bg-muted border-b">
					{imageUrl ? (
						<Image
							src={imageUrl}
							alt={title}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 50vw, 33vw"
						/>
					) : (
						<div className="flex items-center justify-center h-full text-muted-foreground/30">
							<ImageIcon className="w-12 h-12" />
						</div>
					)}

					{/* Order Badge (Top Right) */}
					<div className="absolute top-2 right-2 z-10">
						<Badge variant="secondary" className="font-mono text-xs shadow-sm bg-background/80 backdrop-blur">
							#{index + 1}
						</Badge>
					</div>

					{/* Status Badge (Top Left) */}
					{status !== undefined && (
						<div className="absolute top-2 left-2 z-10">
							<Badge
								variant={status ? "default" : "destructive"}
								className={cn("text-[10px] h-5 shadow-sm", !status && "opacity-80")}
							>
								{status ? "Active" : "Hidden"}
							</Badge>
						</div>
					)}

					{/* Drag Handle Overlay */}
					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing">
						<GripVertical className="w-8 h-8 text-white drop-shadow-md" />
					</div>
				</div>

				{/* Content */}
				<div className="p-3">
					<div className="flex items-start justify-between gap-2">
						<div className="min-w-0">
							<h4 className="font-medium text-sm truncate" title={title}>
								{title}
							</h4>
							{subtitle && (
								<p className="text-xs text-muted-foreground truncate font-mono">
									{subtitle}
								</p>
							)}
						</div>

						{onEdit && (
							<Button
								size="icon"
								variant="ghost"
								className="h-6 w-6 -mr-1 text-muted-foreground hover:text-primary"
								onClick={(e) => {
									e.stopPropagation();
									onEdit();
								}}
							>
								<Pencil className="w-3.5 h-3.5" />
							</Button>
						)}
					</div>
				</div>
			</Card>
		</div>
	);
}

interface DraggableGridProps<T> {
	items: T[];
	onReorder: (newItems: T[]) => void;
	keyExtractor: (item: T) => string;
	renderItem?: (item: T, index: number) => React.ReactNode; // Optional custom render
	// Quick props for default card
	getTitle?: (item: T) => string;
	getSubtitle?: (item: T) => string;
	getImage?: (item: T) => string | null | undefined;
	getStatus?: (item: T) => boolean;
	onEdit?: (item: T) => void;
	className?: string;
}

export function DraggableGrid<T>({
	items,
	onReorder,
	keyExtractor,
	getTitle,
	getSubtitle,
	getImage,
	getStatus,
	onEdit,
	className
}: DraggableGridProps<T>) {
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
	const draggingItem = useRef<number | null>(null);

	const handleDragStart = (index: number) => {
		draggingItem.current = index;
		setDraggedIndex(index);
	};

	const handleDragEnter = (index: number) => {
		const draggedIdx = draggingItem.current;
		if (draggedIdx === null || draggedIdx === index) return;

		const newItems = [...items];
		const itemToMove = newItems[draggedIdx];
		newItems.splice(draggedIdx, 1);
		newItems.splice(index, 0, itemToMove!);

		draggingItem.current = index;
		setDraggedIndex(index);
		onReorder(newItems);
	};

	const handleDragEnd = () => {
		draggingItem.current = null;
		setDraggedIndex(null);
	};

	return (
		<div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", className)}>
			{items.map((item, index) => (
				<GridItem
					key={keyExtractor(item)}
					id={keyExtractor(item)}
					index={index}
					// Data accessors
					title={getTitle ? getTitle(item) : "Item"}
					subtitle={getSubtitle ? getSubtitle(item) : undefined}
					imageUrl={getImage ? getImage(item) : undefined}
					status={getStatus ? getStatus(item) : undefined}
					// Handlers
					onDragStart={handleDragStart}
					onDragEnter={handleDragEnter}
					onDragEnd={handleDragEnd}
					onEdit={onEdit ? () => onEdit(item) : undefined}
					isDragging={draggedIndex === index}
				/>
			))}
		</div>
	);
}