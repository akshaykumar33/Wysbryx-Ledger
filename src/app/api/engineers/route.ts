import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { engineers } from "@/db/schema";
import { eq, isNull } from "drizzle-orm";
import { randomUUID } from "crypto";
import { getRealEngineers } from "@/lib/world2/realTeam";
import { DEPARTMENTS, TEAMS } from "@/lib/constants";

export const dynamic = "force-dynamic";

// GET /api/engineers
export async function GET(request: NextRequest) {
  try {
    const showArchived = request.nextUrl.searchParams.get("showArchived") === "true";
    // The real team from World 1, plus anyone added in World 2.
    const team = await getRealEngineers({ includeArchived: showArchived });
    return NextResponse.json({ engineers: team });
  } catch (error: any) {
    console.error("[API] GET /api/engineers error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// POST /api/engineers — Create or update engineer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, fullName, employeeId, email, designationId, departmentId, teamId, managerName, joiningDate, experienceYears, primarySkills, secondarySkills, status } = body;

    if (!fullName || !email) {
      return NextResponse.json({ error: "fullName and email are required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const engId = id || randomUUID();

    const record = {
      id: engId,
      photoUrl: body.photoUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`,
      fullName: fullName.trim(),
      employeeId: employeeId || `ENG-${Math.floor(100 + Math.random() * 900)}`,
      email: email.trim().toLowerCase(),
      departmentId: departmentId || DEPARTMENTS[0].id,
      teamId: teamId || TEAMS[0].id,
      designationId: designationId || "Senior Engineer",
      managerName: managerName || "",
      joiningDate: joiningDate || "2025-01-01",
      experienceYears: Number(experienceYears) || 3.0,
      primarySkills: typeof primarySkills === "string" ? primarySkills : JSON.stringify(primarySkills || []),
      secondarySkills: typeof secondarySkills === "string" ? secondarySkills : JSON.stringify(secondarySkills || []),
      status: status || "Active",
      avgScore: body.avgScore || 85.0,
      grade: body.grade || "A",
      createdAt: now,
      updatedAt: now,
    };

    const existing = await db.query.engineers.findFirst({
      where: eq(engineers.id, engId),
    });

    if (existing) {
      await db.update(engineers).set(record).where(eq(engineers.id, engId));
    } else {
      await db.insert(engineers).values(record);
    }

    return NextResponse.json({ success: true, engineer: record });
  } catch (error: any) {
    console.error("[API] POST /api/engineers error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
