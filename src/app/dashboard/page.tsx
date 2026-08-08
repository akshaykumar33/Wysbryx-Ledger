"use client";

import * as React from "react";
import Link from "next/link";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { ScoreDistributionChart } from "@/components/dashboard/ScoreDistributionChart";
import { ParameterRadarChart } from "@/components/dashboard/ParameterRadarChart";
import { DepartmentComparisonChart } from "@/components/dashboard/DepartmentComparisonChart";
import { QuarterTrendChart } from "@/components/dashboard/QuarterTrendChart";
import { HeatmapMatrix } from "@/components/dashboard/HeatmapMatrix";
import { LeaderboardTable } from "@/components/dashboard/LeaderboardTable";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { DEPARTMENTS, TEAMS, EVALUATION_PARAMETERS } from "@/lib/constants";
import { useAppStore } from "@/lib/store";
import { Download, PlusCircle, Bot, ArrowRight } from "lucide-react";
import { exportToCSV } from "@/lib/export";

export default function DashboardPage() {
  const {
    engineers,
    evaluations,
    selectedQuarter,
    selectedYear,
    filterDepartment,
    setFilterDepartment,
    filterCaptain,
  } = useAppStore();

  const deptOptions = [
    { value: "ALL", label: "All Departments" },
    ...DEPARTMENTS.map((d) => ({ value: d.id, label: d.name })),
  ];

  // Filtered engineers based on selections (excluding soft-deleted ones)
  const filteredEngineers = React.useMemo(() => {
    return (engineers || []).filter((eng) => {
      if (eng.deletedAt) return false;
      if (filterDepartment !== "ALL" && eng.departmentId !== filterDepartment) return false;
      if (filterCaptain !== "ALL" && (eng as any).captainId !== filterCaptain) return false;
      return true;
    });
  }, [engineers, filterDepartment, filterCaptain]);

  // Overall metrics calculation
  const totalEngineers = filteredEngineers.length;
  const completedEvals = (evaluations || []).length;
  const totalScoreSum = filteredEngineers.reduce((acc, curr) => acc + (curr.avgScore || 0), 0);
  const avgScore = totalEngineers > 0 ? totalScoreSum / totalEngineers : 0;

  const sortedEngineers = [...filteredEngineers].sort((a, b) => (b.avgScore || 0) - (a.avgScore || 0));
  const topPerformer = sortedEngineers[0]
    ? {
        name: sortedEngineers[0].fullName,
        score: sortedEngineers[0].avgScore || 0,
        designation: sortedEngineers[0].designation,
        photo: sortedEngineers[0].photoUrl,
      }
    : null;

  const lowestPerformer = sortedEngineers[sortedEngineers.length - 1]
    ? {
        name: sortedEngineers[sortedEngineers.length - 1].fullName,
        score: sortedEngineers[sortedEngineers.length - 1].avgScore || 0,
        designation: sortedEngineers[sortedEngineers.length - 1].designation,
        photo: sortedEngineers[sortedEngineers.length - 1].photoUrl,
      }
    : null;

  // Score distribution data
  const distributionData = React.useMemo(() => {
    const counts = { "95-100": 0, "90-94": 0, "80-89": 0, "70-79": 0, "60-69": 0, "<60": 0 };
    filteredEngineers.forEach((e) => {
      const s = e.avgScore || 0;
      if (s >= 95) counts["95-100"]++;
      else if (s >= 90) counts["90-94"]++;
      else if (s >= 80) counts["80-89"]++;
      else if (s >= 70) counts["70-79"]++;
      else if (s >= 60) counts["60-69"]++;
      else counts["<60"]++;
    });

    return [
      { range: "95-100", count: counts["95-100"], grade: "A+", color: "#10b981" },
      { range: "90-94", count: counts["90-94"], grade: "A", color: "#3b82f6" },
      { range: "80-89", count: counts["80-89"], grade: "B+", color: "#06b6d4" },
      { range: "70-79", count: counts["70-79"], grade: "B", color: "#f59e0b" },
      { range: "60-69", count: counts["60-69"], grade: "C", color: "#f97316" },
      { range: "<60", count: counts["<60"], grade: "F", color: "#f43f5e" },
    ];
  }, [filteredEngineers]);

  // Parameter Radar Data
  const parameterRadarData = React.useMemo(() => {
    return EVALUATION_PARAMETERS.map((p) => {
      let sum = 0;
      let count = 0;
      (evaluations || []).forEach((ev) => {
        const ps = ev.parameterScores?.find((x) => x.parameterKey === p.key || x.parameterId === p.key);
        if (ps) {
          sum += (ps.rating / 5) * 100;
          count++;
        }
      });
      const avg = count > 0 ? sum / count : 85;
      return {
        parameter: p.name.split(" ")[0],
        score: avg,
        fullMark: 100,
      };
    });
  }, [evaluations]);

  // Department Comparison Data
  const deptData = React.useMemo(() => {
    return DEPARTMENTS.map((d) => {
      const engsInDept = (engineers || []).filter((e) => !e.deletedAt && e.departmentId === d.id);
      const sum = engsInDept.reduce((acc, curr) => acc + (curr.avgScore || 0), 0);
      const avg = engsInDept.length > 0 ? sum / engsInDept.length : 0;
      return {
        department: d.code,
        avgScore: avg,
        engineerCount: engsInDept.length,
      };
    });
  }, [engineers]);

  // Quarter Trend Data
  const quarterTrendData = [
    { quarter: "Q3 2025", avgScore: 81.2, evaluationsCount: 18 },
    { quarter: "Q4 2025", avgScore: 83.5, evaluationsCount: 22 },
    { quarter: "Q1 2026", avgScore: 85.0, evaluationsCount: 24 },
    { quarter: "Q2 2026", avgScore: 86.8, evaluationsCount: 28 },
    { quarter: `${selectedQuarter} ${selectedYear}`, avgScore: avgScore || 87.4, evaluationsCount: completedEvals },
  ];

  // Heatmap Data
  const heatmapData = React.useMemo(() => {
    return TEAMS.map((t) => ({
      teamName: t.name,
      scores: {
        ai_usage: 4.5,
        engineering_knowledge: 4.8,
        subject_expertise: 4.6,
        communication: 4.2,
        team_player: 4.7,
        innovation: 4.3,
        delivery: 4.6,
        learning: 4.4,
      },
    }));
  }, []);

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/80 dark:border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-neutral-200/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              EXECUTIVE DASHBOARD
            </span>
            <span className="text-xs font-mono text-emerald-500 font-semibold">• ACTIVE CYCLE: {selectedQuarter} {selectedYear}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white mt-1 tracking-tight">
            Engineering Excellence Analytics
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Custom Department Select Dropdown */}
          <div className="w-52">
            <CustomSelect
              options={deptOptions}
              value={filterDepartment}
              onChange={(val) => setFilterDepartment(val)}
            />
          </div>

          <button
            onClick={() => exportToCSV(evaluations || [], `evaluations_${selectedQuarter}_${selectedYear}.csv`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/evaluations/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90 text-xs font-semibold transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Evaluation</span>
          </Link>
        </div>
      </div>

      {/* World 1 AI Evaluation Switcher Banner */}
      <div className="p-5 rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-950/40 via-neutral-900/80 to-amber-950/40 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">WORLD 1 ENGINE</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">AI Candidates Evaluation</span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5">Wysbryx AI Candidate Evaluation Workspace</h3>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">Assess AI prompting, code verification, debugging speed, and agentic workflows with live rubric scorecards.</p>
          </div>
        </div>
        <Link
          href="/ai-eval"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-black font-extrabold text-xs hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/20 shrink-0"
        >
          <span>Enter World 1</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Top Metric Cards */}
      <OverviewCards
        totalEngineers={totalEngineers}
        completedEvaluations={completedEvals}
        avgScore={avgScore}
        topPerformer={topPerformer}
        lowestPerformer={lowestPerformer}
        pendingReviews={2}
      />

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ScoreDistributionChart data={distributionData} />
        <ParameterRadarChart data={parameterRadarData} />
      </div>

      {/* Secondary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DepartmentComparisonChart data={deptData} />
        <QuarterTrendChart data={quarterTrendData} />
      </div>

      {/* Heatmap Matrix */}
      <HeatmapMatrix matrixData={heatmapData} />

      {/* Leaderboard Ranking Table */}
      <LeaderboardTable engineers={filteredEngineers} />
    </PageWrapper>
  );
}
