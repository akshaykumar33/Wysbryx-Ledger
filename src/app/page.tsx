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
  ChevronRight,
  Cpu,
  BarChart3,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { WysbryxLogo } from "@/components/ui/WysbryxLogo";

export default function WorldSelectionLandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden flex flex-col justify-between font-sans selection:bg-cyan-500 selection:text-black">
      {/* Dynamic Aurora & Grid Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none" />
      
      {/* Top Header Navigation */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <Link href="/">
          <WysbryxLogo height={42} />
        </Link>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-neutral-900 border border-neutral-800 text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Enterprise Isolation v2.4
          </span>
        </div>
      </header>

      {/* Hero Content Section */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-6 py-12 flex-1 flex flex-col justify-center items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono font-semibold backdrop-blur-xl mb-8 shadow-inner shadow-cyan-500/10"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
          <span>SELECT EVALUATION ENVIRONMENT</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-5xl"
        >
          Two Worlds. One Enterprise. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
            Next-Gen Performance Intelligence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-neutral-400 max-w-2xl font-normal leading-relaxed"
        >
          Choose your workspace to begin. Enter the AI-Driven Candidate Evaluation experience or access the Complete Ledger Performance Suite.
        </motion.p>

        {/* Two World Cards Container */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl text-left">
          
          {/* WORLD 1: Wysbryx AI Evaluation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="group relative p-8 rounded-3xl bg-neutral-900/80 border border-neutral-800 hover:border-cyan-500/50 backdrop-blur-2xl transition-all duration-500 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Glowing Card Border Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors duration-300 shadow-lg shadow-cyan-500/10">
                  <Bot className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
                  WORLD 1
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Wysbryx AI Evaluation
              </h2>

              <p className="mt-3 text-sm text-neutral-400 leading-relaxed font-sans">
                Dedicated AI evaluation environment with intelligent evaluator matching, single-roll candidate allocation, rich question rubrics, and automated scorecards.
              </p>

              <ul className="mt-6 space-y-2.5 text-xs text-neutral-300 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Smart Regex Evaluator Matching
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Interactive Single-Roll Distribution Engine
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Notion-Style Rich Question & Rubric Workspace
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Admin Bypass for Praveen & Krishna
                </li>
              </ul>
            </div>

            <div className="mt-10 pt-6 border-t border-neutral-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors">
                Isolated State & Routing
              </span>
              <Link
                href="/ai-eval"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 group/btn"
              >
                <span>Enter World 1</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* WORLD 2: Wysbryx Complete Evaluation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="group relative p-8 rounded-3xl bg-neutral-900/80 border border-neutral-800 hover:border-purple-500/50 backdrop-blur-2xl transition-all duration-500 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Glowing Card Border Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-black transition-colors duration-300 shadow-lg shadow-purple-500/10">
                  <Layers className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                  WORLD 2
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                Wysbryx Complete Evaluation
              </h2>

              <p className="mt-3 text-sm text-neutral-400 leading-relaxed font-sans">
                The full legacy ledger platform preserved completely intact. Comprehensive executive dashboards, engineering rosters, audit logs, and settings.
              </p>

              <ul className="mt-6 space-y-2.5 text-xs text-neutral-300 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" /> Executive Analytics & Multi-Cycle Dashboard
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" /> Full Engineering Directory & Designations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" /> Weighted Score Mathematics & Grade Calculators
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" /> Complete Audit Logging & Governance Suite
                </li>
              </ul>
            </div>

            <div className="mt-10 pt-6 border-t border-neutral-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors">
                Legacy Ledger Preserved
              </span>
              <Link
                href="/complete-eval"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20 group/btn"
              >
                <span>Enter World 2</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-500 font-mono">
        <div>Wysbryx Intelligence Platform &copy; 2026</div>
        <div className="flex items-center gap-4">
          <span>Enterprise Grade</span>
          <span>•</span>
          <span>Zero Interference</span>
        </div>
      </footer>
    </div>
  );
}
