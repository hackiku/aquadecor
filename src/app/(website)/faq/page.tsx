// src/app/(website)/faq/page.tsx
"use client";

import { useState } from "react";
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
import { Search, MessageCircleQuestion, HelpCircle } from "lucide-react";
// import { api, HydrateClient } from "~/trpc/server";
import { api } from "~/trpc/react";

export default function FAQPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	// Fetch FAQs
	const { data: faqData, isLoading } = api.faq.getAll.useQuery({
		locale: "en",
		region: "ROW", // or detect user region
	});

	// Filter FAQs based on search and category
	const filteredFaqs = faqData?.all.filter((faq) => {
		const matchesSearch =
			searchQuery === "" ||
			faq.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			faq.answer?.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesCategory =
			!selectedCategory || faq.category === selectedCategory;

		return matchesSearch && matchesCategory;
	});

	// Group filtered FAQs by category
	const groupedFaqs = filteredFaqs?.reduce(
		(acc, faq) => {
			const category = faq.category || "General";
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(faq);
			return acc;
		},
		{} as Record<string, typeof filteredFaqs>,
	);

	if (isLoading) {
		return (
			<div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-16">
				<div className="text-muted-foreground">Loading FAQs...</div>
			</div>
		);
	}

	return (
		// <HydrateClient>
		<main className="relative min-h-screen bg-linear-to-b from-background to-muted/20">
			{/* Floating Bubble Icon */}
			<BubbleIcon
				icon={MessageCircleQuestion}
				className="absolute left-18 top-32 z-0 opacity-20 md:opacity-30"
			/>

			{/* Hero Section */}
			<div className="relative z-10 mx-auto px-4 py-16 md:pt-20">
				<div className="mx-auto max-w-3xl text-center">
					<h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
						Frequently Asked Questions
					</h1>
					<p className="text-lg text-muted-foreground md:text-xl">
						Everything you need to know about our custom aquarium backgrounds
					</p>
				</div>
			</div>

			<div className="container relative z-10 mx-auto px-4 py-8">
				<div className="mx-auto max-w-4xl">
					{/* Search & Filter */}
					<div className="max-w-2xl mx-auto mb-8 space-y-4">
						{/* Search Bar - Full Rounded */}
						<div className="relative">
							<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search for answers..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="h-12 rounded-full pl-12 text-base shadow-md"
							/>
						</div>

						{/* Category Filter */}
						{faqData?.categories && faqData.categories.length > 0 && (
							<div className="flex flex-wrap gap-2">
								<Button
									variant={selectedCategory === null ? "default" : "outline"}
									size="sm"
									onClick={() => setSelectedCategory(null)}
								>
									All Categories
								</Button>
								{faqData.categories.map((category) => (
									<Button
										key={category}
										variant={selectedCategory === category ? "default" : "outline"}
										size="sm"
										onClick={() => setSelectedCategory(category)}
									>
										{category}
									</Button>
								))}
							</div>
						)}
					</div>

					{/* FAQ Content */}
					{!filteredFaqs || filteredFaqs.length === 0 ? (
						<div className="rounded-lg border bg-card p-12 text-center">
							<HelpCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
							<h3 className="mb-2 text-lg font-semibold">No results found</h3>
							<p className="text-muted-foreground">
								Try adjusting your search or filter to find what you're looking for
							</p>
						</div>
					) : (
						<div className="space-y-8">
							{Object.entries(groupedFaqs || {}).map(([category, faqs]) => (
								<div key={category} className="space-y-4">
									{/* Category Header */}
									<div className="flex items-center gap-3">
										<Badge variant="secondary" className="px-3 py-1">
											{category}
										</Badge>
										<div className="h-px flex-1 bg-border" />
									</div>

									{/* Accordion for FAQs in this category */}
									<Accordion type="single" collapsible className="space-y-2">
										{faqs.map((faq) => (
											<AccordionItem
												key={faq.id}
												value={faq.id}
												className="rounded-lg border bg-card px-6 shadow-sm transition-shadow hover:shadow-md"
											>
												<AccordionTrigger className="py-6 text-left text-base font-medium hover:no-underline">
													{faq.question || "Untitled Question"}
												</AccordionTrigger>
												<AccordionContent className="pb-6 pt-2 text-muted-foreground">
													<div className="prose prose-sm max-w-none">
														{faq.answer ? (
															<p className="whitespace-pre-wrap leading-relaxed">
																{faq.answer}
															</p>
														) : (
															<p className="italic">No answer available</p>
														)}
													</div>
												</AccordionContent>
											</AccordionItem>
										))}
									</Accordion>
								</div>
							))}
						</div>
					)}

					{/* Help Section */}
					<div className="mt-16 rounded-lg border bg-muted/30 p-8 text-center">
						<h3 className="mb-2 text-xl font-semibold">Still have questions?</h3>
						<p className="mb-6 text-muted-foreground">
							Can't find the answer you're looking for? Please get in touch with our
							friendly team.
						</p>
						<Button size="lg">Contact Support</Button>
					</div>
				</div>
			</div>
		</main>
		// </HydrateClient>
	);
}