import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

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

const ALLOWED = ["akshay", "anam", "ayush", "krishna", "praveen"];

async function cleanup() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  console.log("Allowed Evaluators:", ALLOWED);

  const clients = [];

  if (tursoUrl && tursoToken) {
    console.log("☁️  Connecting to Turso Cloud DB:", tursoUrl);
    clients.push({ name: "Turso Cloud", client: createClient({ url: tursoUrl, authToken: tursoToken }) });
  }

  console.log("🛠️  Connecting to Local SQLite DB...");
  clients.push({ name: "Local SQLite", client: createClient({ url: "file:local.db" }) });

  for (const { name, client } of clients) {
    console.log(`\n--- Cleaning DB: ${name} ---`);
    try {
      const res = await client.execute("SELECT * FROM ai_evaluators");
      const invalidEvaluators = res.rows.filter((row: any) => {
        const norm = String(row.normalized_name || row.name || "").toLowerCase();
        return !ALLOWED.some((a) => norm.includes(a));
      });

      console.log(`Found ${invalidEvaluators.length} invalid evaluators to remove:`, invalidEvaluators.map((r: any) => r.name));

      for (const inv of invalidEvaluators) {
        const id = inv.id;
        await client.execute({ sql: "DELETE FROM ai_employee_allocations WHERE evaluator_id = ?", args: [id] });
        await client.execute({ sql: "DELETE FROM ai_evaluations WHERE evaluator_id = ?", args: [id] });
        await client.execute({ sql: "DELETE FROM ai_evaluators WHERE id = ?", args: [id] });
        console.log(`Deleted invalid evaluator "${inv.name}" (ID: ${id})`);
      }
    } catch (err: any) {
      console.warn(`Warning on ${name}:`, err.message);
    }
  }

  console.log("\n✅ Cleaned up invalid evaluators from database!");
}

cleanup().catch((err) => {
  console.error("Cleanup error:", err);
  process.exit(1);
});
