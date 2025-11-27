// src/components/ui/water/wave-container.tsx

import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface WaveContainerProps {
	children: ReactNode;
	className?: string;
}

export function WaveContainer({ children, className }: WaveContainerProps) {
	return (
		<div className={cn("relative", className)}>
			{/* Single seamless SVG blob with animated waves */}
			<svg
				width="100%"
				height="100%"
				fill="none"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1920 800"
				preserveAspectRatio="none"
				className="absolute inset-0 w-full h-full"
				style={{ minHeight: '600px' }}
			>
				<defs>
					<linearGradient id="blobGradient" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#0891b2" />
						<stop offset="50%" stopColor="#0e7490" />
						<stop offset="100%" stopColor="#0891b2" />
					</linearGradient>
				</defs>
				<path
					fill="url(#blobGradient)"
					d="
						M0 77
						C 473,283
							822,-40
							1920,116
						V 684
						C 1447,800
							698,483
							0,716
						Z"
				>
					<animate
						repeatCount="indefinite"
						fill="url(#blobGradient)"
						attributeName="d"
						dur="15s"
						attributeType="XML"
						values="
							M0 77
							C 473,283
								822,-40
								1920,116
							V 684
							C 1447,800
								698,483
								0,716
							Z;

							M0 77
							C 473,-40
								1222,283
								1920,136
							V 677
							C 1447,883
								698,600
								0,736
							Z;

							M0 77
							C 973,260
								1722,-53
								1920,120
							V 680
							C 947,540
								198,877
								0,720
							Z;

							M0 77
							C 473,283
								822,-40
								1920,116
							V 684
							C 1447,800
								698,483
								0,716
							Z
						"
					/>
				</path>
			</svg>

			{/* Content positioned over the SVG */}
			<div className="relative z-10">
				{children}
			</div>
		</div>
	);
}