// src/app/[locale]/(auth)/register/page.tsx

import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

type Props = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'register' });

	return {
		title: t('headline'),
		description: t('headline'),
	};
}

export default async function RegisterPage({ params }: Props) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'register' });

	return (
		<main className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-display font-light">
						{t('headline')}
					</h1>
				</div>

				<form className="space-y-6">
					<div>
						<label htmlFor="name" className="block text-sm font-medium mb-2">
							{t('nameLabel')}
						</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
						/>
					</div>

					<div>
						<label htmlFor="email" className="block text-sm font-medium mb-2">
							{t('emailLabel')}
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium mb-2">
							{t('passwordLabel')}
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							minLength={8}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
						/>
					</div>

					<div className="flex items-start">
						<input
							id="terms"
							name="terms"
							type="checkbox"
							required
							className="mt-1 mr-2"
						/>
						<label htmlFor="terms" className="text-sm text-muted-foreground">
							{/* {t.rich('termsText', {
								termsLink: (chunks) => ( */}
									<Link href={`/${locale}/legal/terms`} className="text-primary hover:underline">
										{/* {chunks} */}
										Terms
									</Link>
								{/* ), */}
								{/* privacyLink: (chunks) => ( */}
									<Link href={`/${locale}/legal/privacy`} className="text-primary hover:underline">
										{/* {chunks} */}
										Privacy
									</Link>
								{/* ), */}
							{/* })} */}
						</label>
					</div>

					<button
						type="submit"
						className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
					>
						{t('createButton')}
					</button>

					<p className="text-center text-sm text-muted-foreground">
						{t('loginText')}{' '}
						<Link href={`/${locale}/login`} className="text-primary hover:underline font-medium">
							{t('loginLink')}
						</Link>
					</p>
				</form>
			</div>
		</main>
	);
}