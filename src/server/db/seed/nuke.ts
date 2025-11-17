#!/usr/bin/env bun
// src/server/db/seed/nuke.ts

import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL not set");

const client = postgres(connectionString);

async function nuke() {
	console.log("💣 NUKING DATABASE...");
	console.log("⚠️  This will drop ALL tables in the public schema!");

	try {
		// Drop all non-system tables in public schema
		await client`
			DO $$ 
			DECLARE
				r RECORD;
			BEGIN
				FOR r IN (
					SELECT tablename 
					FROM pg_tables 
					WHERE schemaname = 'public'
				) 
				LOOP
					EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
				END LOOP;
			END $$;
		`;

		console.log("✅ Database nuked! All tables dropped.");
		console.log("💡 Run 'bun db:push' to recreate schema, then 'bun db:seed' to populate data.");
	} catch (error) {
		console.error("❌ Nuke failed:", error);
		process.exit(1);
	} finally {
		await client.end();
		process.exit(0);
	}
}

nuke();