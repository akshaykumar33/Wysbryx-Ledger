"use client";

import * as React from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { DEPARTMENTS } from "@/lib/constants";
import { getGradeInfo } from "@/lib/utils";
import { exportToCSV } from "@/lib/export";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { AddEngineerModal } from "@/components/ui/AddEngineerModal";
import { toast } from "sonner";
import {
  Search,
  ExternalLink,
  Trash2,
  RotateCcw,
  Download,
  CheckSquare,
  Square,
  UserPlus,
} from "lucide-react";

export default function EngineersDirectoryPage() {
  const { engineers, softDeleteEngineer, restoreEngineer, bulkDeleteEngineers } = useAppStore();
  const [search, setSearch] = React.useState("");
  const [deptFilter, setDeptFilter] = React.useState("ALL");
  const [showArchived, setShowArchived] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [addModalOpen, setAddModalOpen] = React.useState(false);

  const deptOptions = [
    { value: "ALL", label: "All Departments" },
    ...DEPARTMENTS.map((d) => ({ value: d.id, label: d.name })),
  ];

  const filteredEngineers = React.useMemo(() => {
    return engineers.filter((eng) => {
      const isDeleted = Boolean(eng.deletedAt);
      if (showArchived ? !isDeleted : isDeleted) return false;

      const q = search.toLowerCase();
      const matchesSearch =
        eng.fullName.toLowerCase().includes(q) ||
        eng.designation.toLowerCase().includes(q) ||
        eng.primarySkills.some((s) => s.toLowerCase().includes(q));
      const matchesDept = deptFilter === "ALL" || eng.departmentId === deptFilter;
      return matchesSearch && matchesDept;
    });
  }, [engineers, search, deptFilter, showArchived]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    bulkDeleteEngineers(selectedIds);
    toast.success(`Soft-deleted ${selectedIds.length} engineers`, {
      action: {
        label: "Undo",
        onClick: () => {
          selectedIds.forEach((id) => restoreEngineer(id));
          toast.success("Restored engineers!");
        },
      },
    });
    setSelectedIds([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Add Engineer Modal */}
      <AddEngineerModal open={addModalOpen} onOpenChange={setAddModalOpen} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">
            ENGINEERING TALENT ROSTER
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 tracking-tight">
            Engineers Directory & CRUD
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage engineering talent profiles, skills matrix, soft-deletes, and bulk operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-semibold transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={() => exportToCSV(filteredEngineers as any, "engineers_roster.csv")}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User / Engineer</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search engineer name, role, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <div className="w-52">
            <CustomSelect
              options={deptOptions}
              value={deptFilter}
              onChange={(val) => setDeptFilter(val)}
            />
          </div>

          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
              showArchived
                ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
            }`}
          >
            {showArchived ? "Viewing Archived" : "View Archived"}
          </button>
        </div>
      </div>

      {/* Engineers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEngineers.map((eng) => {
          const grade = getGradeInfo(eng.avgScore || 0);
          const isSelected = selectedIds.includes(eng.id);

          return (
            <div
              key={eng.id}
              className={`p-6 rounded-2xl border bg-white dark:bg-neutral-900 shadow-xs space-y-4 transition-all relative group ${
                isSelected
                  ? "border-indigo-500 ring-1 ring-indigo-500"
                  : "border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600"
              }`}
            >
              {/* Top Bar with Select checkbox & Action */}
              <div className="flex items-center justify-between">
                <button onClick={() => toggleSelect(eng.id)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer">
                  {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-500" /> : <Square className="w-4 h-4" />}
                </button>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${grade.bg} ${grade.color} border ${grade.border}`}>
                    {grade.grade}
                  </span>

                  {eng.deletedAt ? (
                    <button
                      onClick={() => {
                        restoreEngineer(eng.id);
                        toast.success(`Restored ${eng.fullName}`);
                      }}
                      className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/10 cursor-pointer"
                      title="Restore"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        softDeleteEngineer(eng.id);
                        toast.success(`Archived ${eng.fullName}`, {
                          action: {
                            label: "Undo",
                            onClick: () => restoreEngineer(eng.id),
                          },
                        });
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Soft delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Profile info */}
              <div className="flex items-center gap-3">
                <img src={eng.photoUrl} alt={eng.fullName} className="w-12 h-12 rounded-full object-cover shadow-xs" />
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">{eng.fullName}</h3>
                  <p className="text-xs text-neutral-500">{eng.designation}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-neutral-400">Department</span>
                  <span className="font-medium text-neutral-900 dark:text-white truncate max-w-[180px]">{eng.departmentName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-neutral-400">Score</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-white">{(eng.avgScore || 0).toFixed(1)} / 100</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-400">{eng.experienceYears.toFixed(1)} yrs exp</span>
                <Link href={`/engineers/${eng.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-400">
                  <span>Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
