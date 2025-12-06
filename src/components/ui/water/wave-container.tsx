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
			{/* SVG background with animated waves on both edges */}
			<svg
				width="100%"
				height="100%"
				fill="none"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1920 1080"
				preserveAspectRatio="none"
				className="absolute inset-0 w-full h-full"
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
						M0,60
						C473,10 822,100 1920,40
						L1920,1020
						C1447,1060 698,1000 0,1040
						Z"
				>
					<animate
						repeatCount="indefinite"
						attributeName="d"
						dur="15s"
						attributeType="XML"
						values="
							M0,60 C473,20 822,80 1920,50 L1920,1020 C1447,1060 698,1000 0,1040 Z;
							M0,50 C473,80 1222,20 1920,60 L1920,1030 C1447,990 698,1070 0,1020 Z;
							M0,70 C973,30 1722,90 1920,55 L1920,1010 C947,1050 198,980 0,1030 Z;
							M0,60 C473,20 822,80 1920,50 L1920,1020 C1447,1060 698,1000 0,1040 Z
						"
					/>
				</path>
			</svg>

			{/* Content positioned over the SVG */}
			<div className="relative z-10 pt-44 _pb-12">
				{children}
			</div>
		</div>
	);
}