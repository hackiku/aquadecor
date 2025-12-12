// src/app/[locale]/(website)/layout.tsx

import { getTranslations } from 'next-intl/server';
import { Footer } from "~/components/navigation/Footer";
import { FooterAlternative } from '~/components/navigation/FooterAlternative';

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'home' });

	return {
		title: {
			template: '%s | Aquadecor', // Will add this to all child pages
			default: t('meta.title'),
		},
		description: t('meta.description'),
		openGraph: {
			title: t('meta.title'),
			description: t('meta.description'),
			siteName: 'Aquadecor',
			locale: locale,
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title: t('meta.title'),
			description: t('meta.description'),
		},
	};
}

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}
			<Footer />
		</>
	);
}