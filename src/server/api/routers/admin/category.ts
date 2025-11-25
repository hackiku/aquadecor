// src/server/api/routers/admin/category.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	categories,
	categoryTranslations,
	products,
} from "~/server/db/schema";
import { eq, and, sql, desc, asc } from "drizzle-orm";

export const adminCategoryRouter = createTRPCRouter({
	// Get all categories with product counts
	getAll: publicProcedure
		.input(z.object({
			locale: z.string().default("en"),
			productLine: z.string().optional(),
			isActive: z.boolean().optional(),
		}).optional())
		.query(async ({ ctx, input }) => {
			const conditions = [];

			if (input?.productLine) {
				conditions.push(eq(categories.productLine, input.productLine));
			}

			if (input?.isActive !== undefined) {
				conditions.push(eq(categories.isActive, input.isActive));
			}

			// Get categories with product counts
			const results = await ctx.db
				.select({
					id: categories.id,
					slug: categories.slug,
					productLine: categories.productLine,
					sortOrder: categories.sortOrder,
					isActive: categories.isActive,
					createdAt: categories.createdAt,
					updatedAt: categories.updatedAt,
					name: categoryTranslations.name,
					description: categoryTranslations.description,
					// Count products in this category
					productCount: sql<number>`(
						SELECT COUNT(*)::int 
						FROM ${products} 
						WHERE ${products.categoryId} = ${categories.id}
					)`,
				})
				.from(categories)
				.leftJoin(
					categoryTranslations,
					and(
						eq(categoryTranslations.categoryId, categories.id),
						eq(categoryTranslations.locale, input?.locale ?? "en")
					)
				);

			// Apply filters if any
			if (conditions.length > 0) {
				return results.filter((r) => {
					if (input?.productLine && r.productLine !== input.productLine) return false;
					if (input?.isActive !== undefined && r.isActive !== input.isActive) return false;
					return true;
				});
			}

			return results;
		}),

	// Get single category with all details
	getById: publicProcedure
		.input(z.object({
			id: z.string(),
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			const [category] = await ctx.db
				.select({
					id: categories.id,
					slug: categories.slug,
					productLine: categories.productLine,
					sortOrder: categories.sortOrder,
					isActive: categories.isActive,
					createdAt: categories.createdAt,
					updatedAt: categories.updatedAt,
					name: categoryTranslations.name,
					description: categoryTranslations.description,
				})
				.from(categories)
				.leftJoin(
					categoryTranslations,
					and(
						eq(categoryTranslations.categoryId, categories.id),
						eq(categoryTranslations.locale, input.locale)
					)
				)
				.where(eq(categories.id, input.id))
				.limit(1);

			if (!category) {
				return null;
			}

			// Get all translations
			const translations = await ctx.db
				.select()
				.from(categoryTranslations)
				.where(eq(categoryTranslations.categoryId, input.id));

			// Get product count
			const productCount = await ctx.db
				.select({ count: sql<number>`COUNT(*)::int` })
				.from(products)
				.where(eq(products.categoryId, input.id));

			return {
				...category,
				translations,
				productCount: productCount[0]?.count ?? 0,
			};
		}),

	// Get category stats for dashboard
	getStats: publicProcedure
		.query(async ({ ctx }) => {
			const allCategories = await ctx.db
				.select({
					id: categories.id,
					productLine: categories.productLine,
					isActive: categories.isActive,
				})
				.from(categories);

			const total = allCategories.length;
			const active = allCategories.filter(c => c.isActive).length;
			const inactive = total - active;

			const byProductLine = {
				"3d-backgrounds": allCategories.filter(c => c.productLine === "3d-backgrounds").length,
				"aquarium-decorations": allCategories.filter(c => c.productLine === "aquarium-decorations").length,
			};

			return {
				total,
				active,
				inactive,
				byProductLine,
			};
		}),

	// Create new category
	create: publicProcedure
		.input(z.object({
			slug: z.string(),
			productLine: z.enum(["3d-backgrounds", "aquarium-decorations"]),
			sortOrder: z.number().default(0),
			isActive: z.boolean().default(true),
			// Translation (English required)
			name: z.string(),
			description: z.string().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			// Insert category
			const [category] = await ctx.db
				.insert(categories)
				.values({
					slug: input.slug,
					productLine: input.productLine,
					sortOrder: input.sortOrder,
					isActive: input.isActive,
				})
				.returning();

			// Insert English translation
			await ctx.db.insert(categoryTranslations).values({
				categoryId: category!.id,
				locale: "en",
				name: input.name,
				description: input.description,
			});

			return category;
		}),

	// Update category
	update: publicProcedure
		.input(z.object({
			id: z.string(),
			slug: z.string().optional(),
			productLine: z.enum(["3d-backgrounds", "aquarium-decorations"]).optional(),
			sortOrder: z.number().optional(),
			isActive: z.boolean().optional(),
			// Translation update
			name: z.string().optional(),
			description: z.string().optional().nullable(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { id, name, description, ...categoryData } = input;

			// Update category
			const [updated] = await ctx.db
				.update(categories)
				.set(categoryData)
				.where(eq(categories.id, id))
				.returning();

			// Update English translation if provided
			if (name || description !== undefined) {
				const translationData: any = {};
				if (name) translationData.name = name;
				if (description !== undefined) translationData.description = description;

				await ctx.db
					.update(categoryTranslations)
					.set(translationData)
					.where(
						and(
							eq(categoryTranslations.categoryId, id),
							eq(categoryTranslations.locale, "en")
						)
					);
			}

			return updated;
		}),

	// Delete category
	delete: publicProcedure
		.input(z.object({
			id: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			// Check if category has products
			const productCount = await ctx.db
				.select({ count: sql<number>`COUNT(*)::int` })
				.from(products)
				.where(eq(products.categoryId, input.id));

			if (productCount[0]?.count && productCount[0].count > 0) {
				throw new Error("Cannot delete category with products");
			}

			await ctx.db.delete(categories).where(eq(categories.id, input.id));
			return { success: true };
		}),
});