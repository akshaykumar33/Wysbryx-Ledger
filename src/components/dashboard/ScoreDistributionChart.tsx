"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface ScoreDistributionChartProps {
  data: { range: string; count: number; grade: string; color: string }[];
}

export function ScoreDistributionChart({ data }: ScoreDistributionChartProps) {
  return (
    <div className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Score Tier Distribution</h3>
          <p className="text-xs text-neutral-500">Breakdown of engineers by evaluation score grade tier</p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
          Q3 2026
        </span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="range"
              stroke="currentColor"
              className="text-neutral-500 dark:text-neutral-400"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="currentColor"
              className="text-neutral-500 dark:text-neutral-400"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(150, 150, 150, 0.06)", rx: 6 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-neutral-900/95 text-white text-xs shadow-2xl backdrop-blur-xl border border-neutral-800 space-y-1">
                      <div className="font-bold">{d.range} (Grade {d.grade})</div>
                      <div className="text-emerald-400 font-mono font-bold">{d.count} Engineers in tier</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
