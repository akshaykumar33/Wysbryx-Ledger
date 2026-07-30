"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, BarChart3, Users, ClipboardCheck, Layers, Activity, BookOpen, Settings, PlusCircle, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function CmdKMenu() {
  const router = useRouter();
  const { cmdOpen, setCmdOpen } = useAppStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen(!cmdOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [cmdOpen, setCmdOpen]);

  if (!cmdOpen) return null;

  const handleSelect = (href: string) => {
    setCmdOpen(false);
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/95 dark:bg-neutral-900/95 shadow-2xl">
        <Command label="Global Command Menu" className="w-full">
          <div className="flex items-center gap-3 px-4 border-b border-neutral-200 dark:border-neutral-800">
            <Search className="w-4 h-4 text-neutral-400" />
            <Command.Input
              placeholder="Search engineers, evaluations, documentation, or settings..."
              className="w-full py-4 text-xs font-medium bg-transparent text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none"
            />
            <kbd className="text-[10px] font-mono text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-300 dark:border-neutral-700">ESC</kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1">
            <Command.Empty className="p-4 text-center text-xs text-neutral-400 font-mono">
              No matching search results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="text-[10px] font-mono font-bold uppercase text-neutral-400 px-3 py-1">
              <Command.Item
                onSelect={() => handleSelect("/dashboard")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer font-medium"
              >
                <BarChart3 className="w-4 h-4 text-primary" />
                <span>Executive Dashboard</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect("/engineers")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer font-medium"
              >
                <Users className="w-4 h-4 text-primary" />
                <span>Engineers Directory</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect("/evaluations")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer font-medium"
              >
                <ClipboardCheck className="w-4 h-4 text-primary" />
                <span>Evaluations Workspace</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect("/analytics")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer font-medium"
              >
                <Layers className="w-4 h-4 text-primary" />
                <span>Skill Gap Analytics</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect("/audit-logs")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer font-medium"
              >
                <Activity className="w-4 h-4 text-primary" />
                <span>System Audit Logs</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect("/docs")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer font-medium"
              >
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Platform Docs</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect("/settings")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer font-medium"
              >
                <Settings className="w-4 h-4 text-primary" />
                <span>Engine Settings</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Quick Actions" className="text-[10px] font-mono font-bold uppercase text-neutral-400 px-3 py-1 pt-2">
              <Command.Item
                onSelect={() => handleSelect("/evaluations/new")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Start New Evaluation</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between p-3 border-t border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/50">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>SINGLE ADMIN GOVERNANCE</span>
            </div>
            <button onClick={() => setCmdOpen(false)} className="hover:text-neutral-900 dark:hover:text-white">
              Close (ESC)
            </button>
          </div>
        </Command>
      </div>
    </div>
  );
}
