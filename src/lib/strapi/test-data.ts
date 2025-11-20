// src/lib/strapi/test-data.ts

import { BlogPost, BlogPostPreview } from "./types";

export const TEST_POSTS: BlogPostPreview[] = [
	{
		id: 1,
		slug: "aquadecor-aquarium-background-story-an-interview-with-mr-florian-kovac-the-founder-of-the-aquadecor-brand",
		title: "Aquadecor Aquarium Background Story – An Interview with Mr. Florian Kovac",
		description: "Discover how Aquadecor started in a 9m² shed and grew into a worldwide brand trusted by 50,000+ customers. An exclusive interview with founder Florian Kovac.",
		cover: {
			url: "/media/blog/florian-interview.jpg",
			alternativeText: "Florian Kovac in workshop",
			width: 1200,
			height: 800,
		},
		reading_time: 5,
		createdAt: "2024-07-01T00:00:00.000Z",
		publishedAt: "2024-07-01T00:00:00.000Z",
	},
	{
		id: 2,
		slug: "how-to-install-3d-aquarium-background",
		title: "How to Install a 3D Aquarium Background",
		description: "Step-by-step guide to installing your custom Aquadecor background. From silicone selection to final positioning.",
		cover: {
			url: "/media/blog/installation-guide.jpg",
			alternativeText: "Installing aquarium background",
			width: 1200,
			height: 800,
		},
		reading_time: 8,
		createdAt: "2024-08-15T00:00:00.000Z",
		publishedAt: "2024-08-15T00:00:00.000Z",
	},
	{
		id: 3,
		slug: "why-limestone-ruins-aquariums",
		title: "Why Limestone Rocks Ruin Your Aquarium (And How We Solve It)",
		description: "Learn why natural rocks containing limestone constantly change your pH and how Aquadecor backgrounds are tested to be completely inert.",
		cover: {
			url: "/media/blog/acid-test.jpg",
			alternativeText: "Acid test on aquarium backgrounds",
			width: 1200,
			height: 800,
		},
		reading_time: 6,
		createdAt: "2024-09-20T00:00:00.000Z",
		publishedAt: "2024-09-20T00:00:00.000Z",
	},
];

export const FLORIAN_INTERVIEW: BlogPost = {
	id: 1,
	slug: "aquadecor-aquarium-background-story-an-interview-with-mr-florian-kovac-the-founder-of-the-aquadecor-brand",
	title: "Aquadecor Aquarium Background Story – An Interview with Mr. Florian Kovac",
	description: "In today's world, some of the most successful stories started in a garage. Discover how Aquadecor started in a 9m² shed and grew into a worldwide brand.",
	body: [
		{
			type: "paragraph",
			children: [
				{
					type: "text",
					text: "In today's world, some of the most successful stories started in a garage. Does the Aquadecor Aquarium Background brand share the same starting point? Where did it all start?",
				},
			],
		},
		{
			type: "paragraph",
			children: [
				{
					type: "text",
					text: 'Our story didn\'t start in a garage; it started in my room. Back in the day, my room was my peaceful haven. I made the first aquarium background in that room, but soon I switched to working in the shed. This shed was approximately nine square meters big, and that is where it all started.',
				},
			],
		},
		{
			type: "heading",
			level: 2,
			children: [
				{
					type: "text",
					text: "When Did You Know This Would Succeed?",
				},
			],
		},
		{
			type: "paragraph",
			children: [
				{
					type: "text",
					text: "Believe it or not, I kind of knew right from the start. I know it sounds like a broken record entrepreneur's story, but it was like that. I would spend hours looking at the result of my work. Bit by bit the whole picture started to show up.",
				},
			],
		},
		{
			type: "heading",
			level: 2,
			children: [
				{
					type: "text",
					text: "What Part Do You Enjoy Most?",
				},
			],
		},
		{
			type: "paragraph",
			children: [
				{
					type: "text",
					text: "My favorite thing is dealing with the final details of an aquarium background. Some would call it the cherry on the top. Let's not leave out the painting, as an exciting part. It affects the final look substantially, and you can change the looks of the 3D background easily.",
				},
			],
		},
		{
			type: "heading",
			level: 2,
			children: [
				{
					type: "text",
					text: "The Custom Order Process",
				},
			],
		},
		{
			type: "paragraph",
			children: [
				{
					type: "text",
					text: "Customers contact us, then we discuss their preferences and choose the model. We implemented a price calculator on our website to make things easier. Customers can quickly fill out the form and receive an approximate price, shipping included.",
				},
			],
		},
		{
			type: "paragraph",
			children: [
				{
					type: "text",
					text: "After payment confirmation, we make a unique sketch based on this specific customer's needs and wishes. Every customer receives this sketch, and after they confirm that all technical details are correct – dimensions, model, color, etc. – we start building this aquarium background by hand.",
				},
			],
		},
		{
			type: "heading",
			level: 2,
			children: [
				{
					type: "text",
					text: "Your Favorite Model?",
				},
			],
		},
		{
			type: "paragraph",
			children: [
				{
					type: "text",
					text: "My absolute favorite of all times is the A10 model. Before uploading the model photo to the website, I told my wife, who works as the sales manager in our company, that this is going to be the best-selling model. She was cheering for the A1 model. For now, I am still leading in this race, but I must make a better model, just in case.",
				},
			],
		},
		{
			type: "paragraph",
			children: [
				{
					type: "text",
					text: "Most of our customers are returning customers. They are loyal to the brand, and in return, we always offer some discount, 10%-20%.",
				},
			],
		},
		{
			type: "heading",
			level: 2,
			children: [
				{
					type: "text",
					text: "Going Global",
				},
			],
		},
		{
			type: "paragraph",
			children: [
				{
					type: "text",
					text: "Five years ago, we only offered our backgrounds to the local Serbian market. Today, in 2024, almost 95% of our products are sold to the international market. We've signed contracts with distributors worldwide, and customers can now order directly from them.",
				},
			],
		},
		{
			type: "heading",
			level: 2,
			children: [
				{
					type: "text",
					text: "Future Plans",
				},
			],
		},
		{
			type: "paragraph",
			children: [
				{
					type: "text",
					text: "We're planning to start making saltwater aquarium backgrounds and expand into this marine niche. Also, we plan to open showrooms in EU countries so customers can see, touch, and order our products in person.",
				},
			],
		},
	],
	cover: {
		url: "/media/blog/florian-interview.jpg",
		alternativeText: "Florian Kovac working on aquarium background in workshop",
		caption: "Founder Florian Kovac in the Aquadecor workshop",
		width: 1200,
		height: 800,
	},
	reading_time: 5,
	createdAt: "2024-07-01T10:00:00.000Z",
	publishedAt: "2024-07-01T10:00:00.000Z",
	updatedAt: "2025-01-15T14:30:00.000Z",
	seo: {
		metaTitle: "Aquadecor Story: Interview with Founder Florian Kovac | Aquadecor Blog",
		metaDescription: "Discover how Aquadecor grew from a 9m² shed in Serbia to serving 50,000+ customers worldwide. Exclusive interview with founder Florian Kovac.",
		keywords: "aquadecor, founder story, florian kovac, aquarium backgrounds, entrepreneur, handmade aquarium decorations",
		indexing: true,
		shared_image: {
			file: {
				url: "/media/blog/florian-interview.jpg",
				alternativeText: "Florian Kovac working in workshop",
				width: 1200,
				height: 630,
			},
		},
	},
};