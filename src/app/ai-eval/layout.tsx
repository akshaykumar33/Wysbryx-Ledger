"use client";

import Link from "next/link";
import { useAIEvalStore } from "@/lib/ai-eval/store";
import { Bot, Sparkles, LogOut, ShieldCheck, ArrowLeft, Layers, UserCheck } from "lucide-react";

export default function AIEvalLayout({ children }: { children: React.ReactNode }) {
  const { evaluatorName, isAdmin, isAllocated, logoutEvaluator } = useAIEvalStore();

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Isolated Header for World 1 */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-neutral-950 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & World Identity */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl bg-neutral-900 border border-white/[0.06] hover:border-cyan-500/40 text-neutral-400 hover:text-white transition-all group"
              title="Return to World Selection Hub"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-tight">Wysbryx AI Evaluation</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    WORLD 1
                  </span>
                </div>
                <span className="text-[11px] font-mono text-neutral-500 block">AI-Driven Candidate Performance Engine</span>
              </div>
            </div>
          </div>

          {/* Evaluator Session Status & Actions */}
          <div className="flex items-center gap-4">
            {evaluatorName ? (
              <div className="flex items-center gap-3 bg-neutral-900 border border-white/[0.06] rounded-2xl px-3.5 py-1.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center border border-cyan-500/30">
                  {evaluatorName.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{evaluatorName}</span>
                    {isAdmin ? (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        ADMIN
                      </span>
                    ) : isAllocated ? (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ROLLED
                      </span>
                    ) : null}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {isAdmin ? "Full Roster Access" : isAllocated ? "Candidates Allocated" : "Roll Pending"}
                  </span>
                </div>

                <button
                  onClick={logoutEvaluator}
                  className="ml-2 text-neutral-500 hover:text-rose-400 transition-colors p-1"
                  title="Logout Evaluator"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <span className="text-xs font-mono text-neutral-500 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Session Unauthenticated
              </span>
            )}

            <Link
              href="/complete-eval"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/[0.06] text-neutral-400 hover:text-purple-300 hover:border-purple-500/30 text-xs font-mono transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" /> Switch to World 2
            </Link>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">{children}</main>
    </div>
  );
}
