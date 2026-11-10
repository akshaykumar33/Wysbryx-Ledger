import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { aiEvaluations, aiEvaluationScores, aiEvaluators } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ALL_CANDIDATES, isAdminUser } from "@/lib/ai-eval/allocation";

export const dynamic = "force-dynamic";

// GET /api/ai-eval/report?evaluatorName=xxx
// Whole-team snapshot for the leadership report. Admin evaluators only.
export async function GET(request: NextRequest) {
  try {
    const evaluatorName = request.nextUrl.searchParams.get("evaluatorName") || "";
    if (!isAdminUser(evaluatorName)) {
      return NextResponse.json({ error: "Only admins can open the team report" }, { status: 403 });
    }

    const [evals, scores, evaluators] = await Promise.all([
      db.select().from(aiEvaluations),
      db.select().from(aiEvaluationScores),
      db.select().from(aiEvaluators),
    ]);

    const evaluatorById = new Map(evaluators.map((e) => [e.id, e.name]));
    const scoresByEval = new Map<string, typeof scores>();
    for (const s of scores) {
      const list = scoresByEval.get(s.evaluationId) || [];
      list.push(s);
      scoresByEval.set(s.evaluationId, list);
    }

    const people = ALL_CANDIDATES.map((cand) => {
      // Latest evaluation wins if someone was reviewed more than once.
      const ev = evals
        .filter((e) => e.employeeEmail.toLowerCase() === cand.email)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
      return {
        id: cand.id,
        name: cand.name,
        email: cand.email,
        evaluation: ev
          ? {
              percentage: ev.percentage || 0,
              grade: ev.grade || "Not Evaluated",
              status: ev.status,
              summary: ev.summary || ev.feedback || "",
              evaluator: evaluatorById.get(ev.evaluatorId) || "",
              updatedAt: ev.updatedAt,
              scores: (scoresByEval.get(ev.id) || []).map((s) => ({
                key: s.parameterKey,
                rating: s.rating,
                evidence: s.evidence || "",
                strength: s.strength || "",
                next: s.improvementSuggestion || "",
              })),
            }
          : null,
      };
    });

    return NextResponse.json({ generatedAt: new Date().toISOString(), people });
  } catch (error: any) {
    console.error("[AI-EVAL] GET report error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
