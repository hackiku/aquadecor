// src/app/robots.ts
import type { MetadataRoute } from 'next';

/**
 * Dynamic robots.txt generation
 * 
 * - PRODUCTION: Allow crawling with sensible blocks
 * - PREVIEW/DEV: Block all crawlers (no indexing on vercel.app)
 */
export default function robots(): MetadataRoute.Robots {
	const isProduction = process.env.VERCEL_ENV === 'production';
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aquadecorbackgrounds.com';

	// ========================================
	// PREVIEW/DEV - Block Everything
	// ========================================
	if (!isProduction) {
		return {
			rules: {
				userAgent: '*',
				disallow: '/',
			},
		};
	}

	// ========================================
	// PRODUCTION - Selective Allow/Block
	// ========================================
	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: [
					'/api/',          // API routes
					'/admin/',        // Admin panel
					'/_next/',        // Next.js internals
					'/account/',      // User dashboards
					'/checkout/',     // Cart/checkout flow
					'/login',         // Auth pages
					'/register',
					'/forgot-password',
					'/reset-password',
				],
			},
			// Optional: Special rules for specific bots
			{
				userAgent:
					[
						// OpenAI
						'GPTBot', 'ChatGPT-User', 'ChatGPT-User/2.0', 'OAI-SearchBot',
						// Anthropic
						'anthropic-ai', 'ClaudeBot', 'Claude-User', 'Claude-Web', 'Claude-SearchBot',
						// Google
						'Google-Extended', 'Google-CloudVertexBot', 'Gemini-Deep-Research', 'GoogleAgent-Mariner',
						'Google-NotebookLM', 'Google-Firebase', 'GoogleOther', 'GoogleOther-Image', 'GoogleOther-Video',
						// Microsoft
						'Bingbot',
						// Meta
						'Meta-ExternalAgent', 'meta-externalagent', 'Meta-ExternalFetcher', 'meta-externalfetcher',
						'Meta-WebIndexer', 'meta-webindexer', 'FacebookBot',
						// Amazon
						'Amazonbot', 'amazon-kendra',
						// Apple
						'Applebot', 'Applebot-Extended',
						// Perplexity
						'PerplexityBot', 'Perplexity-User',
						// ByteDance
						'Bytespider', 'TikTokSpider',
						// DuckDuckGo
						'DuckAssistBot', 'Duckbot',
						// Cohere
						'cohere-ai', 'cohere-training-data-crawler',
						// Mistral
						'MistralAI-User', 'MistralAI-User/1.0',
						// Allen Institute
						'AI2Bot', 'AI2Bot-DeepResearchEval', 'AI2Bot-Dolma',
						// Common Crawl
						'CCBot',
						// Others
						'AddSearchBot', 'aiHitBot', 'AmazonBuyForMe', 'Andibot', 'Anomura', 'atlassian-bot', 'Awario',
						'bedrockbot', 'bigsur.ai', 'Bravebot', 'Brightbot 1.0', 'BuddyBot', 'Channel3Bot', 'ChatGLM-Spider',
						'ChatGPT Agent', 'Cloudflare-AutoRAG', 'CloudVertexBot', 'Cotoyogi', 'Crawl4AI', 'Crawlspace',
						'Datenbank Crawler', 'DeepSeekBot', 'Devin', 'Diffbot', 'Echobot Bot', 'EchoboxBot', 'Factset_spyderbot',
						'FirecrawlAgent', 'FriendlyCrawler', 'iAskBot', 'iaskspider', 'iaskspider/2.0', 'IbouBot', 'ICC-Crawler',
						'ImagesiftBot', 'imageSpider', 'img2dataset', 'ISSCyberRiskCrawler', 'Kangaroo Bot', 'KlaviyoAIBot',
						'KunatoCrawler', 'laion-huggingface-processor', 'LAIONDownloader', 'LCC', 'LinerBot', 'Linguee Bot',
						'LinkupBot', 'LinkedInBot', 'Manus-User', 'MyCentralAIScraperBot', 'netEstate Imprint Crawler', 'NovaAct',
						'omgili', 'omgilibot', 'OpenAI', 'Operator', 'PanguBot', 'Panscient', 'panscient.com', 'PetalBot',
						'PhindBot', 'Poggio-Citations', 'Poseidon Research Crawler', 'QualifiedBot', 'QuillBot', 'quillbot.com',
						'SBIntuitionsBot', 'Scrapy', 'SemrushBot-OCOB', 'SemrushBot-SWA', 'ShapBot', 'Sidetrade indexer bot',
						'Spider', 'TavilyBot', 'TerraCotta', 'Thinkbot', 'Timpibot', 'TwinAgent', 'VelenPublicWebCrawler',
						'WARDBot', 'Webzio-Extended', 'webzio-extended', 'wpbot', 'WRTNBot', 'YaK', 'YandexAdditional',
						'YandexAdditionalBot', 'YouBot', 'ZanistaBot'
					],
				allow: '/',
				crawlDelay: 1, // Be nice to their servers
			}
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}