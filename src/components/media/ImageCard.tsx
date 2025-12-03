// @ts-nocheck
// src/components/media/ImageCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
	MoreVertical,
	Eye,
	Pencil,
	Trash2,
	ExternalLink,
	Copy,
	Check,
	ArrowUpRight,
} from "lucide-react";
import { cn } from "~/lib/utils";
import Link from "next/link";

interface ImageCardProps {
	id: string;
	url: string;
	alt?: string | null;
	width?: number | null;
	height?: number | null;
	fileSize?: number | null;
	mimeType?: string | null;
	sortOrder?: number;
	isSelected?: boolean;
	onSelect?: (id: string) => void;
	onEdit?: (id: string) => void;
	onDelete?: (id: string) => void;
	onView?: (id: string) => void;
	className?: string;
	detailPageHref?: string; // Optional link to detail page (e.g., `/admin/content/gallery/${id}`)
	clickable?: boolean; // Whether the whole card is clickable
}

export function ImageCard({
	id,
	url,
	alt,
	width,
	height,
	fileSize,
	mimeType,
	sortOrder,
	isSelected = false,
	onSelect,
	onEdit,
	onDelete,
	onView,
	className,
	detailPageHref,
	clickable = true,
}: ImageCardProps) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [copied, setCopied] = useState(false);

	const formatFileSize = (bytes: number | null | undefined) => {
		if (!bytes) return "—";
		const kb = bytes / 1024;
		if (kb < 1024) return `${kb.toFixed(1)} KB`;
		return `${(kb / 1024).toFixed(1)} MB`;
	};

	const copyToClipboard = async (text: string) => {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// Determine the detail page href (use provided or generate default)
	const href = detailPageHref || `/admin/content/gallery/${id}`;

	// Card wrapper - either Link or div
	const CardWrapper = clickable && !isSelected ? Link : "div";
	const cardWrapperProps = clickable && !isSelected ? { href } : {};

	return (
		<>
			<CardWrapper {...cardWrapperProps}>
				<Card
					className={cn(
						"group relative overflow-hidden transition-all hover:shadow-lg",
						clickable && !isSelected && "cursor-pointer",
						isSelected && "ring-2 ring-primary",
						className
					)}
				>
					{/* Selection checkbox overlay */}
					{onSelect && (
						<div className="absolute top-2 left-2 z-10">
							<input
								type="checkbox"
								checked={isSelected}
								onChange={() => onSelect(id)}
								className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
							/>
						</div>
					)}

					{/* Image */}
					<div className="relative aspect-square w-full overflow-hidden bg-muted">
						<Image
							src={url}
							alt={alt || "Gallery image"}
							fill
							className="object-cover transition-transform group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>

						{/* Hover overlay with actions */}
						<div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
							{onView && (
								<Button
									size="icon"
									variant="secondary"
									onClick={() => onView(id)}
									className="h-9 w-9 rounded-full"
								>
									<Eye className="h-4 w-4" />
								</Button>
							)}
							{onEdit && (
								<Button
									size="icon"
									variant="secondary"
									onClick={() => onEdit(id)}
									className="h-9 w-9 rounded-full"
								>
									<Pencil className="h-4 w-4" />
								</Button>
							)}
						</div>
					</div>

					{/* Info footer */}
					<div className="p-3 space-y-2">
						{/* Alt text */}
						<div className="flex items-start justify-between gap-2">
							<p className="text-sm font-display font-light truncate flex-1">
								{alt || "Untitled image"}
							</p>

							{/* More actions dropdown */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										size="icon"
										variant="ghost"
										className="h-6 w-6 -mt-1"
										onClick={(e) => e.stopPropagation()} // Prevent card click
									>
										<MoreVertical className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
									{clickable && (
										<DropdownMenuItem asChild>
											<Link href={href}>
												<ArrowUpRight className="mr-2 h-4 w-4" />
												View Details
											</Link>
										</DropdownMenuItem>
									)}
									<DropdownMenuItem onClick={() => window.open(url, "_blank")}>
										<ExternalLink className="mr-2 h-4 w-4" />
										Open in new tab
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => copyToClipboard(url)}>
										{copied ? (
											<Check className="mr-2 h-4 w-4 text-green-500" />
										) : (
											<Copy className="mr-2 h-4 w-4" />
										)}
										{copied ? "Copied!" : "Copy URL"}
									</DropdownMenuItem>
									{onEdit && (
										<DropdownMenuItem onClick={() => onEdit(id)}>
											<Pencil className="mr-2 h-4 w-4" />
											Edit details
										</DropdownMenuItem>
									)}
									{onDelete && (
										<DropdownMenuItem
											onClick={() => setDeleteDialogOpen(true)}
											className="text-destructive focus:text-destructive"
										>
											<Trash2 className="mr-2 h-4 w-4" />
											Delete
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{/* Metadata badges */}
						<div className="flex flex-wrap gap-1.5">
							{width && height && (
								<Badge variant="outline" className="text-xs font-display font-light">
									{width}×{height}
								</Badge>
							)}
							{fileSize && (
								<Badge variant="outline" className="text-xs font-display font-light">
									{formatFileSize(fileSize)}
								</Badge>
							)}
							{mimeType && (
								<Badge variant="outline" className="text-xs font-display font-light">
									{mimeType.split("/")[1]?.toUpperCase()}
								</Badge>
							)}
							{sortOrder !== undefined && sortOrder !== 0 && (
								<Badge variant="secondary" className="text-xs font-display font-light">
									#{sortOrder}
								</Badge>
							)}
						</div>
					</div>
				</Card>
			</CardWrapper>

			{/* Delete confirmation dialog */}
			{onDelete && (
				<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete Image?</AlertDialogTitle>
							<AlertDialogDescription>
								This will permanently delete this image. This action cannot be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									onDelete(id);
									setDeleteDialogOpen(false);
								}}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</>
	);
}