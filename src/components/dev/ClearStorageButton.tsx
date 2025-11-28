// src/components/dev/ClearStorageButton.tsx
"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";

/**
 * Dev-only button to clear localStorage
 * Add to layout during development, remove before production
 */
export function ClearStorageButton() {
	const [cleared, setCleared] = useState(false);

	const handleClear = () => {
		localStorage.removeItem("cart");
		localStorage.removeItem("wishlist");

		// Notify components to refresh
		window.dispatchEvent(new CustomEvent("cart-updated", { detail: { items: [] } }));
		window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { items: [] } }));

		setCleared(true);
		setTimeout(() => setCleared(false), 2000);
	};

	// Only show in development
	if (process.env.NODE_ENV === "production") {
		return null;
	}

	return (
		<div className="fixed bottom-4 left-4 z-50">
			<Button
				variant="outline"
				size="sm"
				onClick={handleClear}
				className="gap-2 bg-background border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
			>
				<Trash2 className="h-3 w-3" />
				{cleared ? "Cleared!" : "Clear Storage"}
			</Button>
		</div>
	);
}