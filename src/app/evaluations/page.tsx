"use client";

import * as React from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { getGradeInfo } from "@/lib/utils";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { PlusCircle, Search, Download, ExternalLink, CheckCircle2, Edit3, Trash2 } from "lucide-react";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";

export default function EvaluationsListPage() {
  const { evaluations, deleteEvaluation } = useAppStore();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  const statusOptions = [
    { value: "ALL", label: "All Statuses" },
    { value: "Completed", label: "Completed" },
    { value: "Pending Review", label: "Pending Review" },
    { value: "Draft", label: "Draft" },
  ];

  const filteredEvals = React.useMemo(() => {
    return evaluations.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        item.engineerName?.toLowerCase().includes(q) ||
        item.reviewerName?.toLowerCase().includes(q) ||
        item.engineerDepartment?.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [evaluations, search, statusFilter]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete evaluation for ${name}?`)) {
      deleteEvaluation(id);
      toast.success(`Deleted evaluation for ${name}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
            EVALUATIONS WORKSPACE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 tracking-tight">
            Quarterly Performance Reviews
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Access, review, modify, and issue objective engineering evaluations across cycles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCSV(filteredEvals, "quarterly_evaluations.csv")}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/evaluations/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90 text-xs font-semibold transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Start Evaluation</span>
          </Link>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search engineer, reviewer or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none"
          />
        </div>

        <div className="w-48">
          <CustomSelect
            options={statusOptions}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
          />
        </div>
      </div>

      {/* Evaluations Table */}
      <div className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 font-mono text-[11px] text-neutral-400">
              <th className="py-3 px-3">ENGINEER</th>
              <th className="py-3 px-3">CYCLE / DATE</th>
              <th className="py-3 px-3">REVIEWER & ROLE</th>
              <th className="py-3 px-3 text-right">OVERALL SCORE</th>
              <th className="py-3 px-3 text-center">GRADE</th>
              <th className="py-3 px-3 text-center">STATUS</th>
              <th className="py-3 px-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {filteredEvals.map((item) => {
              const grade = getGradeInfo(item.overallScore);
              return (
                <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <img src={item.engineerPhoto} alt={item.engineerName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-white">{item.engineerName}</div>
                        <div className="text-[10px] text-neutral-500">{item.engineerDesignation}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-neutral-600 dark:text-neutral-400">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-200">{item.quarter} {item.year}</div>
                    <div className="text-[10px] text-neutral-500">{item.evaluationDate}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-medium text-neutral-900 dark:text-white">{item.reviewerName || item.adminName}</div>
                    <div className="text-[10px] text-indigo-500 font-mono">{item.reviewerRole || "Admin"}</div>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-sm text-neutral-900 dark:text-white">
                    {item.overallScore.toFixed(1)} / 100
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${grade.bg} ${grade.color} border ${grade.border}`}>
                      {grade.grade} ({grade.label})
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/evaluations/${item.id}/edit`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-amber-500 hover:text-amber-400 p-1 rounded-lg hover:bg-amber-500/10 transition-colors"
                        title="Edit Evaluation"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>

                      <Link
                        href={`/evaluations/${item.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-400 p-1 rounded-lg hover:bg-indigo-500/10 transition-colors"
                        title="View Report"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>

                      <button
                        onClick={() => handleDelete(item.id, item.engineerName)}
                        className="p-1 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Evaluation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
