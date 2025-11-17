#!/usr/bin / env bun
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
		// Use CASCADE and IF EXISTS to avoid errors
		await db.execute(sql`
			TRUNCATE TABLE IF EXISTS aquadecorbackgrounds_product_image CASCADE;
			TRUNCATE TABLE IF EXISTS aquadecorbackgrounds_product_translation CASCADE;
			TRUNCATE TABLE IF EXISTS aquadecorbackgrounds_product CASCADE;
			TRUNCATE TABLE IF EXISTS aquadecorbackgrounds_category_translation CASCADE;
			TRUNCATE TABLE IF EXISTS aquadecorbackgrounds_category CASCADE;
		`);

		console.log("✅ Cleared!");
	} catch (error) {
		console.error("❌ Clear failed:", error);
		process.exit(1);
	} finally {
		await client.end();
		process.exit(0);
	}
}

clear();