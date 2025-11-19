// src/components/ui/wave-divider.tsx

interface WaveDividerProps {
	position?: "top" | "bottom";
	flip?: boolean;
	color?: string;
	className?: string;
}

export function WaveDivider({
	position = "bottom",
	flip = false,
	color = "#FFFFFF",
	className = "",
}: WaveDividerProps) {
	const rotationClass = flip ? "rotate-180" : "";
	const positionClass = position === "top" ? "top-0" : "bottom-0";

	return (
		<svg
			data-name="Layer 1"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1200 120"
			preserveAspectRatio="none"
			className={`absolute ${positionClass} left-0 w-full h-12 md:h-16 ${rotationClass} ${className}`}
		>
			<path
				fill={color}
				d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
			/>
		</svg>
	);
}

interface BlobBackgroundProps {
	color?: string;
	opacity?: number;
	className?: string;
}

export function BlobBackground({
	color = "#08BDBA",
	opacity = 0.2,
	className = "",
}: BlobBackgroundProps) {
	return (
		<div
			className={`absolute inset-0 right-0 w-full h-full pointer-events-none ${className}`}
			style={{ opacity }}
		>
			<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
				<path
					fill={color}
					d="M50.8,-63.7C64.7,-59.9,73.9,-43.4,77,-26.7C80.1,-10,77.1,7.1,67.5,17.4C57.9,27.8,41.8,31.5,29.4,34C17.1,36.4,8.5,37.6,-2,40.4C-12.6,43.2,-25.2,47.6,-37.4,45.1C-49.6,42.6,-61.3,33.2,-61.8,22.3C-62.4,11.4,-51.7,-1,-48.5,-17.3C-45.2,-33.5,-49.5,-53.8,-42.7,-59.8C-35.8,-65.9,-17.9,-57.7,0.3,-58.1C18.5,-58.5,37,-67.4,50.8,-63.7Z"
					transform="translate(100 100)"
				/>
			</svg>
		</div>
	);
}