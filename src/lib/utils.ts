import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function getGradeInfo(score: number): {
  grade: string;
  label: string;
  color: string;
  bg: string;
  border: string;
} {
  if (score >= 95) {
    return {
      grade: "A+",
      label: "Outstanding",
      color: "text-emerald-500 dark:text-emerald-400",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      border: "border-emerald-500/30",
    };
  }
  if (score >= 90) {
    return {
      grade: "A",
      label: "Excellent",
      color: "text-blue-500 dark:text-blue-400",
      bg: "bg-blue-500/10 dark:bg-blue-500/20",
      border: "border-blue-500/30",
    };
  }
  if (score >= 80) {
    return {
      grade: "B+",
      label: "Strong",
      color: "text-cyan-500 dark:text-cyan-400",
      bg: "bg-cyan-500/10 dark:bg-cyan-500/20",
      border: "border-cyan-500/30",
    };
  }
  if (score >= 70) {
    return {
      grade: "B",
      label: "Good",
      color: "text-amber-500 dark:text-amber-400",
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
      border: "border-amber-500/30",
    };
  }
  if (score >= 60) {
    return {
      grade: "C",
      label: "Needs Improvement",
      color: "text-orange-500 dark:text-orange-400",
      bg: "bg-orange-500/10 dark:bg-orange-500/20",
      border: "border-orange-500/30",
    };
  }
  return {
    grade: "F",
    label: "Action Required",
    color: "text-rose-500 dark:text-rose-400",
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    border: "border-rose-500/30",
  };
}
