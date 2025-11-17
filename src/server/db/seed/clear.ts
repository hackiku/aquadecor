#!/usr/bin/env bun
// src/server/db/seed/clear.ts

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL not set");

const client = postgres(connectionString);
const db = drizzle(client);

async function clear() {
	console.log("🗑️  Clearing tables...");

	try {
		// Clear all shop tables - CASCADE will handle foreign key constraints
		// Note: PostgreSQL TRUNCATE doesn't support IF EXISTS, so we catch errors instead
		await db.execute(sql`
			TRUNCATE TABLE 
				product_image,
				product_translation,
				product,
				category_translation,
				category,
				review_media,
				review,
				social_proof_source
			CASCADE;
		`);

		console.log("✅ Cleared all shop tables!");
	} catch (error) {
		console.error("❌ Clear failed:", error);
		console.log("\n💡 Tip: If tables don't exist yet, run 'bun db:push' first to create them.");
		process.exit(1);
	} finally {
		await client.end();
		process.exit(0);
	}
}

clear();