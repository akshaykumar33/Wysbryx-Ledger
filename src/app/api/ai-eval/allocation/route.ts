import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { aiEvaluators, aiEmployeeAllocations } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import { randomUUID } from "crypto";
import { ALL_CANDIDATES, allocateCandidatesForEvaluator, isAdminUser } from "@/lib/ai-eval/allocation";

export const dynamic = "force-dynamic";

// GET /api/ai-eval/allocation?evaluatorName=xxx
export async function GET(request: NextRequest) {
  try {
    const evaluatorName = request.nextUrl.searchParams.get("evaluatorName");
    if (!evaluatorName || evaluatorName.trim().length < 2) {
      return NextResponse.json({ error: "evaluatorName query param required" }, { status: 400 });
    }

    const normalizedName = evaluatorName.trim().toLowerCase();

    // 1. Find or create evaluator record
    let evaluator = await db.query.aiEvaluators.findFirst({
      where: eq(aiEvaluators.normalizedName, normalizedName),
    });

    const now = new Date().toISOString();

    if (!evaluator) {
      const evalId = randomUUID();
      const isAdmin = isAdminUser(evaluatorName);
      await db.insert(aiEvaluators).values({
        id: evalId,
        name: evaluatorName.trim(),
        normalizedName,
        allocated: isAdmin,
        allocatedAt: isAdmin ? now : null,
        isAdminBypass: isAdmin,
        createdAt: now,
        updatedAt: now,
      });
      evaluator = {
        id: evalId,
        name: evaluatorName.trim(),
        normalizedName,
        allocated: isAdmin,
        allocatedAt: isAdmin ? now : null,
        isAdminBypass: isAdmin,
        createdAt: now,
        updatedAt: now,
      };
    }

    // 2. Admin users get all candidates
    if (evaluator.isAdminBypass || isAdminUser(evaluatorName)) {
      return NextResponse.json({
        evaluatorName: evaluator.name,
        isAdmin: true,
        allocated: true,
        allocatedAt: evaluator.allocatedAt || now,
        assignedCandidates: ALL_CANDIDATES,
      });
    }

    // 3. Check existing allocations in DB for this evaluator
    const existingRows = await db
      .select()
      .from(aiEmployeeAllocations)
      .where(eq(aiEmployeeAllocations.evaluatorId, evaluator.id));

    if (existingRows.length > 0) {
      // Map stored emails back to candidate objects
      const assignedEmails = new Set(existingRows.map((r) => r.employeeEmail.toLowerCase()));
      const candidates = ALL_CANDIDATES.filter((c) => assignedEmails.has(c.email.toLowerCase()));

      return NextResponse.json({
        evaluatorName: evaluator.name,
        isAdmin: false,
        allocated: true,
        allocatedAt: evaluator.allocatedAt || now,
        assignedCandidates: candidates.length > 0 ? candidates : allocateCandidatesForEvaluator(evaluatorName, 10),
      });
    }

    // Return unallocated state if performRoll has not been triggered yet
    return NextResponse.json({
      evaluatorName: evaluator.name,
      isAdmin: false,
      allocated: evaluator.allocated,
      allocatedAt: evaluator.allocatedAt,
      assignedCandidates: [],
    });
  } catch (error: any) {
    console.error("[AI-EVAL] GET allocation error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// POST /api/ai-eval/allocation — Perform Roll & Persist Disjoint Partition
export async function POST(request: NextRequest) {
  try {
    const { evaluatorName } = await request.json();
    if (!evaluatorName || evaluatorName.trim().length < 2) {
      return NextResponse.json({ error: "evaluatorName required" }, { status: 400 });
    }

    const normalizedName = evaluatorName.trim().toLowerCase();
    const now = new Date().toISOString();

    // 1. Find or create evaluator record
    let evaluator = await db.query.aiEvaluators.findFirst({
      where: eq(aiEvaluators.normalizedName, normalizedName),
    });

    if (!evaluator) {
      const evalId = randomUUID();
      const isAdmin = isAdminUser(evaluatorName);
      await db.insert(aiEvaluators).values({
        id: evalId,
        name: evaluatorName.trim(),
        normalizedName,
        allocated: false,
        allocatedAt: null,
        isAdminBypass: isAdmin,
        createdAt: now,
        updatedAt: now,
      });
      evaluator = {
        id: evalId,
        name: evaluatorName.trim(),
        normalizedName,
        allocated: false,
        allocatedAt: null,
        isAdminBypass: isAdmin,
        createdAt: now,
        updatedAt: now,
      };
    }

    // 2. If Admin, return ALL_CANDIDATES
    if (evaluator.isAdminBypass || isAdminUser(evaluatorName)) {
      await db
        .update(aiEvaluators)
        .set({ allocated: true, allocatedAt: now, updatedAt: now })
        .where(eq(aiEvaluators.id, evaluator.id));

      return NextResponse.json({
        evaluatorName: evaluator.name,
        isAdmin: true,
        allocated: true,
        allocatedAt: now,
        assignedCandidates: ALL_CANDIDATES,
      });
    }

    // 3. If existing allocations in DB, return those
    const existingRows = await db
      .select()
      .from(aiEmployeeAllocations)
      .where(eq(aiEmployeeAllocations.evaluatorId, evaluator.id));

    if (existingRows.length > 0) {
      const assignedEmails = new Set(existingRows.map((r) => r.employeeEmail.toLowerCase()));
      const candidates = ALL_CANDIDATES.filter((c) => assignedEmails.has(c.email.toLowerCase()));

      return NextResponse.json({
        evaluatorName: evaluator.name,
        isAdmin: false,
        allocated: true,
        allocatedAt: evaluator.allocatedAt || now,
        assignedCandidates: candidates,
      });
    }

    // 4. Fetch all emails allocated to OTHER regular evaluators to prevent overlap
    const otherAllocations = await db
      .select({ employeeEmail: aiEmployeeAllocations.employeeEmail })
      .from(aiEmployeeAllocations)
      .where(ne(aiEmployeeAllocations.evaluatorId, evaluator.id));

    const allocatedEmailsSet = new Set(otherAllocations.map((r) => r.employeeEmail.toLowerCase()));

    // 5. Compute disjoint partition
    const assignedCandidates = allocateCandidatesForEvaluator(evaluatorName, 10, allocatedEmailsSet);

    // 6. Save newly allocated candidates to DB
    const allocationInserts = assignedCandidates.map((cand) => ({
      id: randomUUID(),
      evaluatorId: evaluator.id,
      employeeEmail: cand.email,
      employeeName: cand.name,
      assignedAt: now,
    }));

    if (allocationInserts.length > 0) {
      await db.insert(aiEmployeeAllocations).values(allocationInserts);
    }

    // 7. Update evaluator table
    await db
      .update(aiEvaluators)
      .set({ allocated: true, allocatedAt: now, updatedAt: now })
      .where(eq(aiEvaluators.id, evaluator.id));

    return NextResponse.json({
      evaluatorName: evaluator.name,
      isAdmin: false,
      allocated: true,
      allocatedAt: now,
      assignedCandidates,
    });
  } catch (error: any) {
    console.error("[AI-EVAL] POST allocation error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
