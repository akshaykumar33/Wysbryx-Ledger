"use client";

import * as React from "react";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Scale,
  Sparkles,
  HelpCircle,
  FileCheck,
  Terminal,
  Lock,
  XCircle,
  Bot,
  UserCheck,
  Dices,
  BarChart3,
  Flame,
  ShieldAlert,
  ArrowRight,
  Zap,
  Target,
  FileText,
  TrendingUp,
  Award,
  Calculator,
  Activity,
  Crown,
} from "lucide-react";
import { AUDIT_TOPIC_QUESTIONS } from "@/lib/ai-eval/store";
import { EVALUATION_PARAMETERS } from "@/lib/constants";

export default function PlatformDocsPage() {
  const [activeTab, setActiveTab] = React.useState<"world1" | "world2">("world1");
  const [activeSection, setActiveSection] = React.useState("w1-overview");

  // Sections definition per world
  const world1Sections = [
    { id: "w1-overview", title: "1. AI Engine Overview" },
    { id: "w1-login", title: "2. Evaluator Onboarding & Roll" },
    { id: "w1-workspace", title: "3. Evaluation Workspace" },
    { id: "w1-rubrics", title: "4. 6 Standardized Rubrics" },
    { id: "w1-grading", title: "5. Grade Tiers & Risk Map" },
    { id: "w1-guidelines", title: "6. Evaluator Guidelines" },
    { id: "w1-faq", title: "7. AI Engine FAQs" },
  ];

  const world2Sections = [
    { id: "w2-overview", title: "1. Ledger Suite Overview" },
    { id: "w2-parameters", title: "2. 8 Weighted Parameters" },
    { id: "w2-math", title: "3. Mathematical Formula & Grades" },
    { id: "w2-workflow", title: "4. Evaluation Creation Workflow" },
    { id: "w2-audit", title: "5. Governance & Audit Logs" },
  ];

  const currentSections = activeTab === "world1" ? world1Sections : world2Sections;

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isW1 = activeTab === "world1";

  return (
    <PageWrapper>
      <div className="relative min-h-screen">
        {/* Dynamic World Aurora Backdrop Glow */}
        {isW1 ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.22),rgba(0,0,0,0))] pointer-events-none transition-all duration-700" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-[130px] pointer-events-none transition-all duration-700" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(168,85,247,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(168,85,247,0.22),rgba(0,0,0,0))] pointer-events-none transition-all duration-700" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[130px] pointer-events-none transition-all duration-700" />
          </>
        )}

        <div className="relative z-10 max-w-7xl mx-auto space-y-8 pb-16 px-4 sm:px-6 lg:px-8">
          
          {/* Header Hero Banner */}
          <div
            data-tour="docs-hero"
            className={`p-6 sm:p-8 rounded-3xl border transition-all duration-500 backdrop-blur-2xl shadow-xl space-y-4 ${
              isW1
                ? "bg-amber-950/20 dark:bg-neutral-900/90 border-amber-500/30 dark:border-amber-500/40 shadow-amber-500/5"
                : "bg-purple-950/20 dark:bg-neutral-900/90 border-purple-500/30 dark:border-purple-500/40 shadow-purple-500/5"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 dark:border-neutral-800/80 pb-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border transition-colors ${
                      isW1
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                        : "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30"
                    }`}
                  >
                    {isW1 ? <Bot className="w-3.5 h-3.5 text-amber-500" /> : <Layers className="w-3.5 h-3.5 text-purple-500" />}
                    <span>{isW1 ? "WORLD 1 OPERATING GUIDELINES" : "WORLD 2 OPERATING GUIDELINES"}</span>
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  Wysbryx Platform Guidelines
                </h1>
              </div>

              {/* World Selector Tabs */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shrink-0 shadow-inner">
                <button
                  onClick={() => {
                    setActiveTab("world1");
                    setActiveSection("w1-overview");
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "world1"
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/25 scale-105"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  <span>World 1: AI Engine</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("world2");
                    setActiveSection("w2-overview");
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "world2"
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>World 2: Complete Ledger</span>
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-3xl leading-relaxed font-sans">
              Welcome to the official operating guide for the Wysbryx Platform. Switch between <strong className="text-amber-600 dark:text-amber-400">World 1 (AI Performance Engine)</strong> and <strong className="text-purple-600 dark:text-purple-400">World 2 (Complete Ledger Suite)</strong> above to inspect rubrics, evaluation workflows, and mathematical score formulas.
            </p>
          </div>

          {/* Layout Grid: Sticky Toc + Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 lg:sticky lg:top-20 space-y-4">
              <div
                className={`p-4 rounded-2xl border transition-all duration-300 backdrop-blur-xl shadow-md ${
                  isW1
                    ? "bg-white/90 dark:bg-neutral-900/90 border-amber-500/25 dark:border-amber-500/30"
                    : "bg-white/90 dark:bg-neutral-900/90 border-purple-500/25 dark:border-purple-500/30"
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 px-1">
                  <BookOpen className={`w-3.5 h-3.5 ${isW1 ? "text-amber-500" : "text-purple-500"}`} />
                  <span>Table of Contents</span>
                  <span
                    className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full font-extrabold uppercase border ${
                      isW1
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                        : "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30"
                    }`}
                  >
                    {activeTab}
                  </span>
                </div>

                <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0 scrollbar-none">
                  {currentSections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`shrink-0 lg:w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all font-semibold whitespace-nowrap lg:whitespace-normal ${
                        activeSection === sec.id
                          ? isW1
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-extrabold border border-amber-500/30 shadow-xs"
                            : "bg-purple-500/15 text-purple-700 dark:text-purple-300 font-extrabold border border-purple-500/30 shadow-xs"
                          : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
                      }`}
                    >
                      {sec.title}
                    </button>
                  ))}
                </nav>

                <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800/80 px-1 mt-3">
                  <Link
                    href={isW1 ? "/ai-eval" : "/complete-eval"}
                    className={`flex items-center justify-between w-full p-3 rounded-xl text-xs font-mono font-bold transition-all shadow-md ${
                      isW1
                        ? "bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20"
                        : "bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/20"
                    }`}
                  >
                    <span>Launch {isW1 ? "World 1 Workspace" : "World 2 Suite"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9 space-y-10">
              
              {/* =========================================================================
                  WORLD 1 DOCUMENTATION (USER-LEVEL WORKFLOWS & AI RUBRICS - AMBER THEME)
                 ========================================================================= */}
              {isW1 && (
                <>
                  {/* Section 1: Overview */}
                  <section
                    id="w1-overview"
                    className="p-6 sm:p-8 rounded-3xl border border-amber-500/25 dark:border-amber-500/30 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-2xl shadow-xl space-y-4"
                  >
                    <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-extrabold text-lg border-b border-amber-500/20 pb-3">
                      <Bot className="w-5 h-5 text-amber-500" />
                      <h2>1. World 1: AI Performance Evaluation Engine</h2>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                      World 1 is a dedicated evaluation workspace engineered to assess how developers adopt, leverage, and verify AI tools in their daily software engineering lifecycle.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">IDENTIFIER</span>
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Smart Match Login</h3>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Evaluator names are validated real-time with fuzzy regex matching.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">DISTRIBUTION</span>
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Single-Roll Candidate Allocation</h3>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Deterministically partitions candidate pools per evaluator upon initial roll.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">AUDIT RUBRIC</span>
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white">6 AI Competency Topics</h3>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Prompting, verification, debugging, velocity, agentic design, and security.</p>
                      </div>
                    </div>
                  </section>

                  {/* Section 2: Onboarding & Candidate Roll */}
                  <section
                    id="w1-login"
                    className="p-6 sm:p-8 rounded-3xl border border-amber-500/25 dark:border-amber-500/30 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-2xl shadow-xl space-y-6"
                  >
                    <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-extrabold text-lg border-b border-amber-500/20 pb-3">
                      <Dices className="w-5 h-5 text-amber-500" />
                      <h2>2. Onboarding, Evaluator Login & Candidate Roll Workflow</h2>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                      The candidate assignment engine uses a deterministic single-roll generator to distribute candidates fairly across evaluators. Follow these steps to complete setup:
                    </p>

                    <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                      {/* Step 1 */}
                      <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-500/5 dark:bg-neutral-950/70 border border-amber-500/20">
                        <span className="w-8 h-8 rounded-xl bg-amber-500 text-black font-mono font-extrabold flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">1</span>
                        <div className="space-y-1">
                          <strong className="text-neutral-900 dark:text-white font-bold text-sm block">Select World 1 Workspace</strong>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            On the root portal hub (`/`), click <strong className="text-amber-600 dark:text-amber-400">Enter World 1</strong> on the Wysbryx AI Evaluation card to open the specialized candidate evaluation workspace.
                          </p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-500/5 dark:bg-neutral-950/70 border border-amber-500/20">
                        <span className="w-8 h-8 rounded-xl bg-amber-500 text-black font-mono font-extrabold flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">2</span>
                        <div className="space-y-1.5">
                          <strong className="text-neutral-900 dark:text-white font-bold text-sm block">Enter Evaluator Name (Real-Time Match & Admin Access)</strong>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            Type your full name in the evaluator login input field. The engine provides instant regex matching feedback:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-xs text-neutral-600 dark:text-neutral-400 font-mono pt-1">
                            <li><strong className="text-amber-600 dark:text-amber-400">Real-Time Validation:</strong> Shows live feedback as you type (e.g., <em>"✔ Valid Evaluator Match: Praveen"</em>).</li>
                            <li><strong className="text-amber-500 dark:text-amber-300">Admin Bypass & Super Captain Storyboard:</strong> Evaluators identified as designated leadership (<em>Praveen</em>, <em>Krishna</em>) unlock an <strong>ADMIN SUPER CAPTAIN 👑</strong> badge and open an exclusive storyboard modal with 100% organization roster access.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-500/5 dark:bg-neutral-950/70 border border-amber-500/20">
                        <span className="w-8 h-8 rounded-xl bg-amber-500 text-black font-mono font-extrabold flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">3</span>
                        <div className="space-y-1.5">
                          <strong className="text-neutral-900 dark:text-white font-bold text-sm block">Trigger Candidate Roll Engine (Single-Roll Rule)</strong>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            Click <strong className="text-amber-600 dark:text-amber-400">Roll Assigned Candidates</strong>. The allocation generator initializes an interactive distribution sequence:
                          </p>
                          <div className="p-3.5 rounded-xl bg-neutral-950 border border-amber-500/30 text-[11px] font-mono text-amber-300 space-y-1">
                            <div>[1/4] Initializing Quantum Random Generator...</div>
                            <div>[2/4] Partitioning Employee Pool across Evaluators...</div>
                            <div>[3/4] Verifying Equal Workload Distribution...</div>
                            <div>[4/4] Finalizing Candidate Allocation Commit.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section 3: Workspace */}
                  <section
                    id="w1-workspace"
                    className="p-6 sm:p-8 rounded-3xl border border-amber-500/25 dark:border-amber-500/30 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-2xl shadow-xl space-y-4"
                  >
                    <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-extrabold text-lg border-b border-amber-500/20 pb-3">
                      <FileText className="w-5 h-5 text-amber-500" />
                      <h2>3. How to Conduct an Evaluation</h2>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                      The candidate workspace contains two primary tabs: <strong className="text-amber-600 dark:text-amber-400">Evaluation Editor</strong> (for marking and evidence entry) and <strong className="text-amber-600 dark:text-amber-400">Graphical Analysis</strong> (for live radar charts and executive synthesis).
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                          <FileText className="w-4 h-4" /> Evaluation Editor Tab
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          Enter numeric marks (1-10) for each topic. Record observed evidence and growth recommendations.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                          <BarChart3 className="w-4 h-4" /> Graphical Analysis Tab
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          View real-time radar charts, competency contours, marks breakdown, and auto-generated executive synthesis.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 4: Rubrics */}
                  <section
                    id="w1-rubrics"
                    className="p-6 sm:p-8 rounded-3xl border border-amber-500/25 dark:border-amber-500/30 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-2xl shadow-xl space-y-6"
                  >
                    <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-extrabold text-lg border-b border-amber-500/20 pb-3">
                      <Target className="w-5 h-5 text-amber-500" />
                      <h2>4. Standardized 6 AI Competency Rubrics</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {AUDIT_TOPIC_QUESTIONS.map((q, idx) => (
                        <div
                          key={q.id}
                          className="p-5 rounded-2xl bg-amber-500/5 dark:bg-neutral-950/70 border border-amber-500/20 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                              TOPIC {idx + 1} · {q.category}
                            </span>
                            <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">1 - 10 Marks</span>
                          </div>
                          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{q.parameter}</h3>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">{q.questionText}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Section 5: Grade Tiers & Risk Map */}
                  <section
                    id="w1-grading"
                    className="p-6 sm:p-8 rounded-3xl border border-amber-500/25 dark:border-amber-500/30 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-2xl shadow-xl space-y-6"
                  >
                    <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-extrabold text-lg border-b border-amber-500/20 pb-3">
                      <Award className="w-5 h-5 text-amber-500" />
                      <h2>5. Grade Tiers & Risk Map Boundaries</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          Score: 85 - 100 Marks
                        </span>
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white">AI Master (Verdict: Strong Hire)</h3>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-300">Multi-turn prompting, JSON schemas, system guardrails, zero security breaches.</p>
                      </div>

                      <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          Score: 70 - 84 Marks
                        </span>
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white">AI Power User (Verdict: Hire)</h3>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-300">Strong verification habit, catches type mismatches and boundary cases.</p>
                      </div>

                      <div className="p-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 space-y-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30">
                          Score: 50 - 69 Marks
                        </span>
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white">AI Practitioner (Verdict: Lean Hire)</h3>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-300">Uses basic inline copilot; requires guidance on structured schemas.</p>
                      </div>
                    </div>
                  </section>

                  {/* Section 6: Guidelines */}
                  <section
                    id="w1-guidelines"
                    className="p-6 sm:p-8 rounded-3xl border border-amber-500/25 dark:border-amber-500/30 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-2xl shadow-xl space-y-6"
                  >
                    <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-extrabold text-lg border-b border-amber-500/20 pb-3">
                      <ShieldAlert className="w-5 h-5 text-amber-500" />
                      <h2>6. Evaluator Security & Integrity Guidelines</h2>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 font-mono text-xs">
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-300 font-bold uppercase tracking-wider">
                        <Lock className="w-4 h-4" /> Integrity Directive
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                        Evaluators must log in strictly using their own verified name. Swapping credentials or altering allocation states is prohibited. All evaluation submissions and edits are recorded in audit logs.
                      </p>
                    </div>
                  </section>

                  {/* Section 7: FAQs */}
                  <section
                    id="w1-faq"
                    className="p-6 sm:p-8 rounded-3xl border border-amber-500/25 dark:border-amber-500/30 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-2xl shadow-xl space-y-6"
                  >
                    <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-extrabold text-lg border-b border-amber-500/20 pb-3">
                      <HelpCircle className="w-5 h-5 text-amber-500" />
                      <h2>7. AI Performance Engine FAQs</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-neutral-950/70 border border-amber-500/20 space-y-1">
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Q: Can an evaluator re-roll their candidate pool?</h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">A: No. The single-roll engine locks the assigned pool per session to maintain workload fairness.</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-neutral-950/70 border border-amber-500/20 space-y-1">
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Q: How do Admin Super Captains access all candidates?</h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">A: Leadership evaluators (Praveen, Krishna) automatically bypass single-roll partitioning to inspect 100% of candidates.</p>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {/* =========================================================================
                  WORLD 2 DOCUMENTATION (COMPLETE LEDGER SUITE - PURPLE THEME)
                 ========================================================================= */}
              {!isW1 && (
                <>
                  {/* Section 1: Overview */}
                  <section
                    id="w2-overview"
                    className="p-6 sm:p-8 rounded-3xl border border-purple-500/25 dark:border-purple-500/30 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-2xl shadow-xl space-y-4"
                  >
                    <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400 font-extrabold text-lg border-b border-purple-500/20 pb-3">
                      <Layers className="w-5 h-5 text-purple-500" />
                      <h2>1. World 2: Complete Ledger Performance Suite Overview</h2>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                      World 2 is the comprehensive engineering performance ledger platform. It provides executive leadership with a transparent, non-surveillance evaluation framework to track software engineering performance across 8 weighted core dimensions over a 90-day review cycle.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">PERIODIC REVIEW</span>
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Quarterly 90-Day Cycles</h3>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Evaluates quarterly performance deliverables (Q1, Q2, Q3, Q4) without daily keystroke monitoring.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">WEIGHTED MATH</span>
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white">8 Core Dimensions</h3>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Balanced matrix covering technical mastery, delivery speed, AI usage, and mentorship.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">GOVERNANCE</span>
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Audit Trail Logging</h3>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Every score modification and evaluation submission is logged for enterprise compliance.</p>
                      </div>
                    </div>
                  </section>

                  {/* Section 2: 8 Weighted Parameters */}
                  <section
                    id="w2-parameters"
                    className="p-6 sm:p-8 rounded-3xl border border-purple-500/25 dark:border-purple-500/30 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-2xl shadow-xl space-y-6"
                  >
                    <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400 font-extrabold text-lg border-b border-purple-500/20 pb-3">
                      <Scale className="w-5 h-5 text-purple-500" />
                      <h2>2. The 8 Weighted Evaluation Parameters</h2>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                      Each parameter carries an explicit percentage weight totaling 100%. Scores are rated on a 1-to-5 scale with mandatory evidence documentation:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {EVALUATION_PARAMETERS.map((param) => (
                        <div
                          key={param.key}
                          className="p-4 rounded-2xl bg-purple-500/5 dark:bg-neutral-950/70 border border-purple-500/20 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-neutral-900 dark:text-white">{param.name}</h3>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                              Weight: {param.weight}%
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">{param.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Section 3: Math & Formula */}
                  <section
                    id="w2-math"
                    className="p-6 sm:p-8 rounded-3xl border border-purple-500/25 dark:border-purple-500/30 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-2xl shadow-xl space-y-6"
                  >
                    <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400 font-extrabold text-lg border-b border-purple-500/20 pb-3">
                      <Calculator className="w-5 h-5 text-purple-500" />
                      <h2>3. Mathematical Score Calculation & Grade Boundaries</h2>
                    </div>

                    <div className="p-5 rounded-2xl bg-neutral-950 border border-purple-500/30 text-purple-300 font-mono text-xs space-y-2">
                      <div className="text-purple-400 font-bold uppercase text-[11px] tracking-wider">// OVERALL SCORE MATHEMATICAL FORMULA</div>
                      <div className="text-white text-sm font-bold">
                        Overall Score = ∑ [ (Rating_i / 5) × Weight_i × 100 ]
                      </div>
                      <p className="text-neutral-400 text-xs font-sans">
                        Where <em>Rating_i</em> is the numeric rating (1-5) assigned to parameter <em>i</em>, and <em>Weight_i</em> is the parameter percentage weight (e.g. 0.15 for 15%).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          Score: 95.0 - 100.0
                        </span>
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Outstanding (Grade: A+)</h3>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-300">Exceptional engineering impact and architectural leadership.</p>
                      </div>

                      <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/10 space-y-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                          Score: 90.0 - 94.9
                        </span>
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Excellent (Grade: A)</h3>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-300">Exceeds quarterly goals across all technical parameters.</p>
                      </div>

                      <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 space-y-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                          Score: 85.0 - 89.9
                        </span>
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Very Good (Grade: B+)</h3>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-300">Consistently high code quality and reliable team velocity.</p>
                      </div>
                    </div>
                  </section>

                  {/* Section 4: Workflow */}
                  <section
                    id="w2-workflow"
                    className="p-6 sm:p-8 rounded-3xl border border-purple-500/25 dark:border-purple-500/30 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-2xl shadow-xl space-y-6"
                  >
                    <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400 font-extrabold text-lg border-b border-purple-500/20 pb-3">
                      <FileCheck className="w-5 h-5 text-purple-500" />
                      <h2>4. Evaluation Creation Workflow</h2>
                    </div>

                    <ol className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 list-decimal list-inside font-sans">
                      <li>Navigate to <strong className="text-purple-600 dark:text-purple-400">Evaluations Workspace</strong> or click <strong>New Evaluation</strong>.</li>
                      <li>Select an engineer profile from the central employee database.</li>
                      <li>Rate all 8 parameters on a scale of 1 to 5 stars.</li>
                      <li>Provide mandatory <strong>Evidence & Justification</strong> text for each parameter.</li>
                      <li>Click <strong>Submit Evaluation</strong> to log the scorecard into the immutable ledger database.</li>
                    </ol>
                  </section>

                  {/* Section 5: Audit & Security */}
                  <section
                    id="w2-audit"
                    className="p-6 sm:p-8 rounded-3xl border border-purple-500/25 dark:border-purple-500/30 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-2xl shadow-xl space-y-6"
                  >
                    <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400 font-extrabold text-lg border-b border-purple-500/20 pb-3">
                      <Activity className="w-5 h-5 text-purple-500" />
                      <h2>5. Governance, Audit Trails & System Security</h2>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                      Every evaluation record created or edited is timestamped and written to the <strong>System Audit Logs</strong> (`/audit-logs`) with full admin identity verification, preventing unauthorized score modifications and ensuring transparent organizational governance.
                    </p>
                  </section>
                </>
              )}

            </div>

          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
