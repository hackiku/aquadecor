// src/app/(website)/calculator/_components/product/AdditionalItemCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus, ShoppingCart, Maximize2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { MediaDrawer } from "./MediaDrawer";

interface AdditionalItemCardProps {
	id: string;
	name: string;
	description?: string;
	priceCents: number;
	image: string;
	onAdd: (quantity: number) => void;
}

export function AdditionalItemCard({
	id,
	name,
	description,
	priceCents,
	image,
	onAdd,
}: AdditionalItemCardProps) {
	const [quantity, setQuantity] = useState(0);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const formattedPrice = new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency: "EUR"
	}).format(priceCents / 100);

	const handleAdd = () => {
		if (quantity > 0) {
			onAdd(quantity);
			// Optional: Reset quantity or show success state
		}
	};

	return (
		<>
			<Card className="group relative flex flex-col overflow-hidden border-2 border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg">

				{/* Image Area - Click opens drawer */}
				<div
					className="relative aspect-square w-full cursor-pointer overflow-hidden bg-muted"
					onClick={() => setIsDrawerOpen(true)}
				>
					{image ? (
						<Image
							src={image}
							alt={name}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
							sizes="(max-width: 640px) 100vw, 300px"
						/>
					) : (
						<div className="flex h-full items-center justify-center">
							<span className="text-muted-foreground">No image</span>
						</div>
					)}

					{/* Hover Overlay */}
					<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
						<Button variant="secondary" size="sm" className="gap-2 pointer-events-none">
							<Maximize2 className="h-4 w-4" />
							Quick View
						</Button>
					</div>

					{/* Price Badge */}
					<Badge variant="secondary" className="absolute top-3 right-3 shadow-sm backdrop-blur-md bg-background/80">
						{formattedPrice}
					</Badge>
				</div>

				{/* Content */}
				<div className="flex flex-1 flex-col p-4 space-y-4">
					<div className="space-y-1">
						<h3
							className="font-display font-medium leading-tight group-hover:text-primary transition-colors cursor-pointer"
							onClick={() => setIsDrawerOpen(true)}
						>
							{name}
						</h3>
						{description && (
							<p className="text-xs text-muted-foreground line-clamp-1">
								{description}
							</p>
						)}
					</div>

					{/* Controls Footer */}
					<div className="mt-auto flex items-center justify-between gap-3 pt-2">
						{/* Counter */}
						<div className="flex items-center bg-muted/50 rounded-lg p-0.5 border">
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 rounded-md hover:bg-background hover:text-destructive"
								onClick={() => setQuantity(Math.max(0, quantity - 1))}
								disabled={quantity === 0}
							>
								<Minus className="h-3 w-3" />
							</Button>
							<span className="w-8 text-center text-sm font-mono">{quantity}</span>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 rounded-md hover:bg-background hover:text-primary"
								onClick={() => setQuantity(quantity + 1)}
							>
								<Plus className="h-3 w-3" />
							</Button>
						</div>

						{/* Add Button */}
						<Button
							size="sm"
							onClick={handleAdd}
							disabled={quantity === 0}
							className={cn(
								"flex-1 gap-2 transition-all",
								quantity > 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted"
							)}
						>
							<ShoppingCart className="h-4 w-4" />
							<span className="sr-only sm:not-sr-only">Add</span>
						</Button>
					</div>
				</div>
			</Card>

			{/* Media Drawer Component */}
			<MediaDrawer
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				product={{
					id,
					name,
					description,
					price: priceCents,
					images: [image] // Assuming single image for now, or pass array if available
				}}
				quantity={quantity}
				setQuantity={setQuantity}
				onAdd={() => onAdd(quantity)}
			/>
		</>
	);
}