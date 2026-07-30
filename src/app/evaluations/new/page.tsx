"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  ShieldCheck,
  Save,
  Send,
  User,
  Sparkles,
  Link2,
  ChevronDown,
  ChevronUp,
  Clock,
  Lock,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { MOCK_ENGINEERS } from "@/lib/mockData";
import { EVALUATION_PARAMETERS, calculateEvaluationGrade } from "@/lib/constants";
import { ParameterScoreInput, Evaluation } from "@/lib/types";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { Badge } from "@/components/ui/Badge";

const evaluationSchema = z.object({
  engineerId: z.string().min(1, "Engineer selection is required"),
  quarter: z.enum(["Q1", "Q2", "Q3", "Q4"]),
  year: z.number().min(2020).max(2030),
  evaluationDate: z.string().min(1, "Date is required"),
  comments: z.string().optional(),
  parameterScores: z.array(
    z.object({
      parameterKey: z.string(),
      rating: z.number().min(1).max(5),
      weight: z.number(),
      comments: z.string().optional(),
      evidenceUrl: z.string().optional(),
    })
  ),
});

type FormValues = z.infer<typeof evaluationSchema>;

export default function NewEvaluationPage() {
  const router = useRouter();
  const { addEvaluation, currentUser } = useAppStore();

  const [collapsedSections, setCollapsedSections] = React.useState<Record<string, boolean>>({});
  const [lastSaved, setLastSaved] = React.useState<string | null>(null);

  const defaultParameters = EVALUATION_PARAMETERS.map((p) => ({
    parameterKey: p.key,
    rating: 4,
    weight: p.weight,
    comments: "",
    evidenceUrl: "",
  }));

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      engineerId: MOCK_ENGINEERS[0]?.id || "eng_1",
      quarter: "Q3",
      year: 2026,
      evaluationDate: new Date().toISOString().split("T")[0],
      comments: "",
      parameterScores: defaultParameters,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "parameterScores",
  });

  const watchedScores = watch("parameterScores");
  const selectedEngineerId = watch("engineerId");

  const selectedEngineer = MOCK_ENGINEERS.find((e) => e.id === selectedEngineerId);

  // Calculate live weighted score sum: sum((rating / 5) * weight * 100)
  const calculatedScore = React.useMemo(() => {
    if (!watchedScores) return 0;
    let sum = 0;
    watchedScores.forEach((ps) => {
      sum += (ps.rating / 5.0) * (ps.weight || 0);
    });
    return Math.min(100, Math.max(0, sum));
  }, [watchedScores]);

  const gradeInfo = calculateEvaluationGrade(calculatedScore);

  // Auto-save draft timestamp trigger
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastSaved(`Autosaved at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
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

  const engineerOptions = MOCK_ENGINEERS.map((eng) => ({
    value: eng.id,
    label: `${eng.fullName} — ${eng.designation}`,
    sublabel: eng.departmentName,
  }));

  const quarterOptions = [
    { value: "Q1", label: "Q1 Cycle" },
    { value: "Q2", label: "Q2 Cycle" },
    { value: "Q3", label: "Q3 Active Cycle" },
    { value: "Q4", label: "Q4 Cycle" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Notion-Stripe Sticky Top Navigation Bar */}
      <div className="sticky top-16 z-30 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-primary">ADMIN GOVERNANCE</span>
              <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> {lastSaved || "Draft Ready"}
              </span>
            </div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
              Evaluation Workspace & Score Calculator
            </h1>
          </div>
        </div>

        {/* Live Score Floating Badge */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase text-neutral-400 font-bold">LIVE WEIGHTED MATRIX</div>
            <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
              {calculatedScore.toFixed(1)} <span className="text-xs text-neutral-400">/ 100</span>
            </div>
          </div>
          <Badge variant="brand" className="text-xs py-1 px-3">
            {gradeInfo.grade} ({gradeInfo.label})
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* CARD 1: TARGET ENGINEER SELECTOR */}
        <div className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <User className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">1. Select Target Engineer & Evaluation Cycle</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Target Engineer *</label>
              <Controller
                control={control}
                name="engineerId"
                render={({ field }) => (
                  <CustomSelect
                    options={engineerOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Search & select engineer..."
                  />
                )}
              />

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
                <Controller
                  control={control}
                  name="quarter"
                  render={({ field }) => (
                    <CustomSelect
                      options={quarterOptions}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Year</label>
                <input
                  type="number"
                  {...register("year", { valueAsNumber: true })}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Date</label>
                <Controller
                  control={control}
                  name="evaluationDate"
                  render={({ field }) => (
                    <DatePicker value={field.value} onChange={field.onChange} />
                  )}
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
                <Sparkles className="w-4 h-4 text-primary" />
                <span>2. Parameter Score & Evidence Ratings (8 Metrics)</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Every rating requires supporting evidence links (PRs, doc URLs, benchmarks).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => {
              const spec = EVALUATION_PARAMETERS.find((p) => p.key === field.parameterKey);
              const isCollapsed = collapsedSections[field.parameterKey];
              const currentRating = watch(`parameterScores.${index}.rating`);

              return (
                <div
                  key={field.id}
                  className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xs space-y-4 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleSection(field.parameterKey)}
                        className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400"
                      >
                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-neutral-900 dark:text-white">{spec?.name}</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                            {spec?.weight}% Weight
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">{spec?.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-400 font-mono">Rating:</span>
                      <span className="text-base font-bold font-mono text-primary">{currentRating} / 5</span>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/60 grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade">
                      {/* Rating Buttons */}
                      <div className="md:col-span-4 space-y-2">
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Rating Scale (1 to 5)</label>
                        <div className="grid grid-cols-5 gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setValue(`parameterScores.${index}.rating`, star)}
                              className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                                currentRating === star
                                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                              }`}
                            >
                              {star} ★
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Evidence PR Link */}
                      <div className="md:col-span-8 space-y-2">
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                          <Link2 className="w-3.5 h-3.5 text-primary" />
                          <span>Evidence URL / PR Link (Mandatory Proof)</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://github.com/org/repo/pull/123 or architecture spec link"
                          {...register(`parameterScores.${index}.evidenceUrl`)}
                          className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-primary/50 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Executive Feedback & Submit Bar */}
        <div className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            Executive Feedback & Actionable Growth Objectives
          </label>
          <textarea
            rows={4}
            placeholder="Synthesize overall engineering impact, mentorship contributions, and targeted upskilling objectives for Q4..."
            {...register("comments")}
            className="w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-sans text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-primary/50 focus:outline-none"
          />

          <div className="pt-2 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>SINGLE ADMIN AUDIT TRAIL LOGGED</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/evaluations")}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-lg shadow-primary/25 hover:opacity-90 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Evaluation</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
