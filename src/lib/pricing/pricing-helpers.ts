// src/lib/pricing-helpers.ts

import type { Sale } from '~/server/db/schema'

export function calculateSalePrice(
	basePrice: number,
	productId: string,
	categoryId: string,
	productLine: string,
	activeSales: Sale[],
	market: string
): { salePrice: number | null; activeSale: Sale | null } {

	// Find first matching sale
	const matchingSale = activeSales.find(sale => {
		// Check market
		if (sale.targetMarkets && !sale.targetMarkets.includes(market)) {
			return false
		}

		// Check targeting
		if (sale.targetType === 'all') return true

		if (sale.targetType === 'product_line') {
			return sale.targetProductIds?.includes(productLine)
		}

		if (sale.targetType === 'category') {
			return sale.targetCategoryIds?.includes(categoryId)
		}

		if (sale.targetType === 'specific_products') {
			return sale.targetProductIds?.includes(productId)
		}

		return false
	})

	if (!matchingSale) {
		return { salePrice: null, activeSale: null }
	}

	// Calculate discount
	const discount = matchingSale.type === 'percentage'
		? Math.floor(basePrice * (matchingSale.discountPercent! / 100))
		: matchingSale.discountAmountCents!

	const salePrice = Math.max(0, basePrice - discount)

	return { salePrice, activeSale: matchingSale }
}