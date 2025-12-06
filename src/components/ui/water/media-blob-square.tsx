// src/components/ui/water/media-blob.tsx

"use client";

// cat blob sample
// https://codepen.io/sjoerdkoelewijn/pen/LYxrxeL

import { type ReactNode } from "react";
import Image from "next/image";
import { cn } from "~/lib/utils";

interface MediaBlobProps {
	asset: string;
	type: "image" | "video";
	alt?: string;
	className?: string;
	priority?: boolean;
	autoPlay?: boolean;
	loop?: boolean;
	muted?: boolean;
	controls?: boolean;
	/** Animation intensity multiplier (default: 2) */
	amount?: number;
	/** Animation duration in seconds (default: 10) */
	duration?: number;
}

export function MediaBlob({
	asset,
	type,
	alt = "",
	className = "",
	priority = false,
	autoPlay = true,
	loop = true,
	muted = true,
	controls = false,
	amount = 2,
	duration = 10,
}: MediaBlobProps) {
	return (
		<div
			className={cn("blob relative", className)}
			style={
				{
					"--time": `${duration}s`,
					"--amount": amount,
				} as React.CSSProperties
			}
		>
			{type === "image" ? (
				<Image
					src={asset}
					alt={alt}
					fill
					className="absolute inset-0 w-full h-full object-cover"
					priority={priority}
					sizes="(max-width: 768px) 100vw, 30vw"
				/>
			) : (
				<video
					autoPlay={autoPlay}
					loop={loop}
					muted={muted}
					playsInline
					controls={controls}
					className="absolute inset-0 w-full h-full object-cover"
					preload="metadata"
				>
					<source src={asset} type="video/mp4" />
				</video>
			)}

			<div className="svg-wrap">
				<svg
					width="1865"
					height="1865"
					viewBox="0 0 1865 1865"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						className="fill-background"
						d="M932.46 0C417.47 0 0 417.47 0 932.46C0 1447.45 417.47 1864.92 932.46 1864.92C1447.45 1864.92 1864.92 1447.45 1864.92 932.46C1864.92 417.47 1447.44 0 932.46 0ZM1196.7 1028.36C1182.03 1084.17 1140.69 1137.91 1087.39 1157.76C1034.09 1177.61 968.84 1163.55 892.69 1144.25C817.09 1125.18 730.2 1101.02 688.08 1040.63C645.73 980.8 647.78 884.91 687.68 815.14C727.58 745.37 805.11 702.28 883.84 675.78C962.81 648.72 1043.15 638.63 1093.91 671.5C1144.51 703.98 1165.68 779.81 1182.35 846.86C1199.02 913.91 1211.21 972.16 1196.7 1028.36Z"
					/>
				</svg>
			</div>

			<style jsx>{`
				.blob {
					width: 30vw;
					height: 30vw;
					position: relative;
					min-width: 300px;
					min-height: 300px;
				}

				.blob :global(img),
				.blob :global(video) {
					position: absolute;
				}

				.svg-wrap {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					overflow: hidden;
					pointer-events: none;
				}

				.svg-wrap svg {
					width: 300%;
					height: 300%;
					margin-left: -100%;
					margin-top: -100%;
					position: absolute;
					animation: blob-skew calc(var(--time, 10s) * 0.5) linear 0s infinite,
						blob-turn var(--time, 10s) linear infinite;
					transform-origin: center;
				}

				.svg-wrap svg path {
					animation: blob-scale calc(var(--time, 10s) * 0.5) ease-in-out 0s infinite;
					transform-origin: center;
				}

				@keyframes blob-turn {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}

				@keyframes blob-skew {
					0% {
						transform: skewY(0deg);
					}
					13% {
						transform: skewY(calc(1.8deg * var(--amount, 2)));
					}
					18% {
						transform: skewY(calc(2.2deg * var(--amount, 2)));
					}
					24% {
						transform: skewY(calc(2.48deg * var(--amount, 2)));
					}
					25% {
						transform: skewY(calc(2.5deg * var(--amount, 2)));
					}
					26% {
						transform: skewY(calc(2.48deg * var(--amount, 2)));
					}
					32% {
						transform: skewY(calc(2.2deg * var(--amount, 2)));
					}
					37% {
						transform: skewY(calc(1.8deg * var(--amount, 2)));
					}
					50% {
						transform: skewY(0deg);
					}
					63% {
						transform: skewY(calc(-1.8deg * var(--amount, 2)));
					}
					68% {
						transform: skewY(calc(-2.2deg * var(--amount, 2)));
					}
					74% {
						transform: skewY(calc(-2.48deg * var(--amount, 2)));
					}
					75% {
						transform: skewY(calc(-2.5deg * var(--amount, 2)));
					}
					76% {
						transform: skewY(calc(-2.48deg * var(--amount, 2)));
					}
					82% {
						transform: skewY(calc(-2.2deg * var(--amount, 2)));
					}
					87% {
						transform: skewY(calc(-1.8deg * var(--amount, 2)));
					}
					100% {
						transform: skewY(0deg);
					}
				}

				@keyframes blob-scale {
					0% {
						transform: scaleX(0.9) scaleY(1);
					}
					25% {
						transform: scaleX(0.9) scaleY(0.9);
					}
					50% {
						transform: scaleX(1) scaleY(0.9);
					}
					75% {
						transform: scaleX(0.9) scaleY(0.9);
					}
					100% {
						transform: scaleX(0.9) scaleY(1);
					}
				}

				@media (max-width: 768px) {
					.blob {
						width: 80vw;
						height: 80vw;
					}
				}
			`}</style>
		</div>
	);
}