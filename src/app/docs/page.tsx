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
  Code2,
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
import { Badge } from "@/components/ui/Badge";

export default function PlatformDocumentationPage() {
  const [activeTab, setActiveTab] = React.useState<"world1" | "world2">("world1");
  const [activeSection, setActiveSection] = React.useState("w1-overview");

  const w1Sections = [
    { id: "w1-overview", title: "1. AI Engine Overview" },
    { id: "w1-login", title: "2. Evaluator Login & Candidate Roll" },
    { id: "w1-workspace", title: "3. Evaluation Workspace & Marks" },
    { id: "w1-rubrics", title: "4. The 6 AI Competency Rubrics" },
    { id: "w1-grading", title: "5. Grade Tiers & Risk Classification" },
    { id: "w1-analytics", title: "6. Graphical Analysis & Scorecards" },
    { id: "w1-guidelines", title: "7. Evaluator Dos & Don'ts" },
    { id: "w1-faq", title: "8. World 1 FAQ" },
  ];

  const w2Sections = [
    { id: "w2-overview", title: "1. World 2 Platform Philosophy" },
    { id: "w2-roles", title: "2. Governance Roles & Privileges" },
    { id: "w2-scoring", title: "3. 8-Parameter Weighted Math" },
    { id: "w2-bias", title: "4. Recency Bias Prevention" },
    { id: "w2-examples", title: "5. Good vs Poor Evidence Examples" },
    { id: "w2-faq", title: "6. World 2 FAQ" },
  ];

  const currentSections = activeTab === "world1" ? w1Sections : w2Sections;

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div className="border-b border-neutral-200/80 dark:border-neutral-800/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              PLATFORM OPERATING GUIDE
            </span>
            <span className="text-xs font-mono text-neutral-500 font-semibold">• USER WORKFLOWS & RUBRICS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white mt-2 tracking-tight">
            Wysbryx Intelligence Guidelines
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-3xl leading-relaxed">
            Step-by-step evaluator workflows, candidate allocation rules, AI competency rubrics, weighted scoring math, and evidence guidelines.
          </p>
        </div>

        {/* World Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0">
          <button
            onClick={() => { setActiveTab("world1"); setActiveSection("w1-overview"); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "world1"
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-xs"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>World 1: AI Engine</span>
          </button>
          <button
            onClick={() => { setActiveTab("world2"); setActiveSection("w2-overview"); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "world2"
                ? "bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-xs"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>World 2: Complete Ledger</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sticky Table of Contents Sidebar */}
        <div className="lg:col-span-3">
          <div className="p-4 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm sticky top-20 space-y-3">
            <div className="flex items-center justify-between px-3 pt-1">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-400">
                NAVIGATION INDEX
              </span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                activeTab === "world1" ? "bg-cyan-500/10 text-cyan-400" : "bg-purple-500/10 text-purple-400"
              }`}>
                {activeTab === "world1" ? "WORLD 1" : "WORLD 2"}
              </span>
            </div>

            <nav className="space-y-1">
              {currentSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all font-medium ${
                    activeSection === sec.id
                      ? activeTab === "world1"
                        ? "bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/25"
                        : "bg-purple-500/15 text-purple-400 font-bold border border-purple-500/25"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </nav>

            <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 px-1">
              <Link
                href={activeTab === "world1" ? "/ai-eval" : "/complete-eval"}
                className={`flex items-center justify-between w-full p-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeTab === "world1"
                    ? "bg-cyan-500 text-black hover:bg-cyan-400"
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
              <section id="w1-overview" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <Bot className="w-5 h-5" />
                  <h2>1. World 1: AI Performance Evaluation Engine</h2>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                  World 1 is a specialized evaluation workspace designed to assess how engineers adopt, leverage, and verify AI tools in their daily software development lifecycle.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/15 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">IDENTIFIER</span>
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Smart Match Login</h3>
                    <p className="text-[11px] text-neutral-500">Evaluator names are validated real-time with fuzzy regex matching.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/15 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">DISTRIBUTION</span>
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Single-Roll Candidate Allocation</h3>
                    <p className="text-[11px] text-neutral-500">Deterministically partitions candidate pools per evaluator upon initial roll.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/15 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">AUDIT RUBRIC</span>
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white">6 AI Competency Topics</h3>
                    <p className="text-[11px] text-neutral-500">Prompting, verification, debugging, velocity, agentic design, and security.</p>
                  </div>
                </div>
              </section>

              {/* Section 2: Login & Roll */}
              <section id="w1-login" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <UserCheck className="w-5 h-5" />
                  <h2>2. Evaluator Authentication & Candidate Allocation Workflow</h2>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0">1</span>
                    <div>
                      <strong className="text-neutral-900 dark:text-white block font-bold mb-0.5">Enter Evaluator Name:</strong>
                      Type your full name on the World 1 main roster page (`/ai-eval`). The system will provide real-time matching feedback. Admin access is automatically granted for designated leadership profiles (Praveen, Krishna).
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0">2</span>
                    <div>
                      <strong className="text-neutral-900 dark:text-white block font-bold mb-0.5">Trigger Single-Roll Allocation:</strong>
                      Click <strong className="text-cyan-400">Roll Assigned Candidates</strong>. The allocation generator distributes candidates across evaluators cleanly. Your allocation state persists permanently.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0">3</span>
                    <div>
                      <strong className="text-neutral-900 dark:text-white block font-bold mb-0.5">Access Candidate Evaluation Card:</strong>
                      Your assigned candidate cards will appear on the dashboard. Click <strong className="text-cyan-400">AI Audit</strong> to open the interactive candidate workspace.
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: Workspace & Marks */}
              <section id="w1-workspace" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <FileText className="w-5 h-5" />
                  <h2>3. How to Conduct an Evaluation (Step-by-Step)</h2>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                  The candidate workspace contains two primary tabs: <strong className="text-cyan-400">Evaluation Editor</strong> (for marking and evidence entry) and <strong className="text-cyan-400">Graphical Analysis</strong> (for live scorecard review).
                </p>

                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 font-mono text-xs">
                  <div className="text-cyan-400 font-bold uppercase tracking-wider">// EVALUATOR DATA ENTRY STEPS</div>
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
              <section id="w1-rubrics" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <Target className="w-5 h-5" />
                  <h2>4. Standardized 6 AI Competency Rubrics</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AUDIT_TOPIC_QUESTIONS.map((q, idx) => (
                    <div key={q.id} className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          TOPIC #{idx + 1}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 font-bold">1 - 10 MARKS</span>
                      </div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{q.parameter}</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed font-sans">{q.questionText}</p>
                      <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-400">
                        <strong>Evaluation Focus:</strong> {q.evaluationCriteria}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 5: Grade Tiers */}
              <section id="w1-grading" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <Award className="w-5 h-5" />
                  <h2>5. Grade Tiers & Automatic Risk Classification</h2>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  The overall score is computed as the total percentage of marks earned across all graded topics out of 60 possible points:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      85 - 100 MARKS
                    </span>
                    <h3 className="text-xs font-bold text-white">AI Master / Agentic Architect</h3>
                    <p className="text-[11px] text-neutral-400">Verdict: <strong>Strong Hire</strong> · Risk: <strong>Low Risk (Passed)</strong></p>
                  </div>

                  <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 space-y-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      70 - 84 MARKS
                    </span>
                    <h3 className="text-xs font-bold text-white">AI Power User</h3>
                    <p className="text-[11px] text-neutral-400">Verdict: <strong>Hire</strong> · Risk: <strong>Low Risk (Passed)</strong></p>
                  </div>

                  <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      50 - 69 MARKS
                    </span>
                    <h3 className="text-xs font-bold text-white">AI Practitioner</h3>
                    <p className="text-[11px] text-neutral-400">Verdict: <strong>Lean Hire</strong> · Risk: <strong>Moderate Risk (Needs Training)</strong></p>
                  </div>

                  <div className="p-4 rounded-2xl border border-orange-500/30 bg-orange-500/5 space-y-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                      35 - 49 MARKS
                    </span>
                    <h3 className="text-xs font-bold text-white">AI Novice</h3>
                    <p className="text-[11px] text-neutral-400">Verdict: <strong>Lean Reject</strong> · Risk: <strong>Moderate Risk (Needs Training)</strong></p>
                  </div>

                  <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      &lt; 35 MARKS
                    </span>
                    <h3 className="text-xs font-bold text-white">AI Resistant</h3>
                    <p className="text-[11px] text-neutral-400">Verdict: <strong>Reject</strong> · Risk: <strong>High Risk (Critical Review)</strong></p>
                  </div>
                </div>
              </section>

              {/* Section 6: Analytics */}
              <section id="w1-analytics" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <BarChart3 className="w-5 h-5" />
                  <h2>6. Graphical Analysis Dashboard Breakdown</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-cyan-400">
                      <Sparkles className="w-4 h-4" />
                      <span>Executive Synthesis Card</span>
                    </div>
                    <p className="text-neutral-400 leading-relaxed text-[11px]">
                      Structured top summary displaying candidate name, score, grade badge, strength pills, growth pills, and decision verdict.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-cyan-400">
                      <BarChart3 className="w-4 h-4" />
                      <span>Radar & Horizontal Bar Charts</span>
                    </div>
                    <p className="text-neutral-400 leading-relaxed text-[11px]">
                      Polygon contour chart visualizes overall skill shape, while the horizontal bar chart plots exact marks per topic.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-400">
                      <Flame className="w-4 h-4" />
                      <span>Strengths Panel (≥ 7 Marks)</span>
                    </div>
                    <p className="text-neutral-400 leading-relaxed text-[11px]">
                      Automatically filters and highlights topics where the candidate earned 7 or more marks.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-rose-400">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Risks Panel (≤ 5 Marks)</span>
                    </div>
                    <p className="text-neutral-400 leading-relaxed text-[11px]">
                      Identifies competency areas scoring 5 or lower, attaching growth recommendations.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 7: Guidelines */}
              <section id="w1-guidelines" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <FileCheck className="w-5 h-5" />
                  <h2>7. Evaluator Guidelines (Dos & Don'ts)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>DO'S (RECOMMENDED EVALUATOR PRACTICE)</span>
                    </div>
                    <ul className="space-y-2 text-neutral-300 list-disc list-inside font-sans leading-relaxed">
                      <li>Describe specific AI prompts, tools (Cursor, Claude, Copilot), or test verifications.</li>
                      <li>Highlight concrete velocity gains (e.g. 3x speedup on feature refactoring).</li>
                      <li>Include actionable growth recommendations for topics below 7 marks.</li>
                      <li>Verify zero credential/secret leak discipline in LLM prompts.</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                      <XCircle className="w-4 h-4" />
                      <span>DON'TS (ANTI-PATTERNS TO AVOID)</span>
                    </div>
                    <ul className="space-y-2 text-neutral-300 list-disc list-inside font-sans leading-relaxed">
                      <li>Don't leave evidence text blank or use generic phrases like "uses AI well".</li>
                      <li>Don't score candidate code without checking for type-safety and unit tests.</li>
                      <li>Don't penalize candidates for using AI tools to accelerate repetitive boilerplate.</li>
                      <li>Don't mark an evaluation as Completed without reviewing all 6 rubrics.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 8: FAQ */}
              <section id="w1-faq" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <HelpCircle className="w-5 h-5" />
                  <h2>8. World 1 Evaluator FAQ</h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <strong className="text-white block font-bold">Q: Will my saved evaluations persist if I switch browsers or computers?</strong>
                    <p>Yes. Every evaluation saved in World 1 is synced to your backend cloud database automatically.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <strong className="text-white block font-bold">Q: How do I switch back to World 2?</strong>
                    <p>Click the <span className="text-purple-400 font-bold">Switch to World 2</span> button in the top navigation header anytime.</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* =========================================================================
              WORLD 2 DOCUMENTATION (COMPLETE LEDGER SUITE GUIDELINES)
             ========================================================================= */}
          {activeTab === "world2" && (
            <>
              {/* Section 1 */}
              <section id="w2-overview" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <Layers className="w-5 h-5" />
                  <h2>1. World 2: Complete Engineering Ledger Philosophy</h2>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                  World 2 is the comprehensive executive evaluation suite designed to eliminate recency bias and measure engineering talent across 8 standardized parameters.
                </p>
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium">
                  <strong>Zero Surveillance Guarantee:</strong> No keystroke tracking or camera monitoring. Evaluations are based 100% on explicit deliverables, PR artifacts, and peer collaboration.
                </div>
              </section>

              {/* Section 2 */}
              <section id="w2-roles" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <ShieldCheck className="w-5 h-5" />
                  <h2>2. Governance Roles & Responsibilities</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">ROLE</span>
                    <h3 className="text-sm font-bold text-white">Executive Administrator</h3>
                    <p className="text-neutral-400">Oversees org-wide evaluation cycles, configures metric weights, and manages system governance.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">ROLE</span>
                    <h3 className="text-sm font-bold text-white">Engineering Captain</h3>
                    <p className="text-neutral-400">Conducts quarterly team evaluations, attaches PR proof links, and holds 1-on-1 growth reviews.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">ROLE</span>
                    <h3 className="text-sm font-bold text-white">Engineer</h3>
                    <p className="text-neutral-400">Transparent access to view personal scorecards, radar charts, and skill gap roadmaps.</p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="w2-scoring" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <Scale className="w-5 h-5" />
                  <h2>3. Standardized 8-Parameter Weighted Scoring</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {EVALUATION_PARAMETERS.map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white">{p.name}</h3>
                        <Badge variant="brand">{p.weight}%</Badge>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-sans">{p.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 4 */}
              <section id="w2-bias" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <Lock className="w-5 h-5" />
                  <h2>4. Recency Bias & Arbitrary Rating Prevention</h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <strong className="text-white block font-bold">1. Mandatory Deliverable Proof:</strong> Ratings cannot be saved without attached PR links or architecture specs.
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <strong className="text-white block font-bold">2. Full 90-Day Evaluation Horizon:</strong> Evaluators review deliverables across the entire quarter rather than recent weeks.
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="w2-examples" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <Code2 className="w-5 h-5" />
                  <h2>5. Examples of Good vs Poor Evidence Notes</h2>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                    <div className="text-emerald-400 font-bold">✓ EXCELLENT EVIDENCE EXAMPLE</div>
                    <div className="text-neutral-300">
                      "Engineered zero-downtime database migration for user sessions (PR #402). Reduced API response latency by 35ms across 2M daily requests."
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
                    <div className="text-rose-400 font-bold">✗ POOR EVIDENCE EXAMPLE</div>
                    <div className="text-neutral-300">
                      "Good developer, works fast and does good work."
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section id="w2-faq" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <HelpCircle className="w-5 h-5" />
                  <h2>6. World 2 FAQ</h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <strong className="text-white block font-bold">Q: How do I switch to World 1 (AI Evaluation Engine)?</strong>
                    <p>Click the <span className="text-cyan-400 font-bold">Switch to World 1</span> button in the top navigation header or floating dock.</p>
                  </div>
                </div>
              </section>
            </>
          )}

        </div>
      </div>
    </PageWrapper>
  );
}
