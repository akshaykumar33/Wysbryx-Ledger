import { db } from "@/db";
import { aiEvaluations, engineers } from "@/db/schema";
import { ALL_CANDIDATES } from "@/lib/ai-eval/allocation";
import { calculateEvaluationGrade, departmentIdFor, teamIdFor } from "@/lib/constants";
import { MOCK_ENGINEERS } from "@/lib/mockData";

// World 2 shows the real team from World 1. The original demo engineers
// (eng_1 … eng_10) stay in the database but are never shown.
export const DEMO_ENGINEER_IDS = new Set(MOCK_ENGINEERS.map((e) => e.id));

const yearsSince = (iso: string) => {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.round((ms / (365.25 * 24 * 3600 * 1000)) * 10) / 10);
};

/**
 * Every World 1 person as a World 2 engineer, scored with their latest
 * World 1 AI evaluation, followed by anyone added directly in World 2.
 */
export async function getRealEngineers({ includeArchived = false } = {}) {
  const [aiEvals, dbEngineers] = await Promise.all([db.select().from(aiEvaluations), db.select().from(engineers)]);

  const latestByEmail = new Map<string, (typeof aiEvals)[number]>();
  for (const ev of aiEvals) {
    const key = ev.employeeEmail.toLowerCase();
    const prev = latestByEmail.get(key);
    if (!prev || ev.updatedAt > prev.updatedAt) latestByEmail.set(key, ev);
  }

  const real = ALL_CANDIDATES.map((c, i) => {
    const ev = latestByEmail.get(c.email);
    const score = ev && ev.percentage ? Number(ev.percentage) : undefined;
    return {
      id: c.id,
      photoUrl: c.avatarSeed,
      fullName: c.name,
      employeeId: `WYS-${String(i + 1).padStart(3, "0")}`,
      email: c.email,
      departmentId: departmentIdFor(c.department),
      departmentName: c.department,
      teamId: teamIdFor(c.department),
      teamName: `${c.department} Team`,
      designation: c.role,
      designationId: c.role,
      managerName: "",
      joiningDate: c.startDate,
      experienceYears: yearsSince(c.startDate),
      primarySkills: [] as string[],
      secondarySkills: [] as string[],
      status: "Active",
      avgScore: score,
      grade: score !== undefined ? calculateEvaluationGrade(score).grade : undefined,
      source: "world1",
      deletedAt: null,
    };
  });

  const realEmails = new Set(real.map((r) => r.email));
  const added = dbEngineers.filter(
    (e) => !DEMO_ENGINEER_IDS.has(e.id) && !realEmails.has(e.email.toLowerCase()) && (includeArchived || !e.deletedAt)
  );

  return [...real, ...added];
}
