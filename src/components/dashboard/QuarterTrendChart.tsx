"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface QuarterTrendChartProps {
  data: { quarter: string; avgScore: number; evaluationsCount: number }[];
}

export function QuarterTrendChart({ data }: QuarterTrendChartProps) {
  return (
    <div className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Quarter-over-Quarter Growth Trend</h3>
          <p className="text-xs text-neutral-500">Org average evaluation score evolution over time</p>
        </div>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" />
            <XAxis dataKey="quarter" stroke="currentColor" className="text-neutral-500 dark:text-neutral-400" fontSize={11} axisLine={false} tickLine={false} />
            <YAxis domain={[60, 100]} stroke="#888888" fontSize={11} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ stroke: "rgba(150, 150, 150, 0.3)", strokeWidth: 1, strokeDasharray: "4 4" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-neutral-900/95 text-white text-xs shadow-2xl backdrop-blur-xl border border-neutral-800 space-y-1">
                      <div className="font-bold">{d.quarter}</div>
                      <div className="text-cyan-400 font-mono font-bold">Avg Score: {d.avgScore.toFixed(1)}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{d.evaluationsCount} Reviews Completed</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="avgScore"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ r: 4, fill: "#06b6d4", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
