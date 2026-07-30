"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { MOCK_ENGINEERS } from "@/lib/mockData";
import { EVALUATION_PARAMETERS } from "@/lib/constants";
import { getGradeInfo } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Evaluation, ParameterScoreInput } from "@/lib/types";
import {
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  User,
  Sliders,
  Paperclip,
  Clock,
  Command,
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldCheck,
} from "lucide-react";

const evaluationFormSchema = z.object({
  engineerId: z.string().min(1, "Please select an engineer"),
  evaluationDate: z.string().min(1, "Evaluation date is required"),
  quarter: z.enum(["Q1", "Q2", "Q3", "Q4"]),
  year: z.number().min(2020).max(2030),
  comments: z.string().min(10, "Executive qualitative summary must be at least 10 characters"),
  parameterScores: z.array(
    z.object({
      parameterId: z.string(),
      categoryId: z.string(),
      parameterKey: z.string(),
      parameterName: z.string(),
      rating: z.number().min(1).max(5),
      weight: z.number(),
      evidence: z.string().min(10, "Concrete technical evidence is mandatory"),
      strength: z.string().optional(),
      improvementSuggestion: z.string().min(5, "Improvement suggestion required"),
      notes: z.string().optional(),
    })
  ),
});

type FormValues = z.infer<typeof evaluationFormSchema>;

export default function NewEvaluationPage() {
  const router = useRouter();
  const { currentUser, addEvaluation } = useAppStore();
  const [collapsedSections, setCollapsedSections] = React.useState<Record<string, boolean>>({});
  const [lastSaved, setLastSaved] = React.useState<string>("Just now");

  const defaultParameters = EVALUATION_PARAMETERS.map((p) => ({
    parameterId: p.id,
    categoryId: p.category,
    parameterKey: p.key,
    parameterName: p.name,
    rating: 4,
    weight: p.weight,
    evidence: "",
    strength: "",
    improvementSuggestion: "",
    notes: "",
  }));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      engineerId: MOCK_ENGINEERS[0]?.id || "",
      evaluationDate: new Date().toISOString().split("T")[0],
      quarter: "Q3",
      year: 2026,
      comments: "",
      parameterScores: defaultParameters as any,
    },
  });

  const watchedScores = watch("parameterScores");
  const selectedEngineerId = watch("engineerId");
  const selectedEngineer = MOCK_ENGINEERS.find((e) => e.id === selectedEngineerId);

  // Real-time score calculation
  const calculatedScore = React.useMemo(() => {
    if (!watchedScores || watchedScores.length === 0) return 0;
    let totalScore = 0;
    watchedScores.forEach((ps) => {
      totalScore += (ps.rating / 5.0) * (ps.weight || 0);
    });
    return totalScore;
  }, [watchedScores]);

  const gradeInfo = getGradeInfo(calculatedScore);

  // Autosave simulation timer
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastSaved(`Autosaved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const onSubmit = (data: FormValues) => {
    const newEval: Evaluation = {
      id: `eval_${Date.now()}`,
      cycleTitle: `${data.quarter} ${data.year} Performance Intelligence Review`,
      engineerId: data.engineerId,
      engineerName: selectedEngineer?.fullName || "Engineer",
      engineerEmail: selectedEngineer?.email || "",
      engineerDesignation: selectedEngineer?.designation || "",
      engineerDepartment: selectedEngineer?.departmentName || "",
      engineerPhoto: selectedEngineer?.photoUrl || "",
      adminId: currentUser.id,
      adminName: currentUser.name,
      adminEmail: currentUser.email,
      evaluationDate: data.evaluationDate,
      quarter: data.quarter,
      year: data.year,
      overallScore: calculatedScore,
      percentage: calculatedScore,
      grade: gradeInfo.grade,
      gradeLabel: gradeInfo.label,
      comments: data.comments,
      status: "Completed",
      parameterScores: data.parameterScores as ParameterScoreInput[],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addEvaluation(newEval);
    toast.success("Evaluation submitted successfully & logged in Audit Trail!", {
      description: `Overall Score: ${calculatedScore.toFixed(1)} (${gradeInfo.grade} - ${gradeInfo.label})`,
    });

    router.push("/evaluations");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Notion-Stripe Sticky Top Navigation Bar */}
      <div className="sticky top-16 z-30 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-purple-400">ADMIN GOVERNANCE</span>
              <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> {lastSaved}
              </span>
            </div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
              Notion-Stripe Evaluation Workspace
            </h1>
          </div>
        </div>

        {/* Live Score Floating Badge */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase text-neutral-400 font-bold">LIVE SCORE MATRIX</div>
            <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
              {calculatedScore.toFixed(1)} <span className="text-xs text-neutral-400">/ 100</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-xl text-xs font-mono font-bold ${gradeInfo.bg} ${gradeInfo.color} border ${gradeInfo.border}`}>
            {gradeInfo.grade} ({gradeInfo.label})
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* CARD 1: TARGET ENGINEER SELECTOR */}
        <div className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <User className="w-4 h-4 text-indigo-500" />
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">1. Select Target Engineer & Evaluation Cycle</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Select Engineer *</label>
              <select
                {...register("engineerId")}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/80 text-xs text-neutral-900 dark:text-white focus:outline-none"
              >
                {MOCK_ENGINEERS.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.fullName} — {eng.designation} ({eng.departmentName})
                  </option>
                ))}
              </select>
              {selectedEngineer && (
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 flex items-center gap-3 border border-neutral-200/50 dark:border-neutral-700/50 mt-2">
                  <img src={selectedEngineer.photoUrl} alt={selectedEngineer.fullName} className="w-9 h-9 rounded-full object-cover" />
                  <div className="text-xs">
                    <div className="font-bold text-neutral-900 dark:text-white">{selectedEngineer.fullName}</div>
                    <div className="text-[10px] text-neutral-500">{selectedEngineer.designation} • {selectedEngineer.teamName}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Quarter</label>
                <select
                  {...register("quarter")}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/80 text-xs text-neutral-900 dark:text-white focus:outline-none"
                >
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Year</label>
                <input
                  type="number"
                  {...register("year", { valueAsNumber: true })}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/80 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Date</label>
                <input
                  type="date"
                  {...register("evaluationDate")}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/80 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: COLLAPSIBLE PARAMETER CARDS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <span>2. Standardized Category Evaluation Cards</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Collapsible evaluation dimensions with rating sliders and technical evidence.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {EVALUATION_PARAMETERS.map((param, index) => {
              const isCollapsed = collapsedSections[param.id];
              const currentRating = watchedScores?.[index]?.rating || 4;

              return (
                <div
                  key={param.id}
                  className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden transition-all"
                >
                  {/* Card Header Bar */}
                  <div
                    onClick={() => toggleSection(param.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-neutral-400">0{index + 1}</span>
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{param.name}</h3>
                        <p className="text-xs text-neutral-500">{param.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                        {param.weight}% Weight
                      </span>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950">
                        {currentRating} / 5
                      </span>
                      {isCollapsed ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronUp className="w-4 h-4 text-neutral-400" />}
                    </div>
                  </div>

                  {/* Card Body (Collapsible) */}
                  {!isCollapsed && (
                    <div className="p-5 pt-0 border-t border-neutral-100 dark:border-neutral-800/80 space-y-4">
                      {/* Rating Selector */}
                      <div className="pt-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Rating Scale (1-5):</span>
                        <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setValue(`parameterScores.${index}.rating`, star)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                                currentRating === star
                                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
                                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                              }`}
                            >
                              {star}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Technical Evidence & Recommendations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
                            <span>Technical Evidence & Artifact Links *</span>
                            <span className="text-[10px] text-indigo-400 font-mono">Mandatory</span>
                          </label>
                          <textarea
                            rows={3}
                            {...register(`parameterScores.${index}.evidence`)}
                            placeholder="e.g., Authored PR #104 reducing bundle size by 30%. Built security wrapper in Rust..."
                            className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/80 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none font-mono"
                          />
                          {errors.parameterScores?.[index]?.evidence && (
                            <p className="text-[10px] text-rose-500 font-mono">
                              {errors.parameterScores[index]?.evidence?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                            Improvement & Growth Suggestion *
                          </label>
                          <textarea
                            rows={3}
                            {...register(`parameterScores.${index}.improvementSuggestion`)}
                            placeholder="e.g., Lead an internal tech talk on Web Workers and share prompt templates..."
                            className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/80 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CARD 3: EXECUTIVE SUMMARY & SUBMIT */}
        <div className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-900 dark:text-white">
              3. Administrative Qualitative Summary *
            </label>
            <textarea
              rows={4}
              {...register("comments")}
              placeholder="Provide a final executive summary highlighting key achievements, leadership potential, and roadmap..."
              className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/80 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none"
            />
            {errors.comments && <p className="text-[10px] text-rose-500 font-mono">{errors.comments.message}</p>}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs hover:opacity-90 transition-all shadow-xl"
            >
              <Save className="w-4 h-4" />
              <span>Submit Evaluation</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
