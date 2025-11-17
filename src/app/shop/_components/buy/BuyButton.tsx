"use client";

// src/app/shop/_components/buy/BuyButton.tsx

import { Button } from "~/components/ui/button";
import { useState } from "react";

interface BuyButtonProps {
	productId: string;
	productName: string;
	className?: string;
}

export function BuyButton({ productId, productName, className }: BuyButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = () => {
		// TODO: Open quote modal
		console.log("Request quote for:", productId, productName);
		// setIsModalOpen(true);
	};

	return (
		<Button
			size="lg"
			className={className}
			onClick={handleClick}
			disabled={isLoading}
		>
			{isLoading ? "Loading..." : "Request Quote"}
		</Button>
	);
}