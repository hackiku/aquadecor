// src/components/cta/support/SupportForm.tsx

"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { Loader2 } from "lucide-react";

export function SupportForm() {
	const t = useTranslations('contact');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		const formData = new FormData(e.currentTarget);
		const data = {
			firstName: formData.get('firstName'),
			email: formData.get('email'),
			orderNumber: formData.get('orderNumber'),
			topic: formData.get('topic'),
			message: formData.get('message'),
		};

		console.log('Support form submission:', data);

		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));

		setIsSubmitting(false);
		alert(t('form.success'));
		(e.target as HTMLFormElement).reset();
	};

	return (
		<div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border">
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid md:grid-cols-2 gap-6">
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
				</div>

				{/* Order Number (Optional) */}
				<div className="space-y-2">
					<label htmlFor="orderNumber" className="text-sm font-display font-medium">
						{t('support.form.fields.orderNumber.label')}
						<span className="text-muted-foreground ml-1">
							{t('support.form.fields.orderNumber.optional')}
						</span>
					</label>
					<input
						type="text"
						id="orderNumber"
						name="orderNumber"
						placeholder={t('support.form.fields.orderNumber.placeholder')}
						className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-display font-light"
					/>
				</div>

				{/* Issue Type */}
				<div className="space-y-2">
					<label htmlFor="topic" className="text-sm font-display font-medium">
						{t('support.form.fields.issueType.label')}
					</label>
					<select
						id="topic"
						name="topic"
						required
						className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-display font-light appearance-none cursor-pointer"
					>
						<option value="">{t('support.form.fields.issueType.placeholder')}</option>
						<option value="installation">{t('support.form.fields.issueType.options.installation')}</option>
						<option value="damage">{t('support.form.fields.issueType.options.damage')}</option>
						<option value="warranty">{t('support.form.fields.issueType.options.warranty')}</option>
						<option value="technical">{t('support.form.fields.issueType.options.technical')}</option>
						<option value="other">{t('support.form.fields.issueType.options.other')}</option>
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
						placeholder={t('support.form.fields.message.placeholder')}
						className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-display font-light resize-none"
					/>
					<p className="text-xs text-muted-foreground font-display font-light">
						{t('support.form.fields.message.hint')}
					</p>
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
						t('support.form.submit')
					)}
				</button>
			</form>
		</div>
	);
}