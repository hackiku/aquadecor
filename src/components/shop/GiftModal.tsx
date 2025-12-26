// src/components/shop/GiftModal.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Progress } from '~/components/ui/progress'
import { Gift } from 'lucide-react'

interface GiftModalProps {
	isOpen: boolean
	onClose: () => void
	cartTotal: number // in cents
}

// Gift thresholds (in cents)
const GIFT_THRESHOLDS = [
	{ amount: 25000, label: '$250', gift: 'Premium Moss Pack' },
	{ amount: 50000, label: '$500', gift: 'Aquascaping Tools Set' },
	{ amount: 100000, label: '$1000', gift: 'Custom Background Upgrade' },
]

export function GiftModal({ isOpen, onClose, cartTotal }: GiftModalProps) {
	const router = useRouter()
	const [progress, setProgress] = useState(0)

	// Find next gift threshold
	const nextThreshold = GIFT_THRESHOLDS.find(t => cartTotal < t.amount)
	const amountNeeded = nextThreshold ? nextThreshold.amount - cartTotal : 0
	const maxThreshold = GIFT_THRESHOLDS[GIFT_THRESHOLDS.length - 1].amount

	// Calculate progress percentage (0-100)
	const progressPercent = Math.min(100, (cartTotal / maxThreshold) * 100)

	useEffect(() => {
		if (isOpen) {
			// Animate progress bar
			setTimeout(() => setProgress(progressPercent), 100)
		}
	}, [isOpen, progressPercent])

	const handleShopMore = () => {
		onClose()
		router.push('/shop')
	}

	const handleCheckout = () => {
		onClose()
		router.push('/checkout')
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-xs sm:max-w-lg p-8 dev">
				<DialogHeader>
					<DialogTitle className="font-light text-xl leading-none tracking-tight md:text-xl mb-12 text-center sm:text-left">
						{nextThreshold ? (
							<>
								You're just <span className="font-semibold">${(amountNeeded / 100).toFixed(2)}</span> away from a FREE gift - add one more item!
							</>
						) : (
							<>
								🎉 Congrats! You've unlocked all gifts! Your order qualifies for premium rewards.
							</>
						)}
					</DialogTitle>
				</DialogHeader>

				{/* Progress Bar */}
				<div className="relative">
					{/* Labels */}
					<span className="absolute bottom-4 font-bold text-sm">$0</span>
					<span className="absolute bottom-4 left-1/4 -translate-x-1/4 font-bold text-sm">
						$250
					</span>
					<span className="absolute bottom-4 right-1/2 translate-x-1/4 font-bold text-sm">
						$500
					</span>
					<span className="absolute bottom-4 right-0 font-bold text-sm">$1000</span>

					{/* Milestone Dots */}
					<div className="absolute top-1/2 left-0 w-4 h-4 bg-primary z-[30] rounded-full -translate-y-1/2" />
					<div
						className={`absolute top-1/2 left-1/4 z-[30] w-4 h-4 rounded-full -translate-y-1/2 ${cartTotal >= GIFT_THRESHOLDS[0].amount
								? 'bg-primary'
								: 'dark:bg-zinc-500 bg-zinc-200'
							}`}
					/>
					<div
						className={`absolute top-1/2 right-1/2 z-[30] w-4 h-4 rounded-full -translate-y-1/2 ${cartTotal >= GIFT_THRESHOLDS[1].amount
								? 'bg-primary'
								: 'dark:bg-zinc-500 bg-zinc-200'
							}`}
					/>
					<div
						className={`absolute top-1/2 w-4 h-4 right-0 -translate-y-1/2 rounded-full z-[30] ${cartTotal >= GIFT_THRESHOLDS[2].amount
								? 'bg-primary'
								: 'dark:bg-zinc-500 bg-zinc-200'
							}`}
					/>

					{/* Progress Bar */}
					<Progress value={progress} className="h-2 w-full" />
				</div>

				{/* Current Gift Info */}
				{nextThreshold && (
					<div className="text-center mt-6">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
							<Gift className="h-4 w-4 text-primary" />
							<span className="text-sm font-display font-medium text-primary">
								Next reward: {nextThreshold.gift}
							</span>
						</div>
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex flex-col-reverse sm:space-x-2 sm:flex sm:gap-y-4 sm:flex-row sm:items-center sm:justify-center mt-6">
					<Button
						onClick={handleShopMore}
						className="rounded-full px-9 py-3.5"
					>
						Shop more
					</Button>
					<Button
						onClick={handleCheckout}
						variant="outline"
						className="rounded-full px-9 py-3.5"
					>
						Checkout now
					</Button>
				</div>

				{/* Note */}
				<div className="text-center mt-2">
					<span className="text-xs text-muted-foreground">
						Note: Gift will be automatically added to your cart
					</span>
				</div>
			</DialogContent>
		</Dialog>
	)
}