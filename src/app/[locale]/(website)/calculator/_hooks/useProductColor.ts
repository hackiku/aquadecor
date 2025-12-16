// src/app/(website)/calculator/_hooks/useProductColor.ts
"use client";

import { useState, useEffect } from "react";
import { FastAverageColor } from "fast-average-color";

const fac = new FastAverageColor();

export function useProductColor(imageUrl?: string, defaultColor = "#6B5D52") {
	const [color, setColor] = useState(defaultColor);

	useEffect(() => {
		if (!imageUrl) {
			setColor(defaultColor);
			return;
		}

		// Check if it's a valid URL to prevent errors
		if (imageUrl.startsWith("/") || imageUrl.startsWith("http")) {
			fac.getColorAsync(imageUrl, { algorithm: "dominant" })
				.then((col) => {
					// We darken the color slightly because average colors 
					// tend to be too bright for 3D rock shadows
					// increasing saturation slightly also helps
					setColor(col.hex);
				})
				.catch((e) => {
					console.warn("Color extraction failed, using default", e);
					setColor(defaultColor);
				});
		}
	}, [imageUrl, defaultColor]);

	return color;
}