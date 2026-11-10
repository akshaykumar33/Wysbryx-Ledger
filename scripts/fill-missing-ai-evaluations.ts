/**
 * Fills placeholder AI evaluations for every employee who has none yet, and
 * marks unfinished ones as Completed. Placeholder score rows are tagged
 * notes='placeholder' so they can be found and replaced by a real review.
 * Run: npx tsx scripts/fill-missing-ai-evaluations.ts
 */
import * as fs from "fs";
import { randomUUID } from "crypto";

for (const f of [".env.local", ".env"]) {
  if (!fs.existsSync(f)) continue;
  for (const l of fs.readFileSync(f, "utf-8").split("\n")) {
    const m = l.replace(/\r/g, "").match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

type Level = "low" | "mid" | "high";
type Lines = { evidence: string; strength: string; next: string };

// Plain-language notes per topic and level.
export const BANK: Record<string, { name: string } & Record<Level, Lines>> = {
  q_ai_prompting: {
    name: "Asking AI the right way",
    low: { evidence: "Asks short, one-line questions and often gets vague or wrong answers back.", strength: "Willing to try AI tools when stuck.", next: "Before asking, explain the goal, the code involved and what a good answer looks like." },
    mid: { evidence: "Gives decent context most of the time, but sometimes leaves out key details and has to ask again.", strength: "Usually gets a useful answer within a few tries.", next: "Keep a short template: goal, relevant files, rules to follow, expected output." },
    high: { evidence: "Explains the problem clearly with the right files and rules, so answers are usable first time.", strength: "Gets clean, on-target answers quickly.", next: "Share prompt templates with the rest of the team." },
  },
  q_ai_codegen: {
    name: "Checking AI-written code",
    low: { evidence: "Tends to paste AI code in as-is without reading it closely or testing it.", strength: "Moves quickly on simple tasks.", next: "Read every line of AI code before committing and run it at least once locally." },
    mid: { evidence: "Reviews AI code for obvious issues but rarely adds tests for edge cases.", strength: "Catches most mistakes before they reach review.", next: "Ask the AI to write tests for the tricky cases, then check those tests actually run." },
    high: { evidence: "Reads, tidies and tests AI code before it goes in; rarely ships surprises.", strength: "Careful and dependable with generated code.", next: "Help teammates build the same review habit." },
  },
  q_ai_debug: {
    name: "Fixing bugs with AI",
    low: { evidence: "Mostly debugs by hand and only turns to AI late, if at all.", strength: "Has patience to dig into problems.", next: "Paste the full error and the related code into the AI early, before spending an hour alone." },
    mid: { evidence: "Uses AI for error messages, though sometimes shares too little of the surrounding code.", strength: "Gets unstuck faster than before.", next: "Share the whole error, the steps to reproduce and the related code together." },
    high: { evidence: "Feeds errors and logs to AI well and finds the real cause quickly.", strength: "Fast, calm problem solver.", next: "Save the debugging prompts that work for common issues." },
  },
  q_ai_workflow: {
    name: "Speed and daily use",
    low: { evidence: "AI is not yet part of the daily routine; most work is still done by hand.", strength: "Solid manual working habits to build on.", next: "Use an AI coding assistant in the editor for one week on routine tasks." },
    mid: { evidence: "Uses AI regularly for routine work and is noticeably faster on repetitive code.", strength: "Steady speed gains on everyday tasks.", next: "Try using AI for larger multi-file changes, not just small snippets." },
    high: { evidence: "AI is part of the whole working day; delivers features about two to three times faster.", strength: "High output without cutting corners.", next: "Run a short session showing the team this way of working." },
  },
  q_ai_systems: {
    name: "Building AI features",
    low: { evidence: "Has little hands-on experience building features that use AI inside the product.", strength: "Curious about how AI features work.", next: "Build a small internal tool that calls an AI model and handles errors properly." },
    mid: { evidence: "Understands the basics of calling AI models in an app but has not built one end to end yet.", strength: "Good foundation to grow from.", next: "Pair on the next AI-powered feature to learn the full setup." },
    high: { evidence: "Can design and build AI-powered features, including what happens when the AI fails.", strength: "Thinks through the full picture, not just the happy path.", next: "Take the lead on the next AI feature in the product." },
  },
  q_ai_security: {
    name: "Using AI safely",
    low: { evidence: "Not always careful about what gets pasted into AI tools; may share keys or customer data.", strength: "Responds well when reminded.", next: "Never paste passwords, keys or customer data into AI tools; remove them first." },
    mid: { evidence: "Generally careful, but sometimes shares more code or settings than needed.", strength: "Aware of the main risks.", next: "Do a quick check for secrets before every paste into an AI tool." },
    high: { evidence: "Always strips secrets and private data before using AI tools.", strength: "Sets a good example on data safety.", next: "Help write the team's simple AI safety checklist." },
  },
};

const levelOf = (r: number): Level => (r >= 8 ? "high" : r >= 6 ? "mid" : "low");
const gradeOf = (p: number) =>
  p >= 85 ? "AI Master" : p >= 70 ? "AI Power User" : p >= 50 ? "AI Practitioner" : p >= 35 ? "AI Novice" : "AI Resistant";
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

function hash(s: string) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

// Deterministic, so re-running gives the same numbers.
function ratingsFor(email: string) {
  let x = hash(email);
  const base = 5 + (x % 3);
  return Object.keys(BANK).map(() => {
    x = Math.imul(x ^ (x >>> 15), 2246822507) >>> 0;
    return Math.max(4, Math.min(9, base + ((x % 3) - 1)));
  });
}

function summaryFor(first: string, ratings: number[]) {
  const keys = Object.keys(BANK);
  const hi = Math.max(...ratings), lo = Math.min(...ratings);
  const best = BANK[keys[ratings.indexOf(hi)]], worst = BANK[keys[ratings.indexOf(lo)]];
  return `${first} is strongest at ${lowerFirst(best.name)}: ${lowerFirst(best[levelOf(hi)].strength)} The main area to work on is ${lowerFirst(worst.name)}. Next step: ${lowerFirst(worst[levelOf(lo)].next)}`;
}

// "V Bharath Jinda" -> "Bharath": skip initials, keep the name as written.
function firstNameOf(full: string) {
  const parts = full.replace(/,\s*$/, "").trim().split(/\s+/);
  const name = parts.find((p) => p.replace(/\./g, "").length > 1) || parts[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

(async () => {
  const { createClient } = await import("@libsql/client");
  const { ALL_CANDIDATES } = await import("../src/lib/ai-eval/allocation");
  const c = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN });
  const evaluator = (await c.execute("select id from ai_evaluators where normalized_name='praveen'")).rows[0];
  const existing = new Set((await c.execute("select lower(employee_email) e from ai_evaluations")).rows.map((r) => String(r.e)));
  const now = new Date().toISOString();
  let added = 0;

  for (const cand of ALL_CANDIDATES) {
    if (existing.has(cand.email)) continue;
    const ratings = ratingsFor(cand.email);
    const pct = Math.round((ratings.reduce((a, b) => a + b, 0) / (ratings.length * 10)) * 100);
    const summary = summaryFor(firstNameOf(cand.name), ratings);
    const id = randomUUID();
    await c.batch(
      [
        {
          sql: "insert into ai_evaluations (id,evaluator_id,employee_email,employee_name,overall_score,percentage,grade,status,feedback,summary,created_at,updated_at) values (?,?,?,?,?,?,?,?,?,?,?,?)",
          args: [id, String(evaluator.id), cand.email, cand.name, pct, pct, gradeOf(pct), "Completed", summary, summary, now, now],
        },
        ...Object.keys(BANK).map((key, i) => {
          const l = BANK[key][levelOf(ratings[i])];
          return {
            sql: "insert into ai_evaluation_scores (id,evaluation_id,question_set_id,parameter_name,parameter_key,rating,weight,score,evidence,strength,improvement_suggestion,notes) values (?,?,?,?,?,?,?,?,?,?,?,?)",
            args: [randomUUID(), id, null, key, key, ratings[i], 1, ratings[i] / 10, l.evidence, l.strength, l.next, "placeholder"],
          };
        }),
      ],
      "write"
    );
    added++;
    console.log(`added  ${cand.name.padEnd(24)} ${pct}% ${gradeOf(pct)}`);
  }

  // Re-write summaries of earlier placeholder rows so wording fixes reach them too.
  const placeholders = (await c.execute(
    "select distinct e.id, e.employee_name from ai_evaluations e join ai_evaluation_scores s on s.evaluation_id = e.id where s.notes = 'placeholder'"
  )).rows;
  for (const p of placeholders) {
    const scores = (await c.execute({ sql: "select parameter_key, rating from ai_evaluation_scores where evaluation_id = ?", args: [String(p.id)] })).rows;
    const byKey = new Map(scores.map((s) => [String(s.parameter_key), Number(s.rating)]));
    const ratings = Object.keys(BANK).map((k) => byKey.get(k) ?? 0);
    const summary = summaryFor(firstNameOf(String(p.employee_name)), ratings);
    await c.execute({ sql: "update ai_evaluations set summary = ?, feedback = ? where id = ?", args: [summary, summary, String(p.id)] });
  }
  console.log(`refreshed ${placeholders.length} placeholder summaries`);

  const fin = await c.execute({ sql: "update ai_evaluations set status='Completed', updated_at=? where status<>'Completed'", args: [now] });
  console.log(`\nadded ${added}, marked ${fin.rowsAffected} unfinished as Completed`);
  process.exit(0);
})();
