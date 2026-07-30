"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Command, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Tooltip } from "@/components/ui/Tooltip";
import { WysbryxLogo } from "@/components/ui/WysbryxLogo";
import { useAppStore } from "@/lib/store";

export function Navbar() {
  const { setCmdOpen, selectedQuarter, selectedYear, setSelectedCycle } = useAppStore();

  const cycleOptions = [
    { value: "Q3_2026", label: "Q3 2026", sublabel: "Active Evaluation Cycle" },
    { value: "Q2_2026", label: "Q2 2026", sublabel: "Completed Cycle" },
    { value: "Q1_2026", label: "Q1 2026", sublabel: "Completed Cycle" },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-200/60 dark:border-neutral-800/60 glass-panel transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand Wysbryx Logo */}
        <Link href="/">
          <WysbryxLogo />
        </Link>

        {/* Right Actions: Cycle Selector, Search Trigger, Single Admin Badge, Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Custom Cycle Selector */}
          <div className="w-36">
            <CustomSelect
              options={cycleOptions}
              value={`${selectedQuarter}_${selectedYear}`}
              onChange={(val) => {
                const [q, y] = val.split("_");
                setSelectedCycle(q, Number(y));
              }}
            />
          </div>

          {/* Search Trigger */}
          <Tooltip content="Press Cmd+K to open global search">
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-xs shadow-xs"
            >
              <Search className="w-3.5 h-3.5 text-primary" />
              <span className="hidden md:inline-block">Search platform...</span>
              <kbd className="hidden md:flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-300/50 dark:border-neutral-700/50">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>
          </Tooltip>

          {/* Single Admin Governance Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-semibold font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ADMIN GOVERNANCE</span>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
