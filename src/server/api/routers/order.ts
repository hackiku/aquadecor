// src/server/api/routers/order.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const mockOrders = [
	{
		id: "ORD-001",
		email: "john.doe@example.com",
		createdAt: "2025-11-10",
		total: "€285.00",
		status: "Paid" as const,
		discountCode: "SAVE10",
	},
	{
		id: "ORD-002",
		email: "maria@aquafan.de",
		createdAt: "2025-11-08",
		total: "€420.50",
		status: "Pending" as const,
		discountCode: null,
	},
	{
		id: "ORD-003",
		email: "piet.nl@outlook.com",
		createdAt: "2025-11-05",
		total: "€199.99",
		status: "Paid" as const,
		discountCode: "WELCOME20",
	},
];

export const orderRouter = createTRPCRouter({
	getAll: publicProcedure.query(() => {
		return mockOrders;
	}),
});