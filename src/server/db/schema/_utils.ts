// src/server/db/schema/_utils.ts
import { pgTableCreator } from "drizzle-orm/pg-core";

/**
 * Table creator for Drizzle ORM
 * 
 * Using unprefixed table names for simplicity.
 * If you need multi-project schema support later, uncomment the prefixed version below.
 * 
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => name);

// Prefixed version (commented out):
// export const createTable = pgTableCreator((name) => `aquadecorbackgrounds_${name}`);