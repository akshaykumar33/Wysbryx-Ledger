"use client";

import * as React from "react";
import { useAppStore } from "@/lib/store";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { toast } from "sonner";
import { Save, Building, ShieldCheck, Palette, Percent } from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings, themeAccent, setThemeAccent } = useAppStore();

  const [companyName, setCompanyName] = React.useState(settings.companyName);
  const [maxScore, setMaxScore] = React.useState(settings.maxScore);
  const [activeQuarter, setActiveQuarter] = React.useState(settings.activeQuarter);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      companyName,
      maxScore: Number(maxScore),
      activeQuarter,
    });
    toast.success("System & Branding settings saved successfully!");
  };

  return (
    <PageWrapper className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-neutral-200/80 dark:border-neutral-800/80 pb-6">
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
          SYSTEM CONFIGURATION & BRANDING
        </span>
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 tracking-tight">
          Platform Engine Settings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Configure active evaluation cycles, brand theme accent, and evaluation score boundaries.
        </p>
      </div>

      {/* Brand Theme Accent Selector Section */}
      <div data-tour="settings-theme-selector" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Dynamic Brand Theme Accent</h2>
        </div>

        <p className="text-xs text-neutral-500">
          Selecting a brand theme color instantly updates all primary action buttons, active navigation pills, progress bars, scrollbars, text selections, and hover rings across every page on the platform.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { id: "wysbryx", label: "Wysbryx Orange", color: "#D8561B", bg: "bg-[#D8561B]" },
            { id: "violet", label: "Linear Violet", color: "#8B5CF6", bg: "bg-purple-500" },
            { id: "emerald", label: "Raycast Emerald", color: "#10B981", bg: "bg-emerald-500" },
            { id: "cyan", label: "Vercel Cyan", color: "#06B6D4", bg: "bg-cyan-500" },
            { id: "rose", label: "Neon Rose", color: "#F43F5E", bg: "bg-rose-500" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setThemeAccent(item.id as any);
                document.documentElement.setAttribute("data-theme-accent", item.id);
                toast.success(`Active platform theme set to ${item.label}!`);
              }}
              className={`p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
                themeAccent === item.id
                  ? "border-primary ring-2 ring-primary/40 bg-neutral-100/80 dark:bg-neutral-800/80 shadow-md scale-105"
                  : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900"
              }`}
            >
              <div className={`w-6 h-6 rounded-full ${item.bg} shadow-sm`} />
              <div className="text-xs font-bold text-neutral-900 dark:text-white">{item.label}</div>
              <div className="text-[10px] text-neutral-400 font-mono">{item.color}</div>
            </button>
          ))}
        </div>
      </div>

      {/* System Branding Form */}
      <form onSubmit={handleSaveBranding} className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <Building className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Organization & Scoring Scale</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">COMPANY / ORGANIZATION NAME</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-semibold focus:ring-2 focus:ring-primary/50 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">MAX EVALUATION SCORE</label>
            <input
              type="number"
              value={maxScore}
              onChange={(e) => setMaxScore(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono font-bold focus:ring-2 focus:ring-primary/50 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">ACTIVE QUARTER</label>
            <input
              type="text"
              value={activeQuarter}
              onChange={(e) => setActiveQuarter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono font-bold focus:ring-2 focus:ring-primary/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-md shadow-primary/20 hover:opacity-90 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </PageWrapper>
  );
}
