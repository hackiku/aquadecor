// src/app/api/validate-discount/route.ts
import { NextResponse } from 'next/server'
import { validateDiscountCode } from '~/lib/discount-validation'

export async function POST(req: Request) {
	try {
		const { code, subtotal, market, email } = await req.json()

		if (!code || !subtotal) {
			return NextResponse.json(
				{ success: false, message: 'Missing required fields' },
				{ status: 400 }
			)
		}

		const result = await validateDiscountCode(code, subtotal, market, email)

		return NextResponse.json(result)
	} catch (error) {
		console.error('Discount validation error:', error)
		return NextResponse.json(
			{ success: false, message: 'Validation failed' },
			{ status: 500 }
		)
	}
}