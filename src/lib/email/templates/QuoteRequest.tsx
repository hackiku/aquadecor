// src/lib/email/templates/QuoteRequest.tsx

export function QuoteRequest({ name, product }: Props) {
	return (
		<EmailLayout>
			<h1>New Quote Request</h1>
			<p>Customer: {name}</p>
			<p>Product: {product}</p>
		</EmailLayout>
	);
}