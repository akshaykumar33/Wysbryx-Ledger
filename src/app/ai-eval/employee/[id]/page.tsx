"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  useAIEvalStore,
  AUDIT_TOPIC_QUESTIONS,
  PerQuestionScore,
} from "@/lib/ai-eval/store";
import { ALL_CANDIDATES } from "@/lib/ai-eval/allocation";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  ArrowLeft,
  Award,
  Target,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Terminal,
  Lightbulb,
  Check,
  Edit3,
  Save,
  Bot,
  Code2,
  MessageSquare,
  FileText,
  BarChart3,
  CircleDot,
  Sparkles,
  Flame,
  Star,
  Zap,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";

// ── Pre-filled demo data for Akash Upadhyay ────────────────────────
const AKASH_SAMPLE_DATA: Record<string, PerQuestionScore> = {
  q_ai_prompting: {
    rating: 8,
    evidence: "Structures multi-turn system prompts with role-playing guardrails. Uses few-shot examples with JSON schema enforcement for structured outputs. Prevents hallucinations by constraining output format and providing explicit context boundaries.",
    observedStrength: "Excellent prompt architecture — consistently uses role + constraints + examples pattern.",
    recommendation: "Share internal prompt template library with team leads for cross-pollination.",
    updatedAt: new Date().toISOString(),
  },
  q_ai_codegen: {
    rating: 7,
    evidence: "Reviews AI-generated code through lint checks and writes boundary-condition unit tests. Does not blindly accept Copilot suggestions — edits variable names, adds error handling, and verifies types.",
    observedStrength: "Strong verification habit — catches type mismatches and edge cases in AI output.",
    recommendation: "Increase coverage of integration tests for AI-generated API handlers.",
    updatedAt: new Date().toISOString(),
  },
  q_ai_debug: {
    rating: 9,
    evidence: "Feeds sanitized stack traces and filtered log payloads to Claude for rapid root cause analysis. Identified a memory leak in WebSocket reconnection logic within 12 minutes using AI-assisted heap dump analysis.",
    observedStrength: "Exceptional debugging velocity — consistently resolves P0 bugs under 20 minutes with AI assist.",
    recommendation: "Document the AI-assisted debugging workflow as a team runbook.",
    updatedAt: new Date().toISOString(),
  },
  q_ai_workflow: {
    rating: 8,
    evidence: "Uses Cursor with Claude 3.5 Sonnet as primary IDE agent. Has custom keyboard shortcuts for inline edits, multi-file refactors, and terminal AI commands. Measures ~3.2x throughput improvement on feature tickets.",
    observedStrength: "3.2x engineering velocity multiplier with deeply integrated AI keyboard workflows.",
    recommendation: "Lead a peer workshop on Cursor power-user techniques and CLI automation.",
    updatedAt: new Date().toISOString(),
  },
  q_ai_systems: {
    rating: 5,
    evidence: "Understands function calling schemas and basic RAG retrieval. Has not yet built autonomous agent loops or multi-step tool-calling pipelines. Familiar with embedding models but hasn't tuned vector databases.",
    observedStrength: "",
    recommendation: "Assign a mentored project building a RAG-based internal knowledge agent.",
    updatedAt: new Date().toISOString(),
  },
  q_ai_security: {
    rating: 8,
    evidence: "Strict compliance with zero-secret policy — scrubs API keys, JWTs, and PII before any LLM prompt. Uses .env abstractions and never hardcodes credentials. Reviews OWASP Top 10 for LLMs quarterly.",
    observedStrength: "Impeccable AI security discipline with zero credential exposure incidents.",
    recommendation: "Lead quarterly AI security audit for the engineering org.",
    updatedAt: new Date().toISOString(),
  },
};

export default function EmployeeEvaluationWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const employeeId = resolvedParams.id;
  const { evaluatorName, getEvaluation, saveEvaluation, evaluations, loadEvaluationsFromServer } = useAIEvalStore();
  const candidate = ALL_CANDIDATES.find((c) => c.id === employeeId);
  const existingEval = getEvaluation(employeeId);

  const [activeTab, setActiveTab] = useState<"audit_report" | "topic_editor">("topic_editor");
  const [status, setStatus] = useState<"Draft" | "Completed" | "In Review">(existingEval?.status || "Draft");
  const [perQuestionScores, setPerQuestionScores] = useState<Record<string, PerQuestionScore>>({});
  const [customSynthesis, setCustomSynthesis] = useState("");
  const [customDecision, setCustomDecision] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadEvaluationsFromServer();
  }, [loadEvaluationsFromServer]);

  useEffect(() => {
    if (existingEval?.scores && Object.keys(existingEval.scores).length > 0) {
      setPerQuestionScores(existingEval.scores);
      setCustomSynthesis(existingEval.executiveSynthesis || "");
      setCustomDecision(existingEval.decisionResult || "");
      setStatus(existingEval.status || "Draft");
    } else if (candidate?.name === "Akash Upadhyay") {
      setPerQuestionScores(AKASH_SAMPLE_DATA);
      setStatus("Completed");
    }
  }, [existingEval, candidate]);

  if (!candidate) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-neutral-300">Candidate Not Found</h2>
        <Link href="/ai-eval" className="mt-4 inline-block text-cyan-400 text-sm underline">Return to Roster</Link>
      </div>
    );
  }

  // ═══ Dynamic Calculations ═══
  const gradedQuestions = AUDIT_TOPIC_QUESTIONS.filter((q) => perQuestionScores[q.id] !== undefined);
  const gradedCount = gradedQuestions.length;
  const totalQuestions = AUDIT_TOPIC_QUESTIONS.length;
  const hasAnyGrades = gradedCount > 0;
  const allGraded = gradedCount === totalQuestions;

  const gradedRatings = gradedQuestions.map((q) => perQuestionScores[q.id]?.rating ?? 0);
  const totalSumMarks = gradedRatings.reduce((a, b) => a + b, 0);
  const maxPossibleMarks = totalQuestions * 10;
  const overallScore = gradedCount > 0 ? Math.round((totalSumMarks / maxPossibleMarks) * 100) : 0;

  let autoDecision: "Strong Hire" | "Hire" | "Lean Hire" | "Lean Reject" | "Reject" = "Lean Hire";
  let autoGrade = "Not Evaluated";
  if (!hasAnyGrades) { autoGrade = "Not Evaluated"; }
  else if (overallScore >= 85) { autoDecision = "Strong Hire"; autoGrade = "AI Master"; }
  else if (overallScore >= 70) { autoDecision = "Hire"; autoGrade = "AI Power User"; }
  else if (overallScore >= 50) { autoDecision = "Lean Hire"; autoGrade = "AI Practitioner"; }
  else if (overallScore >= 35) { autoDecision = "Lean Reject"; autoGrade = "AI Novice"; }
  else { autoDecision = "Reject"; autoGrade = "AI Resistant"; }

  const activeDecision = customDecision || autoDecision;
  const risksCount = gradedQuestions.filter((q) => (perQuestionScores[q.id]?.rating ?? 0) <= 5).length;
  const strengthsList = gradedQuestions.filter((q) => (perQuestionScores[q.id]?.rating ?? 0) >= 7);
  const risksList = gradedQuestions.filter((q) => (perQuestionScores[q.id]?.rating ?? 0) <= 5);

  const radarData = AUDIT_TOPIC_QUESTIONS.map((q) => {
    const graded = perQuestionScores[q.id] !== undefined;
    const m = graded ? (perQuestionScores[q.id]?.rating ?? 0) : 0;
    return { subject: q.parameter.length > 14 ? q.parameter.slice(0, 12) + "…" : q.parameter, fullName: q.parameter, mark: m, score: Math.round((m / 10) * 100), fullMark: 100 };
  });

  const barData = AUDIT_TOPIC_QUESTIONS.map((q) => {
    const graded = perQuestionScores[q.id] !== undefined;
    const m = graded ? (perQuestionScores[q.id]?.rating ?? 0) : 0;
    return { name: q.parameter.length > 14 ? q.parameter.slice(0, 12) + "…" : q.parameter, fullName: q.parameter, marks: m, graded };
  });

  const synthesis = customSynthesis || (hasAnyGrades
    ? `${candidate.name} scored ${overallScore}/100 across ${gradedCount}/${totalQuestions} AI competency dimensions — ${autoGrade}. ${strengthsList.length > 0 ? `Strengths: ${strengthsList.map(q => q.parameter).join(", ")}.` : ""} ${risksList.length > 0 ? `Growth areas: ${risksList.map(q => q.parameter).join(", ")}.` : ""} Verdict: ${activeDecision}.`
    : `No marks entered yet for ${candidate.name}. Use the editor to evaluate each AI competency.`);

  const handleScoreUpdate = (qId: string, field: keyof PerQuestionScore, val: any) => {
    setPerQuestionScores((prev) => ({
      ...prev,
      [qId]: { ...(prev[qId] || { rating: 0, evidence: "", updatedAt: new Date().toISOString() }), [field]: val, updatedAt: new Date().toISOString() },
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    saveEvaluation(employeeId, { status, decisionResult: activeDecision as any, overallScore, percentage: overallScore, grade: autoGrade as any, executiveSynthesis: synthesis, scores: perQuestionScores });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Color helpers
  const mc = (m: number) => m >= 8 ? "text-emerald-400" : m >= 6 ? "text-cyan-400" : m >= 4 ? "text-amber-400" : "text-rose-400";
  const mbg = (m: number) => m >= 8 ? "bg-emerald-500/10 border-emerald-500/20" : m >= 6 ? "bg-cyan-500/10 border-cyan-500/20" : m >= 4 ? "bg-amber-500/10 border-amber-500/20" : "bg-rose-500/10 border-rose-500/20";
  const barFill = (m: number) => m >= 8 ? "#34d399" : m >= 6 ? "#22d3ee" : m >= 4 ? "#fbbf24" : "#f87171";
  const markLabel = (m: number) => m >= 9 ? "Exceptional" : m >= 7 ? "Strong" : m >= 5 ? "Developing" : m >= 3 ? "Weak" : "Critical";
  const pct = overallScore;

  return (
    <div className="space-y-6">

      {/* ═══ CANDIDATE HEADER CARD ═══ */}
      <div className="rounded-2xl border border-white/[0.06] bg-neutral-900/80 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left: Back + Candidate info */}
          <div className="flex items-center gap-4">
            <Link href="/ai-eval" className="p-2.5 rounded-xl bg-neutral-800 border border-white/[0.08] text-neutral-400 hover:text-white hover:border-cyan-500/40 transition-all group shrink-0">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <img src={candidate.avatarSeed} alt="" className="w-11 h-11 rounded-xl border border-white/[0.08] bg-neutral-800 p-0.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-base font-bold text-white tracking-tight">{candidate.name}</h1>
                {hasAnyGrades && (
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${
                    overallScore >= 70 ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/25" : overallScore >= 50 ? "bg-amber-500/10 text-amber-300 border-amber-500/25" : "bg-rose-500/10 text-rose-400 border-rose-500/25"
                  }`}>{autoGrade}</span>
                )}
              </div>
              <p className="text-xs font-mono text-neutral-500 mt-0.5">{candidate.role} · {candidate.department}</p>
            </div>
          </div>

          {/* Right: Status + Save */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="w-36">
              <CustomSelect
                options={[{ value: "Draft", label: "Draft" }, { value: "In Review", label: "In Review" }, { value: "Completed", label: "Completed" }]}
                value={status} onChange={(v) => setStatus(v as any)} showAppleIcon={true}
              />
            </div>
            <button onClick={handleSave} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              isSaved ? "bg-emerald-500 text-black" : "bg-cyan-500 text-black hover:bg-cyan-400"
            }`}>
              {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isSaved ? "Saved!" : "Save"}
            </button>
          </div>
        </div>

        {/* Score Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 pt-5 border-t border-white/[0.06]">
          {/* Circular Score */}
          <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
            <div className="relative w-14 h-14 shrink-0">
              <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
                <circle cx="28" cy="28" r="23" fill="none" stroke="currentColor" className="text-neutral-800" strokeWidth="4" />
                <circle cx="28" cy="28" r="23" fill="none"
                  stroke={hasAnyGrades ? (pct >= 70 ? "#22d3ee" : pct >= 50 ? "#fbbf24" : "#f87171") : "transparent"}
                  strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${(pct / 100) * 144.5} 144.5`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-extrabold font-mono ${hasAnyGrades ? "text-white" : "text-neutral-700"}`}>{pct}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-neutral-500 uppercase">Score</div>
              <div className="text-xs font-mono text-neutral-400">{totalSumMarks}/{maxPossibleMarks}</div>
            </div>
          </div>

          {/* Stat cards */}
          {[
            { label: "Graded", value: `${gradedCount}/${totalQuestions}`, icon: FileText, color: "text-cyan-400" },
            { label: "Grade", value: autoGrade, icon: Award, color: "text-violet-400" },
            { label: "Strengths", value: `${strengthsList.length}`, icon: Zap, color: "text-emerald-400" },
            { label: "Risks", value: `${risksCount}`, icon: AlertTriangle, color: risksCount > 0 ? "text-rose-400" : "text-neutral-600" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
              <s.icon className={`w-4 h-4 ${s.color} shrink-0`} />
              <div>
                <div className="text-[10px] font-mono text-neutral-500 uppercase">{s.label}</div>
                <div className={`text-xs font-bold font-mono truncate max-w-[120px] ${hasAnyGrades ? "text-neutral-200" : "text-neutral-600"}`}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ TABS ═══ */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-900 border border-white/[0.06] w-fit">
        {[
          { key: "topic_editor" as const, label: "Evaluation Editor", icon: Edit3 },
          { key: "audit_report" as const, label: "Graphical Analysis", icon: BarChart3 },
        ].map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === t.key ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25" : "text-neutral-500 hover:text-neutral-300 border border-transparent"
          }`}>
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            {t.key === "topic_editor" && !allGraded && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/20">{gradedCount}/{totalQuestions}</span>
            )}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════
          EVALUATION EDITOR TAB
         ═══════════════════════════════════════════════════ */}
      {activeTab === "topic_editor" && (
        <div className="space-y-4">
          {/* Synthesis */}
          <div className="rounded-2xl border border-white/[0.06] bg-neutral-900/60 p-5 space-y-3">
            <label className="text-[11px] font-mono font-semibold text-cyan-400 uppercase flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Executive Synthesis
              <span className="text-neutral-600 font-normal normal-case ml-1">· auto-generated or custom</span>
            </label>
            <textarea
              value={synthesis} onChange={(e) => setCustomSynthesis(e.target.value)} rows={2}
              placeholder="Auto-populates from your marks and evidence below..."
              className="w-full p-3.5 rounded-xl bg-neutral-950 border border-white/[0.06] text-xs text-neutral-200 font-mono focus:outline-none focus:border-cyan-500/40 leading-relaxed placeholder:text-neutral-700 transition-colors resize-none"
            />
          </div>

          {/* Topic Cards */}
          {AUDIT_TOPIC_QUESTIONS.map((q, idx) => {
            const s = perQuestionScores[q.id];
            const graded = s !== undefined;
            const marks = s?.rating ?? 0;

            return (
              <motion.div key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03, duration: 0.25 }}
                className={`rounded-2xl border overflow-hidden transition-all ${graded ? "border-white/[0.08] bg-neutral-900/80" : "border-dashed border-white/[0.06] bg-neutral-900/40"}`}
              >
                {/* Top accent bar */}
                <div className={`h-0.5 ${graded ? (marks >= 8 ? "bg-emerald-500" : marks >= 6 ? "bg-cyan-500" : marks >= 4 ? "bg-amber-500" : "bg-rose-500") : "bg-neutral-800"}`} />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold shrink-0 mt-0.5 border ${
                        graded ? `${mbg(marks)} ${mc(marks)}` : "bg-neutral-800/50 text-neutral-600 border-white/[0.08]"
                      }`}>{idx + 1}</div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                          {q.parameter}
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-neutral-500 bg-neutral-800 border border-white/[0.08]">{q.category}</span>
                        </h4>
                        <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">{q.questionText}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <input type="number" min={1} max={10} value={graded ? marks : ""} placeholder="—"
                        onChange={(e) => { const v = e.target.value; if (v === "") return; handleScoreUpdate(q.id, "rating", Math.min(10, Math.max(1, Number(v)))); }}
                        className={`w-14 h-9 rounded-lg bg-neutral-950 border text-center font-bold font-mono text-base focus:outline-none transition-colors ${
                          graded ? `${mc(marks)} border-white/[0.08] focus:border-cyan-500` : "text-neutral-700 border-white/[0.06]"
                        }`}
                      />
                      <span className="text-[11px] font-mono text-neutral-600">/10</span>
                      {graded && <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold border ${mbg(marks)} ${mc(marks)}`}>{markLabel(marks)}</span>}
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                    <div className="lg:col-span-3 space-y-1.5">
                      <label className="text-[10px] font-mono font-semibold text-cyan-400/70 uppercase flex items-center gap-1"><Terminal className="w-3 h-3" /> Evidence & Comments</label>
                      <textarea value={s?.evidence ?? ""} onChange={(e) => handleScoreUpdate(q.id, "evidence", e.target.value)} rows={3}
                        placeholder={`How does ${candidate.name} demonstrate AI competency in ${q.parameter.toLowerCase()}?`}
                        className="w-full p-3 rounded-lg bg-neutral-950 border border-white/[0.06] text-xs text-neutral-200 font-mono focus:outline-none focus:border-cyan-500/40 leading-relaxed placeholder:text-neutral-700 resize-none"
                      />
                    </div>
                    <div className="lg:col-span-2 space-y-2.5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-semibold text-emerald-400/70 uppercase flex items-center gap-1"><Star className="w-3 h-3" /> Observed Strength</label>
                        <input type="text" value={s?.observedStrength ?? ""} onChange={(e) => handleScoreUpdate(q.id, "observedStrength", e.target.value)}
                          placeholder={q.defaultStrength || "What stood out..."} className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/[0.06] text-xs text-neutral-200 font-mono focus:outline-none focus:border-emerald-500/40 placeholder:text-neutral-700"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-semibold text-violet-400/70 uppercase flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Recommendation</label>
                        <input type="text" value={s?.recommendation ?? ""} onChange={(e) => handleScoreUpdate(q.id, "recommendation", e.target.value)}
                          placeholder={q.defaultRecommendation || "Growth suggestion..."} className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/[0.06] text-xs text-neutral-200 font-mono focus:outline-none focus:border-violet-500/40 placeholder:text-neutral-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          GRAPHICAL ANALYSIS TAB
         ═══════════════════════════════════════════════════ */}
      {activeTab === "audit_report" && (
        <div className="space-y-5">
          {!hasAnyGrades ? (
            <div className="rounded-2xl border border-dashed border-white/[0.08] p-14 text-center space-y-4">
              <BarChart3 className="w-10 h-10 text-neutral-700 mx-auto" />
              <h3 className="text-base font-bold text-neutral-400">No Evaluation Data</h3>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto">Switch to the <strong className="text-cyan-400">Evaluation Editor</strong> and grade each topic. Charts populate dynamically.</p>
              <button onClick={() => setActiveTab("topic_editor")} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-all">
                <Edit3 className="w-3.5 h-3.5" /> Start Evaluating
              </button>
            </div>
          ) : (
            <>
              {/* Synthesis */}
              <div className="rounded-2xl border border-white/[0.06] bg-neutral-900/60 p-6 space-y-4">
                <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-cyan-400 uppercase tracking-wider"><Sparkles className="w-3.5 h-3.5" /> Executive Synthesis</div>
                
                {/* Structured headline */}
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="text-xl font-bold text-white tracking-tight">{candidate.name}</span>
                  <span className="text-sm text-neutral-400">scored</span>
                  <span className={`text-xl font-extrabold font-mono ${overallScore >= 70 ? "text-cyan-400" : overallScore >= 50 ? "text-amber-400" : "text-rose-400"}`}>{overallScore}/100</span>
                  <span className="text-sm text-neutral-400">across</span>
                  <span className="text-sm font-mono text-neutral-300">{gradedCount}/{totalQuestions} dimensions</span>
                  <span className="text-sm text-neutral-500">—</span>
                  <span className={`text-sm font-bold ${overallScore >= 70 ? "text-cyan-400" : overallScore >= 50 ? "text-amber-300" : "text-rose-400"}`}>{autoGrade}</span>
                </div>

                {/* Strengths & Growth pills */}
                <div className="flex flex-wrap gap-3">
                  {strengthsList.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase">Strengths:</span>
                      {strengthsList.map((q) => (
                        <span key={q.id} className="px-2 py-0.5 rounded-md text-[11px] font-mono text-emerald-300 bg-emerald-500/8 border border-emerald-500/15">{q.parameter}</span>
                      ))}
                    </div>
                  )}
                  {risksList.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-semibold text-amber-400 uppercase">Growth:</span>
                      {risksList.map((q) => (
                        <span key={q.id} className="px-2 py-0.5 rounded-md text-[11px] font-mono text-amber-300 bg-amber-500/8 border border-amber-500/15">{q.parameter}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Verdict */}
                <div className="flex items-center gap-3 pt-2 border-t border-white/[0.04]">
                  <span className="text-[10px] font-mono font-semibold text-neutral-500 uppercase">Verdict</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold font-mono border ${
                    activeDecision === "Strong Hire" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    activeDecision === "Hire" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                    activeDecision === "Lean Hire" ? "bg-amber-500/10 text-amber-300 border-amber-500/20" :
                    "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}>{activeDecision}</span>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Radar */}
                <div className="rounded-2xl border border-white/[0.06] bg-neutral-900/60 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-semibold text-neutral-400 uppercase">Competency Contour</span>
                    <Bot className="w-4 h-4 text-cyan-400/60" />
                  </div>
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                        <PolarGrid stroke="#262626" />
                        <PolarAngleAxis dataKey="subject" stroke="#404040" tick={{ fill: "#a3a3a3", fontSize: 9, fontWeight: 600 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#262626" tick={{ fontSize: 8, fill: "#525252" }} />
                        <Radar name="AI Marks" dataKey="score" stroke="#22d3ee" fill="url(#radarG)" fillOpacity={0.5} strokeWidth={2} />
                        <defs>
                          <linearGradient id="radarG" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.08} />
                          </linearGradient>
                        </defs>
                        <RechartsTooltip contentStyle={{ backgroundColor: "#171717", borderColor: "#262626", borderRadius: "10px", fontSize: "11px", color: "#fff" }}
                          formatter={(v: any, _: any, p: any) => [`${p.payload.mark}/10 (${v}%)`, p.payload.fullName]} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bar */}
                <div className="rounded-2xl border border-white/[0.06] bg-neutral-900/60 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-semibold text-neutral-400 uppercase">Marks Per Topic</span>
                    <span className="text-[10px] font-mono text-neutral-600">{gradedCount}/{totalQuestions}</span>
                  </div>
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 12 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                        <XAxis type="number" domain={[0, 10]} stroke="#262626" tick={{ fill: "#737373", fontSize: 10 }} />
                        <YAxis type="category" dataKey="name" stroke="none" tick={{ fill: "#a3a3a3", fontSize: 10 }} width={100} />
                        <RechartsTooltip contentStyle={{ backgroundColor: "#171717", borderColor: "#262626", borderRadius: "10px", fontSize: "11px", color: "#fff" }}
                          formatter={(v: any, _: any, p: any) => [`${v}/10`, p.payload.fullName]} />
                        <Bar dataKey="marks" radius={[0, 6, 6, 0]} barSize={14}>
                          {barData.map((e, i) => <Cell key={i} fill={e.graded ? barFill(e.marks) : "#1a1a1a"} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="rounded-2xl border border-white/[0.06] bg-neutral-900/60 p-5 space-y-4">
                <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-cyan-400 uppercase"><TrendingUp className="w-3.5 h-3.5" /> Marks Breakdown</div>
                <div className="space-y-3 text-xs font-mono">
                  {AUDIT_TOPIC_QUESTIONS.map((q) => {
                    const graded = perQuestionScores[q.id] !== undefined;
                    const m = graded ? (perQuestionScores[q.id]?.rating ?? 0) : 0;
                    const p = Math.round((m / 10) * 100);
                    return (
                      <div key={q.id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-300 font-medium flex items-center gap-2">
                            <CircleDot className={`w-3 h-3 ${graded ? mc(m) : "text-neutral-800"}`} /> {q.parameter}
                          </span>
                          <span className={graded ? mc(m) : "text-neutral-700"}>{graded ? `${m}/10 (${p}%)` : "—"}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden relative">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p}%`, backgroundColor: graded ? barFill(m) : "transparent" }} />
                          <div className="absolute top-0 bottom-0 left-[85%] w-px bg-neutral-700" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strengths & Risks */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-white/[0.06] bg-neutral-900/60 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-emerald-400 uppercase"><Flame className="w-3.5 h-3.5" /> Strengths (≥ 7)</div>
                  {strengthsList.length === 0 ? <p className="text-xs text-neutral-600 font-mono italic">No topics ≥ 7 yet.</p> : (
                    <div className="space-y-2">
                      {strengthsList.map((q) => { const s = perQuestionScores[q.id]; return (
                        <div key={q.id} className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 space-y-1">
                          <div className="text-xs font-bold font-mono text-emerald-400">{q.parameter} — {s?.rating}/10</div>
                          {s?.evidence && <p className="text-[11px] text-neutral-400 font-mono leading-relaxed">• {s.evidence}</p>}
                          {s?.observedStrength && <p className="text-[11px] text-emerald-300/70 font-mono">⚡ {s.observedStrength}</p>}
                        </div>
                      ); })}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-neutral-900/60 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-rose-400 uppercase"><ShieldAlert className="w-3.5 h-3.5" /> Risks (≤ 5)</div>
                  {risksList.length === 0 ? <p className="text-xs text-emerald-400/70 font-mono italic">✔ All graded topics above 5.</p> : (
                    <div className="space-y-2">
                      {risksList.map((q) => { const s = perQuestionScores[q.id]; return (
                        <div key={q.id} className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/15 flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <div className="text-xs font-bold font-mono text-rose-300">{q.parameter} — {s?.rating}/10</div>
                            {s?.evidence && <p className="text-[11px] text-neutral-400 font-mono">• {s.evidence}</p>}
                            {s?.recommendation && <p className="text-[11px] text-amber-300/70 font-mono">💡 {s.recommendation}</p>}
                          </div>
                        </div>
                      ); })}
                    </div>
                  )}
                </div>
              </div>

              {/* Evidence Table */}
              <div className="rounded-2xl border border-white/[0.06] bg-neutral-900/60 p-5 space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-cyan-400 uppercase"><Code2 className="w-3.5 h-3.5" /> Evidence & Marks Table</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/[0.06] text-[10px] text-neutral-500 uppercase">
                        <th className="py-2.5 px-3 w-8">#</th>
                        <th className="py-2.5 px-3">Topic</th>
                        <th className="py-2.5 px-3 w-16">Marks</th>
                        <th className="py-2.5 px-3">Evidence</th>
                        <th className="py-2.5 px-3">Strength</th>
                        <th className="py-2.5 px-3">Rec.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {AUDIT_TOPIC_QUESTIONS.map((q, i) => {
                        const s = perQuestionScores[q.id]; const g = s !== undefined;
                        return (
                          <tr key={q.id} className={g ? "hover:bg-neutral-800/30" : "opacity-30"}>
                            <td className="py-2.5 px-3 text-neutral-600">{i + 1}</td>
                            <td className="py-2.5 px-3 text-white font-semibold whitespace-nowrap">{q.parameter}</td>
                            <td className="py-2.5 px-3">{g ? <span className={`font-bold ${mc(s.rating)}`}>{s.rating}/10</span> : <span className="text-neutral-700">—</span>}</td>
                            <td className="py-2.5 px-3 text-neutral-400 max-w-[200px] truncate cursor-default" title={s?.evidence || ""}>{s?.evidence || "—"}</td>
                            <td className="py-2.5 px-3 text-emerald-300/60 max-w-[120px] truncate cursor-default" title={s?.observedStrength || ""}>{s?.observedStrength || "—"}</td>
                            <td className="py-2.5 px-3 text-violet-300/60 max-w-[120px] truncate cursor-default" title={s?.recommendation || ""}>{s?.recommendation || "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
