
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

	return (
		<Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DrawerContent className="max-h-[90vh] flex flex-col">
				<DrawerHeader className="text-left border-b pb-4">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<DrawerTitle className="font-display text-2xl font-light">
								{product.name}
							</DrawerTitle>
							<DrawerDescription className="font-display font-light">
								{new Intl.NumberFormat("en-EU", { style: "currency", currency: "EUR" }).format(product.price / 100)}
							</DrawerDescription>
						</div>
						<DrawerClose asChild>
							<Button variant="ghost" size="icon" className="rounded-full">
								<X className="h-5 w-5" />
							</Button>
						</DrawerClose>
					</div>
				</DrawerHeader>

				{/* Scrollable Content */}
				<ScrollArea className="flex-1 overflow-y-auto bg-muted/10 p-4">
					<div className="max-w-3xl mx-auto space-y-6">
						{product.description && (
							<p className="text-muted-foreground font-display font-light">
								{product.description}
							</p>
						)}

						{/* Images Grid/Stack */}
						<div className="grid gap-4">
							{product.images.map((img, idx) => (
								<div key={idx} className="relative aspect-video w-full overflow-hidden rounded-xl border bg-black/5">
									<Image
										src={img}
										alt={`${product.name} view ${idx + 1}`}
										fill
										className="object-contain"
										sizes="(max-width: 768px) 100vw, 800px"
									/>
								</div>
							))}
						</div>
					</div>
				</ScrollArea>

				{/* Sticky Footer */}
				<DrawerFooter className="border-t bg-background pt-4 pb-8">
					<div className="max-w-3xl mx-auto w-full flex flex-col sm:flex-row gap-4 items-center justify-between">

						{/* Quantity Control */}
						<div className="flex items-center gap-3 bg-muted/50 rounded-full p-1 border">
							<Button
								variant="ghost"
								size="icon"
								className="h-10 w-10 rounded-full hover:bg-background"
								onClick={() => setQuantity(Math.max(0, quantity - 1))}
							>
								<Minus className="h-4 w-4" />
							</Button>
							<span className="w-8 text-center font-mono font-medium">{quantity}</span>
							<Button
								variant="ghost"
								size="icon"
								className="h-10 w-10 rounded-full hover:bg-background"
								onClick={() => setQuantity(quantity + 1)}
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>

						{/* Add Button */}
						<Button
							onClick={handleAdd}
							className="w-full sm:w-auto min-w-[200px] h-12 rounded-full font-display text-lg gap-2"
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