// src/app/[locale]/(checkout)/_components/ShippingInformation.tsx
'use client'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useCheckout } from '~/app/_context/CheckoutContext'
import { useTranslations } from 'next-intl'

export function ShippingInformation() {
	const t = useTranslations('checkout.shipping')
	const { cartItems } = useCheckout()
	const isDisabled = cartItems.length === 0

	return (
		<div className="border rounded-3xl h-max">
			{/* Header */}
			<div className="p-6 border-b">
				<h3 className="font-display font-light text-xl">
					{t('title')}
				</h3>
				<p className="text-muted-foreground font-display font-light text-base mt-1">
					{t('subtitle')}
				</p>
			</div>

			{/* Form */}
			<form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* First Name */}
				<div className="space-y-2">
					<Label htmlFor="firstName" className="text-sm font-medium">
						{t('fields.firstName')}<span className="text-red-400">*</span>
					</Label>
					<Input
						id="firstName"
						disabled={isDisabled}
						className="rounded-2xl px-3 py-6 text-base"
					/>
				</div>

				{/* Last Name */}
				<div className="space-y-2">
					<Label htmlFor="lastName" className="text-sm font-medium">
						{t('fields.lastName')}<span className="text-red-400">*</span>
					</Label>
					<Input
						id="lastName"
						disabled={isDisabled}
						className="rounded-2xl px-3 py-6 text-base"
					/>
				</div>

				{/* Email */}
				<div className="space-y-2">
					<Label htmlFor="email" className="text-sm font-medium">
						{t('fields.email')}<span className="text-red-400">*</span>
					</Label>
					<Input
						id="email"
						type="email"
						disabled={isDisabled}
						className="rounded-2xl px-3 py-6 text-base"
					/>
				</div>

				{/* Phone */}
				<div className="space-y-2">
					<Label htmlFor="phoneNumber" className="text-sm font-medium">
						{t('fields.phone')}<span className="text-red-400">*</span>
					</Label>
					<Input
						id="phoneNumber"
						type="tel"
						disabled={isDisabled}
						className="rounded-2xl px-3 py-6 text-base"
					/>
				</div>

				{/* Address */}
				<div className="space-y-2">
					<Label htmlFor="addressLine1" className="text-sm font-medium">
						{t('fields.address')}<span className="text-red-400">*</span>
					</Label>
					<Input
						id="addressLine1"
						disabled={isDisabled}
						className="rounded-2xl px-3 py-6 text-base"
					/>
				</div>

				{/* Apartment */}
				<div className="space-y-2">
					<Label htmlFor="addressLine2" className="text-sm font-medium">
						{t('fields.apartment')}
					</Label>
					<Input
						id="addressLine2"
						disabled={isDisabled}
						className="rounded-2xl px-3 py-6 text-base"
					/>
				</div>

				{/* ZIP */}
				<div className="space-y-2">
					<Label htmlFor="postalCode" className="text-sm font-medium">
						{t('fields.zip')}<span className="text-red-400">*</span>
					</Label>
					<Input
						id="postalCode"
						disabled={isDisabled}
						className="rounded-2xl px-3 py-6 text-base"
					/>
				</div>

				{/* City */}
				<div className="space-y-2">
					<Label htmlFor="city" className="text-sm font-medium">
						{t('fields.city')}<span className="text-red-400">*</span>
					</Label>
					<Input
						id="city"
						disabled={isDisabled}
						className="rounded-2xl px-3 py-6 text-base"
					/>
				</div>

				{/* State */}
				<div className="space-y-2">
					<Label htmlFor="state" className="text-sm font-medium">
						{t('fields.state')}
					</Label>
					<Input
						id="state"
						disabled={isDisabled}
						className="rounded-2xl px-3 py-6 text-base"
					/>
				</div>

				{/* Country */}
				<div className="space-y-2 self-end">
					<Label htmlFor="country" className="text-sm font-medium">
						{t('fields.country')}<span className="text-red-400">*</span>
					</Label>
					<select
						id="country"
						disabled={isDisabled}
						className="flex h-10 w-full rounded-2xl border border-input bg-transparent px-3 py-6 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-muted-foreground"
					>
						<option value="">{t('fields.selectCountry')}</option>
						<option value="US">United States</option>
						<option value="RS">Serbia</option>
						<option value="DE">Germany</option>
						<option value="FR">France</option>
						<option value="GB">United Kingdom</option>
						<option value="IT">Italy</option>
					</select>
				</div>
			</form>
		</div>
	)
}