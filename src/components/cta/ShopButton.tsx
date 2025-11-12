
"use client";

import { useState } from "react";
import Link from "next/link";

interface ShopButtonProps {
	href?: string;
	children?: React.ReactNode;
	className?: string;
}

export function ShopButton({
	href = "/store",
	children = "Shop Now",
	className = ""
}: ShopButtonProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Link
			href={href}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={`relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden text-white font-semibold text-base rounded-full border-2 border-[#2A6599] bg-card/30 backdrop-blur-sm shadow-lg hover:shadow-[0_8px_30px_rgba(55,129,194,0.4)] transition-shadow duration-300 ${className}`}
		>
			{/* Water layer - rises on hover */}
			<span className="absolute inset-0 overflow-hidden rounded-full">
				<span
					className="absolute inset-x-0 bottom-0 bg-[#3781C2]/85 transition-all duration-700 ease-in-out"
					style={{ height: isHovered ? "100%" : "83%" }}
				>
					{/* Wave 1 - prominent, slow */}
					<svg
						className="absolute top-0 left-0 w-full"
						style={{ height: "40px", transform: "translateY(-20px)" }}
						viewBox="0 0 1200 50"
						preserveAspectRatio="none"
					>
						<path
							fill="rgba(55, 129, 194, 0.6)"
							d="M0,25 Q300,10 600,25 T1200,25 L1200,50 L0,50 Z"
						>
							<animate
								attributeName="d"
								dur="3.5s"
								repeatCount="indefinite"
								values="
									M0,25 Q300,10 600,25 T1200,25 L1200,50 L0,50 Z;
									M0,25 Q300,40 600,25 T1200,25 L1200,50 L0,50 Z;
									M0,25 Q300,10 600,25 T1200,25 L1200,50 L0,50 Z
								"
							/>
						</path>
					</svg>

					{/* Wave 2 - offset, intersecting */}
					<svg
						className="absolute top-0 left-0 w-full"
						style={{ height: "40px", transform: "translateY(-18px)" }}
						viewBox="0 0 1200 50"
						preserveAspectRatio="none"
					>
						<path
							fill="rgba(55, 129, 194, 0.5)"
							d="M0,28 Q300,43 600,28 T1200,28 L1200,50 L0,50 Z"
						>
							<animate
								attributeName="d"
								dur="4s"
								repeatCount="indefinite"
								begin="1s"
								values="
									M0,28 Q300,43 600,28 T1200,28 L1200,50 L0,50 Z;
									M0,28 Q300,13 600,28 T1200,28 L1200,50 L0,50 Z;
									M0,28 Q300,43 600,28 T1200,28 L1200,50 L0,50 Z
								"
							/>
						</path>
					</svg>

					{/* Bubbles - slower, more natural */}
					<span
						className="absolute w-2.5 h-2.5 bg-white/50 rounded-full"
						style={{
							left: "20%",
							bottom: "15%",
							animation: "bubble1 5.5s ease-in-out infinite",
							boxShadow: "inset 0 -1px 2px rgba(255,255,255,0.7)",
						}}
					/>
					<span
						className="absolute w-2 h-2 bg-white/45 rounded-full"
						style={{
							left: "50%",
							bottom: "25%",
							animation: "bubble2 6s ease-in-out infinite 1s",
							boxShadow: "inset 0 -1px 2px rgba(255,255,255,0.7)",
						}}
					/>
					<span
						className="absolute w-1.5 h-1.5 bg-white/40 rounded-full"
						style={{
							left: "75%",
							bottom: "10%",
							animation: "bubble3 5.8s ease-in-out infinite 2s",
							boxShadow: "inset 0 -1px 1px rgba(255,255,255,0.7)",
						}}
					/>
					<span
						className="absolute w-2 h-2 bg-white/45 rounded-full"
						style={{
							left: "35%",
							bottom: "5%",
							animation: "bubble1 6.2s ease-in-out infinite 3s",
							boxShadow: "inset 0 -1px 2px rgba(255,255,255,0.7)",
						}}
					/>
				</span>
			</span>

			{/* Button text */}
			<span className="relative z-10 drop-shadow-sm">
				{children}
			</span>

			<style jsx>{`
				@keyframes bubble1 {
					0%, 100% {
						transform: translateY(0) scale(1);
						opacity: 0.5;
					}
					50% {
						transform: translateY(-25px) scale(1.1);
						opacity: 0.7;
					}
				}

				@keyframes bubble2 {
					0%, 100% {
						transform: translateY(0) translateX(0) scale(1);
						opacity: 0.45;
					}
					50% {
						transform: translateY(-30px) translateX(5px) scale(1.15);
						opacity: 0.65;
					}
				}

				@keyframes bubble3 {
					0%, 100% {
						transform: translateY(0) translateX(0) scale(1);
						opacity: 0.4;
					}
					50% {
						transform: translateY(-20px) translateX(-4px) scale(1.08);
						opacity: 0.6;
					}
				}
			`}</style>
		</Link>
	);
}