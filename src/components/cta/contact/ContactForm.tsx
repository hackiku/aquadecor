// src/components/cta/contact/ContactForm.tsx

"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { Loader2 } from "lucide-react";

export function ContactForm() {
	const t = useTranslations('contact');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		const formData = new FormData(e.currentTarget);
		const data = {
			firstName: formData.get('firstName'),
			email: formData.get('email'),
			country: formData.get('country'),
			topic: formData.get('topic'),
			message: formData.get('message'),
		};

		console.log('Contact form submission:', data);

		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));

		setIsSubmitting(false);
		alert(t('form.success'));
		(e.target as HTMLFormElement).reset();
	};

	return (
		<div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border">
			<h2 className="text-2xl md:text-3xl font-display font-light mb-6">
				{t('form.title')}
			</h2>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* First Name */}
				<div className="space-y-2">
					<label htmlFor="firstName" className="text-sm font-display font-medium">
						{t('form.fields.firstName.label')}
					</label>
					<input
						type="text"
						id="firstName"
						name="firstName"
						required
						placeholder={t('form.fields.firstName.placeholder')}
						className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-display font-light"
					/>
				</div>

				{/* Email */}
				<div className="space-y-2">
					<label htmlFor="email" className="text-sm font-display font-medium">
						{t('form.fields.email.label')}
					</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						placeholder={t('form.fields.email.placeholder')}
						className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-display font-light"
					/>
				</div>

				{/* Country */}
				<div className="space-y-2">
					<label htmlFor="country" className="text-sm font-display font-medium">
						{t('form.fields.country.label')}
					</label>
					<select
						id="country"
						name="country"
						required
						className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-display font-light appearance-none cursor-pointer"
					>
						<option value="">{t('form.fields.country.placeholder')}</option>
						<option value="US">United States</option>
						<option value="GB">United Kingdom</option>
						<option value="DE">Germany</option>
						<option value="FR">France</option>
						<option value="IT">Italy</option>
						<option value="ES">Spain</option>
						<option value="NL">Netherlands</option>
						<option value="CA">Canada</option>
						<option value="AU">Australia</option>
						<option value="JP">Japan</option>
						<option value="other">Other</option>
					</select>
				</div>

				{/* Message Topic */}
				<div className="space-y-2">
					<label htmlFor="topic" className="text-sm font-display font-medium">
						{t('form.fields.topic.label')}
					</label>
					<select
						id="topic"
						name="topic"
						required
						className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-display font-light appearance-none cursor-pointer"
					>
						<option value="">{t('form.fields.topic.placeholder')}</option>
						<option value="pricing">{t('form.fields.topic.options.pricing')}</option>
						<option value="payment">{t('form.fields.topic.options.payment')}</option>
						<option value="shipping">{t('form.fields.topic.options.shipping')}</option>
						<option value="filters">{t('form.fields.topic.options.filters')}</option>
						<option value="other">{t('form.fields.topic.options.other')}</option>
					</select>
				</div>

				{/* Message */}
				<div className="space-y-2">
					<label htmlFor="message" className="text-sm font-display font-medium">
						{t('form.fields.message.label')}
					</label>
					<textarea
						id="message"
						name="message"
						required
						rows={6}
						placeholder={t('form.fields.message.placeholder')}
						className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-display font-light resize-none"
					/>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg font-display font-medium hover:bg-primary/90 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="h-5 w-5 animate-spin" />
							{t('form.submitting')}
						</>
					) : (
						t('form.submit')
					)}
				</button>
			</form>
		</div>
	);
}