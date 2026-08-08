"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAIEvalStore } from "@/lib/ai-eval/store";
import { validateEvaluatorName, ALL_CANDIDATES } from "@/lib/ai-eval/allocation";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  Sparkles,
  Dices,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  ShieldCheck,
  Crown,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Zap,
  X,
} from "lucide-react";

export default function AIEvalMainPage() {
  const {
    evaluatorName,
    isAdmin,
    isAllocated,
    assignedCandidates,
    loginEvaluator,
    performRoll,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    deptFilter,
    setDeptFilter,
    getEvaluation,
    loadEvaluationsFromServer,
  } = useAIEvalStore();

  useEffect(() => {
    loadEvaluationsFromServer();
  }, [loadEvaluationsFromServer]);

  const [inputName, setInputName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isRolling, setIsRolling] = useState(false);
  const [rollStep, setRollStep] = useState<string>("Ready");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const pageSize = 8;

  // Trigger admin storyboard modal when an admin logs in
  useEffect(() => {
    if (isAdmin && evaluatorName) {
      setShowAdminModal(true);
    }
  }, [isAdmin, evaluatorName]);

  // Real-time regex match preview during input
  const matchFeedback = useMemo(() => {
    if (!inputName.trim()) return null;
    return validateEvaluatorName(inputName);
  }, [inputName]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) {
      setErrorMsg("Please enter your name to proceed");
      return;
    }

    const res = loginEvaluator(inputName);
    if (!res.isValid) {
      setErrorMsg("Name must be at least 2 characters");
      return;
    }
    setErrorMsg("");

    // If admin, immediately trigger roll to get all candidates and show storyboard modal
    if (res.isAdmin) {
      performRoll();
      setShowAdminModal(true);
    }
  };

  const triggerRollExperience = () => {
    setIsRolling(true);
    setRollStep("Initializing Quantum Generator...");

    setTimeout(() => setRollStep("Partitioning Employee Pool..."), 600);
    setTimeout(() => setRollStep("Verifying Equal Distribution..."), 1200);
    setTimeout(() => {
      performRoll();
      setIsRolling(false);
    }, 1800);
  };

  // Departments list for dropdown filter
  const departmentsList = useMemo(() => {
    const set = new Set<string>();
    assignedCandidates.forEach((c) => set.add(c.department));
    return Array.from(set);
  }, [assignedCandidates]);

  // Filtered candidate list
  const filteredCandidates = useMemo(() => {
    return assignedCandidates.filter((cand) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          cand.name.toLowerCase().includes(q) ||
          cand.email.toLowerCase().includes(q) ||
          cand.department.toLowerCase().includes(q) ||
          cand.role.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Status filter
      if (statusFilter !== "ALL" && cand.status !== statusFilter) {
        return false;
      }

      // Department filter
      if (deptFilter !== "ALL" && cand.department !== deptFilter) {
        return false;
      }

      return true;
    });
  }, [assignedCandidates, searchQuery, statusFilter, deptFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / pageSize));
  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCandidates.slice(start, start + pageSize);
  }, [filteredCandidates, currentPage]);

  return (
    <>
      {/* ==========================================================
          SUPER CAPTAIN STORYBOARD MODAL (FOR PRAVEEN & KRISHNA)
         ========================================================== */}
      <AnimatePresence>
        {showAdminModal && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto p-5 sm:p-8 rounded-3xl bg-neutral-900 border border-amber-500/40 shadow-2xl shadow-amber-500/20 text-left space-y-4 sm:space-y-6 scrollbar-none"
            >
              {/* Background Ambient Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Top Header Badge & Close Button */}
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
                  <Crown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span>SUPER CAPTAIN PROTOCOL UNLOCKED</span>
                </div>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Storyboard Content */}
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Ayee Super Captain <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300">{evaluatorName}</span>! 👑
                </h2>
                <p className="text-sm sm:text-base text-amber-200/90 font-sans leading-relaxed">
                  For you, we have skipped the quantum algorithm of choosing—<strong>all Wysbros are yours</strong> to audit, grade, and command! 🚀
                </p>
              </div>

              {/* Storyboard Card Highlights */}
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-white/[0.08] space-y-3 font-mono text-xs text-neutral-300">
                <div className="flex items-center gap-2.5 text-amber-400 font-bold uppercase text-[11px] tracking-wider">
                  <Zap className="w-4 h-4 text-amber-400" /> Administrative Privileges Active
                </div>
                <ul className="space-y-2 text-neutral-400">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>100% Roster Access:</strong> Zero partition limits applied. Every engineer across all departments is mapped to your dashboard.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Executive Governance:</strong> Full permission to inspect, edit, and certify AI competency scorecards.</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowAdminModal(false)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-black font-extrabold text-sm hover:opacity-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2.5"
              >
                <span>Unleash All Wysbros & Enter Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================================
          VIEW 1: EVALUATOR LOGIN SCREEN (If unauthenticated)
         ========================================================== */}
      {!evaluatorName && (
        <div className="max-w-xl mx-auto py-12 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-10 rounded-3xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mx-auto mb-6">
              <User className="w-7 h-7" />
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Evaluator Identification
            </h1>
            <p className="mt-2 text-sm text-neutral-400 font-sans">
              Enter your name to begin. Regex matching will intelligently find your profile.
            </p>

            <form onSubmit={handleLoginSubmit} className="mt-8 text-left space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 font-semibold mb-2">
                  EVALUATOR NAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    data-tour="evaluator-name-input"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="e.g. Akshay, Ayush, Anam, Praveen, Krishna..."
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-white font-medium focus:outline-none focus:border-orange-500 transition-colors placeholder:text-neutral-600"
                  />
                  {matchFeedback?.isValid && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Matched: {matchFeedback.matchedName}</span>
                    </div>
                  )}
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {matchFeedback?.isAdmin && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                  <Crown className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                  <span>Admin User Recognized: Bypasses Roll to access ALL candidates.</span>
                </div>
              )}

              <button
                type="submit"
                data-tour="continue-to-roll-btn"
                className="w-full py-4 rounded-2xl bg-orange-500 text-black font-extrabold text-sm hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                <span>Continue to Roll</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Security & Integrity Warning Callout */}
            <div className="mt-8 p-4 rounded-2xl bg-neutral-950/80 border border-amber-500/20 text-left flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-400 space-y-1 font-sans">
                <strong className="text-amber-300 font-semibold block font-mono uppercase text-[10px] tracking-wider">
                  SECURITY & INTEGRITY DIRECTIVE
                </strong>
                <p className="leading-relaxed text-neutral-400">
                  Please enter <strong>strictly your own full name</strong>. Do not attempt to log in using another team member&apos;s identity or alter candidate allocation states. All login attempts and evaluation audits are recorded for governance compliance.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ==========================================================
          VIEW 2: INTERACTIVE ROLL SCREEN (If logged in but not allocated)
         ========================================================== */}
      {evaluatorName && !isAllocated && (
        <div className="max-w-2xl mx-auto py-12 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 sm:p-12 rounded-3xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mx-auto mb-6 shadow-lg shadow-orange-500/10">
              <Dices className={`w-8 h-8 ${isRolling ? "animate-spin text-orange-300" : ""}`} />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase">
              SINGLE ROLL ALLOCATION
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-4">
              Roll for Assigned Candidates
            </h1>

            <p className="mt-3 text-sm text-neutral-400 max-w-md mx-auto font-sans leading-relaxed">
              Welcome, <strong className="text-white">{evaluatorName}</strong>. You get exactly <strong className="text-orange-400">ONE ROLL</strong>. The distribution engine will randomly assign a balanced candidate pool to you.
            </p>

            <div className="my-10 p-6 rounded-2xl bg-neutral-950 border border-neutral-800/80 font-mono text-xs text-neutral-400 space-y-2">
              <div className="flex items-center justify-between text-neutral-300">
                <span>EVALUATOR</span>
                <span className="text-orange-400 font-bold">{evaluatorName}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>ROLL ALLOWANCE</span>
                <span className="text-emerald-400 font-bold">1 / 1 Remaining</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>TOTAL POOL</span>
                <span className="text-white font-bold">{ALL_CANDIDATES.length} Employees</span>
              </div>
            </div>

            <button
              onClick={triggerRollExperience}
              data-tour="roll-pool-btn"
              disabled={isRolling}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-black font-extrabold text-base hover:opacity-90 transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Dices className={`w-5 h-5 ${isRolling ? "animate-spin" : ""}`} />
              <span>{isRolling ? rollStep : "ROLL CANDIDATE POOL NOW"}</span>
            </button>
          </motion.div>
        </div>
      )}

      {/* ==========================================================
          VIEW 3: ASSIGNED CANDIDATES ENTERPRISE DASHBOARD
         ========================================================== */}
      {evaluatorName && isAllocated && (
        <div className="space-y-6">
          {/* Header Banner & Dynamic Metrics */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900/90 border border-white/[0.06] backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">ASSIGNED CANDIDATE ROSTER</span>
                {isAdmin && (
                  <button
                    onClick={() => setShowAdminModal(true)}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 flex items-center gap-1 transition-colors"
                  >
                    <Crown className="w-3 h-3 text-amber-400 animate-bounce" /> ADMIN SUPER CAPTAIN 👑
                  </button>
                )}
              </div>
              <h1 className="text-2xl font-extrabold text-white mt-1">
                AI Evaluator Workspace: {evaluatorName}
              </h1>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                Showing {filteredCandidates.length} assigned candidates. Select any employee to inspect or grade their AI usage marks & graphical evaluations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-neutral-950 border border-white/[0.06] text-left font-mono">
                <div className="text-[10px] text-neutral-500 font-semibold">CANDIDATE POOL</div>
                <div className="text-sm font-bold text-orange-400">{assignedCandidates.length} Assigned</div>
              </div>
            </div>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-white/[0.06]">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search candidate name, email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-950 border border-white/[0.06] text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Department Filter with Custom Select */}
              <div className="w-44">
                <CustomSelect
                  options={[
                    { value: "ALL", label: "All Departments" },
                    ...departmentsList.map((dept) => ({ value: dept, label: dept })),
                  ]}
                  value={deptFilter}
                  onChange={(val) => {
                    setDeptFilter(val);
                    setCurrentPage(1);
                  }}
                  showAppleIcon={true}
                />
              </div>

              {/* Status Filter with Custom Select */}
              <div className="w-40">
                <CustomSelect
                  options={[
                    { value: "ALL", label: "All Statuses" },
                    { value: "Active", label: "Active" },
                    { value: "In Review", label: "In Review" },
                    { value: "Completed", label: "Completed" },
                  ]}
                  value={statusFilter}
                  onChange={(val) => {
                    setStatusFilter(val);
                    setCurrentPage(1);
                  }}
                  showAppleIcon={true}
                />
              </div>
            </div>
          </div>

          {/* Enterprise Data Table */}
          <div className="rounded-3xl border border-white/[0.06] bg-neutral-900/80 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-neutral-950/80 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Candidate</th>
                    <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Department</th>
                    <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Role</th>
                    <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">AI Evaluation Marks</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-xs">
                  {paginatedCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-neutral-500 font-mono">
                        No candidates found matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedCandidates.map((candidate, candidateIndex) => {
                      const evalRecord = getEvaluation(candidate.id);
                      const score = evalRecord?.overallScore || 0;
                      const grade = evalRecord?.grade || "Pending";

                      return (
                        <tr
                          key={candidate.id}
                          className="hover:bg-neutral-800/40 transition-colors group"
                        >
                          {/* Avatar & Candidate Name */}
                          <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img
                                src={candidate.avatarSeed}
                                alt={candidate.name}
                                className="w-9 h-9 rounded-xl bg-neutral-800 border border-white/[0.06] p-0.5 object-cover shrink-0"
                              />
                              <div>
                                <div className="font-bold text-white group-hover:text-orange-400 transition-colors">
                                  {candidate.name}
                                </div>
                                <div className="text-[11px] font-mono text-slate-500">
                                  {candidate.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Department */}
                          <td className="py-3.5 px-4 sm:px-6 font-mono text-neutral-300 whitespace-nowrap">
                            {candidate.department}
                          </td>

                          {/* Role */}
                          <td className="py-3.5 px-4 sm:px-6 text-neutral-400 font-sans whitespace-nowrap">
                            {candidate.role}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold whitespace-nowrap ${
                                candidate.status === "Completed"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : candidate.status === "In Review"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  candidate.status === "Completed"
                                    ? "bg-emerald-400"
                                    : candidate.status === "In Review"
                                    ? "bg-amber-400 animate-pulse"
                                    : "bg-orange-400"
                                }`}
                              />
                              {candidate.status}
                            </span>
                          </td>

                          {/* AI Evaluation Progress & Marks */}
                          <td className="py-3.5 px-4 sm:px-6 font-mono whitespace-nowrap">
                            {evalRecord ? (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px] gap-2">
                                  <span className="text-orange-400 font-bold">{score} / 100 Marks</span>
                                  <span className="text-amber-300 text-[10px] font-bold">{grade}</span>
                                </div>
                                <div className="w-28 sm:w-32 h-1.5 rounded-full bg-neutral-950 overflow-hidden border border-white/[0.06]">
                                  <div
                                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                                    style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="text-neutral-600 font-mono text-[11px]">Not Evaluated</span>
                            )}
                          </td>

                          {/* Action Button */}
                          <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                            <Link
                              href={`/ai-eval/employee/${candidate.id}`}
                              data-tour={candidateIndex === 0 ? "first-candidate-audit-btn" : undefined}
                              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-black border border-orange-500/30 transition-all font-mono text-xs font-bold whitespace-nowrap shrink-0 shadow-xs"
                            >
                              <span>AI Audit</span>
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            </Link>
                          </td>
                        </tr>
                      );
                    }))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-white/[0.06] bg-neutral-950/60 flex items-center justify-between text-xs font-mono text-neutral-400">
              <div>
                Page {currentPage} of {totalPages} ({filteredCandidates.length} total candidates)
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-neutral-900 border border-white/[0.06] disabled:opacity-40 hover:bg-neutral-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-neutral-900 border border-white/[0.06] disabled:opacity-40 hover:bg-neutral-800 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
