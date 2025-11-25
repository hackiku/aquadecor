// src/app/admin/_data/orders.ts

export type OrderStatus =
	| "pending"           // New order, not yet confirmed
	| "confirmed"         // Confirmed, ready for production
	| "in_production"     // Currently being made
	| "ready_to_ship"     // Completed, awaiting shipment
	| "shipped"           // In transit
	| "delivered"         // Delivered to customer
	| "cancelled"         // Order cancelled
	| "refunded"          // Payment refunded
	| "abandoned";        // Cart abandoned before payment

export type PaymentStatus =
	| "pending"           // Awaiting payment
	| "paid"              // Payment received
	| "failed"            // Payment failed
	| "refunded";         // Payment refunded

export interface Order {
	id: string;
	orderNumber: string;  // Human-readable order ID
	email: string;
	firstName?: string;
	lastName?: string;

	// Order details
	subtotal: number;     // in cents
	discount: number;     // in cents
	shipping: number;     // in cents
	total: number;        // in cents
	currency: string;     // EUR, USD, etc.

	// Status
	status: OrderStatus;
	paymentStatus: PaymentStatus;

	// Discount/Promo
	discountCode?: string;
	promoterId?: string;

	// Items
	items: OrderItem[];

	// Shipping
	shippingAddress?: ShippingAddress;
	trackingNumber?: string;

	// Metadata
	notes?: string;
	internalNotes?: string;

	// Timestamps
	createdAt: Date;
	updatedAt?: Date;
	confirmedAt?: Date;
	shippedAt?: Date;
	deliveredAt?: Date;
}

export interface OrderItem {
	id: string;
	productId: string;
	productName: string;
	sku?: string;
	quantity: number;
	pricePerUnit: number;  // in cents
	total: number;         // in cents
	customizations?: Record<string, any>;  // Custom dimensions, options, etc.
}

export interface ShippingAddress {
	firstName: string;
	lastName: string;
	company?: string;
	address1: string;
	address2?: string;
	city: string;
	state?: string;
	postalCode: string;
	country: string;
	phone?: string;
}

// Mock data for development
export const mockOrders: Order[] = [
	{
		id: "2aa7e5f5-2222-4fdd-8847-6066d21f8089",
		orderNumber: "ORD-2025-001",
		email: "dakermo@hotmail.com",
		status: "abandoned",
		paymentStatus: "pending",
		subtotal: 10580,
		discount: 0,
		shipping: 0,
		total: 10580,
		currency: "EUR",
		items: [],
		createdAt: new Date("2025-11-25T00:45:00"),
	},
	{
		id: "e04dc394-8c8c-4242-817b-dbb324d893e5",
		orderNumber: "ORD-2025-002",
		email: "Chayl22@yahoo.com",
		status: "abandoned",
		paymentStatus: "pending",
		subtotal: 53400,
		discount: 0,
		shipping: 0,
		total: 53400,
		currency: "EUR",
		items: [],
		createdAt: new Date("2025-11-24T20:30:00"),
	},
	{
		id: "289f9756-d9f0-4619-bc9d-21fcd51e815",
		orderNumber: "ORD-2025-003",
		email: "jason_rigdon@comcast.net",
		status: "abandoned",
		paymentStatus: "pending",
		subtotal: 40400,
		discount: 0,
		shipping: 0,
		total: 40400,
		currency: "EUR",
		items: [],
		createdAt: new Date("2025-11-24T14:32:00"),
	},
	{
		id: "a5978ec5-4854-4aea-b39a-0ec8b874d7df",
		orderNumber: "ORD-2025-004",
		email: "teesha.gray@pfizer.com",
		status: "confirmed",
		paymentStatus: "paid",
		subtotal: 48100,
		discount: 0,
		shipping: 0,
		total: 48100,
		currency: "EUR",
		items: [],
		createdAt: new Date("2025-11-22T09:23:00"),
	},
	{
		id: "56481639-2b12-4a7b-b3f0-3b3eec240e70",
		orderNumber: "ORD-2025-005",
		email: "brian_chambers@icmrs.co.uk",
		status: "shipped",
		paymentStatus: "paid",
		subtotal: 38000,
		discount: 0,
		shipping: 0,
		total: 38000,
		currency: "EUR",
		items: [],
		createdAt: new Date("2025-11-21T20:04:00"),
	},
	{
		id: "bd53c3c1-6606-4844-b0ff-a78c6660790a",
		orderNumber: "ORD-2025-006",
		email: "jbramos80@gmail.com",
		status: "delivered",
		paymentStatus: "paid",
		discountCode: "J0EY15",
		subtotal: 70125,
		discount: 0,
		shipping: 0,
		total: 70125,
		currency: "EUR",
		items: [],
		createdAt: new Date("2025-11-18T19:59:00"),
	},
];