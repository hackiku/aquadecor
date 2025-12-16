// src/app/api/dev/create-test-user/route.ts

import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { NextResponse } from "next/server";

// DELETE THIS FILE IN PRODUCTION
export async function GET() {
	if (process.env.NODE_ENV !== "development") {
		return NextResponse.json({ error: "Not available" }, { status: 403 });
	}

	const testUser = await db.insert(users).values({
		id: crypto.randomUUID(),
		email: "test@aquadecor.com",
		name: "Test User",
		role: "customer",
		emailVerified: new Date(),
	}).returning();

	return NextResponse.json({
		message: "Test user created",
		user: testUser[0]
	});
}