"use client";

import * as React from "react";
import Link from "next/link";
import { Engineer } from "@/lib/types";
import { getGradeInfo } from "@/lib/utils";
import { Award, ArrowUpDown, ChevronRight, ExternalLink } from "lucide-react";

interface LeaderboardTableProps {
  engineers: Engineer[];
}

export function LeaderboardTable({ engineers }: LeaderboardTableProps) {
  const [search, setSearch] = React.useState("");
  const [sortField, setSortField] = React.useState<"score" | "name" | "exp">("score");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const filtered = React.useMemo(() => {
    return engineers
      .filter((e) => {
        const query = search.toLowerCase();
        return (
          e.fullName.toLowerCase().includes(query) ||
          e.designation.toLowerCase().includes(query) ||
          e.departmentName?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const valA = sortField === "score" ? a.avgScore || 0 : sortField === "exp" ? a.experienceYears : a.fullName;
        const valB = sortField === "score" ? b.avgScore || 0 : sortField === "exp" ? b.experienceYears : b.fullName;
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [engineers, search, sortField, sortOrder]);

  const toggleSort = (field: "score" | "name" | "exp") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Engineer Rankings & Performance Leaderboard</span>
          </h3>
          <p className="text-xs text-neutral-500">Calibrated overall scores and grade standings</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filter engineer name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48 sm:w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 font-mono text-[11px] text-neutral-400">
              <th className="py-2.5 px-3">RANK</th>
              <th className="py-2.5 px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white" onClick={() => toggleSort("name")}>
                <div className="flex items-center gap-1">
                  <span>ENGINEER</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3">DEPARTMENT & TEAM</th>
              <th className="py-2.5 px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white" onClick={() => toggleSort("exp")}>
                <div className="flex items-center gap-1">
                  <span>EXPERIENCE</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white text-right" onClick={() => toggleSort("score")}>
                <div className="flex items-center justify-end gap-1">
                  <span>OVERALL SCORE</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-center">GRADE</th>
              <th className="py-2.5 px-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {filtered.map((eng, idx) => {
              const gradeInfo = getGradeInfo(eng.avgScore || 0);
              return (
                <tr key={eng.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold">
                    {idx === 0 ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">#1</span>
                    ) : idx === 1 ? (
                      <span className="px-2 py-0.5 rounded bg-neutral-300/30 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-300">#2</span>
                    ) : idx === 2 ? (
                      <span className="px-2 py-0.5 rounded bg-amber-700/20 text-amber-700 dark:text-amber-400">#3</span>
                    ) : (
                      <span className="text-neutral-400">#{idx + 1}</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img src={eng.photoUrl} alt={eng.fullName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-white">{eng.fullName}</div>
                        <div className="text-[10px] text-neutral-500">{eng.designation}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-neutral-800 dark:text-neutral-200">{eng.departmentName}</div>
                    <div className="text-[10px] text-neutral-500">{eng.teamName}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-neutral-600 dark:text-neutral-400">
                    {eng.experienceYears.toFixed(1)} yrs
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-mono font-bold text-sm text-neutral-900 dark:text-white">
                      {(eng.avgScore || 0).toFixed(1)}
                    </span>
                    <span className="text-[10px] text-neutral-400 ml-1">/ 100</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${gradeInfo.bg} ${gradeInfo.color} border ${gradeInfo.border}`}>
                      {gradeInfo.grade} ({gradeInfo.label})
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/engineers/${eng.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-400"
                    >
                      <span>Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
