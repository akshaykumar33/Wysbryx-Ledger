import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const dbUrl = process.env.TURSO_DATABASE_URL || "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url: dbUrl,
  ...(authToken ? { authToken } : {}),
});

export const db = drizzle(client, { schema });
export type Database = typeof db;
