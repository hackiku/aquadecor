// ~/components/ui/BubbleIcon.tsx
"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface BubbleIconProps {
	icon: LucideIcon;
	className?: string;
}

export function BubbleIcon({ icon: Icon, className = "" }: BubbleIconProps) {
	return (
		<motion.div
			className={`relative ${className}`}
			animate={{
				x: [0, 15, -10, 8, 0],
				y: [0, -12, 8, -15, 0],
			}}
			transition={{
				duration: 8,
				repeat: Infinity,
				ease: "easeInOut",
			}}
		>
			<div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-primary/30 bg-card/40 backdrop-blur-sm shadow-xl">
				{/* Water layer - half filled */}
				<div className="absolute inset-x-0 bottom-0 h-[55%] overflow-hidden">
					<div className="absolute inset-0 bg-[#3781C2]/70">
						{/* Wave 1 */}
						<svg
							className="absolute left-0 top-0 w-full"
							style={{ height: "30px", transform: "translateY(-15px)" }}
							viewBox="0 0 1200 50"
							preserveAspectRatio="none"
						>
							<path
								fill="rgba(55, 129, 194, 0.5)"
								d="M0,25 Q300,10 600,25 T1200,25 L1200,50 L0,50 Z"
							>
								<animate
									attributeName="d"
									dur="3s"
									repeatCount="indefinite"
									values="
										M0,25 Q300,10 600,25 T1200,25 L1200,50 L0,50 Z;
										M0,25 Q300,35 600,25 T1200,25 L1200,50 L0,50 Z;
										M0,25 Q300,10 600,25 T1200,25 L1200,50 L0,50 Z
									"
								/>
							</path>
						</svg>

						{/* Wave 2 - offset */}
						<svg
							className="absolute left-0 top-0 w-full"
							style={{ height: "30px", transform: "translateY(-12px)" }}
							viewBox="0 0 1200 50"
							preserveAspectRatio="none"
						>
							<path
								fill="rgba(55, 129, 194, 0.4)"
								d="M0,28 Q300,38 600,28 T1200,28 L1200,50 L0,50 Z"
							>
								<animate
									attributeName="d"
									dur="3.5s"
									repeatCount="indefinite"
									begin="0.5s"
									values="
										M0,28 Q300,38 600,28 T1200,28 L1200,50 L0,50 Z;
										M0,28 Q300,15 600,28 T1200,28 L1200,50 L0,50 Z;
										M0,28 Q300,38 600,28 T1200,28 L1200,50 L0,50 Z
									"
								/>
							</path>
						</svg>

						{/* Bubbles */}
						<span
							className="absolute h-2 w-2 rounded-full bg-white/50 shadow-inner"
							style={{
								left: "25%",
								bottom: "20%",
								animation: "bubble1 4s ease-in-out infinite",
							}}
						/>
						<span
							className="absolute h-2.5 w-2.5 rounded-full bg-white/45 shadow-inner"
							style={{
								left: "60%",
								bottom: "15%",
								animation: "bubble2 4.5s ease-in-out infinite 1s",
							}}
						/>
						<span
							className="absolute h-1.5 w-1.5 rounded-full bg-white/40 shadow-inner"
							style={{
								left: "75%",
								bottom: "30%",
								animation: "bubble3 4.2s ease-in-out infinite 2s",
							}}
						/>
					</div>
				</div>

				{/* Icon - centered above water */}
				<div className="absolute inset-0 flex items-center justify-center">
					<Icon className="relative z-10 h-14 w-14 text-primary drop-shadow-md" />
				</div>
			</div>

			<style jsx>{`
				@keyframes bubble1 {
					0%,
					100% {
						transform: translateY(0) scale(1);
						opacity: 0.5;
					}
					50% {
						transform: translateY(-20px) scale(1.1);
						opacity: 0.7;
					}
				}

				@keyframes bubble2 {
					0%,
					100% {
						transform: translateY(0) translateX(0) scale(1);
						opacity: 0.45;
					}
					50% {
						transform: translateY(-25px) translateX(3px) scale(1.12);
						opacity: 0.65;
					}
				}

				@keyframes bubble3 {
					0%,
					100% {
						transform: translateY(0) translateX(0) scale(1);
						opacity: 0.4;
					}
					50% {
						transform: translateY(-18px) translateX(-3px) scale(1.08);
						opacity: 0.6;
					}
				}
			`}</style>
		</motion.div>
	);
}