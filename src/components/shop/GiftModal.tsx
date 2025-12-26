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
import { Gift, ShoppingCart } from 'lucide-react'

interface GiftModalProps {
	isOpen: boolean
	onClose: () => void
	cartTotal: number // in cents
	justAdded?: string // Product name that was just added
}

// Gift thresholds (in cents)
const GIFT_THRESHOLDS = [
	{ amount: 25000, label: '€250', gift: 'Premium Moss Pack' },
	{ amount: 50000, label: '€500', gift: 'Aquascaping Tools Set' },
	{ amount: 100000, label: '€1000', gift: 'Custom Background Upgrade' },
]

export function GiftModal({ isOpen, onClose, cartTotal, justAdded }: GiftModalProps) {
	const router = useRouter()
	const [progress, setProgress] = useState(0)

	// Find next gift threshold
	const nextThreshold = GIFT_THRESHOLDS.find(t => cartTotal < t.amount)
	const currentThreshold = GIFT_THRESHOLDS.findLast(t => cartTotal >= t.amount)
	const amountNeeded = nextThreshold ? nextThreshold.amount - cartTotal : 0
	const maxThreshold = GIFT_THRESHOLDS[GIFT_THRESHOLDS.length - 1]!.amount

	// Calculate progress percentage (0-100)
	const progressPercent = Math.min(100, (cartTotal / maxThreshold) * 100)

	// Has user unlocked a gift?
	const hasUnlockedGift = cartTotal >= GIFT_THRESHOLDS[0]!.amount

	useEffect(() => {
		if (isOpen) {
			// Animate progress bar
			setTimeout(() => setProgress(progressPercent), 100)
		}
	}, [isOpen, progressPercent])

	const handleViewCart = () => {
		onClose()
		// Open cart drawer via context
		// You'll need to add openCart to the modal props or use context here
		router.push('/checkout') // Or open drawer
	}

	const handleShopMore = () => {
		onClose()
		router.push('/shop')
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-xs sm:max-w-lg p-8">
				<DialogHeader>
					<DialogTitle className="font-light text-xl leading-none tracking-tight md:text-xl mb-6 text-center">
						{justAdded && (
							<div className="mb-4 text-green-600">
								✓ {justAdded} added to cart!
							</div>
						)}

						{hasUnlockedGift ? (
							<>
								🎉 You've unlocked a FREE gift!
							</>
						) : nextThreshold ? (
							<>
								You're <span className="font-semibold">€{(amountNeeded / 100).toFixed(2)}</span> away from a FREE gift!
							</>
						) : (
							<>
								🎉 Maximum rewards unlocked!
							</>
						)}
					</DialogTitle>
				</DialogHeader>

				{/* Progress Bar */}
				<div className="relative mb-6">
					{/* Labels */}
					<div className="flex justify-between text-xs mb-2">
						<span className="font-bold">€0</span>
						<span className="font-bold">€250</span>
						<span className="font-bold">€500</span>
						<span className="font-bold">€1000</span>
					</div>

					{/* Progress Bar */}
					<Progress value={progress} className="h-2 w-full" />

					{/* Milestone Dots */}
					<div className="absolute top-7 left-0 w-4 h-4 bg-primary z-30 rounded-full -translate-y-1/2" />
					<div
						className={`absolute top-7 left-1/4 -translate-x-1/2 z-30 w-4 h-4 rounded-full -translate-y-1/2 ${cartTotal >= GIFT_THRESHOLDS[0]!.amount
								? 'bg-primary'
								: 'dark:bg-zinc-500 bg-zinc-200'
							}`}
					/>
					<div
						className={`absolute top-7 left-1/2 -translate-x-1/2 z-30 w-4 h-4 rounded-full -translate-y-1/2 ${cartTotal >= GIFT_THRESHOLDS[1]!.amount
								? 'bg-primary'
								: 'dark:bg-zinc-500 bg-zinc-200'
							}`}
					/>
					<div
						className={`absolute top-7 left-3/4 -translate-x-1/2 z-30 w-4 h-4 rounded-full -translate-y-1/2 ${cartTotal >= GIFT_THRESHOLDS[2]!.amount
								? 'bg-primary'
								: 'dark:bg-zinc-500 bg-zinc-200'
							}`}
					/>
				</div>

				{/* Current Gift Info */}
				{currentThreshold && (
					<div className="text-center mb-6">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-full">
							<Gift className="h-4 w-4 text-green-600 dark:text-green-400" />
							<span className="text-sm font-display font-medium text-green-700 dark:text-green-300">
								Gift unlocked: {currentThreshold.gift}
							</span>
						</div>
					</div>
				)}

				{nextThreshold && !hasUnlockedGift && (
					<div className="text-center mb-6">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
							<Gift className="h-4 w-4 text-primary" />
							<span className="text-sm font-display font-medium text-primary">
								Next reward: {nextThreshold.gift}
							</span>
						</div>
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex flex-col gap-3">
					<Button
						onClick={handleViewCart}
						className="rounded-full px-9 py-3.5 gap-2"
					>
						<ShoppingCart className="h-4 w-4" />
						View Cart
					</Button>
					<Button
						onClick={handleShopMore}
						variant="outline"
						className="rounded-full px-9 py-3.5"
					>
						Continue Shopping
					</Button>
				</div>

				{/* Note */}
				{hasUnlockedGift && (
					<div className="text-center mt-4">
						<span className="text-xs text-muted-foreground">
							Gift has been automatically added to your cart
						</span>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}