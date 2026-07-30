"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";

interface ParameterRadarChartProps {
  data: { parameter: string; score: number; fullMark: number }[];
}

export function ParameterRadarChart({ data }: ParameterRadarChartProps) {
  return (
    <div className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Parameter Radar Competency</h3>
          <p className="text-xs text-neutral-500">Org-wide competency across all 8 metrics</p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
          8 METRICS
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="rgba(150, 150, 150, 0.2)" />
            <PolarAngleAxis dataKey="parameter" stroke="currentColor" className="text-neutral-600 dark:text-neutral-400" fontSize={10} tickLine={false} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#888888" fontSize={9} />
            <Radar
              name="Avg Score"
              dataKey="score"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.35}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-neutral-900/95 dark:bg-neutral-900/95 text-white text-xs shadow-2xl backdrop-blur-xl border border-neutral-800 space-y-1">
                      <div className="font-bold text-neutral-100">{d.parameter}</div>
                      <div className="text-indigo-400 font-mono font-bold">Score: {d.score.toFixed(1)} / 100</div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
