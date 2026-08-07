"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EmployeeCandidate, validateEvaluatorName, allocateCandidatesForEvaluator, ALL_CANDIDATES } from "./allocation";

export interface QuestionItem {
  id: string;
  parameter: string;
  category: "Prompting" | "Code Gen & Verification" | "AI Debugging" | "AI Workflow & Velocity" | "AI Systems & Agents" | "AI Safety & Security";
  questionText: string;
  description: string;
  maxRating: number; // 10
  evaluationCriteria: string;
  defaultStrength?: string;
  defaultRecommendation?: string;
}

export interface QuestionSet {
  id: string;
  title: string;
  category: string;
  difficulty: "Junior" | "Mid" | "Senior" | "Principal";
  weightage: number;
  content: string;
  questions: QuestionItem[];
}

export interface PerQuestionScore {
  rating: number; // 1 to 10 marks
  evidence: string; // >_ AI USAGE EVIDENCE & NOTES
  observedStrength?: string;
  recommendation?: string;
  updatedAt: string;
}

export interface AIEvaluationRecord {
  id: string;
  evaluatorName: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  status: "Draft" | "Completed" | "In Review";
  totalEvaluated: number;
  decisionResult: "Strong Hire" | "Hire" | "Lean Hire" | "Lean Reject" | "Reject";
  overallScore: number; // 0 - 100 marks
  percentage: number;
  grade: "AI Master / Agentic Architect" | "AI Power User" | "AI Practitioner" | "AI Novice" | "AI Resistant" | "Not Evaluated";
  risksFlaggedCount: number;
  riskClassification: "Low Risk (Passed)" | "Moderate Risk (Needs Training)" | "High Risk (Critical Review)";
  auditRef: string;
  executiveSynthesis: string;
  scores: Record<string, PerQuestionScore>; // key: questionId
  feedbackMarkdown: string;
  aiVelocityMultiplier?: string; // e.g. "3.2x speed boost"
  primaryAITools?: string[]; // e.g. ["Cursor", "Claude 3.5 Sonnet", "GitHub Copilot"]
  updatedAt: string;
}

export interface AIEvalState {
  evaluatorName: string;
  isAdmin: boolean;
  isAllocated: boolean;
  allocatedAt: string | null;
  assignedCandidates: EmployeeCandidate[];
  
  loginEvaluator: (nameInput: string) => { isValid: boolean; matchedName: string; isAdmin: boolean };
  performRoll: () => void;
  logoutEvaluator: () => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  deptFilter: string;
  setDeptFilter: (dept: string) => void;

  questionSets: QuestionSet[];

  evaluations: Record<string, AIEvaluationRecord>;
  isSyncing: boolean;
  saveEvaluation: (employeeId: string, record: Partial<AIEvaluationRecord>) => Promise<void>;
  getEvaluation: (employeeId: string) => AIEvaluationRecord | undefined;
  loadEvaluationsFromServer: () => Promise<void>;
}

export const AUDIT_TOPIC_QUESTIONS: QuestionItem[] = [
  {
    id: "q_ai_prompting",
    parameter: "Prompt Engineering & Context",
    category: "Prompting",
    questionText: "How effectively does the candidate structure system prompts, provide zero/few-shot context, and prevent model hallucinations?",
    description: "System prompt design, context window utilization, and structured output formatting.",
    maxRating: 10,
    evaluationCriteria: "Evaluates prompt clarity, role definition, context boundary setting, and JSON schema enforcement.",
    defaultStrength: "Mastery in structured prompt architecture & multi-turn agentic context management.",
    defaultRecommendation: "Share advanced prompt templates with team leads.",
  },
  {
    id: "q_ai_codegen",
    parameter: "Code Generation & Verification",
    category: "Code Gen & Verification",
    questionText: "Does the candidate rigorously review, refactor, and write automated tests for AI-generated code snippets?",
    description: "AST inspection of AI code, boundary condition testing, and lint compliance.",
    maxRating: 10,
    evaluationCriteria: "Inspects code verification practices, avoiding blind copy-pasting, and unit test generation.",
    defaultStrength: "Rigorous verification of AI outputs with strong test-driven validation.",
    defaultRecommendation: "Maintain high verification standard across complex pull requests.",
  },
  {
    id: "q_ai_debug",
    parameter: "AI-Assisted Debugging",
    category: "AI Debugging",
    questionText: "How efficiently does the candidate feed stack traces, memory dumps, and logs to AI to isolate root causes?",
    description: "Stack trace diagnosis, log sanitization, and step-by-step root cause analysis with AI.",
    maxRating: 10,
    evaluationCriteria: "Evaluates speed in bug resolution, log payload isolation, and memory leak analysis with AI.",
    defaultStrength: "Rapid root cause identification using AI log synthesis.",
    defaultRecommendation: "Continue honing AST inspection skills alongside AI diagnostics.",
  },
  {
    id: "q_ai_workflow",
    parameter: "AI Workflow & Velocity",
    category: "AI Workflow & Velocity",
    questionText: "How well does the candidate integrate IDE AI agents (Cursor, Copilot, Claude CLI) to accelerate feature development?",
    description: "IDE agent integration, keyboard shortcuts, terminal AI workflow, and throughput acceleration.",
    maxRating: 10,
    evaluationCriteria: "Measures engineering velocity multiplier, workflow automation, and tool mastery.",
    defaultStrength: "Exceptional engineering velocity multiplier (>3x productivity boost).",
    defaultRecommendation: "Mentor peers on AI keyboard workflows and shell automation.",
  },
  {
    id: "q_ai_systems",
    parameter: "AI Systems & Agentic Design",
    category: "AI Systems & Agents",
    questionText: "Can the candidate design LLM orchestration workflows, tool-calling schemas, RAG systems, and fallback mechanisms?",
    description: "Function calling, vector embeddings, agentic loop design, and API rate-limit resilience.",
    maxRating: 10,
    evaluationCriteria: "Checks architectural understanding of autonomous AI agents, tool schemas, and RAG pipelines.",
    defaultStrength: "Solid understanding of agentic tool calling and resilient RAG design.",
    defaultRecommendation: "Deepen understanding of semantic caching and vector database tuning.",
  },
  {
    id: "q_ai_security",
    parameter: "AI Safety, Ethics & Security",
    category: "AI Safety & Security",
    questionText: "Does the candidate enforce secret sanitization, prompt injection guardrails, and data privacy in AI prompts?",
    description: "Zero secrets in prompts, PII scrubbing, OWASP for LLMs compliance, and license verification.",
    maxRating: 10,
    evaluationCriteria: "Evaluates security awareness, credential masking, and IP compliance when using external LLMs.",
    defaultStrength: "Impeccable AI security discipline with zero credential exposure.",
    defaultRecommendation: "Lead security audits for team prompt repositories.",
  },
];

const DEFAULT_QUESTION_SETS: QuestionSet[] = [
  {
    id: "qs_ai_evaluation_suite",
    title: "Enterprise AI Usage & Competency Audit",
    category: "Wysbryx AI Performance Benchmark",
    difficulty: "Principal",
    weightage: 100,
    content: "Full 360-degree evaluation of candidate AI tool adoption, prompt engineering, code verification, velocity, and AI safety.",
    questions: AUDIT_TOPIC_QUESTIONS,
  },
];

export const useAIEvalStore = create<AIEvalState>()(
  persist(
    (set, get) => ({
      evaluatorName: "",
      isAdmin: false,
      isAllocated: false,
      allocatedAt: null,
      assignedCandidates: [],
      isSyncing: false,

      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      statusFilter: "ALL",
      setStatusFilter: (status) => set({ statusFilter: status }),
      deptFilter: "ALL",
      setDeptFilter: (dept) => set({ deptFilter: dept }),

      questionSets: DEFAULT_QUESTION_SETS,
      evaluations: {},

      loginEvaluator: (nameInput: string) => {
        const result = validateEvaluatorName(nameInput);
        if (!result.isValid) return result;

        const currentEvaluator = get().evaluatorName;
        const isSameUser = currentEvaluator.toLowerCase() === result.matchedName.toLowerCase();

        if (result.isAdmin) {
          set({
            evaluatorName: result.matchedName,
            isAdmin: true,
            isAllocated: true,
            allocatedAt: get().allocatedAt || new Date().toISOString(),
            assignedCandidates: ALL_CANDIDATES,
          });
          return result;
        }

        if (isSameUser && get().isAllocated) {
          return result;
        }

        set({
          evaluatorName: result.matchedName,
          isAdmin: false,
        });

        return result;
      },

      performRoll: () => {
        const { evaluatorName, isAllocated, isAdmin } = get();
        if (!evaluatorName) return;

        if (isAdmin) {
          set({
            isAllocated: true,
            allocatedAt: new Date().toISOString(),
            assignedCandidates: ALL_CANDIDATES,
          });
          return;
        }

        if (isAllocated && get().assignedCandidates.length > 0) {
          return;
        }

        const allocated = allocateCandidatesForEvaluator(evaluatorName, 10);
        set({
          isAllocated: true,
          allocatedAt: new Date().toISOString(),
          assignedCandidates: allocated,
        });
      },

      logoutEvaluator: () => {
        set({
          evaluatorName: "",
          isAdmin: false,
          isAllocated: false,
          allocatedAt: null,
          assignedCandidates: [],
          searchQuery: "",
        });
      },

      saveEvaluation: async (employeeId, record) => {
        const { evaluations, evaluatorName } = get();
        const cand = ALL_CANDIDATES.find((c) => c.id === employeeId);

        const existing = evaluations[employeeId] || {
          id: `ai_eval_${employeeId}`,
          evaluatorName: evaluatorName || "AI Performance Auditor",
          employeeId,
          employeeName: cand?.name || "Employee",
          employeeEmail: cand?.email || "employee@wysbryx.com",
          status: "Draft",
          totalEvaluated: Object.values(evaluations).filter((e) => e.status === "Completed").length,
          decisionResult: "Lean Hire",
          overallScore: 68,
          percentage: 68,
          grade: "AI Practitioner",
          risksFlaggedCount: 1,
          riskClassification: "Low Risk (Passed)",
          auditRef: `AI-AUD-2026-${employeeId.slice(-4).toUpperCase()}`,
          executiveSynthesis: `${cand?.name || "Candidate"} demonstrates strong practical capability in Prompt Engineering, AI Code Generation & Verification, and AI-Assisted Debugging. Continues to enhance velocity using Cursor & Claude Sonnet. Recommended for AI Power User track.`,
          scores: {},
          feedbackMarkdown: "",
          updatedAt: new Date().toISOString(),
        };

        const updated: AIEvaluationRecord = {
          ...existing,
          ...record,
          updatedAt: new Date().toISOString(),
        };

        // Recalculate score from ratings
        const scoreEntries = Object.values(updated.scores || {});
        if (scoreEntries.length > 0) {
          const totalRatingSum = scoreEntries.reduce((acc, item) => acc + (item.rating || 0), 0);
          const maxPossible = scoreEntries.length * 10;
          const pct = Math.round((totalRatingSum / maxPossible) * 100);
          updated.percentage = pct;
          updated.overallScore = pct;

          if (pct >= 85) {
            updated.decisionResult = "Strong Hire";
            updated.grade = "AI Master / Agentic Architect";
            updated.riskClassification = "Low Risk (Passed)";
          } else if (pct >= 70) {
            updated.decisionResult = "Hire";
            updated.grade = "AI Power User";
            updated.riskClassification = "Low Risk (Passed)";
          } else if (pct >= 50) {
            updated.decisionResult = "Lean Hire";
            updated.grade = "AI Practitioner";
            updated.riskClassification = "Moderate Risk (Needs Training)";
          } else if (pct >= 35) {
            updated.decisionResult = "Lean Reject";
            updated.grade = "AI Novice";
            updated.riskClassification = "Moderate Risk (Needs Training)";
          } else {
            updated.decisionResult = "Reject";
            updated.grade = "AI Resistant";
            updated.riskClassification = "High Risk (Critical Review)";
          }
        }

        set({
          evaluations: {
            ...evaluations,
            [employeeId]: updated,
          },
        });

        // Background server sync
        try {
          set({ isSyncing: true });
          const cand = ALL_CANDIDATES.find((c) => c.id === employeeId);
          await fetch("/api/ai-eval/evaluations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              evaluatorName: get().evaluatorName || "Praveen",
              employeeId,
              employeeName: cand?.name || updated.employeeName,
              employeeEmail: cand?.email || updated.employeeEmail,
              evaluation: updated,
            }),
          });
        } catch (err) {
          console.error("Failed to sync evaluation to server:", err);
        } finally {
          set({ isSyncing: false });
        }
      },

      getEvaluation: (employeeId) => {
        return get().evaluations[employeeId];
      },

      loadEvaluationsFromServer: async () => {
        const evaluatorName = get().evaluatorName;
        if (!evaluatorName) return;

        try {
          set({ isSyncing: true });
          const res = await fetch(`/api/ai-eval/evaluations?evaluatorName=${encodeURIComponent(evaluatorName)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.evaluations && Object.keys(data.evaluations).length > 0) {
              set((state) => ({
                evaluations: {
                  ...state.evaluations,
                  ...data.evaluations,
                },
              }));
            }
          }
        } catch (err) {
          console.error("Failed to load evaluations from server:", err);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "wysbryx_ai_eval_store_v4",
      partialize: (state) => ({
        evaluatorName: state.evaluatorName,
        isAdmin: state.isAdmin,
        isAllocated: state.isAllocated,
        allocatedAt: state.allocatedAt,
        assignedCandidates: state.assignedCandidates,
        evaluations: state.evaluations,
      }),
    }
  )
);
