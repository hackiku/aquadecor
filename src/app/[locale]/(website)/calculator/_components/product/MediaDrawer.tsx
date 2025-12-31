// src/app/(website)/calculator/_components/product/MediaDrawer.tsx
"use client";

import Image from "next/image";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
} from "~/components/ui/drawer";
import { ScrollArea } from "~/components/ui/scroll-area";

interface MediaDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	product: {
		id: string;
		name: string;
		description?: string;
		price: number;
		images: string[]; // Array of URLs
	};
	quantity: number;
	setQuantity: (q: number) => void;
	onAdd: () => void;
}

export function MediaDrawer({
	isOpen,
	onClose,
	product,
	quantity,
	setQuantity,
	onAdd,
}: MediaDrawerProps) {

	const handleAdd = () => {
		onAdd();
		onClose();
	};

	const formattedPrice = new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency: "EUR"
	}).format(product.price / 100);

	return (
		<Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DrawerContent className="max-h-[90vh] flex flex-col">
				<DrawerHeader className="text-left border-b pb-4">
					<div className="flex items-start justify-between gap-4">
						<div className="space-y-2 flex-1">
							<DrawerTitle className="font-display text-2xl font-light">
								{product.name}
							</DrawerTitle>
							<div className="flex items-baseline gap-2">
								<span className="text-2xl font-bold text-primary font-display mx-auto">
									{formattedPrice}
								</span>
							</div>
							{product.description && (
								<DrawerDescription className="font-display font-light text-sm">
									{product.description}
								</DrawerDescription>
							)}
						</div>
						<DrawerClose asChild>
							<Button variant="ghost" size="icon" className="rounded-full shrink-0">
								<X className="h-5 w-5" />
							</Button>
						</DrawerClose>
					</div>
				</DrawerHeader>

				{/* Scrollable Content */}
				<ScrollArea className="flex-1 overflow-y-auto bg-muted/10 p-6">
					<div className="max-w-2xl mx-auto space-y-4">
						{/* Images - Smaller, no overflow on desktop */}
						<div className="grid gap-4">
							{product.images.map((img, idx) => (
								<div
									key={idx}
									className="relative aspect-square max-w-md mx-auto w-full overflow-hidden rounded-xl border bg-black/5"
								>
									<Image
										src={img}
										alt={`${product.name} view ${idx + 1}`}
										fill
										className="object-cover"
										sizes="(max-width: 768px) 100vw, 500px"
									/>
								</div>
							))}
						</div>
					</div>
				</ScrollArea>

				{/* Sticky Footer */}
				<DrawerFooter className="border-t bg-background pt-4 pb-8">
					<div className="max-w-2xl mx-auto w-full flex flex-col sm:flex-row gap-4 items-center justify-between">

						{/* Quantity Control */}
						<div className="flex items-center gap-3 bg-muted/50 rounded-full p-1 border">
							<Button
								variant="ghost"
								size="icon"
								className="h-10 w-10 rounded-full hover:bg-background cursor-pointer"
								onClick={() => setQuantity(Math.max(0, quantity - 1))}
							>
								<Minus className="h-4 w-4" />
							</Button>
							<span className="w-8 text-center font-mono font-medium">{quantity}</span>
							<Button
								variant="ghost"
								size="icon"
								className="h-10 w-10 rounded-full hover:bg-background cursor-pointer"
								onClick={() => setQuantity(quantity + 1)}
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>

						{/* Add Button */}
						<Button
							onClick={handleAdd}
							className="w-full sm:w-auto min-w-[200px] h-12 rounded-full font-display text-lg gap-2 cursor-pointer"
							disabled={quantity === 0}
						>
							<ShoppingCart className="h-4 w-4" />
							Add {quantity > 0 ? `${quantity} items` : "to Quote"}
						</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}