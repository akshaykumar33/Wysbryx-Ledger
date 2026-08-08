import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

// Load .env and .env.local variables
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    }
  }
}

loadEnv();

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
  console.error("❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env or .env.local");
  process.exit(1);
}

console.log("☁️  Connecting to Turso Cloud Database:", tursoUrl);
const tursoClient = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

console.log("🛠️  Connecting to Local SQLite Database (file:local.db)...");
const localClient = createClient({
  url: "file:local.db",
});

const TABLES_TO_SYNC = [
  "ai_evaluators",
  "ai_employee_allocations",
  "ai_evaluations",
  "ai_evaluation_scores",
  "engineers",
  "evaluations",
  "evaluation_scores",
  "audit_logs",
];

async function syncTursoToLocal() {
  console.log("\n🚀 Starting Turso Cloud -> Local SQLite Data Replication...\n");

  // 1. Ensure local tables exist
  await localClient.executeMultiple(`
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
  `);

  let totalReplicatedRecords = 0;

  for (const tableName of TABLES_TO_SYNC) {
    try {
      // Query Turso Cloud DB
      const result = await tursoClient.execute(`SELECT * FROM ${tableName}`);
      const rows = result.rows;

      if (rows.length === 0) {
        console.log(`  ▫️ [${tableName}]: 0 records found on Turso.`);
        continue;
      }

      const columns = result.columns;
      const colNames = columns.join(", ");
      const placeholders = columns.map(() => "?").join(", ");

      // Upsert into local SQLite
      for (const row of rows) {
        const values = columns.map((col) => row[col]);
        await localClient.execute({
          sql: `INSERT OR REPLACE INTO ${tableName} (${colNames}) VALUES (${placeholders})`,
          args: values as any[],
        });
      }

      totalReplicatedRecords += rows.length;
      console.log(`  ✅ [${tableName}]: Replicated ${rows.length} records into local SQLite.`);
    } catch (err: any) {
      console.warn(`  ⚠️ [${tableName}]: ${err.message}`);
    }
  }

  console.log(`\n🎉 Data Replication Complete! Total Records Replicated: ${totalReplicatedRecords}`);
  console.log(`📁 Local Database Ready: file:local.db\n`);
}

syncTursoToLocal().catch((err) => {
  console.error("❌ Replication Error:", err);
  process.exit(1);
});
