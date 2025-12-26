// src/app/[locale]/(checkout)/_components/EnterDiscountCode.tsx
'use client'

import { useState } from 'react'
import { Tag, X } from 'lucide-react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { useCheckout } from '~/app/_context/CheckoutContext'
import { useTranslations } from 'next-intl'

export function EnterDiscountCode() {
	const t = useTranslations('checkout.discount')
	const [code, setCode] = useState('')
	const [isApplying, setIsApplying] = useState(false)
	const {
		discountCode,
		discountMessage,
		applyDiscount,
		clearDiscount
	} = useCheckout()

	const handleApply = async () => {
		setIsApplying(true)
		await applyDiscount(code)
		setIsApplying(false)
	}

	const handleClear = () => {
		setCode('')
		clearDiscount()
	}

	return (
		<div className="border rounded-3xl p-6">
			<Label className="text-sm font-display font-normal flex gap-x-2 items-center mb-3">
				<Tag className="w-5 h-5" />
				{t('label')}
			</Label>

			{discountCode ? (
				// Show applied discount
				<div className="flex gap-x-2 items-center">
					<div className="flex-1 rounded-2xl px-3 py-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 flex items-center justify-between">
						<span className="text-green-700 dark:text-green-300 font-medium">
							{discountCode}
						</span>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleClear}
							className="h-auto p-1"
						>
							<X className="w-4 h-4" />
						</Button>
					</div>
				</div>
			) : (
				// Input for new code
				<div className="flex gap-x-2 items-center">
					<Input
						value={code}
						onChange={(e) => setCode(e.target.value.toUpperCase())}
						onKeyDown={(e) => e.key === 'Enter' && handleApply()}
						placeholder={t('placeholder')}
						className="rounded-2xl px-3 py-6 text-base"
					/>
					<Button
						onClick={handleApply}
						disabled={!code || isApplying}
						className="rounded-full px-9 py-3.5"
					>
						{isApplying ? t('applying') : t('apply')}
					</Button>
				</div>
			)}

			{/* Feedback message */}
			{discountMessage && (
				<p className={`text-sm mt-2 ${discountCode
					? 'text-green-600 dark:text-green-400'
					: 'text-red-600 dark:text-red-400'
					}`}>
					{discountMessage}
				</p>
			)}
		</div>
	)
}