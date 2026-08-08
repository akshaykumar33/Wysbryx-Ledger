"use client";

import Link from "next/link";
import { useAIEvalStore } from "@/lib/ai-eval/store";
import { Bot, LogOut, ArrowLeft, Layers, UserCheck } from "lucide-react";

export default function AIEvalLayout({ children }: { children: React.ReactNode }) {
  const { evaluatorName, isAdmin, isAllocated, logoutEvaluator } = useAIEvalStore();

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col selection:bg-orange-500 selection:text-black">
      {/* Top Isolated Header for World 1 */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-neutral-950 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          {/* Logo & World Identity */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                className="p-2 rounded-xl bg-neutral-900 border border-white/[0.06] hover:border-orange-500/40 text-neutral-400 hover:text-white transition-all group shrink-0"
                title="Return to World Selection Hub"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </Link>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-white tracking-tight">Wysbryx AI Evaluation</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
                      WORLD 1
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-neutral-500 hidden sm:block">AI-Driven Candidate Performance Engine</span>
                </div>
              </div>
            </div>

            {/* Switch to World 2 Mobile Compact Button */}
            <Link
              href="/complete-eval"
              data-tour="world-switch-w2-btn"
              className="sm:hidden p-2 rounded-xl bg-neutral-900 border border-white/[0.06] text-neutral-400 hover:text-purple-300 text-xs font-mono"
              title="Switch to World 2"
            >
              <Layers className="w-4 h-4 text-purple-400" />
            </Link>
          </div>

          {/* Evaluator Session Status & Actions */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t border-white/[0.04] sm:border-0">
            {evaluatorName ? (
              <div className="flex items-center gap-2.5 bg-neutral-900 border border-white/[0.06] rounded-2xl px-3 py-1.5 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-orange-500/20 text-orange-400 font-mono text-xs font-bold flex items-center justify-center border border-orange-500/30 shrink-0">
                    {evaluatorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5 flex-wrap">
                      <span>{evaluatorName}</span>
                      {isAdmin ? (
                        <span className="px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-mono font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ADMIN
                        </span>
                      ) : isAllocated ? (
                        <span className="px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ROLLED
                        </span>
                      ) : null}
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-mono text-neutral-400">
                      {isAdmin ? "Full Roster Access" : isAllocated ? "Candidates Allocated" : "Roll Pending"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logoutEvaluator}
                  className="text-neutral-500 hover:text-rose-400 transition-colors p-1 shrink-0"
                  title="Logout Evaluator"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-orange-400" /> Session Unauthenticated
              </span>
            )}

            <Link
              href="/complete-eval"
              data-tour="world-switch-w2-btn"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/[0.06] text-neutral-400 hover:text-purple-300 hover:border-purple-500/30 text-xs font-mono transition-all shrink-0"
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" /> Switch to World 2
            </Link>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">{children}</main>
    </div>
  );
}
