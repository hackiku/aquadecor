/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import("next").NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "soywdlfgfbvxzzxsakzh.supabase.co", // supabase
			},
			{
				protocol: "https",
				hostname: "cdn.aquadecorbackgrounds.com", // old CDN
			},
			{
				protocol: "https",
				hostname: "img.youtube.com",
			},
			{
				protocol: "https",
				hostname: "i.ytimg.com",
			},
			{
				protocol: "https",
				hostname: "generous-respect-339e42b270.media.strapiapp.com", // Strapi blog
			},
		],
	},
};

export default withNextIntl(config);