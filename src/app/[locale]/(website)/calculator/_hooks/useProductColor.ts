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

		// Basic validation
		if (imageUrl.startsWith("/") || imageUrl.startsWith("http")) {
			fac.getColorAsync(imageUrl, {
				algorithm: "dominant",
				ignoredColor: [0, 0, 0, 255] // Ignore pure black if it appears
			})
				.then((col) => {
					// Manually adjust brightness if it's too dark
					// (Common issue with transparent PNGs on black backgrounds or dark rock photos)
					const [r, g, b] = col.value;

					// Calculate perceived brightness (standard formula)
					const brightness = (r * 299 + g * 587 + b * 114) / 1000;

					// If too dark (< 60/255), boost it
					if (brightness < 60) {
						// boost factor
						const factor = 1.5;
						const newHex = rgbToHex(
							Math.min(255, r * factor),
							Math.min(255, g * factor),
							Math.min(255, b * factor)
						);
						setColor(newHex);
					} else {
						setColor(col.hex);
					}
				})
				.catch((e) => {
					console.warn("Color extraction failed", e);
					setColor(defaultColor);
				});
		}
	}, [imageUrl, defaultColor]);

	return color;
}

// Helper to reconvert boosted RGB to hex
function rgbToHex(r: number, g: number, b: number) {
	return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
}