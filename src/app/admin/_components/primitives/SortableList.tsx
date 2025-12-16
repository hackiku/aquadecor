// src/app/admin/_components/primitives/SortableList.tsx

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
	dragHandle?: boolean;
}

function SortableItem({
	children,
	onDragStart,
	onDragEnter,
	onDragEnd,
	index,
	isDragging,
	dragHandle = true
}: SortableItemProps) {
	return (
		<div
			draggable={dragHandle}
			onDragStart={() => onDragStart(index)}
			onDragEnter={() => onDragEnter(index)}
			onDragEnd={onDragEnd}
			onDragOver={(e) => e.preventDefault()}
			className={cn(
				"transition-transform duration-200 ease-in-out touch-none bg-card border rounded-lg mb-2",
				isDragging ? "opacity-50 scale-[0.98] z-50 ring-2 ring-primary/20" : "opacity-100"
			)}
		>
			<div className="flex items-center gap-3 p-3">
				{dragHandle && (
					<div className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-foreground transition-colors">
						<GripVertical className="w-5 h-5" />
					</div>
				)}
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
		<div className={cn("", className)}>
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