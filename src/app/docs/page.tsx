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
    { id: "w2-overview", title: "1. Ledger Platform Overview" },
    { id: "w2-parameters", title: "2. 8 Weighted Parameters" },
    { id: "w2-math", title: "3. Score & Grade Calculations" },
    { id: "w2-workflow", title: "4. Legacy Evaluation Workflow" },
    { id: "w2-audit", title: "5. Governance & Audit Trails" },
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
        <div className="p-6 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-6">
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
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 shrink-0">
              <button
                onClick={() => {
                  setActiveTab("world1");
                  setActiveSection("w1-overview");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "world1"
                    ? "bg-orange-500/15 text-orange-400 border border-orange-500/30 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Bot className="w-4 h-4 text-orange-400" />
                <span>World 1: AI Engine</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("world2");
                  setActiveSection("w2-overview");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "world2"
                    ? "bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Layers className="w-4 h-4 text-purple-400" />
                <span>World 2: Complete Ledger</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
            Welcome to the official operating guide for the Wysbryx Platform. Switch between <strong className="text-orange-400">World 1 (AI Performance Engine)</strong> and <strong className="text-purple-400">World 2 (Complete Ledger Suite)</strong> above to inspect rubrics, evaluation workflows, and score formulas.
          </p>
        </div>

        {/* Layout Grid: Sticky Toc + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 space-y-4">
            <div className="p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-xs">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 px-1">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>Table of Contents</span>
                <span className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                  activeTab === "world1" ? "bg-orange-500/10 text-orange-400" : "bg-purple-500/10 text-purple-400"
                }`}>
                  {activeTab}
                </span>
              </div>

              <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0">
                {currentSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`shrink-0 lg:w-full text-left px-3 py-2 rounded-xl text-xs transition-all font-medium whitespace-nowrap lg:whitespace-normal ${
                      activeSection === sec.id
                        ? activeTab === "world1"
                          ? "bg-orange-500/15 text-orange-400 font-bold border border-orange-500/25"
                          : "bg-purple-500/15 text-purple-400 font-bold border border-purple-500/25"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                    }`}
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>

              <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 px-1 mt-3">
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
                <section id="w1-overview" className="p-6 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-orange-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <Bot className="w-5 h-5" />
                    <h2>1. World 1: AI Performance Evaluation Engine</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                    World 1 is a specialized evaluation workspace designed to assess how engineers adopt, leverage, and verify AI tools in their daily software development lifecycle.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/15 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-orange-400 uppercase">IDENTIFIER</span>
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Smart Match Login</h3>
                      <p className="text-[11px] text-neutral-500">Evaluator names are validated real-time with fuzzy regex matching.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/15 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-orange-400 uppercase">DISTRIBUTION</span>
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Single-Roll Candidate Allocation</h3>
                      <p className="text-[11px] text-neutral-500">Deterministically partitions candidate pools per evaluator upon initial roll.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/15 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-orange-400 uppercase">AUDIT RUBRIC</span>
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-white">6 AI Competency Topics</h3>
                      <p className="text-[11px] text-neutral-500">Prompting, verification, debugging, velocity, agentic design, and security.</p>
                    </div>
                  </div>
                </section>

                {/* Section 2: Onboarding & Candidate Roll */}
                <section id="w1-login" className="p-6 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-orange-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <Dices className="w-5 h-5" />
                    <h2>2. Onboarding, Evaluator Login & Candidate Roll Workflow</h2>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                    The candidate assignment system uses a deterministic single-roll engine to distribute candidates fairly across evaluators. Follow these 4 steps to get started:
                  </p>

                  <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    {/* Step 1 */}
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-neutral-800">
                      <span className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-400 font-mono font-extrabold flex items-center justify-center shrink-0 border border-orange-500/25">1</span>
                      <div className="space-y-1">
                        <strong className="text-neutral-900 dark:text-white font-bold text-sm block">Select World 1 Environment</strong>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          On the root portal hub (`/`), click <strong className="text-orange-400">Enter World 1</strong> on the Wysbryx AI Evaluation card to enter the specialized candidate evaluation workspace.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-neutral-800">
                      <span className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-400 font-mono font-extrabold flex items-center justify-center shrink-0 border border-orange-500/25">2</span>
                      <div className="space-y-1.5">
                        <strong className="text-neutral-900 dark:text-white font-bold text-sm block">Enter Evaluator Name (Real-Time Match & Admin Access)</strong>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          Type your full name in the evaluator login input field. The engine provides instant regex matching feedback:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-xs text-neutral-400 font-mono pt-1">
                          <li><strong className="text-orange-400">Real-Time Validation:</strong> Shows live feedback as you type (e.g., <em>"✔ Valid Evaluator Match: Praveen"</em>).</li>
                          <li><strong className="text-amber-400">Admin Bypass & Super Captain Storyboard:</strong> Evaluators identified as designated leadership (<em>Praveen</em>, <em>Krishna</em>) unlock an <strong>ADMIN SUPER CAPTAIN 👑</strong> badge and pop open an exclusive storyboard modal with full organization roster access.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-neutral-800">
                      <span className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-400 font-mono font-extrabold flex items-center justify-center shrink-0 border border-orange-500/25">3</span>
                      <div className="space-y-1.5">
                        <strong className="text-neutral-900 dark:text-white font-bold text-sm block">Trigger Candidate Roll Engine (Single-Roll Rule)</strong>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          Click <strong className="text-orange-400">Roll Assigned Candidates</strong>. The allocation generator initializes an interactive distribution sequence:
                        </p>
                        <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-orange-300 space-y-1">
                          <div>[1/4] Initializing Quantum Random Generator...</div>
                          <div>[2/4] Partitioning Employee Pool across Evaluators...</div>
                          <div>[3/4] Verifying Equal Workload Distribution...</div>
                          <div>[4/4] Finalizing Candidate Allocation Commit.</div>
                        </div>
                        <p className="text-[11px] text-amber-400/90 font-mono">
                          ⚡ <strong>Single-Roll Guarantee:</strong> Candidate allocation is permanent per evaluator. Once rolled, your assigned candidates remain assigned to your profile across logins.
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-neutral-800">
                      <span className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-400 font-mono font-extrabold flex items-center justify-center shrink-0 border border-orange-500/25">4</span>
                      <div className="space-y-1">
                        <strong className="text-neutral-900 dark:text-white font-bold text-sm block">Access Your Candidate Roster & Open Workspace</strong>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          Your assigned candidate cards (e.g. <em>Akash Upadhyay</em>, <em>Sophia Chen</em>) will render on the main dashboard. Filter by department or evaluation status, then click <strong className="text-orange-400">AI Audit</strong> to open the candidate's workspace.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3: Workspace & Marks */}
                <section id="w1-workspace" className="p-6 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-orange-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <FileText className="w-5 h-5" />
                    <h2>3. How to Conduct an Evaluation (Step-by-Step)</h2>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                    The candidate workspace contains two primary tabs: <strong className="text-orange-400">Evaluation Editor</strong> (for marking and evidence entry) and <strong className="text-orange-400">Graphical Analysis</strong> (for live scorecard review).
                  </p>

                  <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 font-mono text-xs">
                    <div className="text-orange-400 font-bold uppercase tracking-wider">// EVALUATOR DATA ENTRY STEPS</div>
                    <ol className="space-y-2 text-neutral-300 list-decimal list-inside">
                      <li>Select an AI topic card (e.g. <em>Prompt Engineering & Context</em>).</li>
                      <li>Enter a numerical mark between <strong>1 and 10</strong> in the score input field.</li>
                      <li>Write observed evidence in the <strong>Evidence & Comments</strong> field (e.g. prompt templates used, zero-shot guardrails, type check verifications).</li>
                      <li>Highlight a notable <strong>Observed Strength</strong> (optional).</li>
                      <li>Add a constructive <strong>Recommendation</strong> for developer growth.</li>
                      <li>Click <strong>Save</strong> at the top right to persist all updates.</li>
                    </ol>
                  </div>
                </section>

                {/* Section 4: 6 Rubrics */}
                <section id="w1-rubrics" className="p-6 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-orange-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <Target className="w-5 h-5" />
                    <h2>4. Standardized 6 AI Competency Rubrics</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {AUDIT_TOPIC_QUESTIONS.map((q, idx) => (
                      <div key={q.id} className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            TOPIC {idx + 1} · {q.category}
                          </span>
                          <span className="text-xs font-mono text-neutral-400 font-bold">1 - 10 Marks</span>
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{q.parameter}</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed font-sans">{q.questionText}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 5: Grade Tiers & Risk Map */}
                <section id="w1-grading" className="p-6 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-orange-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <Award className="w-5 h-5" />
                    <h2>5. Grade Tiers & Risk Classification</h2>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                    Total marks earned across all 6 topics out of 60 total points are mapped to an overall percentage and auto-calculated grade level:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        85% - 100%
                      </span>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white">AI Master / Agentic Architect</h3>
                      <p className="text-xs text-neutral-500">Verdict: <strong>Strong Hire</strong> · Risk: <strong>Low Risk</strong></p>
                    </div>

                    <div className="p-4 rounded-2xl border border-orange-500/30 bg-orange-500/5 space-y-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        70% - 84%
                      </span>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white">AI Power User</h3>
                      <p className="text-xs text-neutral-500">Verdict: <strong>Hire</strong> · Risk: <strong>Low Risk</strong></p>
                    </div>

                    <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        50% - 69%
                      </span>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white">AI Practitioner</h3>
                      <p className="text-xs text-neutral-500">Verdict: <strong>Lean Hire</strong> · Risk: <strong>Moderate Risk</strong></p>
                    </div>
                  </div>
                </section>

                {/* Section 6: Guidelines */}
                <section id="w1-guidelines" className="p-6 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-orange-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <ShieldCheck className="w-5 h-5" />
                    <h2>6. Evaluator Guidelines (Do&apos;s & Don&apos;ts)</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                      <div className="flex items-center gap-2 font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Recommended Practice (Do&apos;s)
                      </div>
                      <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300 list-disc list-inside">
                        <li>Describe specific AI prompts and tools used (Cursor, Claude, Copilot).</li>
                        <li>Highlight engineering velocity (e.g. 3.2x feature ticket acceleration).</li>
                        <li>Provide actionable growth recommendations for any rubric under 7.</li>
                        <li>Verify zero secrets or API keys are exposed in prompt contexts.</li>
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                      <div className="flex items-center gap-2 font-bold text-rose-400">
                        <XCircle className="w-4 h-4" /> Anti-Patterns to Avoid (Don&apos;ts)
                      </div>
                      <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300 list-disc list-inside">
                        <li>Do not leave evidence text fields blank or write generic statements.</li>
                        <li>Do not score code generation high if code is accepted without unit tests.</li>
                        <li>Do not penalize candidates for using AI tools to eliminate boilerplate.</li>
                        <li>Do not mark reviews as Completed without grading all 6 topics.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 7: FAQs */}
                <section id="w1-faq" className="p-6 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-orange-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <HelpCircle className="w-5 h-5" />
                    <h2>7. Frequently Asked Questions</h2>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-neutral-800 space-y-1">
                      <strong className="text-neutral-900 dark:text-white font-bold block">Q: How do I switch between World 1 and World 2?</strong>
                      <p>Click the <span className="text-orange-400 font-bold">Switch to World 1</span> or <span className="text-purple-400 font-bold">Switch to World 2</span> button in the top navigation header or floating dock on any page.</p>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* =========================================================================
                WORLD 2 DOCUMENTATION (COMPLETE LEDGER SUITE)
               ========================================================================= */}
            {activeTab === "world2" && (
              <>
                <section id="w2-overview" className="p-6 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <Layers className="w-5 h-5" />
                    <h2>1. World 2: Complete Ledger Performance Suite</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                    World 2 is the full legacy engineering performance ledger platform. It assesses engineering performance across 8 weighted core dimensions over a full 90-day cycle horizon.
                  </p>
                </section>

                <section id="w2-parameters" className="p-6 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <Scale className="w-5 h-5" />
                    <h2>2. The 8 Weighted Evaluation Parameters</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {EVALUATION_PARAMETERS.map((param) => (
                      <div key={param.key} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-neutral-900 dark:text-white">{param.name}</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            Weight: {param.weight}%
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 font-sans">{param.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

          </div>

        </div>

      </div>
    </PageWrapper>
  );
}
