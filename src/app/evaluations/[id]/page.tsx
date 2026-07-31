"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { getGradeInfo } from "@/lib/utils";
import { printPDFReport, exportToCSV } from "@/lib/export";
import {
  Printer,
  Download,
  ArrowLeft,
  Award,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  Sparkles,
  Layers,
  Edit3,
} from "lucide-react";

export default function EvaluationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { evaluations } = useAppStore();

  const evalId = params.id as string;
  const evaluation = evaluations.find((e) => e.id === evalId) || evaluations[0];

  if (!evaluation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Evaluation Not Found</h2>
        <Link href="/evaluations" className="mt-4 inline-block text-xs text-indigo-500 font-mono">
          ← Back to evaluations list
        </Link>
      </div>
    );
  }

  const gradeInfo = getGradeInfo(evaluation.overallScore);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:m-0 print:max-w-none">
      {/* Non-printable action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6 print:hidden">
        <button
          onClick={() => router.push("/evaluations")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Evaluations</span>
        </button>

        <div className="flex items-center gap-3">
          <Link
            href={`/evaluations/${evaluation.id}/edit`}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 text-xs font-semibold transition-all shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Evaluation</span>
          </Link>

          <button
            onClick={() => exportToCSV([evaluation], `evaluation_${evaluation.id}.csv`)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => printPDFReport()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90 text-xs font-semibold transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE REPORT CARD CONTAINER */}
      <div className="p-8 sm:p-10 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-2xl space-y-8 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* REPORT HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">
                ENGINEERING EVALUATION REPORT
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {evaluation.quarter} {evaluation.year}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {evaluation.engineerName}
            </h1>
            <p className="text-sm text-neutral-500 font-mono">
              {evaluation.engineerDesignation} • {evaluation.engineerDepartment}
            </p>
          </div>

          {/* OVERALL SCORE DISPLAY */}
          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-right min-w-[200px]">
            <div className="text-[10px] font-mono uppercase text-neutral-400 font-bold">OVERALL SCORE</div>
            <div className="text-3xl font-extrabold font-mono text-neutral-900 dark:text-white mt-0.5">
              {evaluation.overallScore.toFixed(1)} <span className="text-xs font-normal text-neutral-400">/ 100</span>
            </div>
            <div className="mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold ${gradeInfo.bg} ${gradeInfo.color} border ${gradeInfo.border}`}>
                {gradeInfo.grade} — {gradeInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* METADATA GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800/60 text-xs">
          <div>
            <div className="font-mono text-neutral-400 text-[10px]">REVIEWER</div>
            <div className="font-bold text-neutral-900 dark:text-white mt-0.5">{evaluation.reviewerName || evaluation.adminName}</div>
            <div className="text-[10px] text-neutral-500">{evaluation.reviewerRole || "Executive Administrator"}</div>
          </div>

          <div>
            <div className="font-mono text-neutral-400 text-[10px]">EVALUATION DATE</div>
            <div className="font-bold text-neutral-900 dark:text-white mt-0.5">{evaluation.evaluationDate}</div>
          </div>

          <div>
            <div className="font-mono text-neutral-400 text-[10px]">STATUS</div>
            <div className="font-bold text-emerald-500 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {evaluation.status}
            </div>
          </div>

          <div>
            <div className="font-mono text-neutral-400 text-[10px]">REPORT ID</div>
            <div className="font-mono text-neutral-700 dark:text-neutral-300 mt-0.5 text-[11px] truncate">
              {evaluation.id}
            </div>
          </div>
        </div>

        {/* PARAMETERS BREAKDOWN TABLE */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Standardized Parameter Scores & Evidence</span>
          </h2>

          <div className="space-y-4">
            {(evaluation.parameterScores || []).map((ps, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-400">0{idx + 1}</span>
                    <h3 className="font-bold text-xs text-neutral-900 dark:text-white">{ps.parameterName || ps.parameterKey}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-neutral-400">Weight: {ps.weight}%</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-mono font-bold text-xs">
                      {ps.rating} / 5
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="font-mono text-[10px] uppercase text-neutral-400 font-semibold">
                      TECHNICAL EVIDENCE & ARTIFACTS
                    </div>
                    <p className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300 font-mono text-[11px] leading-relaxed border border-neutral-200/40 dark:border-neutral-700/40">
                      {ps.evidenceUrl || ps.evidence || "N/A"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="font-mono text-[10px] uppercase text-neutral-400 font-semibold">
                      IMPROVEMENT & RECOMMENDATIONS
                    </div>
                    <p className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300 text-[11px] leading-relaxed border border-neutral-200/40 dark:border-neutral-700/40">
                      {ps.improvementSuggestion || ps.comments || "Continuous improvement advised."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REVIEWER COMMENTS */}
        <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800/60 space-y-2">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-neutral-500">
            REVIEWER QUALITATIVE SUMMARY
          </h2>
          <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
            "{evaluation.comments}"
          </p>
        </div>
      </div>
    </div>
  );
}
