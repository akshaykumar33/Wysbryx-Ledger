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

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8 pb-16 px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero Banner */}
        <div className="p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 backdrop-blur-xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">PLATFORM OPERATING GUIDELINES</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Wysbryx Platform Guidelines
              </h1>
            </div>

            {/* World Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shrink-0">
              <button
                onClick={() => {
                  setActiveTab("world1");
                  setActiveSection("w1-overview");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "world1"
                    ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Bot className="w-4 h-4 text-orange-500" />
                <span>World 1: AI Engine</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("world2");
                  setActiveSection("w2-overview");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "world2"
                    ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Layers className="w-4 h-4 text-purple-500" />
                <span>World 2: Complete Ledger</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
            Welcome to the official operating guide for the Wysbryx Platform. Switch between <strong className="text-orange-600 dark:text-orange-400">World 1 (AI Performance Engine)</strong> and <strong className="text-purple-600 dark:text-purple-400">World 2 (Complete Ledger Suite)</strong> above to inspect rubrics, evaluation workflows, and score formulas.
          </p>
        </div>

        {/* Layout Grid: Sticky Toc + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 space-y-4">
            <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 backdrop-blur-xl shadow-xs">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 px-1">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>Table of Contents</span>
                <span className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                  activeTab === "world1" ? "bg-orange-500/10 text-orange-600 dark:text-orange-400" : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                }`}>
                  {activeTab}
                </span>
              </div>

              <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0 scrollbar-none">
                {currentSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`shrink-0 lg:w-full text-left px-3 py-2 rounded-xl text-xs transition-all font-medium whitespace-nowrap lg:whitespace-normal ${
                      activeSection === sec.id
                        ? activeTab === "world1"
                          ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 font-bold border border-orange-500/25"
                          : "bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/25"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                    }`}
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 px-1 mt-3">
                <Link
                  href={activeTab === "world1" ? "/ai-eval" : "/complete-eval"}
                  className={`flex items-center justify-between w-full p-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeTab === "world1"
                      ? "bg-orange-500 text-black hover:bg-orange-400"
                      : "bg-purple-600 text-white hover:bg-purple-500"
                  }`}
                >
                  <span>Launch {activeTab === "world1" ? "World 1" : "World 2"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-10">
            
            {/* =========================================================================
                WORLD 1 DOCUMENTATION (USER-LEVEL WORKFLOWS & AI RUBRICS)
               ========================================================================= */}
            {activeTab === "world1" && (
              <>
                {/* Section 1: Overview */}
                <section id="w1-overview" className="p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 backdrop-blur-xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-lg border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    <Bot className="w-5 h-5" />
                    <h2>1. World 1: AI Performance Evaluation Engine</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                    World 1 is a specialized evaluation workspace designed to assess how engineers adopt, leverage, and verify AI tools in their daily software development lifecycle.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/15 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase">IDENTIFIER</span>
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Smart Match Login</h3>
                      <p className="text-[11px] text-neutral-500">Evaluator names are validated real-time with fuzzy regex matching.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/15 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase">DISTRIBUTION</span>
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Single-Roll Candidate Allocation</h3>
                      <p className="text-[11px] text-neutral-500">Deterministically partitions candidate pools per evaluator upon initial roll.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/15 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase">AUDIT RUBRIC</span>
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-white">6 AI Competency Topics</h3>
                      <p className="text-[11px] text-neutral-500">Prompting, verification, debugging, velocity, agentic design, and security.</p>
                    </div>
                  </div>
                </section>

                {/* Section 2: Onboarding & Candidate Roll */}
                <section id="w1-login" className="p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 backdrop-blur-xl shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-lg border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    <Dices className="w-5 h-5" />
                    <h2>2. Onboarding, Evaluator Login & Candidate Roll Workflow</h2>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                    The candidate assignment system uses a deterministic single-roll engine to distribute candidates fairly across evaluators. Follow these 4 steps to get started:
                  </p>

                  <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    {/* Step 1 */}
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800">
                      <span className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 font-mono font-extrabold flex items-center justify-center shrink-0 border border-orange-500/25">1</span>
                      <div className="space-y-1">
                        <strong className="text-neutral-900 dark:text-white font-bold text-sm block">Select World 1 Environment</strong>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          On the root portal hub (`/`), click <strong className="text-orange-600 dark:text-orange-400">Enter World 1</strong> on the Wysbryx AI Evaluation card to enter the specialized candidate evaluation workspace.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800">
                      <span className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 font-mono font-extrabold flex items-center justify-center shrink-0 border border-orange-500/25">2</span>
                      <div className="space-y-1.5">
                        <strong className="text-neutral-900 dark:text-white font-bold text-sm block">Enter Evaluator Name (Real-Time Match & Admin Access)</strong>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          Type your full name in the evaluator login input field. The engine provides instant regex matching feedback:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-xs text-neutral-600 dark:text-neutral-400 font-mono pt-1">
                          <li><strong className="text-orange-600 dark:text-orange-400">Real-Time Validation:</strong> Shows live feedback as you type (e.g., <em>"✔ Valid Evaluator Match: Praveen"</em>).</li>
                          <li><strong className="text-amber-600 dark:text-amber-400">Admin Bypass & Super Captain Storyboard:</strong> Evaluators identified as designated leadership (<em>Praveen</em>, <em>Krishna</em>) unlock an <strong>ADMIN SUPER CAPTAIN 👑</strong> badge and pop open an exclusive storyboard modal with full organization roster access.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800">
                      <span className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 font-mono font-extrabold flex items-center justify-center shrink-0 border border-orange-500/25">3</span>
                      <div className="space-y-1.5">
                        <strong className="text-neutral-900 dark:text-white font-bold text-sm block">Trigger Candidate Roll Engine (Single-Roll Rule)</strong>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          Click <strong className="text-orange-600 dark:text-orange-400">Roll Assigned Candidates</strong>. The allocation generator initializes an interactive distribution sequence:
                        </p>
                        <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-orange-300 space-y-1">
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
                <section id="w1-workspace" className="p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 backdrop-blur-xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-lg border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    <FileText className="w-5 h-5" />
                    <h2>3. How to Conduct an Evaluation</h2>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                    The candidate workspace contains two primary tabs: <strong className="text-orange-600 dark:text-orange-400">Evaluation Editor</strong> (for marking and evidence entry) and <strong className="text-orange-600 dark:text-orange-400">Graphical Analysis</strong> (for live scorecard review).
                  </p>
                </section>

                {/* Section 4: Rubrics */}
                <section id="w1-rubrics" className="p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 backdrop-blur-xl shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-lg border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    <Target className="w-5 h-5" />
                    <h2>4. Standardized 6 AI Competency Rubrics</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {AUDIT_TOPIC_QUESTIONS.map((q, idx) => (
                      <div key={q.id} className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                            TOPIC {idx + 1} · {q.category}
                          </span>
                          <span className="text-xs font-mono text-neutral-500 font-bold">1 - 10 Marks</span>
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{q.parameter}</h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">{q.questionText}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* =========================================================================
                WORLD 2 DOCUMENTATION (COMPLETE LEDGER SUITE - FULL EXPANDED)
               ========================================================================= */}
            {activeTab === "world2" && (
              <>
                {/* Section 1: Overview */}
                <section id="w2-overview" className="p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 backdrop-blur-xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-lg border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    <Layers className="w-5 h-5" />
                    <h2>1. World 2: Complete Ledger Performance Suite Overview</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                    World 2 is the comprehensive engineering performance ledger platform. It provides executive leadership with a transparent, non-surveillance evaluation framework to track software engineering performance across 8 weighted core dimensions over a 90-day review cycle.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/15 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">PERIODIC REVIEW</span>
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Quarterly 90-Day Cycles</h3>
                      <p className="text-[11px] text-neutral-500">Evaluates quarterly performance deliverables (Q1, Q2, Q3, Q4) without daily keystroke monitoring.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/15 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">WEIGHTED MATH</span>
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-white">8 Core Dimensions</h3>
                      <p className="text-[11px] text-neutral-500">Balanced matrix covering technical mastery, delivery speed, AI usage, and mentorship.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/15 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">GOVERNANCE</span>
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Audit Trail Logging</h3>
                      <p className="text-[11px] text-neutral-500">Every score modification and evaluation submission is logged for enterprise compliance.</p>
                    </div>
                  </div>
                </section>

                {/* Section 2: 8 Weighted Parameters */}
                <section id="w2-parameters" className="p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 backdrop-blur-xl shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-lg border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    <Scale className="w-5 h-5" />
                    <h2>2. The 8 Weighted Evaluation Parameters</h2>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                    Each parameter carries an explicit percentage weight totaling 100%. Scores are rated on a 1-to-5 scale with mandatory evidence documentation:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {EVALUATION_PARAMETERS.map((param) => (
                      <div key={param.key} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-neutral-900 dark:text-white">{param.name}</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            Weight: {param.weight}%
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans">{param.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 3: Math & Formula */}
                <section id="w2-math" className="p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 backdrop-blur-xl shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-lg border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    <Calculator className="w-5 h-5" />
                    <h2>3. Mathematical Score Calculation & Grade Boundaries</h2>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 text-purple-300 font-mono text-xs space-y-2">
                    <div className="text-purple-400 font-bold uppercase text-[11px] tracking-wider">// OVERALL SCORE MATHEMATICAL FORMULA</div>
                    <div className="text-white text-sm font-bold">
                      Overall Score = ∑ [ (Rating_i / 5) × Weight_i × 100 ]
                    </div>
                    <p className="text-neutral-400 text-xs font-sans">
                      Where <em>Rating_i</em> is the numeric rating (1-5) assigned to parameter <em>i</em>, and <em>Weight_i</em> is the parameter percentage weight (e.g. 0.15 for 15%).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        Score: 95.0 - 100.0
                      </span>
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Outstanding (Grade: A+)</h3>
                      <p className="text-[11px] text-neutral-500">Exceptional engineering impact and architectural leadership.</p>
                    </div>

                    <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/5 space-y-1">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                        Score: 90.0 - 94.9
                      </span>
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Excellent (Grade: A)</h3>
                      <p className="text-[11px] text-neutral-500">Exceeds quarterly goals across all technical parameters.</p>
                    </div>

                    <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 space-y-1">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                        Score: 85.0 - 89.9
                      </span>
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Very Good (Grade: B+)</h3>
                      <p className="text-[11px] text-neutral-500">Consistently high code quality and reliable team velocity.</p>
                    </div>
                  </div>
                </section>

                {/* Section 4: Workflow */}
                <section id="w2-workflow" className="p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 backdrop-blur-xl shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-lg border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    <FileCheck className="w-5 h-5" />
                    <h2>4. Evaluation Creation Workflow</h2>
                  </div>

                  <ol className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 list-decimal list-inside font-sans">
                    <li>Navigate to <strong className="text-purple-600 dark:text-purple-400">Evaluations Workspace</strong> or click <strong>New Evaluation</strong>.</li>
                    <li>Select an engineer profile from the central employee database.</li>
                    <li>Rate all 8 parameters on a scale of 1 to 5 stars.</li>
                    <li>Provide mandatory <strong>Evidence & Justification</strong> text for each parameter.</li>
                    <li>Click <strong>Submit Evaluation</strong> to log the scorecard into the immutable ledger database.</li>
                  </ol>
                </section>

                {/* Section 5: Audit & Security */}
                <section id="w2-audit" className="p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 backdrop-blur-xl shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-lg border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    <Activity className="w-5 h-5" />
                    <h2>5. Governance, Audit Trails & System Security</h2>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                    Every evaluation record created or edited is timestamped and written to the <strong>System Audit Logs</strong> (`/audit-logs`) with full admin identity verification, preventing unauthorized score modifications and ensuring transparent organizational governance.
                  </p>
                </section>
              </>
            )}

          </div>

        </div>

      </div>
    </PageWrapper>
  );
}
