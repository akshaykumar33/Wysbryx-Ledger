import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { evaluations, evaluationScores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { DEMO_ENGINEER_IDS } from "@/lib/world2/realTeam";

export const dynamic = "force-dynamic";

// GET /api/evaluations
export async function GET(request: NextRequest) {
  try {
    const allEvals = await db.select().from(evaluations);
    const allScores = await db.select().from(evaluationScores);

    const scoresByEvalId: Record<string, any[]> = {};
    allScores.forEach((s) => {
      if (!scoresByEvalId[s.evaluationId]) scoresByEvalId[s.evaluationId] = [];
      scoresByEvalId[s.evaluationId].push(s);
    });

    // Reviews of the old demo engineers are not shown.
    const enriched = allEvals.filter((ev) => !DEMO_ENGINEER_IDS.has(ev.engineerId)).map((ev) => ({
      ...ev,
      parameterScores: scoresByEvalId[ev.id] || [],
    }));

    return NextResponse.json({ evaluations: enriched });
  } catch (error: any) {
    console.error("[API] GET /api/evaluations error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// POST /api/evaluations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, cycleTitle, engineerId, adminId, adminName, adminEmail, quarter, year, overallScore, percentage, grade, gradeLabel, comments, status, parameterScores } = body;

    if (!engineerId) {
      return NextResponse.json({ error: "engineerId is required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const evalId = id || randomUUID();

    const record = {
      id: evalId,
      cycleTitle: cycleTitle || `${quarter || "Q3"} ${year || 2026} Engineering Performance Cycle`,
      engineerId,
      adminId: adminId || "admin_1",
      adminName: adminName || "Praveen",
      adminEmail: adminEmail || "praveen@wysbryx.com",
      evaluationDate: body.evaluationDate || now.split("T")[0],
      quarter: quarter || "Q3",
      year: Number(year) || 2026,
      overallScore: Number(overallScore) || 85.0,
      percentage: Number(percentage) || 85.0,
      grade: grade || "A",
      gradeLabel: gradeLabel || "Outstanding",
      rank: body.rank || 1,
      comments: comments || "",
      status: status || "Completed",
      createdAt: now,
      updatedAt: now,
    };

    const existing = await db.query.evaluations.findFirst({
      where: eq(evaluations.id, evalId),
    });

    if (existing) {
      await db.update(evaluations).set(record).where(eq(evaluations.id, evalId));
      await db.delete(evaluationScores).where(eq(evaluationScores.evaluationId, evalId));
    } else {
      await db.insert(evaluations).values(record);
    }

    if (Array.isArray(parameterScores) && parameterScores.length > 0) {
      const inserts = parameterScores.map((sc: any) => ({
        id: sc.id || randomUUID(),
        evaluationId: evalId,
        categoryId: sc.categoryId || "cat_1",
        parameterId: sc.parameterId || "param_1",
        parameterKey: sc.parameterKey || "code_quality",
        rating: Number(sc.rating) || 5,
        weight: Number(sc.weight) || 1.0,
        evidence: sc.evidence || "",
        strength: sc.strength || sc.observedStrength || "",
        improvementSuggestion: sc.improvementSuggestion || "",
        notes: sc.notes || null,
        weightedScore: Number(sc.weightedScore) || Number(sc.rating) || 5,
      }));
      await db.insert(evaluationScores).values(inserts);
    }

    return NextResponse.json({ success: true, evaluation: record });
  } catch (error: any) {
    console.error("[API] POST /api/evaluations error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
