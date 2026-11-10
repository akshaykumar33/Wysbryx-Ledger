"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Engineer, Evaluation, AdminUser, SystemSettings, AuditLog } from "./types";
import { MOCK_ENGINEERS, MOCK_EVALUATIONS } from "./mockData";
import { DEFAULT_SETTINGS, DEPARTMENTS, TEAMS, EVALUATION_PARAMETERS } from "./constants";
import { recordAuditEvent, INITIAL_AUDIT_LOGS, setAuditLogs } from "./audit";

// The API returns raw database rows; screens expect display fields
// (department and team names, skills as arrays, engineer and parameter names).
const toList = (v: unknown): string[] => {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === "string" && v.trim()) {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      return v.split(",").map((x) => x.trim()).filter(Boolean);
    }
  }
  return [];
};

function normalizeEngineer(e: any): Engineer {
  const team = TEAMS.find((t) => t.id === e.teamId);
  return {
    ...e,
    departmentName: e.departmentName || DEPARTMENTS.find((d) => d.id === e.departmentId)?.name || "",
    teamName: e.teamName || team?.name || "",
    captainName: e.captainName || team?.captainName || e.managerName || "",
    designation: e.designation || e.designationTitle || e.designationId || "",
    primarySkills: toList(e.primarySkills),
    secondarySkills: toList(e.secondarySkills),
  };
}

function normalizeEvaluation(ev: any, engineers: Engineer[]): Evaluation {
  const eng = engineers.find((x) => x.id === ev.engineerId);
  return {
    ...ev,
    engineerName: ev.engineerName || eng?.fullName || "",
    engineerEmail: ev.engineerEmail || eng?.email || "",
    engineerDesignation: ev.engineerDesignation || eng?.designation || "",
    engineerDepartment: ev.engineerDepartment || eng?.departmentName || "",
    engineerPhoto: ev.engineerPhoto || eng?.photoUrl || "",
    reviewerName: ev.reviewerName || ev.adminName || "",
    reviewerEmail: ev.reviewerEmail || ev.adminEmail || "",
    reviewerRole: ev.reviewerRole || "Administrator",
    parameterScores: (ev.parameterScores || []).map((p: any) => ({
      ...p,
      parameterName: p.parameterName || EVALUATION_PARAMETERS.find((x) => x.key === p.parameterKey)?.name || p.parameterKey,
    })),
  };
}

export type ThemeAccent = "wysbryx" | "violet" | "emerald" | "cyan" | "rose";

interface AppState {
  // Theme Accent
  themeAccent: ThemeAccent;
  setThemeAccent: (accent: ThemeAccent) => void;

  // Single Admin Governance
  currentUser: AdminUser;

  // Selected Cycle Context
  selectedQuarter: "Q1" | "Q2" | "Q3" | "Q4";
  selectedYear: number;
  setSelectedCycle: (quarter: string, year: number) => void;

  // Data Collections
  engineers: Engineer[];
  evaluations: Evaluation[];
  settings: SystemSettings;
  auditLogs: AuditLog[];

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterDepartment: string;
  setFilterDepartment: (deptId: string) => void;
  filterCaptain: string;
  setFilterCaptain: (captainId: string) => void;

  // Actions - Engineers
  addEngineer: (engineer: Engineer) => void;
  updateEngineer: (engineer: Engineer) => void;
  softDeleteEngineer: (id: string) => void;
  restoreEngineer: (id: string) => void;
  bulkDeleteEngineers: (ids: string[]) => void;

  // Actions - Evaluations
  addEvaluation: (evaluation: Evaluation) => void;
  updateEvaluation: (evaluation: Evaluation) => void;
  deleteEvaluation: (id: string) => void;

  // Server Data Sync
  loadDataFromServer: () => Promise<void>;

  // Actions - Audit Logs
  deleteAuditLog: (id: string) => void;
  clearAuditLogs: () => void;

  // Actions - Settings
  updateSettings: (newSettings: Partial<SystemSettings>) => void;

  // Command Menu State
  cmdOpen: boolean;
  setCmdOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      themeAccent: "wysbryx",
      setThemeAccent: (accent) => {
        set({ themeAccent: accent });
        recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "SETTINGS_CHANGE",
          entityType: "System",
          entityId: "theme_accent",
          newValues: JSON.stringify({ accent }),
        });
      },

      currentUser: {
        id: "admin_exec_1",
        name: "Executive Administrator",
        email: "admin@wysbryx.com",
        role: "Admin",
      },

      selectedQuarter: "Q3",
      selectedYear: 2026,
      setSelectedCycle: (quarter, year) =>
        set({ selectedQuarter: quarter as any, selectedYear: year }),

      engineers: MOCK_ENGINEERS,
      evaluations: MOCK_EVALUATIONS,
      settings: DEFAULT_SETTINGS,
      auditLogs: INITIAL_AUDIT_LOGS,

      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      filterDepartment: "ALL",
      setFilterDepartment: (deptId) => set({ filterDepartment: deptId }),
      filterCaptain: "ALL",
      setFilterCaptain: (captainId) => set({ filterCaptain: captainId }),

      addEngineer: async (eng) => {
        set((state) => ({ engineers: [eng, ...state.engineers] }));
        const log = recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "CREATE",
          entityType: "Engineer",
          entityId: eng.id,
          newValues: JSON.stringify(eng),
        });
        set((state) => ({ auditLogs: [log, ...state.auditLogs] }));

        try {
          await fetch("/api/engineers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eng),
          });
          await fetch("/api/audit-logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(log),
          });
        } catch (err) {
          console.error("Failed to sync new engineer to server:", err);
        }
      },

      updateEngineer: async (eng) => {
        set((state) => ({
          engineers: state.engineers.map((e) => (e.id === eng.id ? eng : e)),
        }));
        const log = recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "UPDATE",
          entityType: "Engineer",
          entityId: eng.id,
          newValues: JSON.stringify(eng),
        });
        set((state) => ({ auditLogs: [log, ...state.auditLogs] }));

        try {
          await fetch("/api/engineers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eng),
          });
        } catch (err) {
          console.error("Failed to sync updated engineer to server:", err);
        }
      },

      softDeleteEngineer: (id) => {
        const deletedAt = new Date().toISOString();
        set((state) => ({
          engineers: state.engineers.map((e) =>
            e.id === id ? { ...e, deletedAt } : e
          ),
        }));
        const log = recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "SOFT_DELETE",
          entityType: "Engineer",
          entityId: id,
          newValues: JSON.stringify({ deletedAt }),
        });
        set((state) => ({ auditLogs: [log, ...state.auditLogs] }));
      },

      restoreEngineer: (id) => {
        set((state) => ({
          engineers: state.engineers.map((e) =>
            e.id === id ? { ...e, deletedAt: null } : e
          ),
        }));
        const log = recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "RESTORE",
          entityType: "Engineer",
          entityId: id,
          newValues: JSON.stringify({ deletedAt: null }),
        });
        set((state) => ({ auditLogs: [log, ...state.auditLogs] }));
      },

      bulkDeleteEngineers: (ids) => {
        const deletedAt = new Date().toISOString();
        set((state) => ({
          engineers: state.engineers.map((e) =>
            ids.includes(e.id) ? { ...e, deletedAt } : e
          ),
        }));
        const log = recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "BULK_DELETE",
          entityType: "Engineer",
          entityId: ids.join(","),
          newValues: JSON.stringify({ count: ids.length, ids }),
        });
        set((state) => ({ auditLogs: [log, ...state.auditLogs] }));
      },

      addEvaluation: async (evalItem) => {
        set((state) => ({ evaluations: [evalItem, ...state.evaluations] }));
        const log = recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "CREATE",
          entityType: "Evaluation",
          entityId: evalItem.id,
          newValues: JSON.stringify(evalItem),
        });
        set((state) => ({ auditLogs: [log, ...state.auditLogs] }));

        try {
          await fetch("/api/evaluations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(evalItem),
          });
        } catch (err) {
          console.error("Failed to sync evaluation to server:", err);
        }
      },

      updateEvaluation: async (evalItem) => {
        set((state) => ({
          evaluations: state.evaluations.map((ev) =>
            ev.id === evalItem.id ? evalItem : ev
          ),
        }));
        const log = recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "UPDATE",
          entityType: "Evaluation",
          entityId: evalItem.id,
          newValues: JSON.stringify(evalItem),
        });
        set((state) => ({ auditLogs: [log, ...state.auditLogs] }));

        try {
          await fetch("/api/evaluations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(evalItem),
          });
        } catch (err) {
          console.error("Failed to sync updated evaluation to server:", err);
        }
      },

      deleteEvaluation: (id) => {
        set((state) => ({
          evaluations: state.evaluations.filter((ev) => ev.id !== id),
        }));
        const log = recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "SOFT_DELETE",
          entityType: "Evaluation",
          entityId: id,
        });
        set((state) => ({ auditLogs: [log, ...state.auditLogs] }));
      },

      deleteAuditLog: (id) => {
        set((state) => {
          const newLogs = state.auditLogs.filter((log) => log.id !== id);
          setAuditLogs(newLogs);
          return { auditLogs: newLogs };
        });
      },

      clearAuditLogs: () => {
        setAuditLogs([]);
        set({ auditLogs: [] });
      },

      updateSettings: (newSettings) => {
        set((state) => ({ settings: { ...state.settings, ...newSettings } }));
        const log = recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "SETTINGS_CHANGE",
          entityType: "Settings",
          entityId: "system_settings",
          newValues: JSON.stringify(newSettings),
        });
        set((state) => ({ auditLogs: [log, ...state.auditLogs] }));
      },

      loadDataFromServer: async () => {
        try {
          // Fetch Engineers
          const engRes = await fetch("/api/engineers");
          if (engRes.ok) {
            const data = await engRes.json();
            if (data.engineers && data.engineers.length > 0) {
              set({ engineers: data.engineers.map(normalizeEngineer) });
            }
          }

          // Fetch Evaluations
          const evalRes = await fetch("/api/evaluations");
          if (evalRes.ok) {
            const data = await evalRes.json();
            if (data.evaluations && data.evaluations.length > 0) {
              set({ evaluations: data.evaluations.map((ev: any) => normalizeEvaluation(ev, get().engineers)) });
            }
          }

          // Fetch Audit Logs
          const logRes = await fetch("/api/audit-logs");
          if (logRes.ok) {
            const data = await logRes.json();
            if (data.auditLogs && data.auditLogs.length > 0) {
              set({ auditLogs: data.auditLogs });
            }
          }
        } catch (err) {
          console.error("Failed to load server data:", err);
        }
      },

      cmdOpen: false,
      setCmdOpen: (open) => set({ cmdOpen: open }),
    }),
    {
      name: "wysbryx_intel_store_v3",
      partialize: (state) => ({
        themeAccent: state.themeAccent,
        engineers: state.engineers,
        evaluations: state.evaluations,
        auditLogs: state.auditLogs,
        settings: state.settings,
        selectedQuarter: state.selectedQuarter,
        selectedYear: state.selectedYear,
      }),
      // Data saved before normalisation existed may hold raw rows.
      merge: (persisted, current) => {
        const p = (persisted || {}) as Partial<AppState>;
        const engineers = (p.engineers || current.engineers).map(normalizeEngineer);
        const evaluations = (p.evaluations || current.evaluations).map((ev) => normalizeEvaluation(ev, engineers));
        return { ...current, ...p, engineers, evaluations };
      },
    }
  )
);
