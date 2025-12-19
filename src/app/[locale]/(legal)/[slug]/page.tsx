import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "~/i18n/routing";
import { generateSEOMetadata } from "~/i18n/seo/hreflang";
import { PolicyRenderer } from "../_components/PolicyRenderer";

type Props = {
	params: Promise<{ locale: string; slug: string }>;
};

const LEGAL_KEYS = ['terms', 'privacy', 'shipping', 'refund'] as const;

export async function generateMetadata({ params }: Props) {
	const { locale, slug } = await params;
	if (!(LEGAL_KEYS as any).includes(slug)) return {};

	const t = await getTranslations({ locale, namespace: `legal.${slug}` });

	return generateSEOMetadata({
		currentLocale: locale,
		path: `/${slug}`,
		title: t('meta.title'),
		description: t('meta.description'),
		type: 'website',
	});
}

export function generateStaticParams() {
	return LEGAL_KEYS.map((slug) => ({ slug }));
}

export default async function LegalPage({ params }: Props) {
	const { locale, slug } = await params;
	setRequestLocale(locale);

	if (!(LEGAL_KEYS as any).includes(slug)) notFound();

	return <PolicyRenderer namespace={slug} />;
}