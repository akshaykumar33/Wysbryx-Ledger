import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";
import { TEAM_NOTES_PROFILES } from "../src/lib/ai-eval/teamNotesData";
import { ALL_CANDIDATES } from "../src/lib/ai-eval/allocation";
import { randomUUID } from "crypto";

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

async function run() {
  const tursoUrl = process.env.TURSO_DATABASE_URL ? process.env.TURSO_DATABASE_URL.trim().replace(/\r/g, "") : "";
  const tursoToken = process.env.TURSO_AUTH_TOKEN ? process.env.TURSO_AUTH_TOKEN.trim().replace(/\r/g, "") : "";

  const clients: { name: string; client: any }[] = [];

  if (tursoUrl && tursoToken) {
    console.log("☁️  Connecting to Turso Cloud DB:", tursoUrl);
    clients.push({
      name: "Turso Cloud",
      client: createClient({ url: tursoUrl, authToken: tursoToken }),
    });
  }

  console.log("🛠️  Connecting to Local SQLite DB (file:local.db)...");
  clients.push({
    name: "Local SQLite",
    client: createClient({ url: "file:local.db" }),
  });

  const now = new Date().toISOString();

  for (const { name, client } of clients) {
    console.log(`\n==================================================`);
    console.log(`🚀 Seeding AI Evaluations into ${name}...`);
    console.log(`==================================================\n`);

    // 1. Ensure tables exist
    await client.executeMultiple(`
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

      CREATE TABLE IF NOT EXISTS ai_notes (
        id TEXT PRIMARY KEY,
        evaluation_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    // 2. Remove any accidental evaluator entries for Vishwesh and ensure Praveen/Krishna is Admin evaluator
    await client.execute("DELETE FROM ai_evaluators WHERE normalized_name IN ('vishwesh', 'viswesh')");
    await client.execute("DELETE FROM ai_employee_allocations WHERE employee_email IN ('viswesh@wysbryx.com', 'bharath@wysbryx.com')");
    
    // Clean any accidental evaluations for Vishwesh, Bharath, Devesh, Rohit Sharma so only the 13 evaluated exist
    const blankEvals = await client.execute("SELECT id FROM ai_evaluations WHERE employee_email IN ('viswesh@wysbryx.com', 'bharath@wysbryx.com', 'devesh@wysbryx.com', 'rohit.s@wysbryx.com')");
    for (const row of blankEvals.rows) {
      await client.execute({ sql: "DELETE FROM ai_evaluation_scores WHERE evaluation_id = ?", args: [row.id] });
      await client.execute({ sql: "DELETE FROM ai_notes WHERE evaluation_id = ?", args: [row.id] });
    }
    await client.execute("DELETE FROM ai_evaluations WHERE employee_email IN ('viswesh@wysbryx.com', 'bharath@wysbryx.com', 'devesh@wysbryx.com', 'rohit.s@wysbryx.com')");
    console.log("  ✓ Verified Vishwesh, Bharath, and un-evaluated employees are clean in DB");

    // Ensure Praveen exists as Admin evaluator
    const evalRes = await client.execute("SELECT id FROM ai_evaluators WHERE normalized_name = 'praveen'");
    let evaluatorId: string;
    if (evalRes.rows.length === 0) {
      evaluatorId = randomUUID();
      await client.execute({
        sql: `INSERT INTO ai_evaluators (id, name, normalized_name, allocated, allocated_at, is_admin_bypass, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [evaluatorId, "Praveen", "praveen", 1, now, 1, now, now],
      });
      console.log(`  ✓ Inserted Admin Evaluator Praveen (${evaluatorId})`);
    } else {
      evaluatorId = String(evalRes.rows[0].id);
      await client.execute({
        sql: `UPDATE ai_evaluators SET is_admin_bypass = 1, allocated = 1, updated_at = ? WHERE id = ?`,
        args: [now, evaluatorId],
      });
      console.log(`  ✓ Active Admin Evaluator Praveen (${evaluatorId})`);
    }

    // 3. For each non-blank profile, insert evaluation, scores, and note
    for (const [key, profile] of Object.entries(TEAM_NOTES_PROFILES)) {
      if (profile.isBlank) {
        console.log(`  ⚪ Skipping ${profile.candidateName} (kept blank)`);
        continue;
      }

      // Find candidate from ALL_CANDIDATES
      const cand = ALL_CANDIDATES.find((c) =>
        profile.aliases.some((a) => c.name.toLowerCase() === a || c.name.toLowerCase().includes(a))
      );

      const employeeName = cand ? cand.name : profile.candidateName;
      const employeeEmail = cand ? cand.email : `${key}@wysbryx.com`;

      // Check if evaluation already exists
      const existing = await client.execute({
        sql: `SELECT id FROM ai_evaluations WHERE employee_email = ?`,
        args: [employeeEmail],
      });

      let evalId: string;
      if (existing.rows.length > 0) {
        evalId = String(existing.rows[0].id);
        await client.execute({
          sql: `UPDATE ai_evaluations SET evaluator_id = ?, employee_name = ?, overall_score = ?, percentage = ?, grade = ?, status = ?, summary = ?, feedback = ?, updated_at = ? WHERE id = ?`,
          args: [
            evaluatorId,
            employeeName,
            profile.overallScore,
            profile.percentage,
            profile.grade,
            profile.status,
            profile.executiveSynthesis,
            profile.executiveSynthesis,
            now,
            evalId,
          ],
        });
        // Delete old scores
        await client.execute({
          sql: `DELETE FROM ai_evaluation_scores WHERE evaluation_id = ?`,
          args: [evalId],
        });
      } else {
        evalId = randomUUID();
        await client.execute({
          sql: `INSERT INTO ai_evaluations (id, evaluator_id, employee_email, employee_name, overall_score, percentage, grade, status, summary, feedback, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            evalId,
            evaluatorId,
            employeeEmail,
            employeeName,
            profile.overallScore,
            profile.percentage,
            profile.grade,
            profile.status,
            profile.executiveSynthesis,
            profile.executiveSynthesis,
            now,
            now,
          ],
        });
      }

      // Insert question scores
      for (const [paramKey, scoreData] of Object.entries(profile.scores)) {
        await client.execute({
          sql: `INSERT INTO ai_evaluation_scores (id, evaluation_id, question_set_id, parameter_name, parameter_key, rating, weight, score, evidence, strength, improvement_suggestion, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            randomUUID(),
            evalId,
            null,
            paramKey,
            paramKey,
            scoreData.rating,
            1.0,
            scoreData.rating / 10,
            scoreData.evidence,
            scoreData.observedStrength || "",
            scoreData.recommendation || "",
            null,
          ],
        });
      }

      // Insert or replace AI notes
      const notesContent = JSON.stringify({
        whatsClicking: profile.notes.whatsClicking,
        relatableTrap: profile.notes.relatableTrap,
        nextMove: profile.notes.nextMove,
      });

      await client.execute({
        sql: `DELETE FROM ai_notes WHERE evaluation_id = ?`,
        args: [evalId],
      });

      await client.execute({
        sql: `INSERT INTO ai_notes (id, evaluation_id, author_name, content, created_at) VALUES (?, ?, ?, ?, ?)`,
        args: [randomUUID(), evalId, "Praveen (Admin)", notesContent, now],
      });

      console.log(`  ✓ Seeded ${employeeName} (${employeeEmail}) — ${profile.grade} (${profile.overallScore}/100)`);
    }
  }

  console.log("\n🎉 ALL AI Evaluations, Scores, and Notes successfully seeded into both Turso Cloud and Local DB!");
}

run().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});

