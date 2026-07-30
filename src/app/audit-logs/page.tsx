"use client";

import * as React from "react";
import { getAuditLogs } from "@/lib/audit";
import { ShieldCheck, Search, Filter, Clock, User, Activity, FileText } from "lucide-react";

export default function AuditLogsPage() {
  const [search, setSearch] = React.useState("");
  const logs = getAuditLogs();

  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const q = search.toLowerCase();
      return (
        log.adminName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.entityType.toLowerCase().includes(q) ||
        log.entityId.toLowerCase().includes(q)
      );
    });
  }, [logs, search]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "UPDATE":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "SOFT_DELETE":
      case "BULK_DELETE":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "RESTORE":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
            AUDIT TRAIL & GOVERNANCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 tracking-tight">
            System Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Complete immutable log of all administrative evaluations, settings updates, and system mutations.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search action, actor, entity ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none"
          />
        </div>
        <span className="text-xs font-mono text-neutral-400">{filteredLogs.length} Events Recorded</span>
      </div>

      {/* Audit Stream Table */}
      <div className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 font-mono text-[11px] text-neutral-400">
              <th className="py-2.5 px-3">TIMESTAMP</th>
              <th className="py-2.5 px-3">ADMINISTRATOR</th>
              <th className="py-2.5 px-3">ACTION</th>
              <th className="py-2.5 px-3">ENTITY & ID</th>
              <th className="py-2.5 px-3">IP ADDRESS</th>
              <th className="py-2.5 px-3">PAYLOAD DIFF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors font-mono">
                <td className="py-3 px-3 text-neutral-500 text-[11px]">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-white">
                  {log.adminName}
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getActionBadge(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="py-3 px-3 text-neutral-800 dark:text-neutral-200">
                  <span>{log.entityType}</span>
                  <span className="text-[10px] text-neutral-400 block font-mono">{log.entityId}</span>
                </td>
                <td className="py-3 px-3 text-neutral-500 text-[11px]">
                  {log.ipAddress}
                </td>
                <td className="py-3 px-3 max-w-xs">
                  <div className="truncate text-[10px] text-neutral-400 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-lg border border-neutral-200/50 dark:border-neutral-700/50">
                    {log.newValues || log.oldValues || "N/A"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
