// @ts-nocheck
// src/server/api/routers/checkout.ts

export const createCheckoutSession = protectedProcedure
	.input(z.object({
		locale: z.enum(['en', 'de', 'nl', 'it']),
		cartItems: z.array(...)
	}))
	.mutation(async ({ ctx, input }) => {

		// 1. RE-FETCH DATA FROM DB (Do not trust input prices)
		// Use your fancy DB to look up products by slug
		const lineItems = input.cartItems.map(item => {
			const product = await ctx.db.query.products.findFirst({
				where: eq(products.slug, item.slug)
			});

			// Get the translation for the CURRENT user locale
			// You already have this logic in your seed files!
			const translation = translations[product.slug][input.locale];

			// Calculate dynamic price if needed (custom dimensions)
			const finalPrice = calculatePrice(product, item.width, item.height);

			return {
				price_data: {
					currency: 'eur',
					unit_amount: finalPrice, // Amount in cents
					product_data: {
						name: translation.name, // <--- LOCALIZED NAME!
						description: translation.shortDescription, // <--- LOCALIZED DESC!
						images: [getProductImage(product.slug)], // <--- DYNAMIC IMAGE
						metadata: {
							sku: product.sku,
							dimensions: `${item.width}x${item.height}`,
							productSlug: product.slug
						},
						// IMPORTANT: Pass the Tax Code here for Stripe Tax to work
						// 'txcd_99999999' is the code for "General Tangible Goods"
						tax_code: 'txcd_99999999',
					},
				},
				quantity: item.quantity,
			};
		});

		// 2. Create Session
		const session = await stripe.checkout.sessions.create({
			line_items: lineItems,
			mode: 'payment',
			locale: input.locale, // Tells Stripe to translate their own UI (Pay button, etc)
			// ... rest of config
		});

		return { url: session.url };
	});