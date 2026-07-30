"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Engineer, Evaluation, AdminUser, SystemSettings } from "./types";
import { MOCK_ENGINEERS, MOCK_EVALUATIONS } from "./mockData";
import { DEFAULT_SETTINGS } from "./constants";
import { recordAuditEvent } from "./audit";

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

      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      filterDepartment: "ALL",
      setFilterDepartment: (deptId) => set({ filterDepartment: deptId }),
      filterCaptain: "ALL",
      setFilterCaptain: (captainId) => set({ filterCaptain: captainId }),

      addEngineer: (eng) => {
        set((state) => ({ engineers: [eng, ...state.engineers] }));
        recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "CREATE",
          entityType: "Engineer",
          entityId: eng.id,
          newValues: JSON.stringify(eng),
        });
      },

      updateEngineer: (eng) => {
        set((state) => ({
          engineers: state.engineers.map((e) => (e.id === eng.id ? eng : e)),
        }));
        recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "UPDATE",
          entityType: "Engineer",
          entityId: eng.id,
          newValues: JSON.stringify(eng),
        });
      },

      softDeleteEngineer: (id) => {
        const deletedAt = new Date().toISOString();
        set((state) => ({
          engineers: state.engineers.map((e) =>
            e.id === id ? { ...e, deletedAt } : e
          ),
        }));
        recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "SOFT_DELETE",
          entityType: "Engineer",
          entityId: id,
          newValues: JSON.stringify({ deletedAt }),
        });
      },

      restoreEngineer: (id) => {
        set((state) => ({
          engineers: state.engineers.map((e) =>
            e.id === id ? { ...e, deletedAt: null } : e
          ),
        }));
        recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "RESTORE",
          entityType: "Engineer",
          entityId: id,
          newValues: JSON.stringify({ deletedAt: null }),
        });
      },

      bulkDeleteEngineers: (ids) => {
        const deletedAt = new Date().toISOString();
        set((state) => ({
          engineers: state.engineers.map((e) =>
            ids.includes(e.id) ? { ...e, deletedAt } : e
          ),
        }));
        recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "BULK_DELETE",
          entityType: "Engineer",
          entityId: ids.join(","),
          newValues: JSON.stringify({ count: ids.length, ids }),
        });
      },

      addEvaluation: (evalItem) => {
        set((state) => ({ evaluations: [evalItem, ...state.evaluations] }));
        recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "CREATE",
          entityType: "Evaluation",
          entityId: evalItem.id,
          newValues: JSON.stringify(evalItem),
        });
      },

      updateEvaluation: (evalItem) => {
        set((state) => ({
          evaluations: state.evaluations.map((ev) =>
            ev.id === evalItem.id ? evalItem : ev
          ),
        }));
        recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "UPDATE",
          entityType: "Evaluation",
          entityId: evalItem.id,
          newValues: JSON.stringify(evalItem),
        });
      },

      updateSettings: (newSettings) => {
        set((state) => ({ settings: { ...state.settings, ...newSettings } }));
        recordAuditEvent({
          adminId: get().currentUser.id,
          adminName: get().currentUser.name,
          action: "SETTINGS_CHANGE",
          entityType: "Settings",
          entityId: "system_settings",
          newValues: JSON.stringify(newSettings),
        });
      },

      cmdOpen: false,
      setCmdOpen: (open) => set({ cmdOpen: open }),
    }),
    {
      name: "wysbryx_intel_store_v2",
      partialize: (state) => ({
        themeAccent: state.themeAccent,
        engineers: state.engineers,
        evaluations: state.evaluations,
        settings: state.settings,
        selectedQuarter: state.selectedQuarter,
        selectedYear: state.selectedYear,
      }),
    }
  )
);
