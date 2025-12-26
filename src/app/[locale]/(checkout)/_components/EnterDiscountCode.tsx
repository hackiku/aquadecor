// src/app/[locale]/(checkout)/_components/EnterDiscountCode.tsx
'use client'

import { useState } from 'react'
import { Tag } from 'lucide-react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'

export function EnterDiscountCode() {
	const [code, setCode] = useState('')
	const [isApplying, setIsApplying] = useState(false)

	const handleApply = async () => {
		setIsApplying(true)
		// TODO: Validate with tRPC
		console.log('Applying discount:', code)
		setTimeout(() => setIsApplying(false), 1000)
	}

	return (
		<div className="border rounded-3xl p-6">
			<Label className="text-sm font-display font-normal flex gap-x-2 items-center mb-3">
				<Tag className="w-5 h-5" />
				Discount code
			</Label>
			<div className="flex gap-x-2 items-center">
				<Input
					value={code}
					onChange={(e) => setCode(e.target.value)}
					placeholder="Enter discount code"
					className="rounded-2xl px-3 py-6 text-base"
				/>
				<Button
					onClick={handleApply}
					disabled={!code || isApplying}
					className="rounded-full px-9 py-3.5"
				>
					{isApplying ? 'Applying...' : 'Apply'}
				</Button>
			</div>
		</div>
	)
}