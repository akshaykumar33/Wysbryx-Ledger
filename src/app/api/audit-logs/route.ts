import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

// GET /api/audit-logs
export async function GET() {
  try {
    const logs = await db.select().from(auditLogs);
    return NextResponse.json({ auditLogs: logs });
  } catch (error: any) {
    console.error("[API] GET /api/audit-logs error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// POST /api/audit-logs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, adminName, action, entityType, entityId, oldValues, newValues, ipAddress } = body;

    const now = new Date().toISOString();
    const logId = randomUUID();

    const record = {
      id: logId,
      adminId: adminId || "admin_praveen",
      adminName: adminName || "Praveen",
      action: action || "SETTINGS_CHANGE",
      entityType: entityType || "General",
      entityId: entityId || "system",
      oldValues: typeof oldValues === "object" ? JSON.stringify(oldValues) : oldValues || "",
      newValues: typeof newValues === "object" ? JSON.stringify(newValues) : newValues || "",
      ipAddress: ipAddress || "127.0.0.1",
      timestamp: now,
    };

    await db.insert(auditLogs).values(record);
    return NextResponse.json({ success: true, auditLog: record });
  } catch (error: any) {
    console.error("[API] POST /api/audit-logs error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
