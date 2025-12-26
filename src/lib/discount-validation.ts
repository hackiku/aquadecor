// src/lib/discount-validation.ts
import { db } from '~/server/db'
import { promoterCodes, sales } from '~/server/db/schema'
import { and, eq, lte, gte, sql } from 'drizzle-orm'

interface DiscountResult {
	success: boolean
	type: 'promoter' | 'sale' | 'signup' | null
	discountAmount: number
	discountPercent?: number
	promoterId?: string
	saleId?: string
	code: string
	message?: string
}

export async function validateDiscountCode(
	code: string,
	subtotal: number,
	market: string,
	userEmail?: string
): Promise<DiscountResult> {
	const normalizedCode = code.toUpperCase().trim()

	// Check if it's the signup discount code
	if (normalizedCode === 'WELCOME10' || normalizedCode === 'SIGNUP10') {
		// TODO: Check if user already used this (query orders by email)
		if (userEmail) {
			const { orders } = await import('~/server/db/schema')
			const existingOrders = await db.query.orders.findMany({
				where: eq(orders.email, userEmail),
				limit: 1
			})

			if (existingOrders.length > 0) {
				return {
					success: false,
					type: null,
					discountAmount: 0,
					code: normalizedCode,
					message: 'Signup discount can only be used once'
				}
			}
		}

		const discountAmount = Math.floor(subtotal * 0.10)
		return {
			success: true,
			type: 'signup',
			discountAmount,
			discountPercent: 10,
			code: normalizedCode
		}
	}

	// Try promoter codes
	const promoterCode = await db.query.promoterCodes.findFirst({
		where: and(
			eq(promoterCodes.code, normalizedCode),
			eq(promoterCodes.isActive, true)
		),
		with: { promoter: true }
	})

	if (promoterCode) {
		const discountAmount = promoterCode.type === 'percentage'
			? Math.floor(subtotal * (promoterCode.discountPercent! / 100))
			: promoterCode.discountAmountCents!

		// Increment usage
		await db.update(promoterCodes)
			.set({ usageCount: sql`${promoterCodes.usageCount} + 1` })
			.where(eq(promoterCodes.id, promoterCode.id))

		return {
			success: true,
			type: 'promoter',
			discountAmount,
			discountPercent: promoterCode.discountPercent ?? undefined,
			promoterId: promoterCode.promoterId,
			code: normalizedCode
		}
	}

	// Try seasonal sales
	const now = new Date()
	const sale = await db.query.sales.findFirst({
		where: and(
			eq(sales.discountCode, normalizedCode),
			eq(sales.isActive, true),
			lte(sales.startsAt, now),
			gte(sales.endsAt, now)
		)
	})

	if (sale) {
		// Check market restrictions
		if (sale.targetMarkets && sale.targetMarkets.length > 0) {
			if (!sale.targetMarkets.includes(market)) {
				return {
					success: false,
					type: null,
					discountAmount: 0,
					code: normalizedCode,
					message: 'This discount is not available in your region'
				}
			}
		}

		const discountAmount = sale.type === 'percentage'
			? Math.floor(subtotal * (sale.discountPercent! / 100))
			: sale.discountAmountCents!

		// Increment usage
		await db.update(sales)
			.set({
				usageCount: sql`${sales.usageCount} + 1`,
				totalRevenue: sql`${sales.totalRevenue} + ${subtotal}`
			})
			.where(eq(sales.id, sale.id))

		return {
			success: true,
			type: 'sale',
			discountAmount,
			discountPercent: sale.discountPercent ?? undefined,
			saleId: sale.id,
			code: normalizedCode
		}
	}

	// Code not found
	return {
		success: false,
		type: null,
		discountAmount: 0,
		code: normalizedCode,
		message: 'Invalid or expired discount code'
	}
}