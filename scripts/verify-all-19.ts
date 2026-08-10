import * as fs from "fs";
import * as path from "path";

function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      for (const rawLine of content.split("\n")) {
        const line = rawLine.replace(/\r/g, "").trim();
        if (line && !line.startsWith("#")) {
          const eqIdx = line.indexOf("=");
          if (eqIdx > 0) {
            const key = line.slice(0, eqIdx).trim();
            const val = line.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
            process.env[key] = val;
          }
        }
      }
    }
  }
}
loadEnv();

async function verifyAll19Tables() {
  const { createClient } = await import("@libsql/client");

  const tursoUrl = process.env.TURSO_DATABASE_URL ? process.env.TURSO_DATABASE_URL.trim().replace(/\r/g, "") : "";
  const tursoToken = process.env.TURSO_AUTH_TOKEN ? process.env.TURSO_AUTH_TOKEN.trim().replace(/\r/g, "") : "";

  console.log("==========================================================");
  console.log("🔍 DIRECT AUDIT OF ALL 19 TABLES ON TURSO CLOUD DATABASE");
  console.log("==========================================================\n");
  console.log("Turso Cloud DB URL:", tursoUrl);

  const client = createClient({
    url: tursoUrl,
    authToken: tursoToken,
  });

  const ALL_19_TABLES = [
    "admins",
    "ai_employee_allocations",
    "ai_evaluation_scores",
    "ai_evaluations",
    "ai_evaluators",
    "ai_notes",
    "ai_question_sets",
    "attachments",
    "audit_logs",
    "departments",
    "designations",
    "engineers",
    "evaluation_categories",
    "evaluation_parameters",
    "evaluation_scores",
    "evaluations",
    "notifications",
    "settings",
    "teams",
  ];

  let totalTablesPopulated = 0;

  for (const table of ALL_19_TABLES) {
    try {
      const res = await client.execute(`SELECT COUNT(*) as cnt FROM ${table}`);
      const count = res.rows[0].cnt;
      console.log(`  ✓ Table [${table}]: ${count} active records on Turso!`);
      if (Number(count) > 0) {
        totalTablesPopulated++;
      }
    } catch (err: any) {
      console.log(`  ❌ Table [${table}]: Error - ${err.message}`);
    }
  }

  console.log("\n==========================================================");
  console.log(`🎉 VERIFICATION COMPLETE: ${totalTablesPopulated} / 19 TABLES HAVE ACTIVE DATA ON TURSO CLOUD DB!`);
  console.log("==========================================================\n");
}

verifyAll19Tables().catch(console.error);
