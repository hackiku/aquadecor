// src/components/ui/water/negative-wave.tsx

interface NegativeWaveProps {
	position?: "top" | "bottom";
	bgColor?: string; // Tailwind color class like "bg-background" or "bg-cyan-900"
	className?: string;
}

export function NegativeWave({
	position = "bottom",
	bgColor = "bg-background",
	className = ""
}: NegativeWaveProps) {
	const isTop = position === "top";
	const positionClass = isTop ? "top-0 rotate-180" : "bottom-0";

	return (
		<div className={`absolute ${positionClass} left-0 w-full h-16 md:h-20 lg:h-24 overflow-hidden ${className}`}>
			<svg
				width="100%"
				height="100%"
				fill="none"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1200 120"
				preserveAspectRatio="none"
				className="absolute bottom-0 left-0 w-full h-full"
			>
				<path
					className={`${bgColor} fill-current`}
					d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
				/>
			</svg>
		</div>
	);
}