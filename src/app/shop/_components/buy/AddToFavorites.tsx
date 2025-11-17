// src/app/shop/_components/buy/AddToFavorites.tsx
"use client";


import { Button } from "~/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";

interface AddToFavoritesProps {
	productId: string;
}

export function AddToFavorites({ productId }: AddToFavoritesProps) {
	const [isFavorited, setIsFavorited] = useState(false);

	const toggle = () => {
		setIsFavorited(!isFavorited);
		// TODO: Call tRPC mutation to save to wishlist
		console.log(isFavorited ? "Removed from" : "Added to", "favorites:", productId);
	};

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={toggle}
			className="rounded-full"
		>
			<Heart className={`h-5 w-5 ${isFavorited ? "fill-primary text-primary" : ""}`} />
		</Button>
	);
}