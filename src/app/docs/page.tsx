"use client";

import * as React from "react";
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
} from "lucide-react";
import { EVALUATION_PARAMETERS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = React.useState("why-exists");

  const sections = [
    { id: "why-exists", title: "1. Why This Platform Exists" },
    { id: "target-audience", title: "2. Target Audience & Roles" },
    { id: "scoring-math", title: "3. Evaluation & Scoring Math" },
    { id: "grade-tiers", title: "4. Grade Tiers & Ranking Rules" },
    { id: "bias-prevention", title: "5. Bias Prevention Principles" },
    { id: "captain-rules", title: "6. Captain Responsibilities (Dos & Don'ts)" },
    { id: "good-vs-poor", title: "7. Examples of Good vs. Poor Evaluations" },
    { id: "parameters-spec", title: "8. Standardized Parameters Spec" },
    { id: "faq", title: "9. Documentation FAQ" },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-neutral-200/80 dark:border-neutral-800/80 pb-6">
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          DOCUMENTATION & METHODOLOGY
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white mt-2 tracking-tight">
          Platform Architecture & Evaluation Rules
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-3xl leading-relaxed">
          Comprehensive guide to conducting objective, evidence-backed engineering talent evaluations, calculating weighted scores, preventing bias, and guiding continuous team growth.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Table of Contents Sticky Sidebar */}
        <div className="lg:col-span-3">
          <div className="p-4 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm sticky top-20 space-y-2">
            <div className="text-[10px] font-mono font-bold uppercase text-neutral-400 px-3 py-1">
              TABLE OF CONTENTS
            </div>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all font-medium ${
                    activeSection === sec.id
                      ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-10">
          {/* Section 1 */}
          <section id="why-exists" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <Sparkles className="w-5 h-5" />
              <h2>1. Why This Platform Exists</h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              The primary purpose of Wysbryx Intel is <strong className="text-neutral-900 dark:text-white">NOT employee surveillance</strong>. We reject keystroke monitoring, idle screen tracking, and intrusive micromanagement metrics.
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              Instead, this platform provides Engineering Captains and tech leads with a standardized, data-driven framework to evaluate engineers fairly, consistently, and transparently based on high-level impact, technical depth, and team collaboration.
            </p>
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 text-primary text-xs leading-relaxed font-medium">
              <strong>Core Philosophy:</strong> Evaluations are meant to identify strengths, illuminate growth opportunities, justify promotions transparently, and build personal development roadmaps.
            </div>
          </section>

          {/* Section 2 */}
          <section id="target-audience" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-primary font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <ShieldCheck className="w-5 h-5" />
              <h2>2. Target Audience & Governance Roles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">ADMINISTRATOR</span>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Admin Privileges</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">Manages overall evaluation cycles, creates team structures, configures parameter weights, views organization-wide analytics, and exports reports.</p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">ENGINEERING CAPTAIN</span>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Captain Privileges</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">Evaluates team members, conducts quarterly calibration sessions, provides improvement feedback, and tracks team growth timelines.</p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">REVIEWER</span>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Reviewer Privileges</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">Submits peer evaluations and technical parameter ratings supported by specific project evidence.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="scoring-math" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-primary font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <Terminal className="w-5 h-5" />
              <h2>3. Evaluation & Weighted Scoring Math</h2>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Every evaluation scores 8 core parameters on a scale of 1 to 5. Each parameter is assigned a specific percentage weight totaling 100%.
            </p>

            <div className="p-4 rounded-2xl bg-neutral-900 text-white font-mono text-xs overflow-x-auto space-y-1">
              <div className="text-neutral-400">// Overall Score Calculation Formula</div>
              <div className="text-primary font-bold">Overall Score = ∑ [ (Rating / 5.0) × Parameter Weight × 100 ]</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400">
                    <th className="py-2.5 px-3">PARAMETER</th>
                    <th className="py-2.5 px-3">CATEGORY</th>
                    <th className="py-2.5 px-3 text-center">WEIGHT</th>
                    <th className="py-2.5 px-3 text-center">MAX POINTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {EVALUATION_PARAMETERS.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-2.5 px-3 font-bold text-neutral-900 dark:text-white">{p.name}</td>
                      <td className="py-2.5 px-3 text-neutral-500">{p.category}</td>
                      <td className="py-2.5 px-3 text-center text-primary font-bold">{p.weight}%</td>
                      <td className="py-2.5 px-3 text-center text-neutral-400">{p.weight} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 */}
          <section id="grade-tiers" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-primary font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <Scale className="w-5 h-5" />
              <h2>4. Grade Tiers & Ranking Rules</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                <Badge variant="success">A+ (95 - 100)</Badge>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white mt-1">Outstanding Impact</h3>
                <p className="text-[11px] text-neutral-500">Sets industry benchmarks, drives architectural vision.</p>
              </div>

              <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-1">
                <Badge variant="indigo">A (90 - 94)</Badge>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white mt-1">Excellent Execution</h3>
                <p className="text-[11px] text-neutral-500">Exceeds sprint goals, delivers high-quality code.</p>
              </div>

              <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 space-y-1">
                <Badge variant="indigo">B+ (85 - 89)</Badge>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white mt-1">Very Good Performance</h3>
                <p className="text-[11px] text-neutral-500">Consistently solid, autonomous problem solver.</p>
              </div>

              <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-1">
                <Badge variant="warning">B (75 - 84)</Badge>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white mt-1">Good Solid Contributor</h3>
                <p className="text-[11px] text-neutral-500">Meets expectations, reliable team contributor.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="bias-prevention" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <Lock className="w-5 h-5" />
              <h2>5. Bias Prevention Principles</h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 space-y-1">
                <strong className="text-neutral-900 dark:text-white">1. Mandatory PR & Spec Proof:</strong> Every rating must be accompanied by explicit links to pull requests, architecture documents, or test suite spikes.
              </div>
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 space-y-1">
                <strong className="text-neutral-900 dark:text-white">2. Recency Bias Mitigation:</strong> Evaluations review the full 90-day quarter rather than just the last 2 weeks before review.
              </div>
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 space-y-1">
                <strong className="text-neutral-900 dark:text-white">3. Multi-Metric Balance:</strong> Pure coding volume is balanced with team mentorship, code quality, and responsible AI usage.
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="captain-rules" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-primary font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <FileCheck className="w-5 h-5" />
              <h2>6. Captain Responsibilities (Dos & Don'ts)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>DO'S (BEST PRACTICES)</span>
                </div>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300 list-disc list-inside">
                  <li>Provide concrete evidence links for ratings.</li>
                  <li>Highlight specific strengths and actionable growth steps.</li>
                  <li>Schedule 1-on-1 feedback sessions to discuss results.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                  <XCircle className="w-4 h-4" />
                  <span>DON'TS (ANTI-PATTERNS)</span>
                </div>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300 list-disc list-inside">
                  <li>Don't submit generic ratings without explanation.</li>
                  <li>Don't let recent incidents override 90-day impact.</li>
                  <li>Don't use evaluations as a surprise disciplinary tool.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="good-vs-poor" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <Code2 className="w-5 h-5" />
              <h2>7. Examples of Good vs. Poor Evaluations</h2>
            </div>
            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <div className="text-emerald-500 font-bold">✓ EXCELLENT EVALUATION EVIDENCE EXAMPLE</div>
                <div className="text-neutral-700 dark:text-neutral-300">
                  "Engineered zero-downtime database migration for user sessions (PR #402). Reduced API response latency by 35ms across 2M daily requests."
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
                <div className="text-rose-500 font-bold">✗ POOR EVALUATION EVIDENCE EXAMPLE</div>
                <div className="text-neutral-700 dark:text-neutral-300">
                  "Good developer, works fast and does good work."
                </div>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section id="parameters-spec" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-primary font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <Layers className="w-5 h-5" />
              <h2>8. Standardized Parameters Breakdown</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EVALUATION_PARAMETERS.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white">{p.name}</h3>
                    <Badge variant="brand">{p.weight}%</Badge>
                  </div>
                  <p className="text-[11px] text-neutral-500">{p.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 9 */}
          <section id="faq" className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <HelpCircle className="w-5 h-5" />
              <h2>9. Documentation FAQ</h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <div>
                <strong className="text-neutral-900 dark:text-white">Q: How often are evaluations conducted?</strong>
                <p className="mt-1">Quarterly (every 90 days) with calibration reviews prior to score finalization.</p>
              </div>
              <div>
                <strong className="text-neutral-900 dark:text-white">Q: Can an engineer request a score review?</strong>
                <p className="mt-1">Yes, engineers can request calibration reviews within 14 days of evaluation release.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
}
