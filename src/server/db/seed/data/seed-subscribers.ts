// src/server/db/seed/data/seed-subscribers.ts

import type { EmailSubscriber } from "~/server/db/schema/subscribers";

/**
 * Test email subscribers for development
 * Each gets a unique discount code
 */
export const subscribersSeedData: Array<Omit<EmailSubscriber, 'id' | 'createdAt' | 'updatedAt' | 'lastSyncedAt' | 'confirmedAt' | 'unsubscribedAt' | 'discountUsedAt'>> = [
	{
		// Active subscriber - code not used
		email: 'john.aquascaper@example.com',
		firstName: 'John',
		lastName: 'Smith',
		discountCode: 'SUB10-TEST01',
		discountUsed: false,
		subscriptionConfirmed: true,
		confirmationToken: 'confirm-token-john-123',
		source: 'website',
		locale: 'en',
		isActive: true,
		unsubscribeReason: null,
		brevoContactId: null,
		resendContactId: null,
		emailsSent: 5,
		emailsOpened: 3,
		emailsClicked: 1,
	},
	{
		// Active subscriber - discount already used
		email: 'maria.tankenthusiast@example.com',
		firstName: 'Maria',
		lastName: 'Garcia',
		discountCode: 'SUB10-TEST02',
		discountUsed: true,
		subscriptionConfirmed: true,
		confirmationToken: 'confirm-token-maria-456',
		source: 'checkout',
		locale: 'de',
		isActive: true,
		unsubscribeReason: null,
		brevoContactId: 'brevo-123',
		resendContactId: null,
		emailsSent: 12,
		emailsOpened: 8,
		emailsClicked: 4,
	},
	{
		// Unsubscribed user
		email: 'former.subscriber@example.com',
		firstName: 'Alex',
		lastName: 'Chen',
		discountCode: 'SUB10-TEST03',
		discountUsed: false,
		subscriptionConfirmed: true,
		confirmationToken: 'confirm-token-alex-789',
		source: 'popup',
		locale: 'en',
		isActive: false,
		unsubscribeReason: 'Too many emails',
		brevoContactId: null,
		resendContactId: null,
		emailsSent: 3,
		emailsOpened: 1,
		emailsClicked: 0,
	},
];