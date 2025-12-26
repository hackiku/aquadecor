// src/components/shop/checkout/OrderConfirmation.tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, Truck, Mail, ArrowRight } from 'lucide-react'
import { Button } from '~/components/ui/button'
import confetti from 'canvas-confetti'

interface OrderConfirmationProps {
	orderId: string
}

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
	// TODO: Fetch order details with tRPC
	// const { data: order } = api.order.getById.useQuery({ orderId })

	// Confetti on mount
	useEffect(() => {
		const duration = 3000
		const end = Date.now() + duration

		const frame = () => {
			confetti({
				particleCount: 2,
				angle: 60,
				spread: 55,
				origin: { x: 0 },
				colors: ['#0EA5E9', '#06B6D4', '#14B8A6'],
			})
			confetti({
				particleCount: 2,
				angle: 120,
				spread: 55,
				origin: { x: 1 },
				colors: ['#0EA5E9', '#06B6D4', '#14B8A6'],
			})

			if (Date.now() < end) {
				requestAnimationFrame(frame)
			}
		}

		frame()

		// Clear cart
		localStorage.removeItem('cart')
		window.dispatchEvent(new CustomEvent('cart-updated', { detail: { items: [] } }))
	}, [])

	return (
		<div className="max-w-3xl mx-auto">
			{/* Success Icon */}
			<div className="text-center mb-8">
				<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
					<CheckCircle className="h-10 w-10 text-primary" />
				</div>
				<h1 className="text-3xl md:text-4xl font-display font-light tracking-tight mb-3">
					Order Confirmed!
				</h1>
				<p className="text-lg text-muted-foreground font-display font-light">
					Thank you for your purchase
				</p>
			</div>

			{/* Order Details Card */}
			<div className="bg-card rounded-2xl border p-6 md:p-8 space-y-6 mb-8">
				{/* Order Number */}
				<div className="text-center pb-6 border-b">
					<p className="text-sm text-muted-foreground font-display font-light mb-1">
						Order Number
					</p>
					<p className="text-2xl font-display font-medium font-mono">
						{orderId}
					</p>
				</div>

				{/* Confirmation Email */}
				<div className="flex items-start gap-4">
					<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
						<Mail className="h-5 w-5 text-primary" />
					</div>
					<div>
						<h3 className="font-display font-medium mb-1">Confirmation Email Sent</h3>
						<p className="text-sm text-muted-foreground font-display font-light">
							We've sent order details and receipt to your email address.
						</p>
					</div>
				</div>

				{/* Production Timeline */}
				<div className="flex items-start gap-4">
					<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
						<Package className="h-5 w-5 text-primary" />
					</div>
					<div>
						<h3 className="font-display font-medium mb-1">Production Starts Soon</h3>
						<p className="text-sm text-muted-foreground font-display font-light">
							Your custom backgrounds will be ready for shipping in 10-12 business days.
						</p>
					</div>
				</div>

				{/* Tracking Info */}
				<div className="flex items-start gap-4">
					<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
						<Truck className="h-5 w-5 text-primary" />
					</div>
					<div>
						<h3 className="font-display font-medium mb-1">Tracking Updates</h3>
						<p className="text-sm text-muted-foreground font-display font-light">
							We'll email you tracking information once your order ships.
						</p>
					</div>
				</div>
			</div>

			{/* Next Steps */}
			<div className="grid md:grid-cols-2 gap-4 mb-8">
				<Button
					asChild
					variant="outline"
					size="lg"
					className="rounded-full"
				>
					<Link href="/account/orders">
						View Order Status
						<ArrowRight className="h-4 w-4 ml-2" />
					</Link>
				</Button>

				<Button
					asChild
					size="lg"
					className="rounded-full"
				>
					<Link href="/shop">
						Continue Shopping
						<ArrowRight className="h-4 w-4 ml-2" />
					</Link>
				</Button>
			</div>

			{/* Support CTA */}
			<div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border-2 border-primary/20 p-6 text-center">
				<h3 className="text-lg font-display font-medium mb-2">Need Help?</h3>
				<p className="text-sm text-muted-foreground font-display font-light mb-4">
					Our team is here to answer any questions about your order.
				</p>
				<Button
					asChild
					variant="outline"
					size="sm"
					className="rounded-full"
				>
					<Link href="/support">Contact Support</Link>
				</Button>
			</div>
		</div>
	)
}