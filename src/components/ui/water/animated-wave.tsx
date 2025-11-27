// src/components/ui/water/animated-wave.tsx

interface AnimatedWaveProps {
	position?: "top" | "bottom";
	className?: string;
}

export function AnimatedWave({ position = "bottom", className = "" }: AnimatedWaveProps) {
	const isTop = position === "top";
	const positionClass = isTop ? "top-0 rotate-180" : "bottom-0";

	return (
		<div className={`absolute ${positionClass} left-0 w-full h-32 md:h-40 lg:h-48 overflow-hidden ${className}`}>
			<svg
				width="100%"
				height="100%"
				fill="none"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1920 200"
				preserveAspectRatio="none"
				className="absolute bottom-0 left-0 w-full h-full"
			>
				<defs>
					<linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#0891b2" />
						<stop offset="50%" stopColor="#0e7490" />
						<stop offset="100%" stopColor="#0891b2" />
					</linearGradient>
				</defs>
				<path
					fill="url(#waveGradient)"
					d="
						M0 67
						C 273,183
							822,-40
							1920,106
						V 359
						H 0
						V 67
						Z"
				>
					<animate
						repeatCount="indefinite"
						fill="url(#waveGradient)"
						attributeName="d"
						dur="15s"
						attributeType="XML"
						values="
							M0 77
							C 473,283
								822,-40
								1920,116
							V 359
							H 0
							V 67
							Z;

							M0 77
							C 473,-40
								1222,283
								1920,136
							V 359
							H 0
							V 67
							Z;

							M0 77
							C 973,260
								1722,-53
								1920,120
							V 359
							H 0
							V 67
							Z;

							M0 77
							C 473,283
								822,-40
								1920,116
							V 359
							H 0
							V 67
							Z
						"
					/>
				</path>
			</svg>
		</div>
	);
}