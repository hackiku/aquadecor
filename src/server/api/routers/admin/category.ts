// src/server/api/routers/admin/category.ts

import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import {
	categories,
	categoryTranslations,
	products,
	media,
} from "~/server/db/schema";
import { eq, and, sql, desc, asc } from "drizzle-orm";

export const adminCategoryRouter = createTRPCRouter({
	// Get all categories with product counts
	getAll: adminProcedure
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

			// Get categories with product counts and hero images
			const results = await ctx.db
				.select({
					id: categories.id,
					slug: categories.slug,
					productLine: categories.productLine,
					modelCode: categories.modelCode,
					sortOrder: categories.sortOrder,
					isActive: categories.isActive,
					contentBlocks: categories.contentBlocks,
					createdAt: categories.createdAt,
					updatedAt: categories.updatedAt,
					name: categoryTranslations.name,
					description: categoryTranslations.description,
					heroImageUrl: media.storageUrl,
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
				)
				.leftJoin(
					media,
					and(
						eq(media.categoryId, categories.id),
						eq(media.usageType, "category"),
						eq(media.sortOrder, 0)
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
	getById: adminProcedure
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
					modelCode: categories.modelCode,
					sortOrder: categories.sortOrder,
					isActive: categories.isActive,
					contentBlocks: categories.contentBlocks,
					createdAt: categories.createdAt,
					updatedAt: categories.updatedAt,
					name: categoryTranslations.name,
					description: categoryTranslations.description,
					metaTitle: categoryTranslations.metaTitle,
					metaDescription: categoryTranslations.metaDescription,
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

			// Get category media
			const categoryMedia = await ctx.db
				.select()
				.from(media)
				.where(
					and(
						eq(media.categoryId, input.id),
						eq(media.usageType, "category")
					)
				)
				.orderBy(media.sortOrder);

			// Get product count
			const productCount = await ctx.db
				.select({ count: sql<number>`COUNT(*)::int` })
				.from(products)
				.where(eq(products.categoryId, input.id));

			return {
				...category,
				translations,
				media: categoryMedia,
				productCount: productCount[0]?.count ?? 0,
			};
		}),

	// Get category stats for dashboard
	getStats: adminProcedure
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
	create: adminProcedure
		.input(z.object({
			slug: z.string(),
			productLine: z.enum(["3d-backgrounds", "aquarium-decorations"]),
			modelCode: z.string().optional(),
			sortOrder: z.number().default(0),
			isActive: z.boolean().default(true),
			contentBlocks: z.any().optional(),
			// Translation (English required)
			name: z.string(),
			description: z.string().optional(),
			metaTitle: z.string().optional(),
			metaDescription: z.string().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			// Insert category
			const [category] = await ctx.db
				.insert(categories)
				.values({
					slug: input.slug,
					productLine: input.productLine,
					modelCode: input.modelCode,
					sortOrder: input.sortOrder,
					isActive: input.isActive,
					contentBlocks: input.contentBlocks,
				})
				.returning();

			// Insert English translation
			await ctx.db.insert(categoryTranslations).values({
				categoryId: category!.id,
				locale: "en",
				name: input.name,
				description: input.description,
				metaTitle: input.metaTitle,
				metaDescription: input.metaDescription,
			});

			return category;
		}),

	// Update category
	update: adminProcedure
		.input(z.object({
			id: z.string(),
			slug: z.string().optional(),
			productLine: z.enum(["3d-backgrounds", "aquarium-decorations"]).optional(),
			modelCode: z.string().optional().nullable(),
			sortOrder: z.number().optional(),
			isActive: z.boolean().optional(),
			contentBlocks: z.any().optional().nullable(),
			// Translation update
			name: z.string().optional(),
			description: z.string().optional().nullable(),
			metaTitle: z.string().optional().nullable(),
			metaDescription: z.string().optional().nullable(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { id, name, description, metaTitle, metaDescription, ...categoryData } = input;

			// Update category
			const [updated] = await ctx.db
				.update(categories)
				.set(categoryData)
				.where(eq(categories.id, id))
				.returning();

			// Update English translation if provided
			if (name || description !== undefined || metaTitle !== undefined || metaDescription !== undefined) {
				const translationData: any = {};
				if (name) translationData.name = name;
				if (description !== undefined) translationData.description = description;
				if (metaTitle !== undefined) translationData.metaTitle = metaTitle;
				if (metaDescription !== undefined) translationData.metaDescription = metaDescription;

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
	delete: adminProcedure
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

			// Media will cascade delete via FK
			await ctx.db.delete(categories).where(eq(categories.id, input.id));
			return { success: true };
		}),

	// Add translation
	addTranslation: adminProcedure
		.input(z.object({
			categoryId: z.string(),
			locale: z.string(),
			name: z.string(),
			description: z.string().optional(),
			metaTitle: z.string().optional(),
			metaDescription: z.string().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			const [translation] = await ctx.db
				.insert(categoryTranslations)
				.values({
					categoryId: input.categoryId,
					locale: input.locale,
					name: input.name,
					description: input.description,
					metaTitle: input.metaTitle,
					metaDescription: input.metaDescription,
				})
				.returning();

			return translation;
		}),

	// Update translation
	updateTranslation: adminProcedure
		.input(z.object({
			translationId: z.string(),
			name: z.string().optional(),
			description: z.string().optional().nullable(),
			metaTitle: z.string().optional().nullable(),
			metaDescription: z.string().optional().nullable(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { translationId, ...updateData } = input;

			const [updated] = await ctx.db
				.update(categoryTranslations)
				.set(updateData)
				.where(eq(categoryTranslations.id, translationId))
				.returning();

			return updated;
		}),

	// Delete translation
	deleteTranslation: adminProcedure
		.input(z.object({
			translationId: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			// Check if this is the last translation
			const translation = await ctx.db.query.categoryTranslations.findFirst({
				where: eq(categoryTranslations.id, input.translationId),
			});

			if (!translation) {
				throw new Error("Translation not found");
			}

			const remainingTranslations = await ctx.db
				.select({ count: sql<number>`COUNT(*)::int` })
				.from(categoryTranslations)
				.where(eq(categoryTranslations.categoryId, translation.categoryId));

			if (remainingTranslations[0]?.count && remainingTranslations[0].count <= 1) {
				throw new Error("Cannot delete the last translation");
			}

			await ctx.db
				.delete(categoryTranslations)
				.where(eq(categoryTranslations.id, input.translationId));

			return { success: true };
		}),
});