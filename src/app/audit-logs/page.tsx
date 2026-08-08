"use client";

import * as React from "react";
import { useAppStore } from "@/lib/store";
import { ShieldCheck, Search, Filter, Clock, User, Activity, FileText, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { INITIAL_AUDIT_LOGS } from "@/lib/audit";

export default function AuditLogsPage() {
  const { auditLogs, deleteAuditLog, clearAuditLogs } = useAppStore();
  const [search, setSearch] = React.useState("");

  const filteredLogs = React.useMemo(() => {
    return (auditLogs || []).filter((log) => {
      const q = search.toLowerCase();
      return (
        log.adminName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.entityType.toLowerCase().includes(q) ||
        log.entityId.toLowerCase().includes(q)
      );
    });
  }, [auditLogs, search]);

  const handleClearAll = () => {
    if (auditLogs.length === 0) return;
    if (confirm("Are you sure you want to clear all audit logs? This action cannot be undone.")) {
      clearAuditLogs();
      toast.success("Audit logs cleared successfully");
    }
  };

  const handleDeleteSingle = (id: string, action: string) => {
    deleteAuditLog(id);
    toast.success(`Removed audit log entry (${action})`);
  };

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
      <div data-tour="audit-logs-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
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

        {auditLogs.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 text-xs font-semibold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Logs</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
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
      <div className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xs overflow-x-auto">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-neutral-400 mx-auto opacity-50" />
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">No Audit Logs Recorded</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              System actions, evaluations created or modified, and settings changes will appear here automatically.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 font-mono text-[11px] text-neutral-400">
                <th className="py-2.5 px-3">TIMESTAMP</th>
                <th className="py-2.5 px-3">ADMINISTRATOR</th>
                <th className="py-2.5 px-3">ACTION</th>
                <th className="py-2.5 px-3">ENTITY & ID</th>
                <th className="py-2.5 px-3">IP ADDRESS</th>
                <th className="py-2.5 px-3">PAYLOAD DIFF</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors font-mono">
                  <td className="py-3 px-3 text-neutral-500 text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-white font-sans">
                    {log.adminName}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getActionBadge(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-neutral-800 dark:text-neutral-200 font-sans">
                    <span className="font-semibold">{log.entityType}</span>
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
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDeleteSingle(log.id, log.action)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete log entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
