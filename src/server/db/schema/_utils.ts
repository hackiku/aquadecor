// src/server/db/schema/_utils.ts
import { pgTableCreator } from "drizzle-orm/pg-core";

/**
 * Multi-project schema prefix
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
	(name) => `aquadecorbackgrounds_${name}`,
);