// src/components/shop/product/ImageSliderWithModal.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { cn } from "~/lib/utils";

interface ImageSliderWithModalProps {
	images: Array<{
		storageUrl: string;
		altText?: string | null;
	}>;
	productName: string;
}

// Reusable Chevron Button Component
function ChevronButton({
	direction,
	onClick,
	className,
}: {
	direction: "left" | "right";
	onClick: () => void;
	className?: string;
}) {
	const Icon = direction === "left" ? ChevronLeft : ChevronRight;
	return (
		<button
			onClick={onClick}
			className={cn(
				"rounded-full border-2 border-white/20 bg-background/50 backdrop-blur-sm p-3 transition-all hover:scale-110 hover:bg-background/80 hover:border-white/40 cursor-pointer",
				className
			)}
			aria-label={`${direction === "left" ? "Previous" : "Next"} image`}
		>
			<Icon className="h-6 w-6 text-white" />
		</button>
	);
}

export function ImageSliderWithModal({ images, productName }: ImageSliderWithModalProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalIndex, setModalIndex] = useState(0);

	// For demo: use 4 copies of the hero image
	const demoImages = images.length > 0
		? Array.from({ length: 4 }, (_, i) => ({
			storageUrl: images[0]!.storageUrl,
			altText: `${images[0]!.altText || productName} - View ${i + 1}`,
		}))
		: [];

	if (demoImages.length === 0) {
		return (
			<div className="bg-muted/30 rounded-3xl h-72 w-full flex items-center justify-center">
				<p className="text-muted-foreground font-display">No images available</p>
			</div>
		);
	}

	const hasMultipleImages = demoImages.length > 1;
	const nextImage = hasMultipleImages ? demoImages[(currentIndex + 1) % demoImages.length] : null;

	const handleNext = () => {
		if (hasMultipleImages) {
			setCurrentIndex((prev) => (prev + 1) % demoImages.length);
		}
	};

	const handleModalNext = () => {
		setModalIndex((prev) => (prev + 1) % demoImages.length);
	};

	const handleModalPrev = () => {
		setModalIndex((prev) => (prev - 1 + demoImages.length) % demoImages.length);
	};

	const openModal = () => {
		setModalIndex(currentIndex);
		setIsModalOpen(true);
	};

	return (
		<>
			{/* Main 2-Picture Slider */}
			<div className="relative rounded-3xl overflow-hidden h-72 w-full flex">
				{/* Left: Main Image (expandable width) */}
				<div
					className={cn(
						"relative cursor-pointer transition-all duration-300",
						hasMultipleImages ? "flex-[2] min-w-[60%]" : "flex-1"
					)}
					onClick={openModal}
				>
					<Image
						src={demoImages[currentIndex]!.storageUrl}
						alt={demoImages[currentIndex]!.altText || productName}
						fill
						className="object-cover border rounded-3xl"
					/>
				</div>

				{/* Right: Preview Next Image with Gradient */}
				{hasMultipleImages && nextImage && (
					<div
						className="relative flex-1 min-w-[40%] cursor-pointer group"
						onClick={handleNext}
					>
						<Image
							src={nextImage.storageUrl}
							alt={nextImage.altText || productName}
							fill
							className="object-cover"
						/>
						{/* Gradient Overlay */}
						<div className="absolute inset-0 bg-gradient-to-l from-background via-background/30 to-transparent flex items-center justify-center">
							<ChevronButton direction="right" onClick={handleNext} />
						</div>
					</div>
				)}
			</div>

			{/* Full-Screen Modal */}
			{isModalOpen && (
				<div
					className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
					onClick={() => setIsModalOpen(false)}
				>
					{/* Close Button */}
					<button
						className="absolute top-4 right-4 rounded-full bg-white/10 backdrop-blur-sm p-2 hover:bg-white/20 transition-colors"
						onClick={() => setIsModalOpen(false)}
					>
						<X className="h-6 w-6 text-white" />
					</button>

					{/* Modal Slider */}
					<div
						className="relative w-full max-w-5xl aspect-video"
						onClick={(e) => e.stopPropagation()}
					>
						<Image
							src={demoImages[modalIndex]!.storageUrl}
							alt={demoImages[modalIndex]!.altText || productName}
							fill
							className="object-contain border rounded-3xl"
						/>

						{/* Left Chevron */}
						{hasMultipleImages && (
							<div className="absolute left-4 top-1/2 -translate-y-1/2">
								<ChevronButton direction="left" onClick={handleModalPrev} />
							</div>
						)}

						{/* Right Chevron */}
						{hasMultipleImages && (
							<div className="absolute right-4 top-1/2 -translate-y-1/2">
								<ChevronButton direction="right" onClick={handleModalNext} />
							</div>
						)}

						{/* Image Counter */}
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-display">
							{modalIndex + 1} / {demoImages.length}
						</div>
					</div>
				</div>
			)}
		</>
	);
}