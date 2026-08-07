"use client";

import Link from "next/link";
import { Layers, ArrowLeft, Bot, Sparkles, ShieldCheck } from "lucide-react";

export default function CompleteEvalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Top Banner for World 2 */}
      <div className="bg-gradient-to-r from-purple-950 via-neutral-900 to-indigo-950 border-b border-purple-800/40 px-6 py-2.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-purple-400 text-neutral-300 hover:text-white transition-all flex items-center gap-1 font-mono text-[11px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to World Selection Hub
          </Link>
          <span className="hidden sm:inline-block text-neutral-400">|</span>
          <span className="hidden sm:flex items-center gap-1.5 text-purple-300 font-mono font-semibold">
            <Layers className="w-3.5 h-3.5 text-purple-400" /> WORLD 2: Wysbryx Complete Evaluation (Legacy Ledger)
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <Link
            href="/ai-eval"
            className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <Bot className="w-3.5 h-3.5" /> Switch to World 1
          </Link>
        </div>
      </div>

      <main className="flex-1">{children}</main>
    </div>
  );
}
