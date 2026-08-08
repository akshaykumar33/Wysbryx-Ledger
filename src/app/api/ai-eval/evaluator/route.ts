import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { aiEvaluators } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
import { randomUUID } from "crypto";

// POST /api/ai-eval/evaluator — Register or login evaluator
export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }

    const normalizedName = name.trim().toLowerCase();
    const now = new Date().toISOString();

    let evaluator = await db.query.aiEvaluators.findFirst({
      where: eq(aiEvaluators.normalizedName, normalizedName),
    });

    if (!evaluator) {
      const id = randomUUID();
      await db.insert(aiEvaluators).values({
        id,
        name: name.trim(),
        normalizedName,
        allocated: false,
        allocatedAt: null,
        isAdminBypass: false,
        createdAt: now,
        updatedAt: now,
      });
      evaluator = { id, name: name.trim(), normalizedName, allocated: false, allocatedAt: null, isAdminBypass: false, createdAt: now, updatedAt: now };
    }

    return NextResponse.json({
      evaluator: {
        id: evaluator.id,
        name: evaluator.name,
        allocated: evaluator.allocated,
        isAdmin: evaluator.isAdminBypass,
      },
    });
  } catch (error: any) {
    console.error("[AI-EVAL] POST evaluator error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/ai-eval/evaluator?name=xxx
export async function GET(request: NextRequest) {
  try {
    const name = request.nextUrl.searchParams.get("name");
    if (!name) {
      return NextResponse.json({ error: "name param required" }, { status: 400 });
    }

    const evaluator = await db.query.aiEvaluators.findFirst({
      where: eq(aiEvaluators.normalizedName, name.trim().toLowerCase()),
    });

    if (!evaluator) {
      return NextResponse.json({ evaluator: null });
    }

    return NextResponse.json({
      evaluator: {
        id: evaluator.id,
        name: evaluator.name,
        allocated: evaluator.allocated,
        isAdmin: evaluator.isAdminBypass,
      },
    });
  } catch (error: any) {
    console.error("[AI-EVAL] GET evaluator error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
