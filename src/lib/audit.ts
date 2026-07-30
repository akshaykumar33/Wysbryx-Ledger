import { AuditLog } from "./types";

let memoryLogs: AuditLog[] = [
  {
    id: "log_101",
    adminId: "admin_1",
    adminName: "Executive Administrator",
    action: "CREATE",
    entityType: "Evaluation",
    entityId: "eval_2026_q3_1",
    oldValues: undefined,
    newValues: JSON.stringify({ engineer: "Aarav Sharma", score: 96.5, grade: "A+" }),
    ipAddress: "192.168.1.10",
    timestamp: "2026-07-28T10:00:00Z",
  },
  {
    id: "log_102",
    adminId: "admin_1",
    adminName: "Executive Administrator",
    action: "SETTINGS_CHANGE",
    entityType: "Settings",
    entityId: "grade_boundaries",
    oldValues: JSON.stringify({ grade: "A+", min: 90 }),
    newValues: JSON.stringify({ grade: "A+", min: 95 }),
    ipAddress: "192.168.1.10",
    timestamp: "2026-07-29T14:20:00Z",
  },
  {
    id: "log_103",
    adminId: "admin_1",
    adminName: "Executive Administrator",
    action: "CREATE",
    entityType: "Engineer",
    entityId: "eng_10",
    oldValues: undefined,
    newValues: JSON.stringify({ name: "Chloe Dubois", designation: "Junior AI Researcher" }),
    ipAddress: "192.168.1.10",
    timestamp: "2026-07-30T09:15:00Z",
  },
];

export function getAuditLogs(): AuditLog[] {
  return memoryLogs;
}

export function logAuditEvent(
  action: AuditLog["action"],
  entityType: AuditLog["entityType"],
  entityId: string,
  newValues?: any,
  oldValues?: any,
  adminName: string = "Executive Administrator"
): AuditLog {
  const newLog: AuditLog = {
    id: `log_${Date.now()}`,
    adminId: "admin_1",
    adminName,
    action,
    entityType,
    entityId,
    oldValues: oldValues ? (typeof oldValues === "string" ? oldValues : JSON.stringify(oldValues)) : undefined,
    newValues: newValues ? (typeof newValues === "string" ? newValues : JSON.stringify(newValues)) : undefined,
    ipAddress: "127.0.0.1",
    timestamp: new Date().toISOString(),
  };

  memoryLogs = [newLog, ...memoryLogs];
  return newLog;
}

export function recordAuditEvent(params: {
  adminId: string;
  adminName: string;
  action: AuditLog["action"];
  entityType: AuditLog["entityType"];
  entityId: string;
  oldValues?: string;
  newValues?: string;
}): AuditLog {
  return logAuditEvent(
    params.action,
    params.entityType,
    params.entityId,
    params.newValues,
    params.oldValues,
    params.adminName
  );
}
