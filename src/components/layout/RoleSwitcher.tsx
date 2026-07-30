"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function RoleSwitcher() {
  const { currentUser } = useAppStore();

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold font-mono">
      <ShieldCheck className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">EXECUTIVE ADMIN</span>
    </div>
  );
}
