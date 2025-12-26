// src/app/[locale]/(checkout)/_components/CheckoutProgressBar.tsx
'use client'

import { usePathname } from 'next/navigation'
import { ShoppingCart, Truck, CreditCard, CheckCircle } from 'lucide-react'
import { cn } from '~/lib/utils'

const steps = [
	{ key: 'cart', label: 'Cart', icon: ShoppingCart, path: '/cart' },
	{ key: 'shipping', label: 'Shipping', icon: Truck, path: '/shipping' },
	{ key: 'payment', label: 'Payment', icon: CreditCard, path: '/payment' },
	{ key: 'success', label: 'Complete', icon: CheckCircle, path: '/success' },
]

export function CheckoutProgressBar() {
	const pathname = usePathname()

	// Extract step from path (e.g., /en/cart -> cart)
	const currentStepKey = steps.find(step => pathname.includes(step.path))?.key ?? 'cart'
	const currentStepIndex = steps.findIndex(step => step.key === currentStepKey)

	return (
		<div className="relative">
			{/* Progress Line */}
			<div className="absolute top-5 left-0 right-0 h-0.5 bg-muted hidden md:block">
				<div
					className="h-full bg-primary transition-all duration-500"
					style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
				/>
			</div>

			{/* Steps */}
			<div className="relative flex justify-between items-center">
				{steps.map((step, index) => {
					const isActive = index === currentStepIndex
					const isCompleted = index < currentStepIndex
					const Icon = step.icon

					return (
						<div
							key={step.key}
							className={cn(
								'flex flex-col items-center gap-2 transition-all',
								isActive && 'scale-110'
							)}
						>
							{/* Circle */}
							<div
								className={cn(
									'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all',
									isCompleted && 'bg-primary border-primary text-white',
									isActive && 'bg-primary/10 border-primary text-primary',
									!isActive && !isCompleted && 'bg-muted border-muted-foreground/20 text-muted-foreground'
								)}
							>
								<Icon className="h-4 w-4" />
							</div>

							{/* Label - Hidden on mobile except active */}
							<span
								className={cn(
									'text-xs font-display font-medium transition-all',
									isActive ? 'text-primary' : 'text-muted-foreground',
									!isActive && 'hidden md:block'
								)}
							>
								{step.label}
							</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}