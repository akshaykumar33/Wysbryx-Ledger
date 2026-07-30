"use client";

import { EVALUATION_PARAMETERS } from "@/lib/constants";

interface HeatmapMatrixProps {
  matrixData: {
    teamName: string;
    scores: Record<string, number>; // paramKey -> rating (1-5)
  }[];
}

export function HeatmapMatrix({ matrixData }: HeatmapMatrixProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-emerald-500/80 text-white font-bold";
    if (rating >= 4.0) return "bg-emerald-500/40 text-emerald-950 dark:text-emerald-100 font-semibold";
    if (rating >= 3.5) return "bg-blue-500/40 text-blue-950 dark:text-blue-100 font-semibold";
    if (rating >= 3.0) return "bg-amber-500/40 text-amber-950 dark:text-amber-100 font-semibold";
    if (rating >= 2.0) return "bg-orange-500/40 text-orange-950 dark:text-orange-100 font-semibold";
    return "bg-rose-500/40 text-rose-950 dark:text-rose-100 font-semibold";
  };

  return (
    <div className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm space-y-4 overflow-x-auto">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Team x Parameter Competency Heatmap</h3>
          <p className="text-xs text-neutral-500">Average parameter ratings (1 to 5) across engineering teams</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-rose-500/40" /> 1-2 (Gap)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-500/40" /> 3 (Good)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/80" /> 5 (Exceptional)
          </span>
        </div>
      </div>

      <div className="min-w-[700px]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800">
              <th className="py-2 px-3 font-mono font-bold text-neutral-400">Team / Department</th>
              {EVALUATION_PARAMETERS.map((p) => (
                <th key={p.id} className="py-2 px-2 font-mono text-[10px] text-neutral-500 font-semibold text-center truncate max-w-[90px]" title={p.name}>
                  {p.name.split(" ")[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {matrixData.map((row, idx) => (
              <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-white">{row.teamName}</td>
                {EVALUATION_PARAMETERS.map((p) => {
                  const rating = row.scores[p.key] || 3.8;
                  return (
                    <td key={p.id} className="py-2 px-1 text-center">
                      <div className={`py-1 px-2 rounded-lg text-xs font-mono transition-transform hover:scale-105 ${getRatingColor(rating)}`}>
                        {rating.toFixed(1)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
