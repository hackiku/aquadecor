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
			className="relative w-full h-12"
		>
			<div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center gap-x-4">
				<div className="flex flex-row items-center justify-between w-full gap-x-4">

					{/* Flash icon + Message */}
					<div className="flex items-center gap-2">
						<Zap
							className={`w-4 h-4 fill-current transition-transform ${pulse ? "scale-125" : "scale-100"
								}`}
						/>
						<p className="font-display font-medium text-sm hidden md:block">
							{customMessage || `${name}`}
						</p>
					</div>

					{/* Code */}
					<p className="text-sm font-medium">
						Code: <strong>{discountCode}</strong>
					</p>

					{/* Countdown */}
					<div className="flex gap-x-2 items-center">
						<div className="flex gap-1 items-center bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
							<span>{formatTime(timeLeft.hours)}</span>:
							<span>{formatTime(timeLeft.minutes)}</span>:
							<span>{formatTime(timeLeft.seconds)}</span>
						</div>

						{/* Close */}
						{onDismiss && (
							<button
								onClick={onDismiss}
								className="hover:opacity-70 transition-opacity"
								aria-label="Dismiss banner"
							>
								<X className="w-4 h-4" />
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}