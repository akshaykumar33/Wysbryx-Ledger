import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const isDev = process.env.NODE_ENV === "development" || process.env.USE_TURSO !== "true";

// Local development uses file:local.db to protect Turso Cloud DB during testing
const dbUrl = isDev
  ? "file:local.db"
  : (process.env.TURSO_DATABASE_URL || "file:local.db");

const authToken = isDev ? undefined : process.env.TURSO_AUTH_TOKEN;

if (isDev) {
  console.log("[DB Engine] 🛠️ Local Development Mode: Using local SQLite database (file:local.db). Turso Cloud DB bypassed.");
} else {
  console.log("[DB Engine] ☁️ Production Mode: Connected to Turso Cloud Database.");
}

const client = createClient({
  url: dbUrl,
  ...(authToken ? { authToken } : {}),
});

export const db = drizzle(client, { schema });
export type Database = typeof db;
