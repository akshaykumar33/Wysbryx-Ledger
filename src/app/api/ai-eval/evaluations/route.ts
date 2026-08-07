import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { aiEvaluations, aiEvaluationScores, aiEvaluators } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

// GET /api/ai-eval/evaluations?evaluatorName=xxx
// Returns all evaluations for a given evaluator, with their per-topic scores
export async function GET(request: NextRequest) {
  try {
    const evaluatorName = request.nextUrl.searchParams.get("evaluatorName");
    if (!evaluatorName) {
      return NextResponse.json({ error: "evaluatorName query param required" }, { status: 400 });
    }

    const normalizedName = evaluatorName.trim().toLowerCase();

    // Find evaluator
    const evaluator = await db.query.aiEvaluators.findFirst({
      where: eq(aiEvaluators.normalizedName, normalizedName),
    });

    if (!evaluator) {
      return NextResponse.json({ evaluations: {} });
    }

    // Get all evaluations by this evaluator
    const evals = await db
      .select()
      .from(aiEvaluations)
      .where(eq(aiEvaluations.evaluatorId, evaluator.id));

    // Get all scores for these evaluations
    const scoresByEvalId: Record<string, any[]> = {};
    for (const ev of evals) {
      const scores = await db
        .select()
        .from(aiEvaluationScores)
        .where(eq(aiEvaluationScores.evaluationId, ev.id));
      scoresByEvalId[ev.id] = scores;
    }

    // Transform into the shape the Zustand store expects: { [employeeEmail]: EvalRecord }
    const evaluationsMap: Record<string, any> = {};
    for (const ev of evals) {
      const scores = scoresByEvalId[ev.id] || [];
      const scoresRecord: Record<string, any> = {};

      for (const score of scores) {
        scoresRecord[score.parameterKey] = {
          rating: score.rating,
          evidence: score.evidence || "",
          observedStrength: score.strength || "",
          recommendation: score.improvementSuggestion || "",
          updatedAt: ev.updatedAt,
        };
      }

      // Key by a stable employee identifier
      const empKey = ev.employeeEmail;
      evaluationsMap[empKey] = {
        status: ev.status as "Draft" | "Completed" | "In Review",
        decisionResult: ev.grade || "Lean Hire",
        overallScore: ev.overallScore || 0,
        percentage: ev.percentage || 0,
        grade: ev.grade || "Not Evaluated",
        executiveSynthesis: ev.summary || "",
        scores: scoresRecord,
        feedback: ev.feedback || "",
        serverEvalId: ev.id,
      };
    }

    return NextResponse.json({ evaluations: evaluationsMap });
  } catch (error: any) {
    console.error("[AI-EVAL] GET evaluations error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// POST /api/ai-eval/evaluations
// Save or update an evaluation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { evaluatorName, employeeId, employeeName, employeeEmail, evaluation } = body;

    if (!evaluatorName || !employeeId || !evaluation) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedName = evaluatorName.trim().toLowerCase();
    const now = new Date().toISOString();

    // Upsert evaluator
    let evaluator = await db.query.aiEvaluators.findFirst({
      where: eq(aiEvaluators.normalizedName, normalizedName),
    });

    if (!evaluator) {
      const evalId = randomUUID();
      await db.insert(aiEvaluators).values({
        id: evalId,
        name: evaluatorName.trim(),
        normalizedName,
        allocated: true,
        allocatedAt: now,
        isAdminBypass: false,
        createdAt: now,
        updatedAt: now,
      });
      evaluator = { id: evalId, name: evaluatorName.trim(), normalizedName, allocated: true, allocatedAt: now, isAdminBypass: false, createdAt: now, updatedAt: now };
    }

    // Check if evaluation already exists for this evaluator + employee
    const existing = await db.query.aiEvaluations.findFirst({
      where: and(
        eq(aiEvaluations.evaluatorId, evaluator.id),
        eq(aiEvaluations.employeeEmail, employeeEmail || employeeId)
      ),
    });

    const evalRecord = {
      evaluatorId: evaluator.id,
      employeeEmail: employeeEmail || employeeId,
      employeeName: employeeName || employeeId,
      overallScore: evaluation.overallScore || 0,
      percentage: evaluation.percentage || 0,
      grade: evaluation.grade || "Not Evaluated",
      status: evaluation.status || "Draft",
      feedback: evaluation.feedback || "",
      summary: evaluation.executiveSynthesis || "",
      updatedAt: now,
    };

    let evalId: string;

    if (existing) {
      // Update existing
      evalId = existing.id;
      await db.update(aiEvaluations).set(evalRecord).where(eq(aiEvaluations.id, existing.id));

      // Delete old scores and re-insert
      await db.delete(aiEvaluationScores).where(eq(aiEvaluationScores.evaluationId, existing.id));
    } else {
      // Insert new
      evalId = randomUUID();
      await db.insert(aiEvaluations).values({
        id: evalId,
        ...evalRecord,
        createdAt: now,
      });
    }

    // Insert per-topic scores
    const scores = evaluation.scores || {};
    const scoreInserts = Object.entries(scores).map(([paramKey, scoreData]: [string, any]) => ({
      id: randomUUID(),
      evaluationId: evalId,
      questionSetId: null,
      parameterName: paramKey,
      parameterKey: paramKey,
      rating: scoreData.rating || 0,
      weight: 1.0,
      score: (scoreData.rating || 0) / 10,
      evidence: scoreData.evidence || "",
      strength: scoreData.observedStrength || "",
      improvementSuggestion: scoreData.recommendation || "",
      notes: null,
    }));

    if (scoreInserts.length > 0) {
      await db.insert(aiEvaluationScores).values(scoreInserts);
    }

    return NextResponse.json({
      success: true,
      evalId,
      message: existing ? "Evaluation updated" : "Evaluation created",
    });
  } catch (error: any) {
    console.error("[AI-EVAL] POST evaluation error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
