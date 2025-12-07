// src/components/media/MasonryGrid.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { ZoomIn } from "lucide-react";

export interface GalleryImage {
	id: string;
	url: string;
	alt: string | null;
	width: number | null;
	height: number | null;
}

interface MasonryGridProps {
	images: GalleryImage[];
	className?: string;
}

export function MasonryGrid({ images, className }: MasonryGridProps) {
	return (
		<div className={cn("columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4", className)}>
			{images.map((image) => (
				<GalleryItem key={image.id} image={image} />
			))}
		</div>
	);
}

function GalleryItem({ image }: { image: GalleryImage }) {
	const [isOpen, setIsOpen] = useState(false);

	// Aspect ratio calculation for smooth loading placeholder
	const aspectRatio = image.width && image.height ? image.height / image.width : 0.75;

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<div className="group relative break-inside-avoid overflow-hidden rounded-xl bg-muted cursor-zoom-in">
					<div style={{ paddingBottom: `${aspectRatio * 100}%` }} />
					<Image
						src={image.url}
						alt={image.alt || "Gallery image"}
						fill
						className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-110"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>

					{/* Overlay */}
					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
					<div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						<div className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm">
							<ZoomIn className="w-4 h-4" />
						</div>
					</div>
				</div>
			</DialogTrigger>

			<DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-none bg-transparent shadow-none flex items-center justify-center">
				<div className="relative w-full h-full min-h-[50vh]">
					<Image
						src={image.url}
						alt={image.alt || "Gallery image"}
						fill
						className="object-contain"
						quality={100}
						priority
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}