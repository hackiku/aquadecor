// @ts-nocheck
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
import { useTranslations } from 'next-intl'

interface GiftModalProps {
	isOpen: boolean
	onClose: () => void
	cartTotal: number // in cents
	justAdded?: string // Product name that was just added
}

// We store keys here instead of hardcoded strings to allow translation
const GIFT_THRESHOLDS = [
	{ amount: 25000, label: '€250', giftKey: 'moss' },
	{ amount: 50000, label: '€500', giftKey: 'tools' },
	{ amount: 100000, label: '€1000', giftKey: 'upgrade' },
] as const

export function GiftModal({ isOpen, onClose, cartTotal, justAdded }: GiftModalProps) {
	// Hook into the 'checkout.gift' namespace
	const t = useTranslations('checkout.gift')
	const router = useRouter()
	const [progress, setProgress] = useState(0)

	// Find next gift threshold
	const nextThreshold = GIFT_THRESHOLDS.find(threshold => cartTotal < threshold.amount)
	// Find current (last unlocked) threshold
	const currentThreshold = GIFT_THRESHOLDS.findLast(threshold => cartTotal >= threshold.amount)

	const amountNeeded = nextThreshold ? nextThreshold.amount - cartTotal : 0
	const maxThreshold = GIFT_THRESHOLDS[GIFT_THRESHOLDS.length - 1]!.amount

	// Calculate progress percentage (0-100)
	const progressPercent = Math.min(100, (cartTotal / maxThreshold) * 100)

	// Has user unlocked the first gift?
	const hasUnlockedGift = cartTotal >= GIFT_THRESHOLDS[0]!.amount

	useEffect(() => {
		if (isOpen) {
			// Animate progress bar
			setTimeout(() => setProgress(progressPercent), 100)
		}
	}, [isOpen, progressPercent])

	const handleViewCart = () => {
		onClose()
		router.push('/checkout')
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
								{t('modal.addedToCart', { product: justAdded })}
							</div>
						)}

						{hasUnlockedGift ? (
							<>
								{t('modal.unlockedTitle')}
							</>
						) : nextThreshold ? (
							// Rich text formatting: "You're <bold>€10.00</bold> away..."
							t.rich('modal.awayTitle', {
								amount: `€${(amountNeeded / 100).toFixed(2)}`,
								bold: (chunks) => <span className="font-semibold">{chunks}</span>
							})
						) : (
							<>
								{t('modal.maxTitle')}
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

					{/* Render dots dynamically based on thresholds */}
					{GIFT_THRESHOLDS.map((threshold, index) => {
						// Calculate left position (25%, 50%, 75%, or dynamic based on max)
						const leftPos = (threshold.amount / maxThreshold) * 100

						return (
							<div
								key={threshold.amount}
								className={`absolute top-7 w-4 h-4 rounded-full -translate-y-1/2 z-30 transition-colors duration-500 ${cartTotal >= threshold.amount
										? 'bg-primary'
										: 'dark:bg-zinc-500 bg-zinc-200'
									}`}
								style={{ left: `${leftPos}%`, transform: 'translate(-50%, -50%)' }}
							/>
						)
					})}
				</div>

				{/* Current Gift Info (Last unlocked) */}
				{/* {currentThreshold && (
					<div className="text-center mb-6">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-full">
							<Gift className="h-4 w-4 text-green-600 dark:text-green-400" />
							<span className="text-sm font-display font-medium text-green-700 dark:text-green-300">
								{t('modal.unlockedBadge', {
									gift: t(`tiers.${currentThreshold.giftKey}`)
								})}
							</span>
						</div>
					</div>
				)} */}

				{/* Next Gift Info (If not all unlocked) */}
				{nextThreshold && !hasUnlockedGift && (
					<div className="text-center mb-6">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
							<Gift className="h-4 w-4 text-primary" />
							<span className="text-sm font-display font-medium text-primary">
								{t('modal.nextBadge', {
									gift: t(`tiers.${nextThreshold.giftKey}`)
								})}
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
						{t('modal.viewCart')}
					</Button>
					<Button
						onClick={handleShopMore}
						variant="outline"
						className="rounded-full px-9 py-3.5"
					>
						{t('modal.continue')}
					</Button>
				</div>

				{/* Footer Note */}
				{hasUnlockedGift && (
					<div className="text-center mt-4">
						<span className="text-xs text-muted-foreground">
							{t('modal.autoAdded')}
						</span>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}