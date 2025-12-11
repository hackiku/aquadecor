// src/app/[locale]/(website)/faq/FAQClient.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "~/trpc/react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { BubbleIcon } from "~/components/ui/BubbleIcon";
import { Search, MessageCircleQuestion, HelpCircle, Loader2 } from "lucide-react";

interface FAQClientProps {
	region: "US" | "ROW";
	dbLocale: string;
}

export function FAQClient({ region, dbLocale }: FAQClientProps) {
	const t = useTranslations("faq");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	// 1. Fetch Data from our new Public Router
	const { data: faqData, isLoading } = api.faq.getForPublic.useQuery({
		locale: dbLocale,
		region: region,
	});

	// 2. Filter Logic (Client-side is fast enough for FAQs)
	// The API returns categories with nested items. We need to filter inside those items.

	// Create a new array structure based on filters
	const filteredCategories = faqData?.map((cat) => {
		// If a category is selected, ignore others
		if (selectedCategory && cat.name !== selectedCategory && cat.slug !== selectedCategory) {
			return null;
		}

		// Filter items inside the category based on search
		const matchingItems = cat.items.filter((item) => {
			const q = searchQuery.toLowerCase();
			return (
				(item.question?.toLowerCase().includes(q) || false) ||
				(item.answer?.toLowerCase().includes(q) || false)
			);
		});

		// If no items match in this category, return null (hide category)
		if (matchingItems.length === 0) return null;

		return {
			...cat,
			items: matchingItems,
		};
	}).filter(Boolean); // Remove nulls

	const hasResults = filteredCategories && filteredCategories.length > 0;

	return (
		<main className="relative min-h-screen bg-linear-to-b from-background to-muted/20 overflow-hidden">
			{/* Background Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<BubbleIcon
					icon={MessageCircleQuestion}
					className="absolute left-18 top-32 z-0 opacity-20 md:opacity-30"
				/>
			</div>

			{/* Hero Section */}
			<section className="relative z-10 mx-auto px-4 pt-16 md:pt-24 pb-16">
				<div className="mx-auto max-w-5xl text-center space-y-6">
					<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
						<span className="text-sm text-primary font-display font-medium">
							{t("badge")}
						</span>
					</div>
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
						{t("headline")}
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-3xl mx-auto leading-relaxed">
						{t("subHeadline")}
					</p>
				</div>
			</section>

			<div className="container relative z-10 mx-auto px-4 py-2">
				<div className="mx-auto max-w-4xl">
					{/* Search & Filter */}
					<div className="max-w-2xl mx-auto mb-12 space-y-6">
						{/* Search Bar */}
						<div className="relative group">
							<div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							<div className="relative">
								<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder={t("searchPlaceholder")}
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="h-14 rounded-full pl-12 text-base shadow-sm border-2 border-border/50 bg-background/80 backdrop-blur-sm focus:border-primary/50 transition-all"
								/>
							</div>
						</div>

						{/* Category Filter Pills */}
						{!isLoading && faqData && (
							<div className="flex flex-wrap justify-center gap-2">
								<Button
									variant={selectedCategory === null ? "default" : "outline"}
									size="sm"
									onClick={() => setSelectedCategory(null)}
									className="rounded-full"
								>
									{t("allCategories")}
								</Button>
								{faqData.map((cat) => (
									<Button
										key={cat.id}
										variant={selectedCategory === cat.name ? "default" : "outline"}
										size="sm"
										onClick={() => setSelectedCategory(cat.name)}
										className="rounded-full"
									>
										{cat.name}
									</Button>
								))}
							</div>
						)}
					</div>

					{/* Loading State */}
					{isLoading && (
						<div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
							<Loader2 className="w-8 h-8 animate-spin mb-4" />
							<p>{t("loading")}</p>
						</div>
					)}

					{/* No Results */}
					{!isLoading && !hasResults && (
						<div className="rounded-2xl border-2 border-dashed bg-card/50 p-12 text-center">
							<HelpCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
							<h3 className="mb-2 text-lg font-semibold">{t("noResultsTitle")}</h3>
							<p className="text-muted-foreground">
								{t("noResultsText")}
							</p>
							<Button
								variant="link"
								onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
								className="mt-2 text-primary"
							>
								Clear filters
							</Button>
						</div>
					)}

					{/* Results List */}
					<div className="space-y-10 pb-20">
						{filteredCategories?.map((cat: any) => (
							<div key={cat.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
								{/* Category Header */}
								<div className="flex items-center gap-3">
									<Badge variant="outline" className="px-3 py-1 text-sm font-normal bg-background/50 backdrop-blur-sm">
										{cat.name}
									</Badge>
									<div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
								</div>

								{/* Accordion */}
								<Accordion type="single" collapsible className="space-y-3">
									{cat.items.map((faq: any) => (
										<AccordionItem
											key={faq.id}
											value={faq.id}
											className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm px-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20 hover:bg-card"
										>
											<AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline hover:text-primary transition-colors">
												{faq.question}
											</AccordionTrigger>
											<AccordionContent className="pb-6 pt-0 text-muted-foreground leading-relaxed">
												<div className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground">
													{faq.answer}
												</div>
											</AccordionContent>
										</AccordionItem>
									))}
								</Accordion>
							</div>
						))}
					</div>

					{/* Help Section */}
					<div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/50 p-8 md:p-12 text-center mb-16">
						<h3 className="mb-3 text-2xl font-display font-light">{t("contactTitle")}</h3>
						<p className="mb-8 text-muted-foreground max-w-xl mx-auto">
							{t("contactText")}
						</p>
						<Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
							{t("contactButton")}
						</Button>
					</div>
				</div>
			</div>
		</main>
	);
}