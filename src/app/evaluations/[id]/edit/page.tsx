"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
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
  ArrowLeft,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
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

export default function EditEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const evalId = params.id as string;

  const { evaluations, updateEvaluation, engineers, currentUser } = useAppStore();
  const existingEval = evaluations.find((e) => e.id === evalId);

  const [collapsedSections, setCollapsedSections] = React.useState<Record<string, boolean>>({});

  const defaultParameters = React.useMemo(() => {
    if (!existingEval) {
      return EVALUATION_PARAMETERS.map((p) => ({
        parameterKey: p.key,
        rating: 4,
        weight: p.weight,
        comments: "",
        evidenceUrl: "",
      }));
    }

    return EVALUATION_PARAMETERS.map((p) => {
      const found = existingEval.parameterScores?.find(
        (ps) => ps.parameterKey === p.key || ps.parameterId === p.key
      );
      return {
        parameterKey: p.key,
        rating: found ? found.rating : 4,
        weight: p.weight,
        comments: found?.comments || "",
        evidenceUrl: found?.evidenceUrl || found?.evidence || "",
      };
    });
  }, [existingEval]);

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
      engineerId: existingEval?.engineerId || engineers[0]?.id || "eng_1",
      quarter: existingEval?.quarter || "Q3",
      year: existingEval?.year || 2026,
      evaluationDate: existingEval?.evaluationDate || new Date().toISOString().split("T")[0],
      comments: existingEval?.comments || "",
      parameterScores: defaultParameters,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "parameterScores",
  });

  const watchedScores = watch("parameterScores");
  const selectedEngineerId = watch("engineerId");
  const selectedEngineer = engineers.find((e) => e.id === selectedEngineerId);

  const calculatedScore = React.useMemo(() => {
    if (!watchedScores) return 0;
    let sum = 0;
    watchedScores.forEach((ps) => {
      sum += (ps.rating / 5.0) * (ps.weight || 0);
    });
    return Math.min(100, Math.max(0, sum));
  }, [watchedScores]);

  const gradeInfo = calculateEvaluationGrade(calculatedScore);

  if (!existingEval) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Evaluation Not Found</h2>
        <button onClick={() => router.push("/evaluations")} className="mt-4 text-xs text-indigo-500 font-mono">
          ← Return to Evaluations
        </button>
      </div>
    );
  }

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const onSubmit = (data: FormValues) => {
    const updatedEval: Evaluation = {
      ...existingEval,
      quarter: data.quarter,
      year: data.year,
      evaluationDate: data.evaluationDate,
      engineerId: data.engineerId,
      engineerName: selectedEngineer?.fullName || existingEval.engineerName,
      engineerEmail: selectedEngineer?.email || existingEval.engineerEmail,
      engineerDesignation: selectedEngineer?.designation || existingEval.engineerDesignation,
      engineerDepartment: selectedEngineer?.departmentName || existingEval.engineerDepartment,
      engineerPhoto: selectedEngineer?.photoUrl || existingEval.engineerPhoto,
      overallScore: calculatedScore,
      percentage: calculatedScore,
      grade: gradeInfo.grade,
      gradeLabel: gradeInfo.label,
      comments: data.comments || "",
      parameterScores: data.parameterScores as ParameterScoreInput[],
      updatedAt: new Date().toISOString(),
    };

    updateEvaluation(updatedEval);
    toast.success("Evaluation modified & updated in Audit Trail!", {
      description: `New Score: ${calculatedScore.toFixed(1)} (${gradeInfo.grade} - ${gradeInfo.label})`,
    });

    router.push(`/evaluations/${existingEval.id}`);
  };

  const engineerOptions = engineers.map((eng) => ({
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
      {/* Sticky Bar */}
      <div className="sticky top-16 z-30 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-500">EDITING EVALUATION</span>
              <span className="text-[10px] font-mono text-neutral-400">ID: {existingEval.id}</span>
            </div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
              Modify Evaluation: {existingEval.engineerName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase text-neutral-400 font-bold">RECALCULATED SCORE</div>
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
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">Target Engineer & Cycle Metadata</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Target Engineer</label>
              <Controller
                control={control}
                name="engineerId"
                render={({ field }) => (
                  <CustomSelect
                    options={engineerOptions}
                    value={field.value}
                    onChange={field.onChange}
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

        {/* CARD 2: PARAMETER CARDS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Modify Parameter Ratings & Evidence</span>
              </h2>
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
                        className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 cursor-pointer"
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
                      <div className="md:col-span-4 space-y-2">
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Rating Scale (1 to 5)</label>
                        <div className="grid grid-cols-5 gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setValue(`parameterScores.${index}.rating`, star)}
                              className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
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

                      <div className="md:col-span-8 space-y-2">
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                          <Link2 className="w-3.5 h-3.5 text-primary" />
                          <span>Evidence URL / PR Link</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://github.com/org/repo/pull/123"
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
            {...register("comments")}
            className="w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-sans text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:outline-none"
          />

          <div className="pt-2 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>SINGLE ADMIN AUDIT TRAIL LOGGED</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push(`/evaluations/${existingEval.id}`)}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
