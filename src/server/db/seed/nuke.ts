#!/usr/bin / env bun
// src/server/db/seed/nuke.ts

import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL not set");

const client = postgres(connectionString);

async function nuke() {
	console.log("💣 NUKING DATABASE...");

	try {
		// Drop all tables with the prefix
		await client`
			DO $$ 
			DECLARE
				r RECORD;
			BEGIN
				FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'aquadecorbackgrounds_%') 
				LOOP
					EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
				END LOOP;
			END $$;
		`;

		console.log("✅ Database nuked!");
	} catch (error) {
		console.error("❌ Nuke failed:", error);
	} finally {
		await client.end();
	}
}

nuke();