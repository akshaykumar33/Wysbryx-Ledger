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

// Auto-initialize local tables if they do not exist to eliminate SQLite 'no such table' errors
if (isDev) {
  try {
    client.executeMultiple(`
      CREATE TABLE IF NOT EXISTS ai_evaluators (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        normalized_name TEXT NOT NULL,
        allocated INTEGER DEFAULT 0,
        allocated_at TEXT,
        is_admin_bypass INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ai_employee_allocations (
        id TEXT PRIMARY KEY,
        evaluator_id TEXT NOT NULL,
        employee_email TEXT NOT NULL,
        employee_name TEXT NOT NULL,
        assigned_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ai_evaluations (
        id TEXT PRIMARY KEY,
        evaluator_id TEXT NOT NULL,
        employee_email TEXT NOT NULL,
        employee_name TEXT NOT NULL,
        overall_score REAL DEFAULT 0,
        percentage REAL DEFAULT 0,
        grade TEXT DEFAULT 'Pending',
        status TEXT NOT NULL DEFAULT 'Draft',
        feedback TEXT,
        summary TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ai_evaluation_scores (
        id TEXT PRIMARY KEY,
        evaluation_id TEXT NOT NULL,
        question_set_id TEXT,
        parameter_name TEXT NOT NULL,
        parameter_key TEXT NOT NULL,
        rating INTEGER NOT NULL,
        weight REAL NOT NULL,
        score REAL NOT NULL,
        evidence TEXT,
        strength TEXT,
        improvement_suggestion TEXT,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS engineers (
        id TEXT PRIMARY KEY,
        photo_url TEXT NOT NULL,
        full_name TEXT NOT NULL,
        employee_id TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        department_id TEXT NOT NULL,
        team_id TEXT NOT NULL,
        designation_id TEXT NOT NULL,
        manager_name TEXT NOT NULL,
        joining_date TEXT NOT NULL,
        experience_years REAL NOT NULL,
        primary_skills TEXT NOT NULL,
        secondary_skills TEXT NOT NULL,
        status TEXT NOT NULL,
        avg_score REAL DEFAULT 0,
        grade TEXT DEFAULT 'N/A',
        rank INTEGER,
        deleted_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS evaluations (
        id TEXT PRIMARY KEY,
        cycle_title TEXT NOT NULL,
        engineer_id TEXT NOT NULL,
        admin_id TEXT NOT NULL,
        admin_name TEXT NOT NULL,
        admin_email TEXT NOT NULL,
        evaluation_date TEXT NOT NULL,
        quarter TEXT NOT NULL,
        year INTEGER NOT NULL,
        overall_score REAL NOT NULL,
        percentage REAL NOT NULL,
        grade TEXT NOT NULL,
        grade_label TEXT NOT NULL,
        rank INTEGER,
        comments TEXT NOT NULL,
        status TEXT NOT NULL,
        deleted_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS evaluation_scores (
        id TEXT PRIMARY KEY,
        evaluation_id TEXT NOT NULL,
        category_id TEXT NOT NULL,
        parameter_id TEXT NOT NULL,
        parameter_key TEXT NOT NULL,
        rating INTEGER NOT NULL,
        weight REAL NOT NULL,
        evidence TEXT NOT NULL,
        strength TEXT,
        improvement_suggestion TEXT NOT NULL,
        notes TEXT,
        weighted_score REAL NOT NULL
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        admin_id TEXT NOT NULL,
        admin_name TEXT NOT NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        old_values TEXT,
        new_values TEXT,
        ip_address TEXT NOT NULL,
        timestamp TEXT NOT NULL
      );
    `).catch((err) => {
      console.warn("[DB Engine] Table auto-creation notice:", err.message);
    });
  } catch (e) {
    console.warn("[DB Engine] Non-fatal table init notice:", e);
  }
}

export const db = drizzle(client, { schema });
export type Database = typeof db;
