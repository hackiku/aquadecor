// src/server/api/services/email-service.ts

/**
 * EMAIL SERVICE ABSTRACTION
 * 
 * Switch between Brevo (Sendinblue) and Resend by changing EMAIL_PROVIDER env var
 * 
 * Usage:
 *   await emailService.subscribeToNewsletter({ email, name, locale })
 */

import { env } from "~/env";

// ============================================================================
// TYPES
// ============================================================================

interface SubscribeParams {
	email: string;
	firstName?: string;
	lastName?: string;
	locale?: string;
}

interface EmailServiceResponse {
	success: boolean;
	contactId?: string;
	error?: string;
}

// ============================================================================
// BREVO (SENDINBLUE) IMPLEMENTATION
// ============================================================================

async function brevoSubscribe(params: SubscribeParams): Promise<EmailServiceResponse> {
	try {
		const response = await fetch('https://api.brevo.com/v3/contacts', {
			method: 'POST',
			headers: {
				'accept': 'application/json',
				'content-type': 'application/json',
				'api-key': env.BREVO_API_KEY || '',
			},
			body: JSON.stringify({
				email: params.email,
				attributes: {
					FIRSTNAME: params.firstName || '',
					LASTNAME: params.lastName || '',
					LOCALE: params.locale || 'en',
				},
				listIds: [parseInt(env.BREVO_LIST_ID || '0')], // Your newsletter list ID
				updateEnabled: true, // Update if contact exists
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			// Brevo returns 400 if contact already exists - treat as success
			if (response.status === 400 && data.message?.includes('Contact already exist')) {
				return { success: true, contactId: data.id?.toString() };
			}
			throw new Error(data.message || 'Brevo API error');
		}

		return {
			success: true,
			contactId: data.id?.toString(),
		};
	} catch (error) {
		console.error('Brevo subscription error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}

// ============================================================================
// RESEND IMPLEMENTATION (Future-ready)
// ============================================================================

async function resendSubscribe(params: SubscribeParams): Promise<EmailServiceResponse> {
	try {
		// Dynamic import - only loads if needed (won't fail if package not installed)
		const resendModule = await import('resend').catch(() => null);

		if (!resendModule) {
			throw new Error('Resend package not installed. Run: npm install resend');
		}

		const { Resend } = resendModule;
		const resend = new Resend(env.RESEND_API_KEY);

		// Resend uses Audiences API
		const response = await resend.contacts.create({
			email: params.email,
			firstName: params.firstName,
			lastName: params.lastName,
			audienceId: env.RESEND_AUDIENCE_ID || '',
		});

		return {
			success: true,
			contactId: response.data?.id,
		};
	} catch (error) {
		console.error('Resend subscription error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}

// ============================================================================
// MOCK IMPLEMENTATION (Development)
// ============================================================================

async function mockSubscribe(params: SubscribeParams): Promise<EmailServiceResponse> {
	console.log('📧 [MOCK EMAIL SERVICE] Subscribe:', params);
	return {
		success: true,
		contactId: `mock-${Date.now()}`,
	};
}

// ============================================================================
// MAIN SERVICE EXPORT
// ============================================================================

class EmailService {
	private provider: 'brevo' | 'resend' | 'mock';

	constructor() {
		// Determine provider from env (defaults to mock for safety)
		const envProvider = env.EMAIL_PROVIDER as 'brevo' | 'resend' | 'mock' | undefined;
		this.provider = envProvider || 'mock';

		if (this.provider === 'mock') {
			console.warn('⚠️  Using MOCK email service. Set EMAIL_PROVIDER=brevo or resend in .env');
		}
	}

	async subscribeToNewsletter(params: SubscribeParams): Promise<EmailServiceResponse> {
		switch (this.provider) {
			case 'brevo':
				return brevoSubscribe(params);
			case 'resend':
				return resendSubscribe(params);
			case 'mock':
				return mockSubscribe(params);
			default:
				// TypeScript exhaustiveness check - should never happen
				const _exhaustive: never = this.provider;
				throw new Error(`Unknown email provider: ${_exhaustive}`);
		}
	}

	// Future methods:
	// async sendTransactional(params) { ... }
	// async updateContact(params) { ... }
	// async unsubscribe(email) { ... }
}

export const emailService = new EmailService();