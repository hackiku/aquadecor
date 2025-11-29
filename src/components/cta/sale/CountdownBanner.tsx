// src/components/cta/sale/CountdownBanner.tsx
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface CountdownBannerProps {
	name: string;
	discountCode: string;
	discountPercent: number;
	endsAt: Date;
	backgroundColor?: string;
	textColor?: string;
	customMessage?: string;
	onDismiss?: () => void;
}

export function CountdownBanner({
	name,
	discountCode,
	discountPercent,
	endsAt,
	backgroundColor = "#000000",
	textColor = "#ffffff",
	customMessage,
	onDismiss,
}: CountdownBannerProps) {
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		const calculateTimeLeft = () => {
			const difference = endsAt.getTime() - new Date().getTime();

			if (difference > 0) {
				setTimeLeft({
					days: Math.floor(difference / (1000 * 60 * 60 * 24)),
					hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
					minutes: Math.floor((difference / 1000 / 60) % 60),
					seconds: Math.floor((difference / 1000) % 60),
				});
			} else {
				setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
			}
		};

		calculateTimeLeft();
		const timer = setInterval(calculateTimeLeft, 1000);

		return () => clearInterval(timer);
	}, [endsAt]);

	const formatTime = (value: number) => String(value).padStart(2, "0");

	return (
		<div
			style={{ backgroundColor, color: textColor }}
			className="relative w-full"
		>
			<div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center gap-y-2 md:flex-row transition-all duration-150">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-y-2">

					{/* Message */}
					<p className="font-display hidden lg:block text-center md:text-left">
						{customMessage || name}
					</p>

					{/* Code */}
					<p className="text-center md:text-left">
						Use code <strong>{discountCode}</strong> for {discountPercent}% off
					</p>

					{/* Countdown */}
					<div className="flex gap-x-2 items-center justify-center md:justify-end">
						<div className="text-sm lg:w-[200px] text-center font-medium bg-white/20 px-3 py-1 rounded-full">
							Ends in: {formatTime(timeLeft.days)}d {formatTime(timeLeft.hours)}h{" "}
							{formatTime(timeLeft.minutes)}m {formatTime(timeLeft.seconds)}s
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