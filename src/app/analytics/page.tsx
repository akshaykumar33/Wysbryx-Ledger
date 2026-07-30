"use client";

import * as React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { MOCK_ENGINEERS, MOCK_EVALUATIONS } from "@/lib/mockData";
import { EVALUATION_PARAMETERS } from "@/lib/constants";
import { TrendingUp, AlertCircle, BarChart2 } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Badge } from "@/components/ui/Badge";

export default function AnalyticsPage() {
  // Parameter Competency Scores
  const parameterAnalytics = React.useMemo(() => {
    return EVALUATION_PARAMETERS.map((p) => {
      let sum = 0;
      let count = 0;
      MOCK_EVALUATIONS.forEach((ev) => {
        const ps = ev.parameterScores.find((x) => x.parameterKey === p.key);
        if (ps) {
          sum += (ps.rating / 5.0) * 100;
          count++;
        }
      });
      return {
        name: p.name,
        shortName: p.name.split(" ")[0],
        avgScore: count > 0 ? sum / count : 82,
        weight: p.weight,
        category: p.category || p.categoryId || "Technical",
      };
    }).sort((a, b) => b.avgScore - a.avgScore);
  }, []);

  const topStrengths = parameterAnalytics.slice(0, 3);
  const skillGaps = [...parameterAnalytics].reverse().slice(0, 3);

  // Experience level analytics
  const experienceAnalytics = React.useMemo(() => {
    const junior = MOCK_ENGINEERS.filter((e) => e.experienceYears < 3);
    const mid = MOCK_ENGINEERS.filter((e) => e.experienceYears >= 3 && e.experienceYears < 7);
    const senior = MOCK_ENGINEERS.filter((e) => e.experienceYears >= 7);

    const calcAvg = (arr: typeof MOCK_ENGINEERS) =>
      arr.length > 0 ? arr.reduce((acc, curr) => acc + (curr.avgScore || 0), 0) / arr.length : 0;

    return [
      { tier: "Junior (0-3 yrs)", avgScore: calcAvg(junior), count: junior.length },
      { tier: "Mid-Level (3-7 yrs)", avgScore: calcAvg(mid), count: mid.length },
      { tier: "Senior / Principal (7+ yrs)", avgScore: calcAvg(senior), count: senior.length },
    ];
  }, []);

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-neutral-200/80 dark:border-neutral-800/80 pb-6">
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
          DEEP DIVE ANALYTICS
        </span>
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 tracking-tight">
          Engineering Skill Gaps & Competency Insights
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Detailed metrics aggregated across parameters, experience bands, and department cohorts.
        </p>
      </div>

      {/* Top Strengths vs Skill Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl border border-primary/30 bg-primary/5 space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <TrendingUp className="w-5 h-5" />
            <span>ORG-WIDE TOP 3 STRENGTH PARAMETERS</span>
          </div>
          <div className="space-y-3">
            {topStrengths.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-primary/20 text-xs flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">{item.name}</div>
                  <div className="text-[10px] text-neutral-400 font-mono">Category: {item.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-primary">{item.avgScore.toFixed(1)} / 100</div>
                  <div className="text-[10px] text-neutral-400 font-mono">{item.weight}% Weight</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-3xl border border-neutral-300 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <AlertCircle className="w-5 h-5" />
            <span>PRIMARY SKILL GAPS (REQUIRES UPSKILLING)</span>
          </div>
          <div className="space-y-3">
            {skillGaps.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">{item.name}</div>
                  <div className="text-[10px] text-neutral-400 font-mono">Category: {item.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-amber-500">{item.avgScore.toFixed(1)} / 100</div>
                  <div className="text-[10px] text-neutral-400 font-mono">{item.weight}% Weight</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parameter Breakdown Chart */}
      <div className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-primary" />
          <span>Average Performance Score Across All 8 Parameters</span>
        </h3>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={parameterAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="shortName" stroke="#888888" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#888888" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(150, 150, 150, 0.06)", rx: 6 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="p-3 rounded-xl bg-neutral-900/95 text-white text-xs shadow-2xl backdrop-blur-xl border border-neutral-800 space-y-1">
                        <div className="font-bold">{d.name}</div>
                        <div className="text-primary font-mono font-bold">Avg Score: {d.avgScore.toFixed(1)} / 100</div>
                        <div className="text-[10px] text-neutral-400 font-mono">Weight: {d.weight}%</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Experience Tier Comparison */}
      <div className="p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Performance by Experience Band</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {experienceAnalytics.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 space-y-2">
              <div className="text-xs font-semibold text-neutral-900 dark:text-white">{item.tier}</div>
              <div className="text-3xl font-extrabold font-mono text-primary">{item.avgScore.toFixed(1)}</div>
              <div className="text-[10px] text-neutral-400 font-mono">{item.count} Engineers in cohort</div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
