"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Bot,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { WysbryxLogo } from "@/components/ui/WysbryxLogo";

export default function WorldSelectionLandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden flex flex-col justify-between font-sans selection:bg-amber-500 selection:text-black">
      {/* Dynamic Warm Amber Aurora & Grid Backdrop matching Wysbryx Logo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.18),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[160px] pointer-events-none" />
      
      {/* Top Header Navigation */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-8 flex items-center justify-between">
        <Link href="/">
          <WysbryxLogo height={36} />
        </Link>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-mono bg-neutral-900 border border-white/[0.08] text-neutral-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Enterprise Isolation v2.4
          </span>
        </div>
      </header>

      {/* Hero Content Section */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-12 flex-1 flex flex-col justify-center items-center text-center">
        {/* Warm Logo Accent Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 text-amber-300 text-[10px] sm:text-xs font-mono font-semibold backdrop-blur-xl mb-4 sm:mb-8 shadow-inner shadow-amber-500/10"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce shrink-0" />
          <span>SELECT EVALUATION ENVIRONMENT</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15] max-w-5xl"
        >
          Two Worlds. One Enterprise. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300">
            Next-Gen Performance Intelligence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-3 sm:mt-6 text-xs sm:text-xl text-neutral-400 max-w-2xl font-normal leading-relaxed"
        >
          Choose your workspace to begin. Enter the AI-Driven Candidate Evaluation experience or access the Complete Ledger Performance Suite.
        </motion.p>

        {/* Two World Cards Container */}
        <div className="mt-8 sm:mt-14 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 w-full max-w-5xl text-left">
          
          {/* WORLD 1: Wysbryx AI Evaluation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="group relative p-5 sm:p-8 rounded-3xl bg-neutral-900/80 border border-white/[0.08] hover:border-amber-500/50 backdrop-blur-2xl transition-all duration-500 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Glowing Card Border Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300 shadow-lg shadow-amber-500/10 shrink-0">
                  <Bot className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wider">
                  WORLD 1
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold text-white group-hover:text-amber-400 transition-colors">
                Wysbryx AI Evaluation
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                Dedicated AI evaluation environment with intelligent evaluator matching, single-roll candidate allocation, and 6 specialized AI competency audit rubrics.
              </p>

              <div className="mt-4 sm:mt-6 space-y-2 text-xs font-mono text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Interactive Roll Generator</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Real-time Graphical Scorecard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Leaderboard & Admin Bypass</span>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/[0.06]">
              <Link
                href="/ai-eval"
                className="w-full py-3.5 sm:py-4 rounded-2xl bg-amber-500 text-black font-extrabold text-xs sm:text-sm hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 group/btn"
              >
                <span>Enter World 1 Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* WORLD 2: Complete Ledger */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="group relative p-5 sm:p-8 rounded-3xl bg-neutral-900/80 border border-white/[0.08] hover:border-purple-500/50 backdrop-blur-2xl transition-all duration-500 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-lg shadow-purple-500/10 shrink-0">
                  <Layers className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 tracking-wider">
                  WORLD 2
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold text-white group-hover:text-purple-400 transition-colors">
                Complete Ledger Suite
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                The comprehensive engineering performance ledger suite with 8 weighted dimensions, organizational analytics, audit trails, and multi-quarter trends.
              </p>

              <div className="mt-4 sm:mt-6 space-y-2 text-xs font-mono text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>8 Weighted Parameters Math</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Org Heatmaps & Radar Charts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Audit Logs & Platform Docs</span>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/[0.06]">
              <Link
                href="/complete-eval"
                className="w-full py-3.5 sm:py-4 rounded-2xl bg-neutral-800 border border-white/[0.1] hover:bg-neutral-700 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 group/btn"
              >
                <span>Enter World 2 Suite</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 text-center text-xs font-mono text-neutral-500 border-t border-white/[0.04]">
        <span>© 2026 Wysbryx Technologies Inc. Dual-World Performance Intelligence Suite.</span>
      </footer>
    </div>
  );
}
