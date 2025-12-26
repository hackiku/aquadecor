// src/app/[locale]/(checkout)/_components/ShippingForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useCheckout } from './CheckoutContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const shippingSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.string().email('Invalid email address'),
	phone: z.string().min(1, 'Phone number is required'),
	address1: z.string().min(1, 'Address is required'),
	address2: z.string().optional(),
	city: z.string().min(1, 'City is required'),
	state: z.string().optional(),
	postalCode: z.string().min(1, 'Postal code is required'),
	countryCode: z.string().min(2, 'Country is required'),
})

type ShippingFormData = z.infer<typeof shippingSchema>

// ============================================================================
// COMPONENT
// ============================================================================

export function ShippingForm() {
	const router = useRouter()
	const { shippingAddress, setShippingAddress, subtotal, total } = useCheckout()
	const [isSubmitting, setIsSubmitting] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ShippingFormData>({
		resolver: zodResolver(shippingSchema),
		defaultValues: shippingAddress ?? undefined,
	})

	const onSubmit = async (data: ShippingFormData) => {
		setIsSubmitting(true)

		// Save to context
		setShippingAddress(data)

		// TODO: Calculate shipping & tax based on country
		// TODO: Validate address with postal service API

		// Navigate to payment
		router.push('/payment')
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
			{/* Form Fields */}
			<div className="lg:col-span-2 space-y-6">
				<div className="bg-card rounded-2xl border p-6 space-y-6">
					{/* Contact Information */}
					<div>
						<h2 className="text-lg font-display font-medium mb-4">Contact Information</h2>
						<div className="grid md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">
									First name<span className="text-destructive">*</span>
								</Label>
								<Input
									id="firstName"
									{...register('firstName')}
									className="rounded-xl"
								/>
								{errors.firstName && (
									<p className="text-sm text-destructive">{errors.firstName.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="lastName">
									Last name<span className="text-destructive">*</span>
								</Label>
								<Input
									id="lastName"
									{...register('lastName')}
									className="rounded-xl"
								/>
								{errors.lastName && (
									<p className="text-sm text-destructive">{errors.lastName.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">
									Email<span className="text-destructive">*</span>
								</Label>
								<Input
									id="email"
									type="email"
									{...register('email')}
									className="rounded-xl"
								/>
								{errors.email && (
									<p className="text-sm text-destructive">{errors.email.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="phone">
									Phone<span className="text-destructive">*</span>
								</Label>
								<Input
									id="phone"
									type="tel"
									{...register('phone')}
									className="rounded-xl"
								/>
								{errors.phone && (
									<p className="text-sm text-destructive">{errors.phone.message}</p>
								)}
							</div>
						</div>
					</div>

					<div className="h-px bg-border" />

					{/* Shipping Address */}
					<div>
						<h2 className="text-lg font-display font-medium mb-4">Shipping Address</h2>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="address1">
									Address<span className="text-destructive">*</span>
								</Label>
								<Input
									id="address1"
									{...register('address1')}
									placeholder="Street address, P.O. box"
									className="rounded-xl"
								/>
								{errors.address1 && (
									<p className="text-sm text-destructive">{errors.address1.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="address2">Apartment, suite, etc. (optional)</Label>
								<Input
									id="address2"
									{...register('address2')}
									className="rounded-xl"
								/>
							</div>

							<div className="grid md:grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label htmlFor="city">
										City<span className="text-destructive">*</span>
									</Label>
									<Input
										id="city"
										{...register('city')}
										className="rounded-xl"
									/>
									{errors.city && (
										<p className="text-sm text-destructive">{errors.city.message}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="state">State/Province (optional)</Label>
									<Input
										id="state"
										{...register('state')}
										className="rounded-xl"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="postalCode">
										Postal Code<span className="text-destructive">*</span>
									</Label>
									<Input
										id="postalCode"
										{...register('postalCode')}
										className="rounded-xl"
									/>
									{errors.postalCode && (
										<p className="text-sm text-destructive">{errors.postalCode.message}</p>
									)}
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="countryCode">
									Country<span className="text-destructive">*</span>
								</Label>
								<select
									id="countryCode"
									{...register('countryCode')}
									className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="">Select country</option>
									<option value="US">United States</option>
									<option value="RS">Serbia</option>
									<option value="DE">Germany</option>
									<option value="FR">France</option>
									<option value="GB">United Kingdom</option>
									<option value="IT">Italy</option>
									{/* TODO: Fetch from countries table via tRPC */}
								</select>
								{errors.countryCode && (
									<p className="text-sm text-destructive">{errors.countryCode.message}</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Summary Sidebar */}
			<div className="lg:col-span-1">
				<div className="bg-card rounded-2xl border p-6 space-y-6 sticky top-24">
					<h2 className="text-xl font-display font-medium">Order Summary</h2>

					<div className="space-y-3">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground font-display">Subtotal</span>
							<span className="font-display font-medium">€{(subtotal / 100).toFixed(2)}</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground font-display">Shipping</span>
							<span className="font-display font-medium text-primary">Free</span>
						</div>
					</div>

					<div className="h-px bg-border" />

					<div className="flex justify-between items-baseline">
						<span className="text-lg font-display font-medium">Total</span>
						<span className="text-2xl font-display font-semibold">€{(total / 100).toFixed(2)}</span>
					</div>

					<Button
						type="submit"
						className="w-full rounded-full gap-2"
						size="lg"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Processing...' : 'Continue to Payment'}
						<ArrowRight className="h-4 w-4" />
					</Button>

					<p className="text-xs text-center text-muted-foreground font-display font-light">
						Your payment information is secure and encrypted
					</p>
				</div>
			</div>
		</form>
	)
}