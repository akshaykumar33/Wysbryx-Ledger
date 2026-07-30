"use client";

import { Users, ClipboardCheck, Award, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { getGradeInfo } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface OverviewCardsProps {
  totalEngineers: number;
  completedEvaluations: number;
  avgScore: number;
  topPerformer: { name: string; score: number; designation: string; photo: string } | null;
  lowestPerformer: { name: string; score: number; designation: string; photo: string } | null;
  pendingReviews: number;
}

export function OverviewCards({
  totalEngineers,
  completedEvaluations,
  avgScore,
  topPerformer,
  lowestPerformer,
  pendingReviews,
}: OverviewCardsProps) {
  const avgGrade = getGradeInfo(avgScore);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
      {/* Total Engineers */}
      <div className="p-5 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-xs space-y-3 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-neutral-400 font-semibold uppercase tracking-wider">Engineers</span>
          <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-neutral-900 dark:text-white font-mono">
          <AnimatedCounter value={totalEngineers} />
        </div>
        <p className="text-xs text-neutral-500 font-medium">Across 5 departments</p>
      </div>

      {/* Evaluations Completed */}
      <div className="p-5 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-xs space-y-3 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-neutral-400 font-semibold uppercase tracking-wider">Evaluations</span>
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <ClipboardCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-neutral-900 dark:text-white font-mono">
          <AnimatedCounter value={completedEvaluations} />
        </div>
        <Badge variant="success" dot className="text-[10px]">
          100% On Schedule
        </Badge>
      </div>

      {/* Average Score */}
      <div className="p-5 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-xs space-y-3 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-neutral-400 font-semibold uppercase tracking-wider">Org Avg Score</span>
          <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-500">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-white font-mono">
            <AnimatedCounter value={avgScore} decimals={1} />
          </div>
          <Badge variant="indigo" size="sm">
            {avgGrade.grade}
          </Badge>
        </div>
        <p className="text-xs text-neutral-500 font-semibold">{avgGrade.label}</p>
      </div>

      {/* Top Performer */}
      <div className="p-5 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-xs space-y-3 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-neutral-400 font-semibold uppercase tracking-wider">Top Performer</span>
          <Badge variant="warning" size="sm">
            #1 Rank
          </Badge>
        </div>
        {topPerformer ? (
          <div className="flex items-center gap-2.5">
            <img src={topPerformer.photo} alt={topPerformer.name} className="w-9 h-9 rounded-full object-cover shrink-0 border-2 border-amber-500/40" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">{topPerformer.name}</div>
              <div className="text-[11px] text-emerald-500 font-mono font-bold">{topPerformer.score.toFixed(1)} / 100</div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-neutral-400">N/A</div>
        )}
      </div>

      {/* Growth Focus */}
      <div className="p-5 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-xs space-y-3 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-neutral-400 font-semibold uppercase tracking-wider">Growth Focus</span>
          <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-500">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        {lowestPerformer ? (
          <div className="flex items-center gap-2.5">
            <img src={lowestPerformer.photo} alt={lowestPerformer.name} className="w-9 h-9 rounded-full object-cover shrink-0 border-2 border-orange-500/40" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">{lowestPerformer.name}</div>
              <div className="text-[11px] text-orange-500 font-mono font-bold">{lowestPerformer.score.toFixed(1)} / 100</div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-neutral-400">N/A</div>
        )}
      </div>

      {/* Pending Reviews */}
      <div className="p-5 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-xs space-y-3 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-neutral-400 font-semibold uppercase tracking-wider">Pending</span>
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-neutral-900 dark:text-white font-mono">
          <AnimatedCounter value={pendingReviews} />
        </div>
        <p className="text-xs text-neutral-500 font-medium">Awaiting Calibration</p>
      </div>
    </div>
  );
}
