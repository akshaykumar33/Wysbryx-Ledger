"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { EVALUATION_PARAMETERS } from "@/lib/constants";
import { getGradeInfo } from "@/lib/utils";
import { ParameterRadarChart } from "@/components/dashboard/ParameterRadarChart";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  UserCheck,
  Building,
} from "lucide-react";

export default function EngineerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { engineers, evaluations } = useAppStore();

  const engId = params.id as string;
  const engineer = (engineers || []).find((e) => e.id === engId) || engineers[0];

  if (!engineer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Engineer Profile Not Found</h2>
        <button onClick={() => router.push("/engineers")} className="mt-4 text-xs text-indigo-500 font-mono">
          ← Return to Engineers Directory
        </button>
      </div>
    );
  }

  const engineerEvals = (evaluations || []).filter((e) => e.engineerId === engineer.id);
  const latestEval = engineerEvals[0] || evaluations[0];

  const gradeInfo = getGradeInfo(engineer.avgScore || 0);

  // Parameter Radar Data for this specific engineer
  const radarData = React.useMemo(() => {
    return EVALUATION_PARAMETERS.map((p) => {
      const ps = latestEval?.parameterScores?.find((x) => x.parameterKey === p.key || x.parameterId === p.key);
      const rating = ps ? ps.rating : 4;
      return {
        parameter: p.name.split(" ")[0],
        score: (rating / 5) * 100,
        fullMark: 100,
      };
    });
  }, [latestEval]);

  // Strengths & Weaknesses derivation
  const strengths = React.useMemo(() => {
    if (!latestEval?.parameterScores) return [];
    return [...latestEval.parameterScores]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [latestEval]);

  const weaknesses = React.useMemo(() => {
    if (!latestEval?.parameterScores) return [];
    return [...latestEval.parameterScores]
      .sort((a, b) => a.rating - b.rating)
      .slice(0, 2);
  }, [latestEval]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link */}
      <div>
        <button
          onClick={() => router.push("/engineers")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Engineers Directory</span>
        </button>
      </div>

      {/* Profile Header Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={engineer.photoUrl}
            alt={engineer.fullName}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-md border-2 border-white dark:border-neutral-800"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {engineer.employeeId}
              </span>
              <span className="text-[10px] font-mono text-emerald-500 font-semibold">• {engineer.status}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {engineer.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-mono">
              {engineer.designation} • {engineer.departmentName}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-neutral-600 dark:text-neutral-400">
              <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Manager: {engineer.managerName || (engineer as any).captainName || "Executive Administrator"}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-purple-400" /> Joined {engineer.joiningDate}</span>
              <span>•</span>
              <span className="font-mono text-neutral-800 dark:text-neutral-200 font-semibold">{engineer.experienceYears.toFixed(1)} yrs experience</span>
            </div>
          </div>
        </div>

        {/* Score Pill */}
        <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-right min-w-[180px]">
          <div className="text-[10px] font-mono uppercase text-neutral-400 font-bold">CALIBRATED SCORE</div>
          <div className="text-3xl font-extrabold font-mono text-neutral-900 dark:text-white mt-0.5">
            {(engineer.avgScore || 0).toFixed(1)} <span className="text-xs font-normal text-neutral-400">/ 100</span>
          </div>
          <div className="mt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold ${gradeInfo.bg} ${gradeInfo.color} border ${gradeInfo.border}`}>
              {gradeInfo.grade} — {gradeInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Radar Chart & Strengths / Weaknesses */}
        <div className="lg:col-span-7 space-y-6">
          <ParameterRadarChart data={radarData} />

          {/* Strengths & Weaknesses Analysis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>TOP STRENGTHS</span>
              </div>
              <div className="space-y-2">
                {strengths.length === 0 ? (
                  <div className="text-xs text-neutral-400 font-mono py-2">No evaluation evidence recorded yet.</div>
                ) : (
                  strengths.map((s, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-emerald-500/20 text-xs">
                      <div className="font-semibold text-neutral-900 dark:text-white flex items-center justify-between">
                        <span>{s.parameterName || s.parameterKey}</span>
                        <span className="font-mono text-emerald-500 font-bold">{s.rating} / 5</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 font-mono">{s.evidenceUrl || s.evidence || "Verified deliverable impact."}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Weaknesses / Growth Areas */}
            <div className="p-5 rounded-2xl border border-orange-500/30 bg-orange-500/5 space-y-3">
              <div className="flex items-center gap-2 text-orange-500 font-bold text-xs font-mono">
                <AlertTriangle className="w-4 h-4" />
                <span>GROWTH OPPORTUNITIES</span>
              </div>
              <div className="space-y-2">
                {weaknesses.length === 0 ? (
                  <div className="text-xs text-neutral-400 font-mono py-2">No evaluation feedback recorded yet.</div>
                ) : (
                  weaknesses.map((w, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-orange-500/20 text-xs">
                      <div className="font-semibold text-neutral-900 dark:text-white flex items-center justify-between">
                        <span>{w.parameterName || w.parameterKey}</span>
                        <span className="font-mono text-orange-500 font-bold">{w.rating} / 5</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">{w.improvementSuggestion || w.comments || "Continuous improvement advised."}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Skills & Historical Evaluation Timeline */}
        <div className="lg:col-span-5 space-y-6">
          {/* Skills Breakdown */}
          <div className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Technical Skills & Expertise</h3>

            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase text-neutral-400 font-semibold">PRIMARY SKILLS</div>
              <div className="flex flex-wrap gap-1.5">
                {(engineer.primarySkills || ["TypeScript"]).map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono font-medium border border-indigo-500/20"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="text-[10px] font-mono uppercase text-neutral-400 font-semibold">SECONDARY SKILLS</div>
              <div className="flex flex-wrap gap-1.5">
                {(engineer.secondarySkills || ["System Architecture"]).map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Historical Evaluations Stream */}
          <div className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center justify-between">
              <span>Past Evaluation Timeline</span>
              <span className="text-[10px] font-mono text-neutral-400">{engineerEvals.length} Reviews</span>
            </h3>

            <div className="space-y-3">
              {engineerEvals.length === 0 ? (
                <div className="text-xs text-neutral-400 font-mono py-2">No historical evaluations found.</div>
              ) : (
                engineerEvals.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-neutral-900 dark:text-white">{ev.quarter} {ev.year}</span>
                      <span className="text-indigo-400 font-bold">{ev.overallScore.toFixed(1)} / 100</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 line-clamp-2">"{ev.comments}"</p>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                      <span>Reviewer: {ev.reviewerName || ev.adminName}</span>
                      <Link href={`/evaluations/${ev.id}`} className="text-indigo-500 hover:underline flex items-center gap-1 font-mono">
                        Report <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
