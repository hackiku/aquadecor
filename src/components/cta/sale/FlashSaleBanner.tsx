// src/components/cta/sale/FlashSaleBanner.tsx
"use client";

import { useEffect, useState } from "react";
import { X, Zap } from "lucide-react";

interface FlashSaleBannerProps {
	name: string;
	discountCode: string;
	discountPercent: number;
	endsAt: Date;
	backgroundColor?: string;
	textColor?: string;
	customMessage?: string;
	onDismiss?: () => void;
}

export function FlashSaleBanner({
	name,
	discountCode,
	discountPercent,
	endsAt,
	backgroundColor = "#ef4444",
	textColor = "#ffffff",
	customMessage,
	onDismiss,
}: FlashSaleBannerProps) {
	const [timeLeft, setTimeLeft] = useState({
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	const [pulse, setPulse] = useState(false);

	useEffect(() => {
		const calculateTimeLeft = () => {
			const difference = endsAt.getTime() - new Date().getTime();

			if (difference > 0) {
				setTimeLeft({
					hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
					minutes: Math.floor((difference / 1000 / 60) % 60),
					seconds: Math.floor((difference / 1000) % 60),
				});
			} else {
				setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
			}
		};

		calculateTimeLeft();
		const timer = setInterval(calculateTimeLeft, 1000);

		return () => clearInterval(timer);
	}, [endsAt]);

	// Pulse animation every 3 seconds
	useEffect(() => {
		const pulseInterval = setInterval(() => {
			setPulse(true);
			setTimeout(() => setPulse(false), 500);
		}, 3000);

		return () => clearInterval(pulseInterval);
	}, []);

	const formatTime = (value: number) => String(value).padStart(2, "0");

	return (
		<div
			style={{ backgroundColor, color: textColor }}
			className="relative w-full"
		>
			<div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-y-2 md:flex-row">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-y-2 gap-x-4">

					{/* Flash icon + Message */}
					<div className="flex items-center gap-2 justify-center md:justify-start">
						<Zap
							className={`w-5 h-5 fill-current transition-transform ${pulse ? "scale-125" : "scale-100"
								}`}
						/>
						<p className="font-display font-medium">
							{customMessage || `⚡ ${name} - ${discountPercent}% OFF`}
						</p>
					</div>

					{/* Code */}
					<p className="text-center md:text-left font-medium">
						Code: <strong className="text-lg">{discountCode}</strong>
					</p>

					{/* Urgent countdown */}
					<div className="flex gap-x-2 items-center justify-center md:justify-end">
						<div className="flex gap-1 items-center bg-white/20 px-4 py-1.5 rounded-full font-bold">
							<span className="text-lg">{formatTime(timeLeft.hours)}</span>
							<span className="text-xs">h</span>
							<span className="mx-0.5">:</span>
							<span className="text-lg">{formatTime(timeLeft.minutes)}</span>
							<span className="text-xs">m</span>
							<span className="mx-0.5">:</span>
							<span className="text-lg">{formatTime(timeLeft.seconds)}</span>
							<span className="text-xs">s</span>
						</div>

						{/* Desktop close */}
						{onDismiss && (
							<button
								onClick={onDismiss}
								className="hidden md:inline-block hover:opacity-70 transition-opacity"
								aria-label="Dismiss banner"
							>
								<X className="w-5 h-5" />
							</button>
						)}
					</div>
				</div>

				{/* Mobile close */}
				{onDismiss && (
					<button
						onClick={onDismiss}
						className="md:hidden hover:opacity-70 transition-opacity"
						aria-label="Dismiss banner"
					>
						<X className="w-5 h-5" />
					</button>
				)}
			</div>
		</div>
	);
}