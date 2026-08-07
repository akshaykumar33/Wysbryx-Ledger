import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { aiEvaluations, aiEvaluationScores, aiEvaluators } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/ai-eval/evaluations/[employeeId]?evaluatorName=xxx
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  try {
    const { employeeId } = await params;
    const evaluatorName = request.nextUrl.searchParams.get("evaluatorName");

    if (!evaluatorName) {
      return NextResponse.json({ error: "evaluatorName required" }, { status: 400 });
    }

    const normalizedName = evaluatorName.trim().toLowerCase();
    const evaluator = await db.query.aiEvaluators.findFirst({
      where: eq(aiEvaluators.normalizedName, normalizedName),
    });

    if (!evaluator) {
      return NextResponse.json({ evaluation: null });
    }

    const evaluation = await db.query.aiEvaluations.findFirst({
      where: and(
        eq(aiEvaluations.evaluatorId, evaluator.id),
        eq(aiEvaluations.employeeEmail, employeeId)
      ),
    });

    if (!evaluation) {
      return NextResponse.json({ evaluation: null });
    }

    // Get scores
    const scores = await db
      .select()
      .from(aiEvaluationScores)
      .where(eq(aiEvaluationScores.evaluationId, evaluation.id));

    const scoresRecord: Record<string, any> = {};
    for (const s of scores) {
      scoresRecord[s.parameterKey] = {
        rating: s.rating,
        evidence: s.evidence || "",
        observedStrength: s.strength || "",
        recommendation: s.improvementSuggestion || "",
        updatedAt: evaluation.updatedAt,
      };
    }

    return NextResponse.json({
      evaluation: {
        status: evaluation.status,
        overallScore: evaluation.overallScore,
        percentage: evaluation.percentage,
        grade: evaluation.grade,
        executiveSynthesis: evaluation.summary,
        scores: scoresRecord,
        feedback: evaluation.feedback,
      },
    });
  } catch (error: any) {
    console.error("[AI-EVAL] GET single evaluation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
