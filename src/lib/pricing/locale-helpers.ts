// src/lib/pricing/locale-helpers.ts
import { getTranslations } from 'next-intl/server';

export async function generateLocalizedInvoice(
	order: {
		id: string;
		userLocale: string;
		items: Array<{
			sku: string;
			name: string;
			quantity: number;
			unitPriceEurCents: number;
		}>;
		subtotalCents: number;
		shippingCents: number;
		totalCents: number;
		createdAt: Date;
	}
) {
	const locale = order.userLocale || 'en';
	const t = await getTranslations({ locale, namespace: 'invoice' });

	// Format currency based on locale
	const formatCurrency = (cents: number) => {
		const currencyMap: Record<string, string> = {
			en: 'EUR',
			de: 'EUR',
			nl: 'EUR',
			it: 'EUR',
			us: 'USD', // If you want US market to see USD
		};

		const localeMap: Record<string, string> = {
			en: 'en-US',
			de: 'de-DE',
			nl: 'nl-NL',
			it: 'it-IT',
			us: 'en-US',
		};

		return new Intl.NumberFormat(localeMap[locale], {
			style: 'currency',
			currency: currencyMap[locale],
		}).format(cents / 100);
	};

	// Format date based on locale
	const formatDate = (date: Date) => {
		const localeMap: Record<string, string> = {
			en: 'en-US',
			de: 'de-DE',
			nl: 'nl-NL',
			it: 'it-IT',
			us: 'en-US',
		};

		return new Intl.DateTimeFormat(localeMap[locale], {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}).format(date);
	};

	return {
		// Metadata
		invoiceNumber: `INV-${order.id}`,
		date: formatDate(order.createdAt),
		locale,

		// Translated labels
		labels: {
			invoice: t('title'),
			invoiceNumber: t('invoiceNumber'),
			date: t('date'),
			billTo: t('billTo'),
			item: t('item'),
			quantity: t('quantity'),
			unitPrice: t('unitPrice'),
			total: t('total'),
			subtotal: t('subtotal'),
			shipping: t('shipping'),
			grandTotal: t('grandTotal'),
			footer: t('footer'),
		},

		// Line items
		items: order.items.map(item => ({
			sku: item.sku,
			name: item.name,
			quantity: item.quantity,
			unitPrice: formatCurrency(item.unitPriceEurCents),
			total: formatCurrency(item.unitPriceEurCents * item.quantity),
		})),

		// Totals
		subtotal: formatCurrency(order.subtotalCents),
		shipping: formatCurrency(order.shippingCents),
		grandTotal: formatCurrency(order.totalCents),
	};
}

// Usage in API route:
// const invoiceData = await generateLocalizedInvoice(order);
// const pdf = await generateInvoicePDF(invoiceData);
// return pdf;