"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface DepartmentComparisonChartProps {
  data: { department: string; avgScore: number; engineerCount: number }[];
}

export function DepartmentComparisonChart({ data }: DepartmentComparisonChartProps) {
  return (
    <div className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Department Benchmark Comparison</h3>
          <p className="text-xs text-neutral-500">Average overall score by engineering department</p>
        </div>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
            <XAxis type="number" domain={[0, 100]} stroke="#888888" fontSize={11} axisLine={false} tickLine={false} />
            <YAxis dataKey="department" type="category" stroke="currentColor" className="text-neutral-600 dark:text-neutral-400" fontSize={10} axisLine={false} tickLine={false} width={130} />
            <Tooltip
              cursor={{ fill: "rgba(150, 150, 150, 0.06)", rx: 6 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-neutral-900/95 text-white text-xs shadow-2xl backdrop-blur-xl border border-neutral-800 space-y-1">
                      <div className="font-bold">{d.department}</div>
                      <div className="text-purple-400 font-mono font-bold">Avg Score: {d.avgScore.toFixed(1)} / 100</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{d.engineerCount} Engineers</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="avgScore" fill="#a855f7" radius={[0, 6, 6, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
