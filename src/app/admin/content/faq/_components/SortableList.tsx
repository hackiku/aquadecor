// src/app/admin/content/faq/SortableList.tsx
"use client";

import React, { useState, useRef } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "~/lib/utils";

interface SortableItemProps {
	id: string;
	index: number;
	children: React.ReactNode;
	onDragStart: (index: number) => void;
	onDragEnter: (index: number) => void;
	onDragEnd: () => void;
	isDragging: boolean;
}

function SortableItem({
	children,
	onDragStart,
	onDragEnter,
	onDragEnd,
	index,
	isDragging
}: SortableItemProps) {
	return (
		<div
			draggable
			onDragStart={() => onDragStart(index)}
			onDragEnter={() => onDragEnter(index)}
			onDragEnd={onDragEnd}
			onDragOver={(e) => e.preventDefault()}
			className={cn(
				"transition-transform duration-200 ease-in-out touch-none",
				isDragging ? "opacity-50 scale-[0.98] z-50 ring-2 ring-primary/20 rounded-lg" : "opacity-100"
			)}
		>
			<div className="flex items-center gap-2">
				<div className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground/30 hover:text-foreground transition-colors">
					<GripVertical className="w-5 h-5" />
				</div>
				<div className="flex-1 min-w-0">
					{children}
				</div>
			</div>
		</div>
	);
}

interface SortableListProps<T> {
	items: T[];
	onReorder: (newItems: T[]) => void;
	renderItem: (item: T) => React.ReactNode;
	keyExtractor: (item: T) => string;
	className?: string;
}

export function SortableList<T>({
	items,
	onReorder,
	renderItem,
	keyExtractor,
	className
}: SortableListProps<T>) {
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
	const draggingItem = useRef<number | null>(null);

	const handleDragStart = (index: number) => {
		draggingItem.current = index;
		setDraggedIndex(index);
	};

	const handleDragEnter = (index: number) => {
		const draggedIdx = draggingItem.current;
		if (draggedIdx === null || draggedIdx === index) return;

		// Create new array with swapped items
		const newItems = [...items];
		const itemToMove = newItems[draggedIdx];

		// Remove from old pos
		newItems.splice(draggedIdx, 1);
		// Insert at new pos
		newItems.splice(index, 0, itemToMove!);

		// Update ref to track current position while dragging
		draggingItem.current = index;
		setDraggedIndex(index);

		// Optimistic update
		onReorder(newItems);
	};

	const handleDragEnd = () => {
		draggingItem.current = null;
		setDraggedIndex(null);
	};

	return (
		<div className={cn("space-y-2", className)}>
			{items.map((item, index) => (
				<SortableItem
					key={keyExtractor(item)}
					id={keyExtractor(item)}
					index={index}
					onDragStart={handleDragStart}
					onDragEnter={handleDragEnter}
					onDragEnd={handleDragEnd}
					isDragging={draggedIndex === index}
				>
					{renderItem(item)}
				</SortableItem>
			))}
		</div>
	);
}